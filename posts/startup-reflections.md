---
title: Startup Reflections
permalink: /startup-reflections/
slug: startup-reflections
date: 2023-11-21
tags: tech, startups
excerpt: After 12 months of working on a startup and failing to get traction. These are a collection of hard lessons learnt.
layout: layouts/post.njk
---

This is a concise list of lessons learnt the hard way doing a startup. I've tried to keep it as dot-pointy as possible. Which removes the story behind ilumadata (YC22). I may follow up with more of a story-of-the-journey narrative style post. Writing this post has been incredibly cathartic.

If I had to pick two of the learnings, they would be validate the problem/solution upfront i.e. find someone that says 'how can I use this now?' and co-founder fit.


# Product
Our two sentence description: *ilumadata is retool for data pipelines. We're building a cloud editor for enterprise data teams that makes it easy to build, test, and launch data transformations in seconds.*

- Read [the Mom test](https://www.goodreads.com/book/show/52283963-the-mom-test?ac=1&from_search=true&qid=hsNb4HuTjb&rank=1) first, it's a quick read and will save you a lot of time.
	- to validate your product, you need to:
		- Find and validate the problems your target persona has. Ask, *what is your biggest problem? Have you tried fixing it? How often does this happen?*
		- Get some sort of commitment. *Will they sign an LOI? Introduce you to their boss? Pay money now?*
- For ilumadata the adoption cost was greater than the value add. See the [Collison install](http://www.startupengine.org/2013/08/the-collision-installation.html). Adoption needs to be easy - this unlocks critical feedback, which can become the flywheel for increasing product value.
- Ultimately ilumadata was a 'nice to have' - a proliferation of data tools, and a change in the macroeconomy meant no space for nice to haves.
 - Shallow insight? Do people want this? No, do they *really* want it? I could have de-risked this earlier. I *thought* I did with some early calls, but in retrospect they failed the [Mom test](https://www.goodreads.com/book/show/52283963-the-mom-test?ac=1&from_search=true&qid=hsNb4HuTjb&rank=1). To de-risk, try selling a product that doesn't exist.
- Pivot faster - constantly be updating what you are trying to learn from the next call. What is the hypothesis you are trying to prove/disprove?

>"if a company makes a product that people dislike yet still buy, then presumably they'd buy a better alternative if you made one" - [pg](http://paulgraham.com/superlinear.html)

- 👆 When we started, no one liked dbt cloud, the mistake was thinking they were an indicator of success. However a year later, from all our user interviews dbt cloud did not appear to have high uptake of their paid cloud product. 7 months into our venture they had laid off 50% of their workforce and doubled pricing. dbt core solves some real pain points, but dbt cloud is a nice to have.
- Does your product need SOC II? We thought we did. We had found an evangelist *user* at a 1000 headcount US heath care company. Maybe it's going to be our first enterprise sale 🤞📈. They were prepping us for the sales process and said we needed SOC II to get past security. So we rushed out and got it in two weeks. The lead went cold, complete ghosting 👻. But we'd just forked out 20k to get our shiny SOC II badge. With hindsight, we should have been in front of the *buyer* and getting a commitment from them before the SOC II to de-risk the investment on our side. Vanta, Drata and similar companies sell startups on fear 'don't let SOC II be the reason you lose your first big deal'. Whilst this might be true in some cases, if you are really solving a problem, you can get a commitment from the buyer before you get SOC II.

# Co-Founders
> [Here's a guide on How to find a co-founder]()

Co-founding a company is really the business version of marriage. The first signs we didn't work well together occurred during the YC batch. We had left the happy place of coding as a side project, and now were in making all sorts of time pressured decisions to make this a successful company. Our communications styles were very different. Founders are literally the foundation of the company, not working well together always meant a separation was inevitable [^1].

- Perhaps the most important factor in an early stage startup, really really invest time here building and testing the relationship.
- Make sure you go through and write down your answers to [First Mark's 50 Founder Questions](https://proof-assets.s3.amazonaws.com/firstround/50%20Questions%20for%20Co-Founders.pdf). This is good for you to reflect on some hard questions, but also to uncover where there are discrepancies between you and your co-founder. Do this before you start working together. We didn't do this.
- If there is a spectrum between having no opinions, and a mountain of dogmas. You need someone in between, someone that you + Co-founder = better outcomes.
- It is a marriage, your incorporation documents are your marriage certificate and it takes significant legal fees, stress and heartache to get divorced. Would you get married to someone you haven't really spent time getting to know?
	- pick things you disagree on and commit to debating passionately. If you can't do this productively now, how will you in the future?
	- work together - starting to code on the idea is unlikely a good stress test. It's just one area of what you need to work on as founders and as tech co-founders you're in your happy state! It tests whether you work as an engineering duo. But what about when you're stressed, tired, and have to make a decision on a product direction? I know founders who have purposely setup a 12hr day working side by side with a packed agenda to stress test. Others have gone on a two week working 'holiday' together - and then chosen not to continue, way better than years later.
- Listen to any negative hunches you might have - this will likely get worse later on. Would you hang out solo with them, just for fun? If not, why not?
- Pre-define areas of ownership. I made the mistake of everyone does everything, which is often true in startups, but everyone doesn't have to **agree** on everything. Seeking consensus on operational things e.g. landing page copy should perhaps be open to a round or two of feedback, but ultimately decision to execute and move fast lies with the owner. Your co-founder should be comfortable with this. Yes, areas of responsibility and how you resolve deadlocks is covered in the [50 Founder Questions.](https://proof-assets.s3.amazonaws.com/firstround/50%20Questions%20for%20Co-Founders.pdf)

# Sales
- Pre-Product Market Fit both founders should be doing at least some selling, stick your noses into the market. If you're not selling, you're not learning. And if you haven't found a 'hair on fire' problem, then building is really just a waste of time. But it feels productive!
- Customer onboarding - ensure technical founder/s are present for this. Feel the customer pain, so it gets prioritised appropriately against other pains, e.g. engineering pains!
- Read the Mom test first, oh I said this already! Have you read it yet?
- You can Sell first, then build. You can sell a product that doesn't exist, do outbound "we're building X that solves Y", focus on their problems (discovery/validation for you!) and if what your building is a real pain point, be up front on where the build is at and get a commitment (next meeting / LOI!).
- Depending on your product, the user and buyer may be different people. This makes it harder for you to sell.

**Buyer**
- took too long to realise the initial problem, was not the top priority. Much greater concern with data quality. That problem comes before getting greater usage by people with less data skills.
- Start with buyer validation, not user validation. Getting a commitment from a buyer is better than the commitment a user can offer you.

**User**
- in an attempt to breach the chasm between the data team and business, we fell into it. Too technical still for business folk and too light touch for those tech inclined data people.

# Market
- You don't want to be working on a 'nice to have' at the best of times. But if you are and you have a enterprise sales motion, recession fears and major tech lay offs mean most enterprise doors are closed.
- One early thought was - 'if we improve productivity even by a tiny fraction like 5% then using ilumadata is an obvious win'. Firstly, your adoption cost needs to be low to prove this, ours were not. Secondly, even this is not enough, you need to solve a problem and 'improving efficiency by 5%' is not a problem.
- Market Saturation - so many tools in this space, and it only got worse as we were out there. We thought our product was unique or at least sufficiently different, then we started finding many companies doing the same thing.
- Outside of the real core of a data platform, cloud data-warehouses and BI, who is getting decent revenue? Purportedly not many.

#### See also
- [Cascade - Similar startup that failed](https://www.cascade.io/epilogue/the-data-and-analytics-market)
- [Category Collapse](https://benn.substack.com/p/category-collapse)
- [Guide to startups](https://pmarchive.com/guide_to_startups_part4.html)

# Miscellaneous
- legal - cease and desist - don't be scared of this (unless - you really did break laws!)
	- one of our advisers congratulated us
	- Get referrals from respected people to boutique specific law firms - we landed an incredible litigation firm that was very reasonable on the company purse.
	- Big incumbents sometimes hoard the top flight law firms by given legal matters to all of the firms. That way, the law firm you're using will have a potential conflict of interest and need the company that sent you the C&D to sign a waiver. Which of course they won't do!
- on being a founder
	

# Me
- Mental health - doing a startup is very hard. Everyone tells you this. But the lived experience is very different. Facing hundreds of rejections, many iterations, a hard pivot, co-founder separation and eventually a wind-down is tough. I remember seeing the 'trough of sorrow' graph before going through YC, it's very real!

![trough-of-sorrow](../content/images/2023/trough-of-sorrow.png).

- Sales Led Growth is hard! Not sure if would be different with better traction. Perhaps I'd love it it if I had felt the PMF pull. I haven't tried Product Led Growth.
- I'm definitely not a perfectionist - if it works, let's ship it! Then if it is valuable, let's make it better. If customers don't use it, remove it. I'm very comfortable with things being rough around the edges.
- I learnt more about what I need from a co-founder. Someone who is communicative and reflective. Sharing the human experience is helpful to get through the tough times. In an async environment, receiving feedback or even an acknowledgement on meeting notes shared helps me feel I'm not working solo.
- I found talking to other founders really helpful, normalising the struggles unique to startups, hearing about what they have tried, what's worked and what hasn't - it's something I do regularly now, but could have done more through the hard times. This is a huge benefit of going through an accelerator, to forge your network of entrepreneurs.
- CEO - this role is hard and one that I don't much enjoy as a full time job. A lot of startups in our batch had the fight over the role, many have co-CEO's until your group partner finally yells at you enough to change! Early on, this was not my full time. We had an MVP to build. The code base was 40% written by me 6 months in. This felt productive, but in retrospective validating the problem and willingness to pay would have been time better spent. The last few months of the venture I was pure sales/product, soft pivoting through problem areas in the modern data tooling space. When the business/tech ration became 100% business for me, that's when I realised I didn't want to be CEO.
- There is an inherent duplicity that must be maintained, startups are innately difficult and full of uncertainty. But you must project confidence and optimism when raising funds, when selling and to employees, all whilst you might be plague by doubts or recovering from the last 'No' you were banking was a 'Yes'! I found this balance hard to maintain.

# Investors
- Don't be driven by investors, they are not the buyer.
	- if they ask for a product roadmap and you are pre-PMF, this is a waste of time. Spend time on PMF. I remember Siebel during our batch saying "chuck out your Product Roadmap".
- I've filtered out potential co-founders based on focusing on 'investor traction' rather than customer traction
- Don't be afraid of owning your failure / ego getting in the way. I let this get in the way of investor updates, I'd think *I'll wait for some good news* (that never comes!). I should have been more open with investors, they are there to help you. I was afraid of being judged, but in retrospect I was judging myself more harshly than they would have.
- We raised a small round but it cost 2months of time. Did we need to raise? Whilst in YC "The mantra was if you _can_ raise at Demo Day, you _should_ raise" (see [another YC founder's experience of this](https://www.lennysnewsletter.com/p/startup-to-exit-lessons-from-a-first))
	- We could have proven this idea didn't work with only the YC investment. Which would have been more efficient.

# Essential reading
- [startup primer](https://docs.google.com/document/d/1pUdqNJf0hchC96ZW142vE7xKPNsWZpw_GF_PIf9pJ7k/edit)
- https://evis.substack.com/p/we-grew-from-0-to-150k-in-6-months?r=7zecw

# Footnotes
[^1]: One exception to this is if you find PMF - it solves everything. Have heard of founders absolutely hating eachother, that trickling down into very poor company culture. But when you're on a rocket ship to a big payout, people will stick it out 🥕🥕🥕.
