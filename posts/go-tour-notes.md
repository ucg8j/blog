---
title: Go Tour Summary
permalink: /go-tour-summary/
date: 2020-12-07
tags: programming, go
excerpt: These are my summary notes of 'A Tour of Go' - which is meant for people who are familiar with programming to have a quick tour
layout: layouts/post.njk
---

These are my summary notes of [A Tour of Go](https://tour.golang.org) - which is meant for people who are familiar with programming to have a quick tour of the Go language. I'm most familiar with dynamic languages (`R`, `Python`, `JavaScript`) so there are some go-lang features that naturally feel new by the nature of Go being a statically typed language. A subsequent post will expand upon some of the more advanced features like pointers, concurrency and polymorphism.

## Named Return Values
A return statement without arguments returns the named return values. This is known as a "naked" return.

```go
func split(mynumber int) (x, y int) {
	x = mynumber * 4
	y = mynumber - x
	return
}

func main() {
	fmt.Println(split(17))myt
}
// This will print x and y:
// 68 -51
```

## Variables
The `var` statement declares a list of variables; as in function argument lists, the type is last.

### Variables with initializers
A `var` declaration can include initializers, one per variable.

If an initializer is present, the type can be omitted; the variable will take the type of the initializer.

```go
var a int // will have a value of 0 as a placeholder
var f float64 // 0
var b bool // false
var s string // ""

var i, j int = 1, 2 // explicit

var k, l = 1, 2 // implicit

```

## `:=`
Inside a function, the `:=` short assignment statement can be used in place of a var declaration with implicit type.

Outside a function, every statement begins with a keyword (var, func, and so on) and so the `:=` construct is not available.

```go
func main() {
  // := only within fn
  k := 3
}
```

## Types in go
```go
bool

string

int  int8  int16  int32  int64
uint uint8 uint16 uint32 uint64 uintptr

byte // alias for uint8

rune // alias for int32
     // represents a Unicode code point

float32 float64

complex64 complex128
```

## Type conversions
```go
var i int = 42
var f float64 = float64(i)

//or
i := 42
f := float64(i)
```

## Constants
Constants are declared like variables, but with the const keyword.

```go
const Pi = 3.14
```

## For
Go has only one looping construct, the `for` loop.

```go
func main() {
	sum := 0
	for i := 0; i < 10; i++ {
		sum += i
	}
	fmt.Println(sum)
}
```
The init and post statements are optional.
```go
sum := 1
for ; sum < 1000; {
  sum += sum
}
```


## If
Go's `if` statements are like its `for` loops; the expression need not be surrounded by parentheses ( ) but the braces { } are required.

### If with a short statement
Like the `for` loop, the `if` statement can start with a short statement to execute before the condition.

Variables declared by the statement are only in scope until the end of the if.

```go
func pow(x, n, lim float64) float64 {
  // v doesn't exist outside of the if statement scope
  if v := math.Pow(x, n); v < lim {
		return v
	}
	return lim
}
```

## Switch
A switch statement is a shorter way to write a sequence of `if` `else` statements. It runs the first case whose value is equal to the condition expression.

Go's switch is like the one in `C`, `C++`, `Java`, `JavaScript` and `PHP`, except that Go only runs the selected case, not all the cases that follow. In effect, the break statement that is needed at the end of each case in those languages is provided automatically in Go. Another important difference is that Go's switch cases need not be constants, and the values involved need not be integers.

```go
func main() {
	switch 1 {
	case 1:
		fmt.Println("matches")
	case 1 + 1:
		fmt.Println("doesnt match")
	}
}
// matches
```

### Switch with no condition
Switch without a condition is the same as switch true. This construct can be a clean way to write long if-then-else chains.
```go
func main() {
	t := time.Now()
	switch {
	case t.Hour() < 12:
		fmt.Println("Good morning!")
	case t.Hour() < 17:
		fmt.Println("Good afternoon.")
	default:
		fmt.Println("Good evening.")
	}
}
```

## Defer
Defer evaluates but doesn't execute
```go
func main() {
	fmt.Println("hello1")
	defer fmt.Println("world")
  fmt.Println("hello2")
}
// hello1
// hello2
// world
```

### Stacking defers
Deferred function calls are pushed onto a stack. When a function returns, its deferred calls are executed in last-in-first-out order.
```go
func main() {
	fmt.Println("counting")
	for i := 0; i < 4; i++ {
		defer fmt.Println(i)
	}
	fmt.Println("done")
}
// counting
// done
// 3
// 2
// 1
// 0
```

## Pointers
Pointers are useful if you have read something into memory and you don't want to duplicate it. So you can just point to the memory address. Useful for optimising your code.

So if you want to change a variable stored in memory, you can 'mutate' it by using pointers.

The type `*T` is a pointer to a `T` value. Its zero value is nil.

`var p *int`

The `&` operator generates a pointer to its operand.
n.b. In 3+6, 3 and 6 are operands. And the + is the operator.

```go
i := 42
p := &i // a pointer p=0xc00002c008
z := p // 'dereferences the pointer. z=42
fmt.Println("i",i,"p",p, "z", z)
// i 42 p 0xc00002c008 z 42
```

The `*` operator denotes the pointer's underlying value.
```go
fmt.Println(*p) // read i through the pointer p
// 42
*p = 21         // set i through the pointer p
fmt.Println(i)
// 21
```
This is known as "dereferencing" or "indirecting".

## Structs
A struct is a collection of fields.
```go
type Vertex struct {
	X int
	Y int
}

func main() {
	fmt.Println(Vertex{1, 2})
}
// {1 2}
```

## Pointers to structs
Struct fields can be accessed through a struct pointer.
```go
type Vertex struct {
	X int
	Y int
}

func main() {
	v := Vertex{1, 2}
	p := &v
	p.X = 10
	fmt.Println(v)
}
// {10 2}
```


## Struct Literals
A struct literal denotes a newly allocated struct value by listing the values of its fields.

You can list just a subset of fields by using the Name: syntax. The order of named fields is irrelevant.

The special prefix `&` returns a pointer to the struct value.
```go
type Vertex struct {
	X, Y int
}

var (
	v1 = Vertex{1, 2}  // has type Vertex
	v2 = Vertex{X: 1}  // Y:0 is implicit
	v3 = Vertex{}      // X:0 and Y:0
	p  = &Vertex{1, 2} // has type *Vertex
)

func main() {
	fmt.Println(v1, p, v2, v3)
}
// {1 2} &{1 2} {1 0} {0 0}
```

## Arrays
The type `[n]T` is an array of `n` values of type `T`. The expression
`var a [10]int`
declares a variable `a` as an array of ten integers. **An array's length is part of its type, so arrays cannot be resized.**
```go
func main() {
	var a [2]string
	a[0] = "Hello"
	a[1] = "World"
	fmt.Println(a[0], a[1])
	fmt.Println(a)

	primes := [6]int{2, 3, 5, 7, 11, 13}
	fmt.Println(primes)
}
// Hello World
// [Hello World]
// [2 3 5 7 11 13]
```

## Slices
An array has a fixed size. A slice, on the other hand, is a dynamically-sized, flexible view into the elements of an array
```go
func main() {
	primes := [6]int{2, 3, 5, 7, 11, 13}

	var sliced []int = primes[1:4]
	fmt.Println(sliced)
}
```
A slice does not store any data, it just describes a section of an underlying array. Changing the elements of a slice modifies the corresponding elements of its underlying array. Other slices that share the same underlying array will see those changes.
```go
func main() {
	names := [4]string{
		"John",
		"Paul",
		"George",
		"Ringo",
	}

	a := names[0:2]
	b := names[1:3]
	fmt.Println(a, b)

	b[0] = "XXX"
	fmt.Println(a, b)
	fmt.Println(names)
}
// [John Paul] [Paul George]
// [John XXX] [XXX George]
// [John XXX George Ringo]
```

## Slice literals
A slice literal is like an array literal without the length.
This is an array literal:
`[3]bool{true, true, false}`

And this creates the same array as above, then builds a slice that references it:
`[]bool{true, true, false}`

```go
	q := []int{2, 3, 5, 7, 11, 13}
  fmt.Println(q)
  // [2 3 5 7 11 13]
```

## Slice length and capacity
The length of a slice is the number of elements it contains.
The capacity of a slice is the number of elements in the underlying array, counting from the first element in the slice.
The length and capacity of a slice `s` can be obtained using the expressions `len(s)` and `cap(s)`.

## Nil slices
The zero value of a slice is `nil`.
```go
func main() {
	var s []int
	fmt.Println(s, len(s), cap(s))
	if s == nil {
		fmt.Println("nil!")
	}
}
// [] 0 0
// nil!
```

## Creating a slice with `make`
Slices can be created with the built-in `make` function; this is how you create dynamically-sized arrays. The make function allocates a zeroed array and returns a slice that refers to that array:
```go
a := make([]int, 5)  // len(a)=5

// To specify a capacity, pass a third argument to make:

b := make([]int, 0, 5) // len(b)=0, cap(b)=5
```

## Appending to a slice
```go
func main() {
	var s []int
	printSlice(s)

	// append works on nil slices.
	s = append(s, 0)
	printSlice(s)

	// The slice grows as needed.
	s = append(s, 1)
	printSlice(s)

	// We can add more than one element at a time.
	s = append(s, 2, 3, 4)
	printSlice(s)
}

func printSlice(s []int) {
	fmt.Printf("len=%d cap=%d %v\n", len(s), cap(s), s)
}
// len=0 cap=0 []
// len=1 cap=1 [0]
// len=2 cap=2 [0 1]
// len=5 cap=6 [0 1 2 3 4]
```

## Range
The `range` form of the `for` loop iterates over a slice or map.
When ranging over a slice, two values are returned for each iteration. The first is the index, and the second is a copy of the element at that index.

**n.b.** [verbs in string templates.](https://golang.org/pkg/fmt/#hdr-Printing)

```go
var pow = []int{1, 2, 4, 8, 16}

func main() {
	for i, v := range pow {
		fmt.Printf("2**%d = %d\n", i, v)
	}
}
// 2**0 = 1
// 2**1 = 2
// 2**2 = 4
// 2**3 = 8
// 2**4 = 16
```

You can skip the index or value by assigning to _.
```go
for i, _ := range pow
for _, value := range pow
```

## Map literals
Map literals are like struct literals, but the keys are required.
```go
type Vertex struct {
	Lat, Long float64
}

var m = map[string]Vertex{
	"Bell Labs": Vertex{
		40.68433, -74.39967,
	},
	"Google": Vertex{
		37.42202, -122.08408,
	},
}

// m can also be expressed
var m = map[string]Vertex{
	"Bell Labs": {40.68433, -74.39967},
	"Google":    {37.42202, -122.08408},
}

func main() {
	fmt.Println(m)
}
// map[Bell Labs:{40.68433 -74.39967} Google:{37.42202 -122.08408}]
```

## Mutating Maps
```go
// Insert or update an element in map m:
m[key] = elem

// Retrieve an element:
elem = m[key]

// Delete an element:
delete(m, key)

// Test that a key is present with a two-value assignment:
elem, ok = m[key]
```

## Function values
Functions are values too. They can be passed around just like other values. Function values may be used as function arguments and return values.

## Function closures
Go functions may be closures. A closure is a function value that references variables from outside its body. The function may access and assign to the referenced variables; in this sense the function is "bound" to the variables.
```go
func adder() func(int) int {
	sum := 0
	return func(x int) int {
		sum += x
		return sum
	}
}

func main() {
	pos, neg := adder(), adder()
	for i := 0; i < 10; i++ {
		fmt.Println(
			pos(i),
			neg(-2*i),
		)
	}
}
```

## Methods
Go does not have classes. However, you can define methods on types.
A method is a function with a special receiver argument.
The receiver appears in its own argument list between the func keyword and the method name.
In this example, the `Abs` method has a receiver of type `Vertex` named `v`.
```go
type Vertex struct {
	X, Y float64
}

// as a method
func (v Vertex) Abs() float64 {
	return math.Sqrt(v.X*v.X + v.Y*v.Y)
}

func main() {
	v := Vertex{3, 4}
	fmt.Println(v.Abs())
}

// as a normal function
func Abs(v Vertex) float64 {
	return math.Sqrt(v.X*v.X + v.Y*v.Y)
}

func main() {
	v := Vertex{3, 4}
	fmt.Println(Abs(v))
}

```

## Pointer receivers
Methods with pointer receivers can modify the value to which the receiver points (as `Scale` does here 👇). Since methods often need to modify their receiver, pointer receivers are more common than value receivers.

With a value receiver, the Scale method operates on a copy of the original Vertex value. (This is the same behavior as for any other function argument.) The Scale method must have a pointer receiver to change the Vertex value declared in the main function.
```go
type Vertex struct {
	X, Y float64
}

func (v Vertex) Abs() float64 {
	return math.Sqrt(v.X*v.X + v.Y*v.Y)
}

// method on a pointer
func (v *Vertex) Scale(f float64) {
	v.X = v.X * f
	v.Y = v.Y * f
}

func main() {
	v := Vertex{3, 4}
	v.Scale(10)
	fmt.Println(v)
}
// {30 40}

// method on value receiver
func (v Vertex) Scale(f float64) {
	v.X = v.X * f
	v.Y = v.Y * f
}

func main() {
	v := Vertex{3, 4}
	v.Scale(10)
	fmt.Println(v)
}
// {3 4}
// the result {3 4} is because the the original values are not changed. A copy is made on execution. As opposed to the pointer receiver, which modifies the original values.
```

## Methods and pointer indirection (2)
Functions that take a value argument must take a value of that specific type:
```go
var v Vertex
fmt.Println(AbsFunc(v))  // OK
fmt.Println(AbsFunc(&v)) // Compile error!
```
Methods with value receivers take either a value or a pointer as the receiver when they are called:
```go
var v Vertex
fmt.Println(v.Abs()) // OK
p := &v
fmt.Println(p.Abs()) // OK
```

## Interfaces
An interface type is defined as a set of method signatures.
A value of interface type can hold any value that implements those methods.

A type implements an interface by implementing its methods. There is no explicit declaration of intent, no "implements" keyword

### Interface values
Under the hood, interface values can be thought of as a tuple of a value and a concrete type:
`(value, type)`
An interface value holds a value of a specific underlying concrete type.

### Interface values with `nil` underlying values
If the concrete value inside the interface itself is nil, the method will be called with a `nil` receiver.
In some languages this would trigger a null pointer exception, but in Go it is common to write methods that gracefully handle being called with a `nil` receiver.

### The empty interface
The interface type that specifies zero methods is known as the empty interface:
`interface{}`
An empty interface may hold values of any type. Every type implements at least zero methods. Empty interfaces are used by code that handles values of unknown type. For example, `fmt.Print` takes any number of arguments of type interface{}.

### Type assertions
A type assertion provides access to an interface value's underlying concrete value.
`t := i.(T)`
This statement asserts that the interface value `i` holds the concrete type `T` and assigns the underlying `T` value to the variable `t`.
If `i` does not hold a `T`, the statement will trigger a panic.
To test whether an interface value holds a specific type, a type assertion can return two values: the underlying value and a boolean value that reports whether the assertion succeeded.
`t, ok := i.(T)`
```go
func main() {
	var i interface{} = "hello" // implicit string type

	s := i.(string)
	fmt.Println(s) //"hello"

	s, ok := i.(string)
	fmt.Println(s, ok) //"hello", true

	f, ok := i.(float64)
	fmt.Println(f, ok) //0, false

	f = i.(float64) // panic
	fmt.Println(f) //panic: interface conversion: interface {} is string, not float64
}
```

### Type switches
A type switch is a construct that permits several type assertions in series.
A type switch is like a regular switch statement, but the cases in a type switch specify types (not values), and those values are compared against the type of the value held by the given interface value.
```go
func do(i interface{}) {
	switch v := i.(type) {
	case int:
		fmt.Printf("Twice %v is %v\n", v, v*2)
	case string:
		fmt.Printf("%q is %v bytes long\n", v, len(v))
	default:
		fmt.Printf("I don't know about type %T!\n", v)
	}
}

func main() {
	do(21)
	do("hello")
	do(true)
}
// Twice 21 is 42
// "hello" is 5 bytes long
// I don't know about type bool!
```

## Errors
Go programs express error state with error values. The error type is a built-in interface similar to `fmt.Stringer`:
```go
type error interface {
    Error() string
}
```
As with `fmt.Stringer`, the fmt package looks for the error interface when printing values.
Functions often return an error value, and calling code should handle errors by testing whether the error equals nil.
```go
i, err := strconv.Atoi("42")
if err != nil {
    fmt.Printf("couldn't convert number: %v\n", err)
    return
}
fmt.Println("Converted integer:", i)
```

## Goroutines
A goroutine is a lightweight thread managed by the Go runtime.
```go
func say(s string) {
	for i := 0; i < 3; i++ {
		time.Sleep(100 * time.Millisecond)
		fmt.Println(s)
	}
}

func main() {
	go say("world")
	say("hello")
}
// hello
// world
// world
// hello
// hello
```
### ----------------------------------------------------------------------------------------------------------
### 🚧 TODO - continue on here https://tour.golang.org/concurrency/2
### ---------------------------------------------------------------------------------------------------------

# Observations
- unused variables are not allowed by the compiler - very cool

- hard concepts (read more on)
  - pointer indirection
    - performance
    - modify in place
    - when optional, pointer to a string... no empty strings in go. But the pointer to the string will be `nil`
  - interfaces and polymorphism (types)
  - concurrency
  - stringer, but why? Pretty printing? https://tour.golang.org/methods/17

- skipped
  - exercises
  - reader
  - images
  - routines, channels, buffered channels, range and close, select,sync.Mutex

- typing a particular concept into youtube usual has a human to explain it.
  - sentdex is pretty good at explaining in 5mins

- is go functional? Nope and it's not OO. It's procedural. Very explicit.
