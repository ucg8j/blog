---
title: Shiny (R) Web App Performance - Profiling
slug: shiny-r-performance-profiling
date_published: 2017-08-06T11:27:18.000Z
date_updated: 2019-08-04T12:13:13.000Z
tags: r, make-it-fast, shiny
layout: post.njk
---

Introduced at the 2016 R conference, the `profvis` package offers a visual way of inspecting the call stack and highlights the most memory and computationally intensive parts of your code.

## Run Profvis

    # Load library
    library(profvis)
    
    # Run profiler on shiny app with optional arg to save output
    profvis({ runApp('Projects/path_of_app') }
            , prof_output = '/path_to_save_output')
    

At this point your app will launch, to get the shiny app code to execute, interact with the parts of the application that you are interested in. Once you have completed the interactions, close the page and press the 'stop' button at the top of the console in RStudio. Profvis will recognise you have stopped running the shiny app, display the profvis interface and *optionally* save the file. The file name is randomly generated and should look something like this `file108f93bff877b.Rprof`.

> Each block in the flame graph represents a call to a function, or possibly multiple calls to the same function. The width of the block is proportional to the amount of time spent in that function. When a function calls another function, another block is added on top of it in the flame graph.

Source: [Profvis Overview](https://rstudio.github.io/profvis/)

To reload the saved profvis profile:

    # Load saved profvis
    profvis(prof_input = '/path_to_save_output/file108f93bff877b.Rprof')
    

## Reload a Saved Profvis

You can also save as a webpage using the following code:

    # Assign to variable
    p <- profvis(prof_input = '/path_to_save_output/file108f93bff877b.Rprof')
    
    # Save as a webpage
    htmlwidgets::saveWidget(p, "/path_to_save_output/profile.html")
    

If you've found this content helpful why not...
.bmc-button img{width: 27px !important;margin-bottom: 1px !important;box-shadow: none !important;border: none !important;vertical-align: middle !important;}.bmc-button{line-height: 36px !important;height:37px !important;text-decoration: none !important;display:inline-flex !important;color:#000000 !important;background-color:#FFDD00 !important;border-radius: 3px !important;border: 1px solid transparent !important;padding: 1px 9px !important;font-size: 22px !important;letter-spacing: 0.6px !important;box-shadow: 0px 1px 2px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5) !important;margin: 0 auto !important;font-family:'Cookie', cursive !important;-webkit-box-sizing: border-box !important;box-sizing: border-box !important;-o-transition: 0.3s all linear !important;-webkit-transition: 0.3s all linear !important;-moz-transition: 0.3s all linear !important;-ms-transition: 0.3s all linear !important;transition: 0.3s all linear !important;}.bmc-button:hover, .bmc-button:active, .bmc-button:focus {-webkit-box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5) !important;text-decoration: none !important;box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5) !important;opacity: 0.85 !important;color:#000000 !important;}[buy me a coffee](https://www.buymeacoffee.com/6uRXFwMJD)
## Resources

- 
[Video of Winstan Chang presenting ProfViz](https://www.rstudio.com/resources/videos/profiling-and-performance/)

- 
[Profiling code integrated into RStudio IDE, great for non-shiny code](https://blog.rstudio.com/2016/05/23/profiling-with-rstudio-and-profvis/)
