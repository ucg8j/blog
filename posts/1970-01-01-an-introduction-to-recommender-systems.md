---
title: An Introduction to Recommender Systems
slug: an-introduction-to-recommender-systems
date_published: 1970-01-01T00:00:00.000Z
date_updated: 2018-01-20T13:44:10.000Z
draft: true
---

"NBO has its origins in Amazon.com’s early use of so-called recommendation software (or collaborative filtering, in engineering-speak) to spur shoppers toward a “next best offer” based on site page visits and, of course, actual purchases."
[https://www.cooladata.com/blog/next-best-offer-customer-based-predictive-datas-new-frontier/](https://www.cooladata.com/blog/next-best-offer-customer-based-predictive-datas-new-frontier/)

[https://hackernoon.com/spotifys-discover-weekly-how-machine-learning-finds-your-new-music-19a41ab76efe](https://hackernoon.com/spotifys-discover-weekly-how-machine-learning-finds-your-new-music-19a41ab76efe)

## Dithering

Is a technique to improve the learning of a recommender system by taking items with lower relevancy scores and bringing them up the ranking. As users generally don't frequently go beyond the first few results we won't have feedback data on these recommendations. E.g. click through rates on search results almost never go past the first page of results.

> As a result, the recommendation engine mostly gets feedback on re‐ sults that it already knows about and gets very little feedback on results at the edge of current knowledge. This limitation causes the recom‐ mendation engine to stagnate at or near the initial performance level. It does not continue to learn.

Source: p39 Practical Machine Learning: Innovations in Recommendation

## Anti-Flood

> It is much better to avoid monotony in the user experience by pro‐ viding diversity in recommendations with no more than a few of each kind of results.

> ...our experience has been that it is much easier to ruin an otherwise good recommendation engine than it is to get diverse results out of the engine while maintaining overall quality... As a precaution, it is much easier to simply reorder the recommendations

Source: p.40 Practical Machine Learning: Innovations in Recommendation

## Evaluate with A/B testing

# Further Reading

- [https://blog.statsbot.co/recommendation-system-algorithms-ba67f39ac9a3](https://blog.statsbot.co/recommendation-system-algorithms-ba67f39ac9a3)
- [https://www.cs.uic.edu/~elena/pubs/kotsogiannis-wsdm17.pdf](https://www.cs.uic.edu/~elena/pubs/kotsogiannis-wsdm17.pdf)
