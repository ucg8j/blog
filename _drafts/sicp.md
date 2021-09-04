# CS 61A: Structure and Interpretation of Computer Programs
# Raw Notes

- Write a `program.py` and execute with `-i` to jump into an interactie session with the program.
`python3 -i program.py`.

- doctests are an easy way to express what a function does whilst also being tests in themselves.
```py
def add_two(x):
	'''Fn adds two to x

	>>> add_two(2)
	4
	>>> add_two(8)
	10
	'''
	return x + 2
```
This can then be run with, `python -m doctest -v test.py` where -v is for verbose output.


**Higher order functions** are functions that take another function as an argument. A callback function is a function that is passed to another function with the expectation that the other function will call it. I.e. Higher order functions take callbacks.


**Currying**
We can use higher-order functions to convert a function that takes multiple arguments into a chain of functions that each take a single argument. More specifically, given a function f(x, y), we can define a function g such that g(x)(y) is equivalent to f(x, y). Here, g is a higher-order function that takes in a single argument x and returns another function that takes in a single argument y. This transformation is called currying.

Some programming languages, such as Haskell, only allow functions that take a single argument, so the programmer must curry all multi-argument procedures. In more general languages such as Python, currying is useful when we require a function that takes in only a single argument. For example, the map pattern applies a single-argument function to a sequence of values. In later chapters, we will see more general examples of the map pattern, but for now, we can implement the pattern in a function:

We can define functions to automate currying, as well as the inverse uncurrying transformation:
```py
def curry2(f):
	"""Return a curried version of the given two-argument function."""
	def g(x):
			def h(y):
					return f(x, y)
			return h
	return g

def uncurry2(g):
	"""Return a two-argument version of the given curried function."""
	def f(x, y):
			return g(x)(y)
	return f
```


**lambda - a historical accident**
>It may seem perverse to use lambda to introduce a procedure/function. The notation goes back to Alonzo Church, who in the 1930's started with a "hat" symbol; he wrote the square function as "ŷ . y × y". But frustrated typographers moved the hat to the left of the parameter and changed it to a capital lambda: "Λy . y × y"; from there the capital lambda was changed to lowercase, and now we see "λy . y × y" in math books and (lambda (y) (* y y)) in Lisp.

—Peter Norvig (norvig.com/lispy2.html)

**Abstractions and First Class Functions**
*Great advice...*
"As programmers, we should be alert to opportunities to identify the underlying abstractions in our programs, build upon them, and generalize them to create more powerful abstractions. This is not to say that one should always write programs in the most abstract way possible; expert programmers know how to choose the level of abstraction appropriate to their task. But it is important to be able to think in terms of these abstractions, so that we can be ready to apply them in new contexts. The significance of higher-order functions is that they enable us to represent these abstractions explicitly as elements in our programming language, so that they can be handled just like other computational elements.

In general, programming languages impose restrictions on the ways in which computational elements can be manipulated. Elements with the fewest restrictions are said to have first-class status. Some of the "rights and privileges" of first-class elements are:

    They may be bound to names.
    They may be passed as arguments to functions.
    They may be returned as the results of functions.
    They may be included in data structures.

Python awards functions full first-class status, and the resulting gain in expressive power is enormous."

**Decorators**
"Python provides special syntax to apply higher-order functions as part of executing a def statement, called a decorator. Perhaps the most common example is a trace.

>>> def trace(fn):
        def wrapped(x):
            print('-> ', fn, '(', x, ')')
            return fn(x)
        return wrapped

>>> @trace
    def triple(x):
        return 3 * x

>>> triple(12)
->  <function triple at 0x102a39848> ( 12 )
36

In this example, A higher-order function trace is defined, which returns a function that precedes a call to its argument with a print statement that outputs the argument. The def statement for triple has an annotation, @trace, which affects the execution rule for def. As usual, the function triple is created. However, the name triple is not bound to this function. Instead, the name triple is bound to the returned function value of calling trace on the newly defined triple function. In code, this decorator is equivalent to:

>>> def triple(x):
        return 3 * x

>>> triple = trace(triple)
"



# References
https://composingprograms.com/
https://cs61a.org/
