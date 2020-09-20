---
title: A Review of Coursera's Data Science Specialisation
slug: data-science-specialisation-coursera-a-short-review
date_published: 1970-01-01T00:00:00.000Z
date_updated: 2016-07-17T03:20:52.000Z
draft: true
---

After using `R` for a couple of years, I decided it was time to learn in a more systematic way and hopefully take my skills to the next level. As thinking *'Coding, where the hell do I start?'* is not too distant a memory for me, I will keep the begginer in mind.

A question I'll answer at the start, *"Is it worth paying for the specialisation?"* Yes! The course material is free and you can (as I have previously) view the videos and lectures (you can even use [coursera-dl](https://github.com/coursera-dl/coursera-dl) to automatically download all the material). All the benefits without the costs! Well, I am human and my approach has

### 1. The Data Scientist’s Toolbox

If you have used `git` or another version control system (e.g. `bzr`) before this course can literally be completed within an hour - perhaps explaining why it is the cheapest course of the specialisation. For beginners however, version control can be a hard and abstract concept to get your head around, this course does a good job of teaching the fundamentals and making the user familiar with the basics of creating a repository of code and `commit`/`push` process. These fundamentals will be used when submitting your assignments for the rest of this specialisation.

Two extra resources I found incredibly useful: Firstly, this diagram of common git commands and workflow:

{<1>}![](http://assets.osteele.com/images/2008/git-transport.png)

And secondly, this XKCD accurate portrayal of git. I experienced a git error, spent way too long trying to solve it when really the best thing to do is save elsewhere -> delete local repo -> re-clone remote repo.

{<2>}![](http://imgs.xkcd.com/comics/git.png)

### 2. R Programming

The difficulty level increases for this course. Even though I have been using R for some time now, this course pushed my understanding of R as a brilliant data analysis language to treating it more like a *programming* language. If you aren't familiar with programming this course will catapault you through common programming concepts like data structures, boolean logic and control structures. Perhaps the most challenging and abstract concept covered is lexical scoping. Googling "How to do what you're trying to do*** in r?"

### 3. Getting and Cleaning data

### 4. Exploratory Data Analysis

### 5. Reproducible Research

### 6. Statistical Inference

Brian Caffo enters the fold and, unfortunately I have to go quite hard on him. He is incredibly monotone, clearly is reading straight from lecture slides with little in the way of value add and generally falls into the 'how statistics is generally taught badly' category.

### 7. Regression Models

Brian Caffo again! Ok, so his performance picks up in this course where he frequently switches from a slightly more lively delivery of slides c.f. the Statistical Inference course to practical code models. Mathmatical proofs/technical details are included for those inclined and clearly identified as optional.

Something I've picked up particularly in this course, is Brian Caffo's code style, it's poor. He frequently uses `=` rather than `<-` as the assignment operator and includes what should be mulitple lines of code on the one line. I have three sources I'd recommend for R code style. First, [Google's R style](https://google.github.io/styleguide/Rguide.xml) which is very comprehensive. Second, the wise sage of `R`, Hadley Wickham, has [a 'few tweaks'  on Google's guide](http://adv-r.had.co.nz/Style.html). The third, is Data Scientist [Graham William's guide to style](http://handsondatascience.com/StyleO.pdf) which is less prescriptive and offers 'contentious' alternatives that logically aren't *bad* they just aren't the most used in the R community.

### 8. Practical Machine Learning

This course does a great job at introducing machine learning and keeps the delivery focused on the practice which I think if anyone is put off complexity assumed in the term 'machine learning' this is the course to take. Jeff Leek is the lecturer and his delivery is consistently engaging throughout the course. As the name suggests, the course is focused on the practice of machine learning. The lectures take you through worked examples and explain the reasons behind the methods used in machine learning. There are some mathmatical explanations of the methods but if you have sat through Brian Caffo's Statistical Inference, this course will seem like a breeze. There are no `swirl()` courses for machine learning which I think would be a helpful addition. Otherwise, this course is a great introduction into machine learning and should make anyone dangerous when it comes to supervised learning!

### 9. Data Products

Back to Brian Caffo for this course, though he makes use of [goanimate](https://goanimate.com/) videos which are perhaps a little less stilted. Week 1 starts off by introducing Shiny along with [`rCharts`](http://rcharts.io/) and [`googlVis`](https://cran.r-project.org/web/packages/googleVis/vignettes/googleVis_examples.html). I have used shiny a lot and as a consequence have a few criticisms of the first week. The former, despite having being around for at least a couple of years never made it on to [CRAN](https://cran.r-project.org/). Ramnath the talented author behind rCharts seems to have shifted his efforts towards htmlwidgets. In fact, a quick look at the [github stats for rChart](https://github.com/ramnathv/rCharts/graphs/contributors) reveals there hasn't been active development on rCharts for at least two years. The plotly lecture is also out of date, with reference to content that does't exist anymore and advice to install the package from github rather than CRAN.
