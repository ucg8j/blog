---
title: The Pragmatic Programmer - Review
permalink: /pragmatic-programmer-review/
slug: pragmatic-programmer-review
date: 2020-12-28
tags: book, review, software, management
excerpt: A 2020 review of the classic software engineering management book.
layout: layouts/post.njk
---

📚 Book: [The Pragmatic Programmer](https://www.goodreads.com/book/show/4099.The_Pragmatic_Programmer)

⭐️ Rating: 4/5 Sagely advice that is written in an engaging and highly consumable form.

![](/content/images/2020/pragmatic-programmer-frontcover.png#thumbnail)

The Pragmatic Programmer is a very good book full of practical advice. It's written with little *Tip* boxes which are the tl:dr; of a particular section. There's a healthy sprinkling of Dad jokes throughout the book 😁.

Unlike, a [Mythical Man Month](/mythical-man-month-review/), I would recommend this to seasoned professionals as well as newbies. Though this also has a lot of content for the seasoned professional, it is much easier to parse. Instead of having long anecdotes about long since dead technology to gleam the lesson, this book is to the point, with helpful tip boxes, exercises and the examples are mostly relevant to today.

## ❗️ Some criticisms of the book:
#### Tip 17: Program close to the problem domain
Whilst I agree with the principle, the accompanying pages advocate for the creation of *mini languages* in order to get closer to the domain. The project manager senses in me (I am not a project manager) can see this quickly becoming a rabbit hole distraction where developers end up on an academic pursuit of these mini languages, the necessary language parsers, documentation etc. The suggestion to create languages for all makes me cringe,

>There's the end user, who understands the business rules and the requried outputs. There are also secondary users: operations staff, configuration and test managers, support and maintenance programmers, and future generations of developers. Each of these users has their own problem domain and you can generate mini-environments and languages for all of them.

I've not observed anyone creating a mini-language during a project. What I think is more practical and occurs in real-world projects is creating packages of functions whose scope is limited to a particular domain. Such that the ontological representation, the digital recreation of real world concepts happens with a set of classes and/or functions that map to the domain.

#### Chp 3 - The Basic Tools
This chapter discusses tools that a pragmatic programmer should have in their tool kit. Inevitable the technological tools have changed in the intervening years. Well, eMacs and Vi are still around, but the recommended plugins etc. are out of date. If you don't have a good toolset already, I'd recommend going through the MIT's [The Missing Semester of Your CS Education.](https://missing.csail.mit.edu/)


## ✅ Major (Useful) Points of the Book
### ⚖️ Involve Your Users in the Trade-Off
It's quite a common occurrence for technical people when asked by a stakeholder to feel anxious or pressured to provide an estimate of when something can be done on the spot. For a particular data request, this might mean involving the stakeholder in the tradeoff between how accurate vs how quick the deliverable's turnaround is.

### 🍸 DRY
Don't repeat yourself (DRY) is a commonly held maxim of programming. The Pragramatic Programmer exposits the common causes for duplication. This can arise from multiple places, project requirements, multiple target platforms, multiple programming languages being used in one system, laziness etc. A programmer may have to duplicate the schema of a database table to represent it as a class in their programme. Documentation in code as comments and as a separate accompanying document. But these can be duplicative of each other.

> good code has lots of comments

☝️ A slight digression from DRY, but this go-to book for the industry is in favour of lots of comments in code. I've come across a few developers who like to argue the code *is* documentation. But code will never tell you *why* the code has been written this way, or the *trade offs* considered in choosing a particular approach. I've never heard anyone complain *'there are just too many comments in this codebase'*.

With all rules there are [exceptions and trade-offs with DRY](https://orbifold.xyz/dry-trade-off.html).

### 📐 Orthogonality
>Tip 13: Eliminate effects between unrelated things

I know orthogonality as *modularity* or *decoupling*. A great example of modularity is the way unix command line was designed with lots of modular tools that you can chain together using `|` pipes.

> There are two main benefits of orthogonality increased productivity and reduced risk.

### 🎯 Tracer Bullets
Better known these days as 'agile development', 'MVP' and 'iteration'. *Tracer Bullets* are discussed over several pages. Most people could probably skip this as the doctrine of Agile has mostly replaced Waterfall.


### 🤔 Estimates
>Tip 18:  Estimate to avoid surprises

*Involve your users* and ask if they need high accuracy or a ballpark figure for the estimate. First understand the problem space, this will involve working with your user to understand not just what they are asking, but what their *actual problem* is. Then whiteboard what the system is you will build to solve it. If this is large enough a system, then estimate how long each component could take to build. Keep track of this estimate so you can track the accuracy of your estimates. As you go through each project iteration (sprint) update the estimate based on any change in delivery schedule that may now be apparent.

A fun fact from a footnote:
>What is the value of π? "3"... if you are a legislator. In 1987, Indiana State Legistlature House Bill No. 246 attempted to decree that henceforth π should have the value of "3".

Lastly, when asked for an estimate *you say, "I'll get back to you"*.

### 🐛 Debugging
This is a good chapter and great if you're new to tech. *The first rule of debugging*:
>Tip 25: Don't Panic

I've done this, and seen others do it. But it really is counterproductive. Take a deep breathe 🧘‍♀️, and approach it with the Zen of a master. This will help avoid the myopia of jumping on fixes for the symptoms that you immediately see rather than taking a step back to assess the bigger picture here. This is something I usually call, *developing hypotheses* of the root causes or, what are the possible *solution paths* we could go down - it's best to get a range of options before jumping down one that could prove fruitless. Instead, rank the hypotheses in order of most likely, then proceed with the highest ranked hypothesis.

#### Various debugging tips
- *Reproduce the bug* on your machine or a dev environment.
- Visualise your data. Log it to a console, use code breaks.
- 🐥 [Rubber Duck](https://en.wikipedia.org/wiki/Rubber_duck_debugging) with someone else - if they have the time, doing this at the outset can help develop more hypotheses as to what is causing the problem and get a better assessment on which is most likely.
- If there's not an obvious place to start, apply the principle of binary search.
- *Tip 27: Don't assume it, prove it*, this can help avoid putting fixes in place that aren't really fixes. This can happen because your dev environment is different to prod. Or you accidentally were on the wrong branch of code.


### 📃 Design by Contract
The book talks about Java Object Oriented examples. However the principle applies to all code. Does your code return the expected data with the expected types? Does the logic do what it promises to do? Include assertions, tests and document assumptions. An example of the principle applied to a data pipeline where each model is some Spark or SQL code `A -> B -> C`. The final select of model `A` uses `SELECT *` or `SELECT *EXCEPT(x,y,z)` this is not enforcing model `A`'s side of the contract. When model `B` consumes from model `A`, if similar shorthand `SELECT *` is applied, you can end up with a minor code fix that introduces a new column, changing the schema of tables flowing right through this simple pipeline all the way to model `C`. This can be easily avoided by explicitly naming the columns to be returned such that downstream models won't accidentally have their schemas changed by an upstream model. Even better, enforce the contract when you select columns from an upstream data model.

>Tip 33: If it can't happen, use assertions[or tests] to ensure that it won't

>Tip 36: Minimise coupling between modules

### 🎛 Design for Concurrency
The book uses the example of making a cocktail and all the tasks that are required from 'open blender' to 'get pink umbrellas'. If you analyse all of these tasks, some are dependent on others to complete. But many area able to happen in parallel to another task. Diagrams can help design for concurrency.

![](/content/images/2020/design-for-concurrency.svg)

### 🧹 Refactoring
Code needs to evolve. It is not static. And unfortunately many people perceive software as *done* once it is delivered. Software is more like gardening - you might start a gardening project with a plan, plant seedlings according to the plan, but later some plants didn't like the soil others have overgrown. You monitor and regularly tend to the garden to keep it at its best.

#### When to refactor?
These are common qualifiers:
- Duplication
- Highly coupled components
- Outdated knowledge i.e. does the code still reflect the real world problem
- Performance

>Tip 47: Refactor Early, Refactor Often

If time pressure is used as an excuse from management, explain technical debt is like a cancer that grows and is riskier and more time consuming to remove the longer you leave it.

#### How to refactor?
- Don't try to refactor and add functionality. Leave TODOs if you must.
- Make sure you have good tests before starting to refactor, otherwise you may not know when you have broken something.
- Take short deliberate changes and test them. Rather than large sweeping changes all at once.

### 📚 Requirements
To understand what the user needs:
>Tip 52: Work with a user to think like a user

If you have the problem of too many requirements, then point out how much each suggested requirement is going to increase project delivery by.

### 🧪 Testing
>Test Early. Test Often. Test Automatically.

- **Unit Tests** - is code that exercise a particular piece of code in isolation.
- **Integration Tests** - shows that the major subsystems that make up the project work and play well with each other.
- **User Testing** - does it meet the users expectations?
- **Performance Testing / Stress Testing** - does it scale? Is it going to crash as soon as 100 users are using it at the same time?
- **Usability Testing** - This is about UX. It might pass *user testing* but does it feel like the extension of the users hand? Does it feel more like an Apple product or another product that technically does the same but just feels awkward.



## Notes
- I'd recommend the entirety of chapter 6 *While you are coding* - particularly the 'How to program deliberately section'
- One of the simplest explainations of O notation is in this book.
- There's a great section in Chp 8 Pragmatic Projects on team organisation advocating for teams to be organised around functionality which also reflects the decoupled principle.
