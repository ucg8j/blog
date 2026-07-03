(function() {
  'use strict';

  // ============================================
  // CONSTANTS
  // ============================================
  // UK pension access age: 55 if you reach 55 before 2028, otherwise 57
  function getUKPensionAccessAge(currentAge) {
    const currentYear = new Date().getFullYear();
    const yearTurning55 = currentYear + (55 - currentAge);
    return yearTurning55 < 2028 ? 55 : 57;
  }

  const PRESERVATION_AGES = {
    uk: {
      isa: 0      // Accessible anytime
    },
    au: {
      super: 60,
      savings: 0  // Accessible anytime
    }
  };

  const END_AGE = 90;
  const FALLBACK_EXCHANGE_RATE = 1.92; // GBP to AUD fallback
  let currentExchangeRate = FALLBACK_EXCHANGE_RATE;

  // ============================================
  // DOM ELEMENTS
  // ============================================
  const elements = {
    countryRadios: document.querySelectorAll('input[name="country"]'),
    currencyRadios: document.querySelectorAll('input[name="currency"]'),
    housingRadios: document.querySelectorAll('input[name="housing"]'),
    housingCurrencies: document.querySelectorAll('.housing-currency'),
    housingOwnNote: document.getElementById('housing-own-note'),
    housingMortgageFields: document.getElementById('housing-mortgage-fields'),
    housingRentFields: document.getElementById('housing-rent-fields'),
    currencySection: document.getElementById('currency-section'),
    ukSection: document.getElementById('uk-section'),
    auSection: document.getElementById('au-section'),
    exchangeRateDisplay: document.getElementById('exchange-rate-display'),
    calculateBtn: document.getElementById('calculate-btn'),
    resultsSection: document.getElementById('results-section'),
    resultsSummary: document.getElementById('results-summary'),
    liquidityAnalysis: document.getElementById('liquidity-analysis'),
    breakdownTableContainer: document.getElementById('breakdown-table-container'),
    spendingCurrency: document.getElementById('spending-currency'),
    ukPensionAgeDisplay: document.getElementById('uk-pension-age-display'),

    // Inputs
    currentAge: document.getElementById('current-age'),
    fireAge: document.getElementById('fire-age'),
    annualSpending: document.getElementById('annual-spending'),
    returnRate: document.getElementById('return-rate'),
    inflationRate: document.getElementById('inflation-rate'),
    mortgagePayment: document.getElementById('mortgage-payment'),
    mortgageYears: document.getElementById('mortgage-years'),
    rentPayment: document.getElementById('rent-payment'),

    // UK inputs
    ukPensionBalance: document.getElementById('uk-pension-balance'),
    ukPensionContribution: document.getElementById('uk-pension-contribution'),
    ukIsaBalance: document.getElementById('uk-isa-balance'),
    ukIsaContribution: document.getElementById('uk-isa-contribution'),

    // AU inputs
    auSuperBalance: document.getElementById('au-super-balance'),
    auSuperContribution: document.getElementById('au-super-contribution'),
    auSavingsBalance: document.getElementById('au-savings-balance'),
    auSavingsContribution: document.getElementById('au-savings-contribution')
  };

  let netWorthChart = null;

  // ============================================
  // EXCHANGE RATE
  // ============================================
  async function fetchExchangeRate() {
    try {
      elements.exchangeRateDisplay.textContent = 'Loading...';
      const response = await fetch('https://api.frankfurter.app/latest?from=GBP&to=AUD');
      if (!response.ok) throw new Error('API error');
      const data = await response.json();
      currentExchangeRate = data.rates.AUD;
      elements.exchangeRateDisplay.textContent = '1 GBP = ' + currentExchangeRate.toFixed(2) + ' AUD';
    } catch (error) {
      console.warn('Failed to fetch exchange rate, using fallback:', error);
      currentExchangeRate = FALLBACK_EXCHANGE_RATE;
      elements.exchangeRateDisplay.textContent = '1 GBP = ' + currentExchangeRate.toFixed(2) + ' AUD (offline rate)';
    }
  }

  // ============================================
  // UI HELPERS
  // ============================================
  function getSelectedCountry() {
    return document.querySelector('input[name="country"]:checked').value;
  }

  function getSelectedCurrency() {
    return document.querySelector('input[name="currency"]:checked').value;
  }

  function getSelectedHousing() {
    return document.querySelector('input[name="housing"]:checked').value;
  }

  function getCurrencySymbol() {
    const country = getSelectedCountry();
    if (country === 'uk') return '£';
    if (country === 'au') return '$';
    return getSelectedCurrency() === 'GBP' ? '£' : '$';
  }

  function updateVisibility() {
    const country = getSelectedCountry();

    // Show/hide sections based on country
    elements.ukSection.style.display = (country === 'uk' || country === 'both') ? 'block' : 'none';
    elements.auSection.style.display = (country === 'au' || country === 'both') ? 'block' : 'none';
    elements.currencySection.style.display = country === 'both' ? 'block' : 'none';

    // Update currency prefixes for spending and housing
    const currencySymbol = getCurrencySymbol();
    elements.spendingCurrency.textContent = currencySymbol;
    elements.housingCurrencies.forEach(el => { el.textContent = currencySymbol; });
  }

  function updateHousingVisibility() {
    const housing = getSelectedHousing();
    elements.housingOwnNote.style.display = housing === 'own' ? 'block' : 'none';
    elements.housingMortgageFields.style.display = housing === 'mortgage' ? 'block' : 'none';
    elements.housingRentFields.style.display = housing === 'rent' ? 'block' : 'none';
  }

  function updateUKPensionAgeDisplay() {
    const currentAge = parseInt(elements.currentAge.value) || 35;
    const pensionAge = getUKPensionAccessAge(currentAge);
    elements.ukPensionAgeDisplay.textContent = pensionAge;
  }

  function formatCurrency(amount, currency) {
    const symbol = currency === 'GBP' ? '£' : '$';
    return symbol + Math.round(amount).toLocaleString();
  }

  function formatPercent(value) {
    return (value * 100).toFixed(1) + '%';
  }

  function convertToDisplayCurrency(amount, fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) return amount;
    if (fromCurrency === 'GBP' && toCurrency === 'AUD') {
      return amount * currentExchangeRate;
    }
    if (fromCurrency === 'AUD' && toCurrency === 'GBP') {
      return amount / currentExchangeRate;
    }
    return amount;
  }

  // ============================================
  // CALCULATION ENGINE
  // ============================================
  function getInputs() {
    const country = getSelectedCountry();
    const displayCurrency = country === 'both' ? getSelectedCurrency() : (country === 'uk' ? 'GBP' : 'AUD');

    const inputs = {
      country,
      displayCurrency,
      currentAge: parseInt(elements.currentAge.value) || 35,
      fireAge: parseInt(elements.fireAge.value) || 50,
      annualSpending: parseFloat(elements.annualSpending.value) || 40000,
      returnRate: (parseFloat(elements.returnRate.value) || 7) / 100,
      inflationRate: (parseFloat(elements.inflationRate.value) || 2.5) / 100,
      // Housing: spending excludes housing; the model adds the right cost on top.
      // Mortgage/rent inputs are entered in the display currency (matching the prefix shown).
      housingStatus: getSelectedHousing(),
      mortgagePayment: (parseFloat(elements.mortgagePayment.value) || 0) * 12, // annual, display currency
      mortgageYears: parseInt(elements.mortgageYears.value) || 0,
      rent: (parseFloat(elements.rentPayment.value) || 0) * 12, // annual, display currency
      accounts: []
    };

    // UK accounts (in GBP)
    if (country === 'uk' || country === 'both') {
      const ukPensionAccessAge = getUKPensionAccessAge(inputs.currentAge);
      inputs.accounts.push({
        name: 'UK Pension',
        type: 'pension',
        country: 'uk',
        currency: 'GBP',
        balance: parseFloat(elements.ukPensionBalance.value) || 0,
        contribution: parseFloat(elements.ukPensionContribution.value) || 0,
        accessAge: ukPensionAccessAge
      });
      inputs.accounts.push({
        name: 'UK ISA',
        type: 'isa',
        country: 'uk',
        currency: 'GBP',
        balance: parseFloat(elements.ukIsaBalance.value) || 0,
        contribution: parseFloat(elements.ukIsaContribution.value) || 0,
        accessAge: PRESERVATION_AGES.uk.isa
      });
    }

    // AU accounts (in AUD)
    if (country === 'au' || country === 'both') {
      inputs.accounts.push({
        name: 'AU Super',
        type: 'super',
        country: 'au',
        currency: 'AUD',
        balance: parseFloat(elements.auSuperBalance.value) || 0,
        contribution: parseFloat(elements.auSuperContribution.value) || 0,
        accessAge: PRESERVATION_AGES.au.super
      });
      inputs.accounts.push({
        name: 'AU Savings',
        type: 'savings',
        country: 'au',
        currency: 'AUD',
        balance: parseFloat(elements.auSavingsBalance.value) || 0,
        contribution: parseFloat(elements.auSavingsContribution.value) || 0,
        accessAge: PRESERVATION_AGES.au.savings
      });
    }

    return inputs;
  }

  // Annual housing cost for a given age, in display currency.
  // Owners pay nothing; a fixed mortgage is flat in nominal terms until payoff;
  // rent rises with inflation and never ends.
  function housingCostForAge(inputs, age, inflationMultiplier) {
    if (inputs.housingStatus === 'mortgage') {
      const payoffAge = inputs.currentAge + inputs.mortgageYears;
      return age < payoffAge ? inputs.mortgagePayment : 0;
    }
    if (inputs.housingStatus === 'rent') {
      return inputs.rent * inflationMultiplier;
    }
    return 0;
  }

  function calculateProjection(inputs) {
    const { currentAge, fireAge, annualSpending, returnRate, inflationRate, accounts, displayCurrency } = inputs;
    const years = [];

    // Initialize account balances (convert to display currency)
    const accountBalances = accounts.map(acc => ({
      ...acc,
      balanceInDisplayCurrency: convertToDisplayCurrency(acc.balance, acc.currency, displayCurrency),
      contributionInDisplayCurrency: convertToDisplayCurrency(acc.contribution, acc.currency, displayCurrency)
    }));

    // Simulate each year
    for (let age = currentAge; age <= END_AGE; age++) {
      const yearsFromNow = age - currentAge;
      const inflationMultiplier = Math.pow(1 + inflationRate, yearsFromNow);

      // Base spending (excludes housing) inflates; housing cost added on top.
      const adjustedSpending = annualSpending * inflationMultiplier + housingCostForAge(inputs, age, inflationMultiplier);

      // Capture start-of-year balances
      const startOfYearBalance = accountBalances.reduce((sum, acc) => sum + acc.balanceInDisplayCurrency, 0);

      // Calculate totals at start of year
      let totalAccessible = 0;
      let totalLocked = 0;
      let totalNetWorth = 0;

      const accountSnapshots = accountBalances.map(acc => {
        const isAccessible = age >= acc.accessAge;
        const balance = acc.balanceInDisplayCurrency;

        if (isAccessible) {
          totalAccessible += balance;
        } else {
          totalLocked += balance;
        }
        totalNetWorth += balance;

        return {
          name: acc.name,
          balance,
          isAccessible
        };
      });

      // Calculate growth and contributions/withdrawals for this year
      let yearGrowth = 0;
      let yearContributions = 0;
      let yearWithdrawals = 0;

      if (age < fireAge) {
        // Accumulation phase
        yearContributions = accountBalances.reduce((sum, acc) => sum + acc.contributionInDisplayCurrency, 0);
        yearGrowth = accountBalances.reduce((sum, acc) => sum + acc.balanceInDisplayCurrency * returnRate, 0);

        // Apply growth and contributions
        accountBalances.forEach(acc => {
          acc.balanceInDisplayCurrency = acc.balanceInDisplayCurrency * (1 + returnRate) + acc.contributionInDisplayCurrency;
        });
      } else {
        // Drawdown phase
        yearWithdrawals = adjustedSpending;

        // Calculate total accessible balance for proportional withdrawal
        let totalAccessibleBalance = 0;
        for (const acc of accountBalances) {
          if (age >= acc.accessAge) {
            totalAccessibleBalance += acc.balanceInDisplayCurrency;
          }
        }

        // Withdraw proportionally from all accessible accounts
        if (totalAccessibleBalance > 0) {
          const withdrawalRatio = Math.min(1, adjustedSpending / totalAccessibleBalance);
          for (const acc of accountBalances) {
            if (age >= acc.accessAge && acc.balanceInDisplayCurrency > 0) {
              acc.balanceInDisplayCurrency -= acc.balanceInDisplayCurrency * withdrawalRatio;
            }
          }
        }

        // Apply growth after withdrawal
        yearGrowth = accountBalances.reduce((sum, acc) => sum + acc.balanceInDisplayCurrency * returnRate, 0);
        accountBalances.forEach(acc => {
          acc.balanceInDisplayCurrency = acc.balanceInDisplayCurrency * (1 + returnRate);
        });
      }

      const endOfYearBalance = accountBalances.reduce((sum, acc) => sum + acc.balanceInDisplayCurrency, 0);
      const mortgagePayoffAge = inputs.currentAge + inputs.mortgageYears;

      years.push({
        age,
        yearsFromNow,
        totalNetWorth,
        totalAccessible,
        totalLocked,
        adjustedSpending,
        accountSnapshots,
        isFireAge: age === fireAge,
        isMortgagePaidOff: inputs.housingStatus === 'mortgage' && inputs.mortgagePayment > 0 && age === mortgagePayoffAge,
        // Breakdown fields for the table
        startBalance: startOfYearBalance,
        growth: yearGrowth,
        contributions: yearContributions,
        withdrawals: yearWithdrawals,
        endBalance: endOfYearBalance
      });
    }

    // Get balances at target FIRE age
    const fireYearData = years.find(y => y.age === fireAge);

    // Calculate effective withdrawal rate at FIRE
    const effectiveWithdrawalRate = fireYearData && fireYearData.totalAccessible > 0
      ? fireYearData.adjustedSpending / fireYearData.totalAccessible
      : 0;

    return {
      years,
      targetFireAge: fireAge,
      fireYearData,
      displayCurrency,
      effectiveWithdrawalRate
    };
  }

  // ============================================
  // RENDERING
  // ============================================
  // Build the warning message when accessible funds run out. Handles both the
  // "gap before pension unlocks" case and the "total savings insufficient" case
  // through one parameterised path.
  function buildDepletionMessage(results, inputs) {
    const { years, targetFireAge, displayCurrency, fireYearData } = results;
    const fireYearAccessible = fireYearData ? fireYearData.totalAccessible : 0;
    const fireYearSpending = fireYearData ? fireYearData.adjustedSpending : 0;

    // First age at which locked accounts unlock after FIRE
    const pensionUnlockAges = inputs.accounts
      .filter(a => a.accessAge > targetFireAge)
      .map(a => a.accessAge)
      .sort((a, b) => a - b);
    const firstUnlockAge = pensionUnlockAges.length > 0 ? pensionUnlockAges[0] : null;

    let depletionAge = null;
    let gapShortfall = 0;   // spending during depleted years before pension unlocks
    let totalShortfall = 0; // spending across all depleted years
    let depletedYears = 0;

    for (const year of years) {
      if (year.age >= targetFireAge && year.totalAccessible <= 0 && depletionAge === null) {
        depletionAge = year.age;
      }
      if (depletionAge !== null && year.totalAccessible <= 0) {
        totalShortfall += year.adjustedSpending;
        depletedYears++;
        if (year.totalLocked > 0) {
          gapShortfall += year.adjustedSpending;
        }
      }
    }

    const isGapProblem = firstUnlockAge && depletionAge < firstUnlockAge;
    const gapYears = isGapProblem ? firstUnlockAge - depletionAge : 0;
    const runwayYears = fireYearAccessible > 0 ? (fireYearAccessible / fireYearSpending).toFixed(1) : 0;
    const yearsToFire = targetFireAge - inputs.currentAge;

    const shortfall = isGapProblem ? gapShortfall : totalShortfall;
    const additionalSavingsNeeded = yearsToFire > 0 ? Math.ceil(shortfall / yearsToFire / 1000) * 1000 : 0;
    const reductionPeriod = isGapProblem ? gapYears : (END_AGE - targetFireAge);
    const spendingReduction = reductionPeriod > 0 ? Math.ceil((shortfall / reductionPeriod) / 100) * 100 : 0;
    const spendingReductionPct = inputs.annualSpending > 0 ? Math.round((spendingReduction / inputs.annualSpending) * 100) : 0;
    // When the required cut meets or exceeds current spending it isn't achievable by trimming spending alone.
    const spendingFix = spendingReductionPct >= 100
      ? 'Spending cuts alone won\'t close this gap (the required reduction exceeds your current spending) \u2014 combine with more savings or a later FIRE date'
      : 'Reduce spending by ~' + formatCurrency(spendingReduction, displayCurrency) + '/year (' + spendingReductionPct + '%)';

    let msg;
    let shortfallLabel;
    let shortfallTarget;
    let savingsFix;
    let delayFix;

    if (isGapProblem) {
      msg = '<strong>Accessible funds run out at age ' + depletionAge + '</strong>' +
            ', leaving a <strong>' + gapYears + '-year gap</strong> before pension/super unlocks at ' + firstUnlockAge + '.';
      shortfallLabel = 'Gap shortfall';
      shortfallTarget = 'to bridge to pension access';
      savingsFix = 'Increase accessible savings by ~' + formatCurrency(additionalSavingsNeeded, displayCurrency) + '/year';
      delayFix = 'Delay FIRE by ' + gapYears + '+ years';
    } else {
      msg = '<strong>All funds run out at age ' + depletionAge + '</strong>' +
            ', leaving you <strong>' + depletedYears + ' years short</strong> of age ' + END_AGE + '.';
      shortfallLabel = 'Total shortfall';
      shortfallTarget = 'to reach age ' + END_AGE;
      savingsFix = 'Increase total savings by ~' + formatCurrency(additionalSavingsNeeded, displayCurrency) + '/year';
      delayFix = 'Delay FIRE to build a larger nest egg';
    }

    msg += '<br><br><strong>Current runway:</strong> ' + runwayYears + ' years of spending covered at FIRE';
    msg += '<br><strong>' + shortfallLabel + ':</strong> ~' + formatCurrency(shortfall, displayCurrency) + ' needed ' + shortfallTarget;

    if (yearsToFire > 0) {
      msg += '<br><br><strong>To fix, consider:</strong><ul class="fix-list">';
      msg += '<li>' + savingsFix + '</li>';
      msg += '<li>' + spendingFix + '</li>';
      msg += '<li>' + delayFix + '</li>';
      msg += '</ul>';
    }

    return msg;
  }

  // Housing summary for the results grid: directly answers "am I mortgage-free at FIRE?"
  function getHousingSummary(inputs) {
    if (inputs.housingStatus === 'own') {
      return { value: 'Own outright', note: 'No housing costs in retirement' };
    }
    if (inputs.housingStatus === 'mortgage') {
      const payoffAge = inputs.currentAge + inputs.mortgageYears;
      if (inputs.mortgagePayment <= 0 || payoffAge <= inputs.fireAge) {
        return { value: 'Mortgage-free', note: 'Paid off by age ' + payoffAge };
      }
      return { value: 'Still paying', note: 'Mortgage until age ' + payoffAge + ' \u2014 not fully FIRE' };
    }
    return { value: 'Renting', note: 'Housing cost never ends' };
  }

  function getHousingCaveat(inputs) {
    if (inputs.housingStatus === 'rent') {
      return '<br><br><strong>Renting:</strong> your housing cost never ends and rises with inflation, so you need a larger pot than an owner. To be truly FIRE, consider owning the place you live in.';
    }
    if (inputs.housingStatus === 'mortgage' && inputs.mortgagePayment > 0) {
      const payoffAge = inputs.currentAge + inputs.mortgageYears;
      if (payoffAge > inputs.fireAge) {
        return '<br><br><strong>Mortgage:</strong> not paid off until age ' + payoffAge + ', so part of your drawdown covers housing until then \u2014 you are not fully mortgage-free at FIRE.';
      }
    }
    return '';
  }

  function renderResults(results, inputs) {
    const { years, targetFireAge, fireYearData, displayCurrency, effectiveWithdrawalRate } = results;

    // Show results section
    elements.resultsSection.style.display = 'block';

    // Render summary values
    const fireYearNetWorth = fireYearData ? fireYearData.totalNetWorth : 0;
    const fireYearAccessible = fireYearData ? fireYearData.totalAccessible : 0;
    const fireYearLocked = fireYearData ? fireYearData.totalLocked : 0;
    const fireYearSpending = fireYearData ? fireYearData.adjustedSpending : 0;

    // Status hierarchy: depleted (warning) -> above 4% (caution) -> on track (success)
    const fundsDepleted = years.some(y => y.age >= targetFireAge && y.totalAccessible <= 0);
    const hasLockedAtFire = inputs.accounts.some(a => a.accessAge > targetFireAge);

    let statusClass;
    let statusMessage;

    if (fundsDepleted) {
      statusClass = 'status-warning';
      statusMessage = buildDepletionMessage(results, inputs);
    } else if (effectiveWithdrawalRate > 0.04) {
      statusClass = 'status-caution';
      statusMessage = 'You can FIRE at age ' + targetFireAge + ', but your initial withdrawal rate of ' +
        formatPercent(effectiveWithdrawalRate) + ' is above the traditional 4% safe rate. Your funds are projected to last, especially once pension/super unlocks.';
    } else {
      statusClass = 'status-success';
      statusMessage = 'You are on track to reach FIRE at age ' + targetFireAge + '. Your accessible funds sustain your spending' +
        (hasLockedAtFire ? ' until pension/super unlocks' : '') + '.';
    }

    // Append housing caveat (renting / mortgage not cleared at FIRE)
    statusMessage += getHousingCaveat(inputs);

    // Withdrawal rate note
    let withdrawalRateClass = '';
    let withdrawalRateNote = 'Your effective withdrawal rate';
    if (effectiveWithdrawalRate > 0.04) {
      withdrawalRateClass = 'warning-value';
      withdrawalRateNote = 'Above 4% - consider reducing spending';
    } else if (effectiveWithdrawalRate > 0) {
      withdrawalRateNote = 'Below 4% safe withdrawal rate';
    }

    const housing = getHousingSummary(inputs);

    elements.resultsSummary.innerHTML =
      '<div class="result-card ' + statusClass + '">' +
        '<p>' + statusMessage + '</p>' +
      '</div>' +
      '<div class="result-grid">' +
        '<div class="result-item">' +
          '<span class="result-label">Net Worth at ' + targetFireAge + '</span>' +
          '<span class="result-value">' + formatCurrency(fireYearNetWorth, displayCurrency) + '</span>' +
        '</div>' +
        '<div class="result-item">' +
          '<span class="result-label">Accessible at ' + targetFireAge + '</span>' +
          '<span class="result-value">' + formatCurrency(fireYearAccessible, displayCurrency) + '</span>' +
          '<span class="result-note">Funds you can withdraw</span>' +
        '</div>' +
        '<div class="result-item">' +
          '<span class="result-label">Locked until later</span>' +
          '<span class="result-value">' + formatCurrency(fireYearLocked, displayCurrency) + '</span>' +
          '<span class="result-note">Pension/Super not yet accessible</span>' +
        '</div>' +
        '<div class="result-item">' +
          '<span class="result-label">Withdrawal Rate at ' + targetFireAge + '</span>' +
          '<span class="result-value ' + withdrawalRateClass + '">' + formatPercent(effectiveWithdrawalRate) + '</span>' +
          '<span class="result-note">' + withdrawalRateNote + '</span>' +
        '</div>' +
        '<div class="result-item">' +
          '<span class="result-label">Annual Spending at ' + targetFireAge + '</span>' +
          '<span class="result-value">' + formatCurrency(fireYearSpending, displayCurrency) + '</span>' +
          '<span class="result-note">Inflation-adjusted, incl. housing</span>' +
        '</div>' +
        '<div class="result-item">' +
          '<span class="result-label">Housing at ' + targetFireAge + '</span>' +
          '<span class="result-value">' + housing.value + '</span>' +
          '<span class="result-note">' + housing.note + '</span>' +
        '</div>' +
      '</div>';

    // Render chart, table and timeline
    renderNetWorthChart(results, inputs);
    renderBreakdownTable(results, inputs);
    renderLiquidityAnalysis(results, inputs);
  }

  function renderBreakdownTable(results, inputs) {
    const { years, targetFireAge, displayCurrency } = results;

    // Get UK pension access age from accounts (if present)
    const ukPensionAccount = inputs.accounts.find(a => a.name === 'UK Pension');
    const ukPensionAccessAge = ukPensionAccount ? ukPensionAccount.accessAge : null;

    // Determine which years to show (milestones + a few surrounding years)
    const milestoneAges = new Set([
      inputs.currentAge,
      inputs.currentAge + 5,
      inputs.currentAge + 10,
      targetFireAge - 1,
      targetFireAge,
      targetFireAge + 1,
      PRESERVATION_AGES.au.super,
      70,
      80
    ]);

    if (ukPensionAccessAge) {
      milestoneAges.add(ukPensionAccessAge);
    }

    // Add mortgage payoff age if relevant
    if (inputs.housingStatus === 'mortgage' && inputs.mortgagePayment > 0) {
      milestoneAges.add(inputs.currentAge + inputs.mortgageYears);
    }

    const validAges = Array.from(milestoneAges)
      .filter(age => age >= inputs.currentAge && age <= END_AGE)
      .sort((a, b) => a - b);

    let html = '<h4>Year-by-Year Breakdown</h4>';
    html += '<p class="table-note">Validate: End Balance = Start Balance + Growth + Contributions - Withdrawals</p>';
    html += '<div class="table-scroll">';
    html += '<table class="breakdown-table">';
    html += '<thead><tr>' +
      '<th>Age</th>' +
      '<th>Start Balance</th>' +
      '<th>Growth (ROI)</th>' +
      '<th>Contributions</th>' +
      '<th>Withdrawals</th>' +
      '<th>End Balance</th>' +
      '<th>Notes</th>' +
      '</tr></thead>';
    html += '<tbody>';

    for (const age of validAges) {
      const yearData = years.find(y => y.age === age);
      if (!yearData) continue;

      const notes = [];
      if (age === inputs.currentAge) notes.push('Start');
      if (age === targetFireAge) notes.push('FIRE Target');
      if (yearData.isMortgagePaidOff) notes.push('Mortgage paid off');
      if (ukPensionAccessAge && age === ukPensionAccessAge && (inputs.country === 'uk' || inputs.country === 'both')) {
        notes.push('UK Pension unlocks');
      }
      if (age === PRESERVATION_AGES.au.super && (inputs.country === 'au' || inputs.country === 'both')) {
        notes.push('AU Super unlocks');
      }

      const rowClass = age === targetFireAge ? 'fire-row' : '';

      html += '<tr class="' + rowClass + '">' +
        '<td>' + age + '</td>' +
        '<td>' + formatCurrency(yearData.startBalance, displayCurrency) + '</td>' +
        '<td class="positive">' + formatCurrency(yearData.growth, displayCurrency) + '</td>' +
        '<td class="positive">' + (yearData.contributions > 0 ? formatCurrency(yearData.contributions, displayCurrency) : '-') + '</td>' +
        '<td class="negative">' + (yearData.withdrawals > 0 ? formatCurrency(yearData.withdrawals, displayCurrency) : '-') + '</td>' +
        '<td>' + formatCurrency(yearData.endBalance, displayCurrency) + '</td>' +
        '<td class="notes-cell">' + notes.join(', ') + '</td>' +
        '</tr>';
    }

    html += '</tbody></table></div>';

    elements.breakdownTableContainer.innerHTML = html;
  }

  function renderLiquidityAnalysis(results, inputs) {
    const { years, targetFireAge, displayCurrency } = results;

    const milestones = [];

    // FIRE age first
    const fireYearData = years.find(y => y.age === targetFireAge);
    milestones.push({
      age: targetFireAge,
      label: 'Target FIRE date',
      isFireMarker: true,
      balance: fireYearData ? fireYearData.totalAccessible : 0,
      strategy: getStrategyForAge(targetFireAge, inputs)
    });

    // Pension/super unlock ages
    if (inputs.country === 'uk' || inputs.country === 'both') {
      const ukPensionAccount = inputs.accounts.find(a => a.name === 'UK Pension');
      const ukPensionAccessAge = ukPensionAccount ? ukPensionAccount.accessAge : 57;
      if (ukPensionAccessAge > targetFireAge) {
        const yearData = years.find(y => y.age === ukPensionAccessAge);
        milestones.push({
          age: ukPensionAccessAge,
          label: 'UK Pension unlocks',
          balance: yearData ? yearData.totalAccessible : 0,
          strategy: 'Add UK Pension to accessible pool'
        });
      }
    }

    if (inputs.country === 'au' || inputs.country === 'both') {
      if (PRESERVATION_AGES.au.super > targetFireAge) {
        const yearData = years.find(y => y.age === PRESERVATION_AGES.au.super);
        milestones.push({
          age: PRESERVATION_AGES.au.super,
          label: 'AU Super unlocks',
          balance: yearData ? yearData.totalAccessible : 0,
          strategy: 'All accounts now accessible'
        });
      }
    }

    // Depletion age if funds run out
    const depletionYear = years.find(y => y.age >= targetFireAge && y.totalAccessible <= 0);
    if (depletionYear) {
      milestones.push({
        age: depletionYear.age,
        label: 'Funds depleted',
        isWarningMarker: true,
        balance: 0,
        strategy: 'No accessible funds remaining'
      });
    }

    milestones.sort((a, b) => a.age - b.age);

    let html = '<h4>Liquidity Timeline & Drawdown Strategy</h4><div class="timeline">';

    for (const milestone of milestones) {
      let markerClass = '';
      if (milestone.isFireMarker) markerClass = 'fire-marker';
      if (milestone.isWarningMarker) markerClass = 'warning-marker';

      html += '<div class="timeline-item ' + markerClass + '">' +
                '<div class="timeline-age">Age ' + milestone.age + '</div>' +
                '<div class="timeline-event">' + milestone.label + '</div>' +
                '<div class="timeline-strategy">' + milestone.strategy + '</div>' +
                '<div class="timeline-balance">Accessible: ' + formatCurrency(milestone.balance, displayCurrency) + '</div>' +
              '</div>';
    }

    html += '</div>';

    elements.liquidityAnalysis.innerHTML = html;
  }

  function getStrategyForAge(age, inputs) {
    const ukPensionAccount = inputs.accounts.find(a => a.name === 'UK Pension');
    const ukPensionAge = ukPensionAccount ? ukPensionAccount.accessAge : 57;
    const auSuperAge = PRESERVATION_AGES.au.super;

    if (inputs.country === 'both') {
      if (age < ukPensionAge) {
        return 'Proportional draw from UK ISA and AU Savings';
      } else if (age < auSuperAge) {
        return 'Proportional draw from UK ISA, UK Pension, and AU Savings';
      }
      return 'All accounts accessible - proportional draw';
    } else if (inputs.country === 'uk') {
      if (age < ukPensionAge) {
        return 'Draw from ISA only';
      }
      return 'Proportional draw from ISA and Pension';
    }
    if (age < auSuperAge) {
      return 'Draw from taxable savings/ETFs only';
    }
    return 'Proportional draw from Super and Savings';
  }

  function renderNetWorthChart(results, inputs) {
    const { years, displayCurrency, targetFireAge } = results;
    const ctx = document.getElementById('available-chart').getContext('2d');

    const labels = years.map(y => y.age);
    const accessibleData = years.map(y => Math.round(y.totalAccessible));

    // Milestone ages: FIRE age plus pension/super unlock ages
    const milestoneAges = new Set([targetFireAge]);
    const ukPensionAccount = inputs.accounts.find(a => a.name === 'UK Pension');
    const auSuperAccount = inputs.accounts.find(a => a.name === 'AU Super');
    if (ukPensionAccount) milestoneAges.add(ukPensionAccount.accessAge);
    if (auSuperAccount) milestoneAges.add(auSuperAccount.accessAge);

    const pointRadius = years.map(y => milestoneAges.has(y.age) ? 6 : 0);
    const pointHoverRadius = years.map(y => milestoneAges.has(y.age) ? 8 : 0);
    const pointBackgroundColors = years.map(y =>
      y.age === targetFireAge ? 'rgba(255, 99, 132, 1)' : 'rgba(54, 162, 235, 1)'
    );

    if (netWorthChart) {
      netWorthChart.destroy();
    }

    netWorthChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Accessible Net Worth',
          data: accessibleData,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.1,
          pointBackgroundColor: pointBackgroundColors,
          pointRadius: pointRadius,
          pointHoverRadius: pointHoverRadius
        }, {
          label: 'Total Net Worth',
          data: years.map(y => Math.round(y.totalNetWorth)),
          borderColor: 'rgba(120, 120, 120, 0.7)',
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderDash: [5, 5],
          fill: false,
          tension: 0.1,
          pointRadius: 0,
          pointHoverRadius: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          title: {
            display: true,
            text: 'Net Worth Over Time (' + displayCurrency + ')'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.dataset.label + ': ' + formatCurrency(context.raw, displayCurrency);
              },
              afterBody: function(context) {
                const age = parseInt(context[0].label);
                const lines = [];
                if (age === targetFireAge) {
                  lines.push('FIRE Age');
                }
                if (ukPensionAccount && age === ukPensionAccount.accessAge) {
                  lines.push('UK Pension accessible');
                }
                if (auSuperAccount && age === auSuperAccount.accessAge) {
                  lines.push('AU Super accessible');
                }
                return lines;
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Age'
            }
          },
          y: {
            title: {
              display: true,
              text: displayCurrency
            },
            ticks: {
              callback: function(value) {
                if (value >= 1000000) {
                  return (value / 1000000).toFixed(1) + 'M';
                } else if (value >= 1000) {
                  return (value / 1000).toFixed(0) + 'K';
                }
                return value;
              }
            }
          }
        }
      }
    });
  }

  // ============================================
  // EVENT LISTENERS
  // ============================================
  function init() {
    elements.countryRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        updateVisibility();
        if (getSelectedCountry() === 'both') {
          fetchExchangeRate();
        }
      });
    });

    elements.currencyRadios.forEach(radio => {
      radio.addEventListener('change', updateVisibility);
    });

    elements.housingRadios.forEach(radio => {
      radio.addEventListener('change', updateHousingVisibility);
    });

    elements.calculateBtn.addEventListener('click', () => {
      const inputs = getInputs();
      const results = calculateProjection(inputs);
      renderResults(results, inputs);
      elements.resultsSection.scrollIntoView({ behavior: 'smooth' });
    });

    elements.currentAge.addEventListener('change', updateUKPensionAgeDisplay);
    elements.currentAge.addEventListener('input', updateUKPensionAgeDisplay);

    updateVisibility();
    updateHousingVisibility();
    updateUKPensionAgeDisplay();
  }

  init();
})();
