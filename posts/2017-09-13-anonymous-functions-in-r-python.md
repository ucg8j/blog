---
title: Anonymous Functions in R and Python
slug: anonymous-functions-in-r-python
date_published: 2017-09-13T20:30:00.000Z
date_updated: 2020-01-10T08:27:06.000Z
tags: python, r
---

> What's in a name? That which we call a rose by any other name would smell as sweet.

## Normal functions

Before moving to anonymous functions, let's start with what normal functions look like.

#### In R

    # Define a function
    functionName <- function(variables) {
        # Function definition... do some stuff
        print(paste(variables, "doing stuff"))
    }
    
    # Call the function
    > functionName("boring strings")
    [1] "boring strings doing stuff"
    

#### In Python

    # Define function
    def functionName(variables):
        # Do some stuff
        print variables, "doing stuff"
    
    # Call the function
    >>> functionName("boring strings")
    boring strings doing stuff
    

## Anonymous Functions

Have no identity, no name, but still do stuff! They will not live in the global environment. Like a person without a name, you would not be able to look the person up in the address book.

The anonymous function can be called like a normal function `functionName()`, except the functionName is switched for logic contained within parentheses `(fn logic goes here)()`.

#### In R

    # Doing the same stuff anonymously
    > (function(variables) print(paste(variables, "doing stuff")) )("code")
    [1] "code doing stuff"
    

#### In Python

Python introduces the `lambda` keyword for anonymous functions, in contrast to R which sticks with the `function` keyword.

    # Doing the same stuff anonymously
    >>> (lambda variable: variable + " doing stuff")("code")
    'code doing stuff'
    

### R Convention

The most common convention is to use anonymous functions when using the `*apply` family of functions. For example, you might want to do an operation across a set of columns in a dataset.

    # Create a dataset
    df <- data.frame(
      col1 = c("element1", "element2"),
      col2 = c("element1", "element2"), 
      stringsAsFactors = FALSE
    )
    
    # lapply an anonymous function to the columns of the dataset
    > lapply(df, function(x) paste(x, "doing stuff"))
    $col1
    [1] "element1 doing stuff" "element2 doing stuff"
    
    $col2
    [1] "element1 doing stuff" "element2 doing stuff"
    

### Python Convention

Doing the exact operation as above in python:

    import pandas as pd
    
    # Create DataFrame
    df = pd.DataFrame(
        [["element1", "element1"], ["element2", "element2"]],
        columns=['col1', 'col2']
    )
    
    >>> df.apply(lambda x: x + " doing stuff", axis=0)
                       col1                  col2
    0  element1 doing stuff  element1 doing stuff
    1  element2 doing stuff  element2 doing stuff
    

You will generally see lambdas used with higher order functions like `map()`, `reduce()` and `filter()`. E.g.

    # Map a anonymous function against all elements of df['col1']
    >>> map(lambda x: x + " doing stuff", df['col1'])
    ['element1 doing stuff', 'element2 doing stuff']
    

You may also see a lambda used to define a function. e.g.

    functionName = lambda x: x + " doing stuff"
    

This is poor practice when a standard function definition would have been sufficient. The Python community has a bit of a split over the use of anonymous functions (lambdas) vs. [list comprehensions](https://www.digitalocean.com/community/tutorials/understanding-list-comprehensions-in-python-3). The [benevolent dictator](https://en.wikipedia.org/wiki/Benevolent_dictator_for_life) of the Python community [Guido van Rossum](https://en.wikipedia.org/wiki/Guido_van_Rossum) has [argued for lambda's complete removal from python 3](https://www.artima.com/weblogs/viewpost.jsp?thread=98196).

## In Conclusion

Anonymous functions can make your code base harder to read. It can also make debugging harder. However, they can save you time from having to define yet another function in your code base. When should you use anonymous functions? According to [Hadley](http://hadley.nz/)*"when it’s not worth the effort to give it a name"*. A good example is when you won't use the function anywhere else in your code. Or when you want to `apply()` a couple of pre-defined functions in one call e.g. `lapply(df, function(x) secondFunction(firstFunction(x)))`.

## Resources

- 
[Anonymous functions in Python](http://www.curiousefficiency.org/posts/bloggercom1999blog-9320223post-110439602874040740.html)

- 
[Hadley on Anonymous Functions](http://adv-r.had.co.nz/Functional-programming.html#anonymous-functions)

- 
[Lambda Functions in Python: What Are They Good For?](https://dbader.org/blog/python-lambda-functions)
