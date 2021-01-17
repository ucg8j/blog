---
title: Shiny (R) Web App Performance - Profiling
slug: shiny-r-performance-profiling
permalink: "/shiny-r-performance-profiling/"
date: 2017-08-06
tags: r, make-it-fast, shiny
layout: layouts/post.njk
excerpt: "Introduced at the 2016 R conference, the profvis package offers a visual way of inspecting the call stack and highlights the most memory…"
---

Introduced at the 2016 R conference, the `profvis` package offers a visual way of inspecting the call stack and highlights the most memory and computationally intensive parts of your code.

## Run Profvis
```r
# Load library
library(profvis)

# Run profiler on shiny app with optional arg to save output
profvis({ runApp('Projects/path_of_app') }
        , prof_output = '/path_to_save_output')
```

At this point your app will launch, to get the shiny app code to execute, interact with the parts of the application that you are interested in. Once you have completed the interactions, close the page and press the 'stop' button at the top of the console in RStudio. Profvis will recognise you have stopped running the shiny app, display the profvis interface and _optionally_ save the file. The file name is randomly generated and should look something like this `file108f93bff877b.Rprof`.

> Each block in the flame graph represents a call to a function, or possibly multiple calls to the same function. The width of the block is proportional to the amount of time spent in that function. When a function calls another function, another block is added on top of it in the flame graph.

Source: [Profvis Overview](https://rstudio.github.io/profvis/)

To reload the saved profvis profile:

```r
# Load saved profvis
profvis(prof_input = '/path_to_save_output/file108f93bff877b.Rprof')
```

## Reload a Saved Profvis
You can also save as a webpage using the following code:

```r
# Assign to variable
p <- profvis(prof_input = '/path_to_save_output/file108f93bff877b.Rprof')

# Save as a webpage
htmlwidgets::saveWidget(p, "/path_to_save_output/profile.html")
```

## Resources
* [Video of Winstan Chang presenting ProfViz](https://www.rstudio.com/resources/videos/profiling-and-performance/)

* [Profiling code integrated into RStudio IDE, great for non-shiny code](https://blog.rstudio.com/2016/05/23/profiling-with-rstudio-and-profvis/)
