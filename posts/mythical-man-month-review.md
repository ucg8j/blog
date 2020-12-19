---
title: Book Review - The Mythical Man Month
permalink: /mythical-man-month-review/
date: 2020-11-18
tags: book, review, software, management
excerpt: A 2020 review of the classic software engineering management book.
layout: layouts/post.njk
---

📚 Book: [Mythical Man Month](https://www.goodreads.com/book/show/13629.The_Mythical_Man_Month)
⭐️ Rating: 3/5 (4/5 if you haven't had experience in tech)

![](/content/images/2020/mythical-man-month-frontcover.png)

The Mythical Man Month (MMM) is a collection of essays that encapsulate wisdom accumulated by the author Fred Brooks. If, like me, you have been in the tech industry for a number of years you are unlikely to gain much value from this book - as you have either read articles or experienced first hand these lessons.

### Some criticisms of the book:
- 🤦‍♀️ There's not a female pronoun in sight - one of the few mentions of a female, is for an analogy where the project is a pregnancy, adding more women to the project will not decrease the nine months it will take for the birth to happen. This is to be expected of a book originally written in 1975 and with a title like *Mythical Man Month*. I read the 1995 edition. I would hope any subsequent editions endeavour to have more gender inclusive language.
- 👼 There's quite a lot of God mentions, more mentions of God than Women.
- 📠 Many of the examples are very out of date. And the details on these examples of e.g. IBM 360 are superflous to the modern reader.

## Major (Useful) Points of the Book
### 💣 Combinatorial Explosion
Where the title of the book comes from. Many simpler types of work scale linearly with additional resources. For example, if you were a Farmer of 20 fields employing labour to til those fields. You might imagine doubling labour from 2 to 4 would double results. This is true, as there is little requirement for coordination of the manual labour. Labourers each get an allocation of fields to independently til. However, with work that requires much coordination, alignment of corresponding components of a greater system like software, adding more labour is frequently counterproductive. This leads to an assertion that *adding engineers to a late project will make it later* because of the communication overhead and the need to onboard.

The effect is known as [combinatorial explosion](https://en.wikipedia.org/wiki/Combinatorial_explosion). Where each node (worker) that needs to be aligned with the rest of the team adds many more communication links.
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mtext>links</mtext></mrow><mo>=</mo><mfrac><mrow><msup><mi>n</mi><mn>2</mn></msup><mo>-</mo><mi>n</mi></mrow><mn>2</mn></mfrac></math>

A few examples demonstrate this:
- when `n=2`, there is 1 link
- when `n=4`, there are 6 links
- when `n=8`, there are 28 links

This rule is also known as the '[two pizza rule](https://www.theguardian.com/technology/2018/apr/24/the-two-pizza-rule-and-the-secret-of-amazons-success)' 🍕 - teams shouldn't be larger than can be fed with two pizzas. Not helpful if you eat an entire pizza to yourself 🤤. However, 5-7 people is what is meant.

### 🧠 Conceptual Integrity
>... conceptual integrity is the most important consideration in system design

Brooks talks a lot about *Conceptual Integrity* of software systems. In data analytics this is known by various terms e.g. ontology, entity models. If you have worked with any system with multiple contributors you have likely witnessed the core concepts of a system drift over time. Here Brooks suggests a solution,

>If a system is to have conceptual integrity, someone must control the concepts. That is an aristocracy that needs no apology.

### 📈 10x programmers
To maintain *conceptual integrity* smaller teams should be preferred.

>one wants the system to be built by as few minds as possible

The type of team you should favour is one of a few senior engineers rather than one that is larger with junior engineers. Brooks cites a study measuring programmer productivity which is probably where the *10x engineers* terminology originated. I thought this might be an exaggeration, but I've seen this play out in a workplace. A leader of a project thought that software was a sweatshop and if they just got more cheap juniors fresh out of code bootcamps that software would happen. It didn't. However, hiring one senior and one mid-level engineer saw delivery sky rocket. And yes, the senior was an order of magnitude more productive than juniors and for less than 3x the price!

### 📄 Documentation
Write a spec/proposal document prior to commencing on the code. This outlines a number of things, the *why*, the requirements of a solution, the range of solutions considered and the proposed solution to be implemented. This helps in many ways, the writing process helps expose gaps in thinking, communicates to others, helps align the team and provides a record of what is being done or has been done.

### 🚧 Maintenance
>A program doesn't stop changing when it is delivered for customer usage

Brooks estimates that maintenance is '40 percent or more' than the initial cost of developing a system. The more users you have the greater the cost as more bugs are found by more users.

## Resources
- [asciimath.org](http://asciimath.org/) - used to generate mathML mathjax forumula
