---
title: How to Stop R Projects and Scripts Breaking
permalink: "/using-package-management-in-r/"
excerpt: "A how-to in getting started with Package Management in R"
slug: using-package-management-in-r
date: 2016-11-07
tags: r, packrat, package-management
layout: layouts/post.njk
---

_A how-to in getting started with Package Management in R_

**The problem:** Let's say you coded a project in `R` in 2014 using the package [`dplyr`](http://dplyr.tidyverse.org/) and you called the project `2014project`. Over time packages get updated, sometimes changing syntax and function names, let's say some major syntax changes occurred in 2015 to `dplyr` and you used the latest version of [`dplyr`](http://dplyr.tidyverse.org/) in other projects in 2015. Now you come to 2016 and you want to re-run the code in the `2014project`, but you find a bunch of errors because in 2015 dplyr had those syntax changes, such that the syntax you used in 2014 no longer computes. Now for the **solution**...

R scripts breaking over time is annoying for anyone, but it's worth highlighting that organisations using proper package management will significantly decrease their costs in the form of maintenance time spent by developers, data scientists and data analysts fixing projects broken due to changes in package dependencies. In contrast to the Python community who seem very familiar with their [`virtualenv` package management](https://virtualenv.pypa.io/en/stable/), the R community doesn't seem to have widely adopted the practice. In the data science world, I attribute this difference between the R and Python communities to Python coming out of the computer science discipline and R coming from the statistics discipline. If you are an organisation heavily using R, you have a lot of productivity to gain from the adoption of package management by your R developers.

## Packrat

```r
> readLines(system.file("DESCRIPTION", package = "packrat"))[c(3,9,10)]
[1] "Title: A Dependency Management System for Projects and their R Package"
[2] "Description: Manage the R packages your project depends on in an"
[3] "isolated, portable, and reproducible way."  
```

## Getting Started

To get the RStudio niceties/integrations it seems neccessary to treat your project folder as an R Project. I've created a new project `/testpackrat2` and with the latest RStudio you should be able to select both `git` and `packrat` to be initialised. This runs the `packrat::init()` function to enter packrat mode, takes a snapshot of the package dependencies (of which there are currently none) and places the binaries in the project folder under `testpackrat2/packrat/src/`; finally `init()` runs `restore()` to apply the latest snapshot to the project folder. `R` will restart once this process is finished.

![New Packrat Project RStudio](/content/images/2016/11/Screen-Shot-2016-11-08-at-09-19-09.png)  
To double check packrat has been initialised properly run:

```r
# Check I am in the right directory
> getwd()
[1] "/Users/lukesingham/Projects/testpackrat2"

# See if packrat is working
> packrat::status()
Up to date.
```

You should also notice the RStudio integration in the packages area, where it will show your project version against that which Packrat has the binary for and the source of that binary:

![packages window RStudio ](/content/images/2016/11/Screen-Shot-2016-11-07-at-10-03-25.png)

For test purposes I created `script.R` with only one package.

```r
# Create script
> system("echo 'library(stringr)' >| script.R")

# Confirm project contents
> system("ls")
packrat
script.R
testpackrat.Rproj
```

If I open `script.R` in RStudio and try and load the library this is the expected behaviour:

```r
> library(stringr)
Error in library(stringr) : there is no package called ‘stringr’
```

I have `stringr` installed on my system, but now I am in an isolated packrat project which is only reading from the project folders list of packages. Now to run the packrat commands to `snapshot()` the addition of `stringr` to the project and install it ready for use in the project.

```r
> packrat::status()

The following packages are referenced in your code, but are not present
in your library nor in packrat:

    stringr

You will need to install these packages manually, then use
packrat::snapshot() to record these packages in packrat.

# Well I do have stringr in my library, anyway...
# now to take a snapshot
> packrat::snapshot()

Adding these packages to packrat:
             _
    magrittr   1.5  
    stringi    1.1.2
    stringr    1.1.0

Fetching sources for magrittr (1.5) ... OK (CRAN current)
Fetching sources for stringi (1.1.2) ... OK (CRAN current)
Fetching sources for stringr (1.1.0) ... OK (CRAN current)
Snapshot written to '/Users/lukesingham/Projects/testpackrat2/packrat/packrat.lock'

# Now to install/'restore' those sources to the snapshot just taken
> packrat::restore()
Installing magrittr (1.5) ...
 OK (built source)
Installing stringi (1.1.2) ...
 OK (built source)
Installing stringr (1.1.0) ...
 OK (built source)
```

It's probably worth pointing out what packrat is doing to your library path, particularly when you go to install new packages in your project.

```r
# Turn packrat off
> packrat::packrat_mode()
Packrat mode off. Resetting library paths to:
- "/usr/local/lib/R/3.2/site-library"
- "/usr/local/Cellar/r/3.2.3/R.framework/Versions/3.2/Resources/library"

# Turn packrat back on
> packrat::packrat_mode()
Packrat mode on. Using library in directory:
- "~/Projects/testpackrat2/packrat/lib"
```

So as long as you are in `packrat_mode`, when you run `install.packages()` or remove `remove.packages()` it will only be modifying the project `testpackrat2/` folder.

## Existing Project with Out-Of-Date Packages

I want to test the scenario where I have existing projects using old versions of packages. To do this I ran:

```r
# Find old packages
old.packages()
>             Installed     Built   ReposVer
lubridate     "1.5.6"       "3.2.3" "1.6.0"
htmlwidgets   "0.6"         "3.2.3" "0.7"
```

I then created a folder with these packages, to simulate an old project that I want `packrat` to manage.

```bash
mkdir testpackratOutofDatePackages
echo "library(lubridate); library(htmlwidgets)" >| testpackratOutofDatePackages/oldScript.R
```

Now go to RStudio and open the existing project `testpackratOutofDatePackages`. Click on `File > New Project > Existing Directory`

![New project Rstudio](/content/images/2016/11/Screen-Shot-2016-11-07-at-19-58-24.png)

Unfortunately there is not an option to `init` packrat as part the process. So...

```r
> packrat::init()
Initializing packrat project in directory:
- "~/Projects/testpackratOutofDatePackages"
... (edited down the consolte printout)
Fetching sources for htmlwidgets (0.6) ... OK (CRAN archived)
Fetching sources for lubridate (1.5.6) ... OK (CRAN archived)
```

Ok great, it fetches the old binaries. Now let's test upgrading these packages and then reverting back to the initial project state.

```r
> install.packages("htmlwidgets") # v0.7
Installing package into ‘/Users/lukesingham/Projects/testpackratOutofDatePackages/packrat/lib/x86_64-apple-darwin15.2.0/3.2.3’ ...
* DONE (htmlwidgets)
```

So it seems packrat auto snapshots the project, such that I couldn't run `restore()` and return to htmlwidgets v0.6. Let's try that again without autosnapshot and with my out-of-date `lubridate`:

```r
# Turn off auto.snapshot
> packrat::set_opts(auto.snapshot=FALSE)

# Check status
> packrat::status()
Up to date.

# Now try updating lubridate
> install.packages("lubridate")
DONE

> packrat::status()

The following packages are out of sync between packrat and your current library:
                packrat   library
    lubridate     1.5.6     1.6.0

Use packrat::snapshot() to set packrat to use the current library, or use
packrat::restore() to reset the library to the last snapshot.

# Return to old version of lubridate
> packrat::restore(overwrite.dirty=T)

Downgrading these packages in your library:
                 from      to
    lubridate   1.6.0   1.5.6

Do you want to continue? [Y/n]: Y
Replacing lubridate (downgrade 1.6.0 to 1.5.6) ...  OK (built source)
```

## Conclusion

By default packrat `auto.snapshot` my project when I updated a package. Crucially, this meant I could not use `packrat::restore()` because I was `already up to date`. Of course, if I had been using `git` and making commits before and after, then there wouldn't have been a problem. However, without `git`, running `packrat::restore()` to downgrade a package requires the `overwrite.dirty=TRUE` option and only seems possible if you switched off `auto.snapshot`. I'd highly recommend turning it off anyway, as the manual update will allow for a better understanding and control over packrat.

## Other Resources

* [RStudio Video presentation of Packrat](https://www.rstudio.com/resources/webinars/managing-package-dependencies-in-r-with-packrat/)
* [Packrat Package Documentation](https://cran.r-project.org/web/packages/packrat/packrat.pdf)
* [Packrat website](https://rstudio.github.io/packrat/)
* [An alternative to packrat, Microsoft's MRAN and Enhanced R](https://mran.microsoft.com/rro/#repos)
* [Packrat discussion board](https://groups.google.com/forum/#!forum/packrat-discuss)
