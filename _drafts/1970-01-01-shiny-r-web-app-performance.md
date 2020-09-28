---
title: Shiny (R) Web App Performance
slug: shiny-r-web-app-performance
date_published: 1970-01-01T00:00:00.000Z
date_updated: 2017-08-06T10:22:48.000Z
draft: true
---

## Background

> a single R process can usually serve 5 to 30 requests/second.

[https://shiny.rstudio.com/articles/scaling-and-tuning.html](https://shiny.rstudio.com/articles/scaling-and-tuning.html)

[good diagrams/overview of what is shared/excuted per process/connection](https://support.rstudio.com/hc/en-us/articles/220546267-Scaling-and-Performance-Tuning-Applications-in-Shiny-Server-Pro)

## Load Testing

> Tests must be recorded against a local copy of the deployed application.

    library(shinyloadtest)  
    loadTest(testFile = 'myloadTest.R',
             url = 'https://beta.rstudioconnect.com/content/2551',
             numConcurrent = 8,
             numTotal = 16,
             loadTimeout = 5,
             stagger = 4, 
             phantomTimeout = 20)
    

[https://github.com/rstudio/shinyloadtest](https://github.com/rstudio/shinyloadtest)

[RMD report of load test](https://github.com/rstudio/shinyloadtest/blob/master/inst/loadTestReport/load_test_template.Rmd)
[Output report of load test](https://beta.rstudioconnect.com/content/2612/addinTest.html)
