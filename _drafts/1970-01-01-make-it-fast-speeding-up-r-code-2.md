---
title: Make it Fast - Speeding up R Code
slug: make-it-fast-speeding-up-r-code-2
date_published: 1970-01-01T00:00:00.000Z
date_updated: 2017-08-09T14:52:50.000Z
draft: true
---

> ... a lot of R code is slow simply because it’s poorly written. Few R users have any formal training in programming or software development.

In a previous post I covered [Microbenchmarking](/benchmarking-the-performance-of-r-code/) this provides the tool to measure how much we have sped up our code.

> the trade-offs that are key to language design: ... speed, flexibility, and ease of implementation.

> dynamism is that you need minimal upfront planning. You can change your mind at any time, iterating your way to a solution without having to start afresh. The disadvantage of dynamism is that it’s difficult to predict exactly what will happen with a given function call.

> ..[R] contains nearly 800,000 lines of code (about 45% C, 19% R, and 17% Fortran). Changes to base R can only be made by members of the R Core Team (or R-core for short).

## Parallel

[https://stackoverflow.com/questions/38318139/run-a-for-loop-in-parallel-in-r](https://stackoverflow.com/questions/38318139/run-a-for-loop-in-parallel-in-r)

[http://bgc.yale.edu/sites/default/files/ParallelR.html#Parallel_foreach___loop](http://bgc.yale.edu/sites/default/files/ParallelR.html#Parallel_foreach___loop)

## Resources

- 
[Hadley Wickham's book on advanced R](http://adv-r.had.co.nz/Performance.html)

- 
[Inferno R](http://www.burns-stat.com/pages/Tutor/R_inferno.pdf)
