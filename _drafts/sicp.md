# CS 61A: Structure and Interpretation of Computer Programs Notes

- Use `-i` to jump into an interactive session with the program.
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

## Higher order functions
Are functions that take another function as an argument. A callback function is a function that is passed to another function with the expectation that the other function will call it. I.e. Higher order functions take callbacks.

## Currying
We can use higher-order functions to convert a function that takes multiple arguments into a chain of functions that each take a single argument. More specifically, given a function f(x, y), we can define a function g such that g(x)(y) is equivalent to f(x, y). Here, g is a higher-order function that takes in a single argument x and returns another function that takes in a single argument y. This transformation is called currying.

Some programming languages, such as Haskell, only allow functions that take a single argument, so the programmer must curry all multi-argument procedures. In more general languages such as Python, currying is useful when we require a function that takes in only a single argument. For example, the map pattern applies a single-argument function to a sequence of values. In later chapters, we will see more general examples of the map pattern, but for now, we can implement the pattern in a function:

Currying is named after [Haskell Curry](https://en.wikipedia.org/wiki/Haskell_Curry) as well as the languages [Haskell](https://en.wikipedia.org/wiki/Haskell_(programming_language)), Brooks and Curry.

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
Comment: I don't think currying is used much in Python codebases. `f(1,2,3,4,5)`
seems much nicer than `f(1)(2)(3)(4)(5)`.


## `lambda` - a historical accident
>It may seem perverse to use lambda to introduce a procedure/function. The notation goes back to Alonzo Church, who in the 1930's started with a "hat" symbol; he wrote the square function as "ŷ . y × y". But frustrated typographers moved the hat to the left of the parameter and changed it to a capital lambda: "Λy . y × y"; from there the capital lambda was changed to lowercase, and now we see "λy . y × y" in math books and (lambda (y) (* y y)) in Lisp.

—Peter Norvig (norvig.com/lispy2.html)

     lambda            x            :          f(g(x))
"A function that    takes x    and returns     f(g(x))"


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

## Control statements: if/else
Python doesn't and can't have a function `ifelse(condition, if_true, if_false)`, some languages can e.g [R's `ifelse()`](https://www.rdocumentation.org/packages/base/versions/3.6.2/topics/ifelse). The reason is Python's evaluation rules for call expressions, given a call e.g. if we made an ifelse() call
1. It will evaluate the operators and the operand subexpressions
2. Then applies the function logic to the arguments that are the values of the operands.

In other words, the function evaluates the function arguments prior to running running the arguments through the function. This is illustrated below with the square root of a negative number.
```python
>>> from math import sqrt
>>> sqrt(-4)
ValueError: math domain error
```
If we wanted to create a function that returns zero instead of an error it would be:
```python
def real_sqrt(x):
	'''The real part of the square root of X.'''
	if x > 0:
		return sqrt(x)
	else:
		return 0.0
```
Running the function above will return
```python
>>> real_sqrt(-4)
0.0
```
However if we created the `ifelse` function in Python and replaced the control statement in `real_sqrt`, the behaviour will return the ValueError rather than behave the same, because the `if_true` argument gets evaluated.
```python
def ifelse(condition, if_true, if_false):
    if condition:
        return if_true
    else:
        return if_false

def real_sqrt(x):
    '''The real part of the square root of X.'''
    return ifelse(x > 0, sqrt(x), 0.0)
```
```python
>>> real_sqrt(-4)
ValueError: math domain error
```

# Closures
Locally defined functions are often called closures. E.g.
```python
def make_adder_subtractor(x):
	'''I return an adder closure'''
	def adder(y):
		return x + y
	def subtracter(y):
		return y - x
	return adder, subtracter

>>> my_adder, my_subtractor = make_adder_subtractor(5)
>>> my_adder(4)
9
>>> my_subtractor(3)
-2
```
In the above example, x=5 only within the scope of make_adder_subtractor, this is lexical scoping.

# Function - Self Reference
Functions can reference themselves.
```python
def print_all(x):
    print(x)
    return print_all

# print_all(1)(3)
# 1
# 3
# Out[2]: <function __main__.print_all(x)>
```
In the above example, `print_all` returns itself. Such that you could chain as many evaluations `print_all(x)(y)(z)` as you like, since each evaluation is returning the function, that then get's called on the next evaluation. Here's another example of self-reference:
```python
def print_sums(x):
    print(x)

    def next_sum(y):
        return print_sums(x+y)
    return next_sum

# In [4]: print_sums(5)(10)(6)
# 5
# 15
# 21
# Out[4]: <function __main__.print_sums.<locals>.next_sum(y)>
```
In this example, self-reference enables a 'memory' of the sums. `print_sums` is called on `(5)`, but `(10)` and `(6)` are evaluated with `next_sum`.

# Recursion
TODO: check if link works
See [Grokking Algorithms Summary for a basic intro to Recursion](./grokking-algorithms/#3.-recursion). Composing Programs has [a beautifully simple demonstration of simple recursion](composingprograms.com/pages/17-recursive-functions.html#printing-in-recursive-functions) using `print`.

## Mutual Recursion
>When a recursive procedure is divided among two functions that call each other, the functions are said to be mutually recursive

Luhn sum is an algorithm that performs a checksum on credit cards. It catches most tranposition errors and invalid credit card numbers. In this example, `luhn_sum` is a recursive function that calls `luhn_sum_double` which is also a recursive function that calls `luhn_sum`. See the [5min CS61A video](https://www.youtube.com/watch?v=IhY2cNaFktw) for a walk-through.

```python
def split(n):
    return n // 10, n % 10

def sum_digits(n):
    if n < 10:
        return n
    else:
        all_but_last, last = split(n)
        return sum_digits(all_but_last) + last

def luhn_sum(n):
    if n < 10:
        return n
    else:
        all_but_last, last = n // 10, n % 10
        return luhn_sum_double(all_but_last) + last

def luhn_sum_double(n):
    all_but_last, last = n // 10, n % 10
    luhn_digit = sum_digits(2 * last)
    if n < 10:
        return luhn_digit
    else:
        return luhn_sum(all_but_last) + luhn_digit
```
Mutually recursive functions can be refactored into a single recursive function. The same procedure is as a single recursive function or as a mutually recursive function doesn't matter computationally. However, written as mutual recursive functions may be a useful abstraction when a single recursive function is harder to read. [See chp 1.7.2 of Composing Programs](http://composingprograms.com/pages/17-recursive-functions.html#mutual-recursion) for a refactor of mutually recursive functions into a single recursive function.

## Tree Recursion
Tree Recursion is when a recursive function calls itself more than once.
```python
def fib(n):
  if n == 1:
      return 0
  if n == 2:
      return 1
  else:
      return fib(n-2) + fib(n-1)
```
In the above `fib` example, each time fib is called, it will call itself twice. This exponential relationship can mean a lot of computation at a sufficiently large n


# Data Abstraction
Data Abstraction increases modularity of a program. For example, latitude and longitude can be represented as floats, but we might want to treat *coodinates* as an abstraction, such that the rest of our software can work above the implementation of how lat and long are represented. Data abstraction uses *selectors* and *constructors* to define behavior.

Example with rational numbers:
```py
##################
# operations on the abstraction
##################
def add_rationals(x, y):
    nx, dx = numer(x), denom(x)
    ny, dy = numer(y), denom(y)
    return rational(nx * dy + ny * dx, dx * dy)


def mul_rationals(x, y):
    return rational(numer(x) * numer(y), denom(x) * denom(y))


def print_rational(x):
    print(numer(x), '/', denom(x))


def rationals_are_equal(x, y):
    return numer(x) * denom(y) == numer(y) * denom(x)

##################
# the abstraction i.e. Abstract Data Types
##################
def rational(n, d):
    '''the constructor'''
    return [n, d]


def numer(x):
    '''selector'''
    return x[0]


def denom(x):
    '''selector'''
    return x[1]
```
In the above example, the rational number abstraction relies on an abstraction of list - *how is list implemented?*🤷 The operations don't care about the implementation of rationals. So, we could switch the implementation of rational to use say, a dictionary, tuple or using closures...
```py
def rational(n, d):
    '''the constructor'''
    def select(name):
			if name == 'n':
				return n
			elif name == 'd':
				return d
		return select


def numer(x):
    '''selector'''
    return x('n')


def denom(x):
    '''selector'''
    return x('d')
```

# Trees
The ability to create lists of lists is example of a *closure property*. Completely unrelated to [Closures](./#Closure), the *closure property* is satisfied if the result of a combination can itself be combined using the same method. See [Composing Programs](http://composingprograms.com/pages/23-sequences.html#trees) or [SICP on the same topic](https://lfe.gitbooks.io/sicp/content/ch2/hierarchical-data-and-the-closure-property.html).

Nested lists can be used to create a fundamental data abstraction, the *tree*. A tree has the following properties:
- a root label and a sequence of branches
- each branch of a tree is a tree
- a tree with no branches is a leaf

## Tree Abstract Data Type
A tree ADT can be respresented:
```py
# Constructor
def tree(root_label, branches=[]):
	for branch in branches:
			assert is_tree(branch), 'branches must be trees'
	return [root_label] + list(branches)

# selectors
def label(tree):
	return tree[0]

def branches(tree):
	return tree[1:]

>>> tree(3, [tree(1), tree(2, [tree(1), tree(1)])])
[3, [1], [2, [1], [1]]]
```

## Linked Lists
>A common representation of a sequence constructed from nested pairs.
```py
four = [1, [2, [3, [4, 'empty']]]]
```
A linked list, contains first element of the sequence, followed by the second element which is a linked list itself.

A linked list ADT can be represented as:
```py
empty = 'empty'
def is_link(s):
	"""Validator
	s is a linked list if it is empty or a (first, rest) pair."""
	return s == empty or (len(s) == 2 and is_link(s[1]))

def link(first, rest):
	"""Constructor
	Construct a linked list from its first element and the rest."""
	assert is_link(rest), "rest must be a linked list."
	return [first, rest]

def first(s):
	"""Selector
	Return the first element of a linked list s."""
	assert is_link(s), "first only applies to linked lists."
	assert s != empty, "empty linked list has no first element."
	return s[0]

def rest(s):
	"""Selector
	Return the rest of the elements of a linked list s."""
	assert is_link(s), "rest only applies to linked lists."
	assert s != empty, "empty linked list has no rest."
	return s[1]
```


# References
https://composingprograms.com/
https://cs61a.org/
