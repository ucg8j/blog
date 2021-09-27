# Udemy Learn Go notes.
*Mostly a course summary, but some supplementary info prompted by studying the course.*

📚 [Course Link]()

- For Go documentation [pkg.go.dev](https://pkg.go.dev/)

- Go workspace
```bash
/bin    # binaries
/pkg    # packages
/src  	# source code
```

- `$ go fmt ./... # formats code`

## go modules (package mgmt)
A module is a collection of Go packages stored in a file tree with a `go.mod` file at its root. `go.mod` defines the module’s module path, which is also the import path used for the root directory, and its dependency requirements, which are the other modules needed for a successful build. Each dependency requirement is written as a module path and a specific semantic version.

**Init go modules**
```bash
$ go mod init luketest/hello
go: creating new go.mod: module luketest/hello
```

The `go.mod` and `go.sum` files should be checked into the code repo, `go.mod` contains the package dependencies, `go.sum` contains the checksum i.e. the has to ensure the exact bits are downloaded.

## Assignment
- `:=` declares and assigns
- `=` can be used to change the value of an already declared variable
- `var y = 123` can also be used, or to declare variables without intialising *i.e. assign a value*. Plus you can do multiple at a time e.g. `var y, x, anothervar`

- Static language, declare a variable of a certain type, it never changes, it remains static.

You can create your own types
`type hotdog int` where hotdog is a new type, of an underlying type int.
You can convert between types if the underlying type is the same.

- Digital Ocean writes really nice technical documentation, and [this one on variables and constants in Go is great.](https://www.digitalocean.com/community/tutorials/how-to-use-variables-and-constants-in-go)

## Numeral Systems
### Decimal
What we use regularly.
Orders of magnitude (OOM) are expressed as 10 to the power.
3 in decimal is `3*10^0`
42 in decimal is `4*10^1 + 2*10^0`

### Binary
Order of mag expressed as 2 to the power.
To express 3 in binary:
`1*2^1 + 1*2^0`
I.e. 1 times 2 to the power of 1 (resolves to 2 in decimal) and 1 times 2 to the power of 0 (resolves to 1 in decimal). Therefore 3 in binary is 11.

42 in binary is `1*2^5 + 1*2^3 + 1*2^1` = 111

### hexadecimal
16 to the power of. Digits include 0 through to 9, then `a` for 10 `b` for 11 through to `f` for 16. E.g. 911 in hexadecimal is:
`3*16^2 + 8*16^1 + e`
38e


## iota
increments with every const declaration.
```go
package main

import (
	"fmt"
)

const (
	a = iota
	b
	c
)
func main()  {
	fmt.Println(a)
	fmt.Println(b)
	fmt.Println(c)
	fmt.Printf("%T\n", a)
}
// 0
// 1
// 2
// int
```
In use
```go
const (
	// kb = 1024
	// mb = 1024 * kb
	// gb = 1024 * mb
	// iota starts at 0, so through away using `_`
	// then bit shift by 10 each time
	_ = iota
	kb = 1 << (iota * 10)
	mb = 1 << (iota * 10)
	gb = 1 << (iota * 10)
)
func main()  {
	fmt.Printf("%d\t\t\t%b\n", kb, kb)
	fmt.Printf("%d\t\t\t%b\n", mb, mb)
	fmt.Printf("%d\t\t%b\n", gb, gb)
}
```

# For
There are three forms, only one of which has semicolons.
```go
for init; condition; post { }

for condition { }

for { } // inside you can use control flow to break e.g. if condition then break
```

# Switch statements
Exit on the first true case. If you use `fallthrough` in a case statement, it will continue evaluating - however the general advice is to not use fallthrough due to weird behaviour on the evaluation of false statements that contain fallthrough.

# Arrays
>Arrays are useful when planning the detailed layout of memory and sometimes can help avoid allocation, but primarily they are a building block for slices
https://golang.org/doc/effective_go#arrays

# Deleting from a slice
Just use append.
```go
x := []int{1,2,3,65,42}
// delete elem 3
z := append(x[:2], x[3:]...)
fmt.Println(z)
// [1 2 65 42]
```

# Comma ok idiom
```go
// name: age
m := map[string]int{
	"god" : 42,
	"bojo": 57,
}
// print values for a key
fmt.Println(m["bojo"]) // 57
// this key doesn't exist
fmt.Println(m["luke"]) // 0

// in order to handle - use the comma ok idiom
if v, ok := m["luke"]; ok {
	fmt.Println(v) // doesn't print, because `ok` is false
}
```

## `struct` Inheritance
Similar to class inheritance you can define a `struct`, then create `struct` that extends a previously defined `struct`.
```go
type person struct {
	first string
	last  string
	age   int
}

type secretAgent struct {
	person
	ltk   bool
}
```

## defer
```go
func main() {
	defer foo() //will be executed after bar
	bar()
}
```

## Methods i.e. receiver functions
Without the receiver it would be a normal function. With the 'receiver' it will attach to a particular defined type.
```go
//   r receiver
func (t Type) methodName(parameter list) {  
}
```
A more complete example:
```go
// in go this is like declaring a class
type person struct {
	firstName string
	lastName string
}

type secretAgent struct {
	person
	ltk bool
}

// declare a method
func (s secretAgent) intro() {
	fmt.Println("I am", s.firstName, s.lastName)
}

func main() {
	// create instance of class
	s007 := secretAgent{
		person: person{
			firstName: "James",
			lastName: "Bond",
		},
		ltk: true,
	}
	s007.intro()
}
```

- [Good resource on Go functions vs methods](https://golangbot.com/methods/) and code written with vs the other - likely will see either still depending on background of programmer.

## Interfaces and Polymorphism
- Interfaces allow values to be of more than one type.
A value can be of more than one type.
```go
// in go this is like declaring a class
type person struct {
	firstName string
	lastName string
}

type secretAgent struct {
	person
	ltk bool
}

// same method names, for different types
func (p person) intro() {
	fmt.Println("I am", p.firstName, p.lastName, " - the person speaking")
}

func (s secretAgent) intro() {
	fmt.Println("I am", s.firstName, s.lastName, " - the agent speaking")
}

// define a type of interface, that will allow the value of this type to be of multiple types
type human interface {
	intro()
}

// because the human interface has a method `intro`
// any type with the method is also a human such that the `bar` function will return
func bar(h human)  {
	fmt.Println("this fn takes multiple types that have the method `intro`", h)
}

func main() {
	// create instance of class
	s007 := secretAgent{
		person: person{
			firstName: "James",
			lastName: "Bond",
		},
		ltk: true,
	}
	p1 := person{
		firstName: "Miss",
		lastName: "MoneyPenny",
	}

	s007.intro()
	p1.intro()

	bar(s007)
	bar(p1)
}
```

**FLUP** I assume the underlying type must be the same

*An interface says, if you have this method, then you're my type*

## Function Expression
Functions can also be declared by assignment. This is also what is meant by *functions are first class citizens*, they can be used and past around like any other variable.

### function returning a function
```go
// regular fn returning an int
func number() int {
	return 1
}

// function that returns a function that returns an int
func returnfn() func() int {
	return number
}

func main() {
	// evaluation of `returnfn` returns a fn, thus i is a function
	i := returnfn()

	fmt.Printf("%T\n", i)
	fmt.Println("run i: ", i())
}
```

### callback
```go
// regular fn returning an int
func number() int {
	return 1
}

// function that takes a function - a callback
func plusone(x int, y func() int) int {
	return y() + x
}

func main() {
	fmt.Println("evaluate: ")
	fmt.Println(plusone(5, number))
}
```

## closure
Enclosing a variables scope.
```go
func counter() func() int {
		x := 0
		return func() int {
			x++
			return x
		}
}

func main () {
	a := counter()
	b := counter()
	fmt.Println(a())
	fmt.Println(a())
	fmt.Println(a())
	fmt.Println(b())
	fmt.Println(b())
	fmt.Println(b())
}
```

## Pointer
```go
a:=42
memAddress := &a // 0x1040a124
theValue := *memAddress // 42
```

**When to use a pointer?**
1. You don't want to pass around a lot of data
2. You want to change data in a particular location
```go
// take a pointer
func foo(y *int)  {
	*y = 43
}

// normal function
func bar(y int)  {
	y = 43
}

func main () {
	x := 0
	bar(x)
	fmt.Println("not pointer", x)
	// not pointer 0
	foo(&x)
	fmt.Println("Pointer", x)
	// Pointer 43

	// type of a pointer
	fmt.Printf("%T\n", a)
	fmt.Printf("%T\n", &a)
	// int
	// *int <- the type is a pointer to an int
}
```

**Dereferencing a pointer**
```go
func main () {
	a := 10
	b := &a // b now has the memory address of a

	// printing b produces the memory address
	fmt.Println(b)
	// 
	// to print the value at that address, deference
	fmt.Println(*b)
}
```

### Method Sets
[TODO:]

### Marshalling JSON data
From wiki
>[Marshalling] the process of transforming the memory representation of an object into a data format suitable for storage or transmission.... similar or synonymous to serialization.



**Fun fact** - Programs used to be written in one large piece of code, e.g. Basic, which had goto statements to jumped between sections of the code. So it was very difficult to figure out a the logic of the program - true spaghetti code.

# misc
- UTF-8 is the replacement for other schemes such as ASCII.
- World's first computer bug was a moth in the vacuum tubes used in the 40s versions of computers.
- variable shadowing occurs when a variable declared within a certain scope (decision block, method, or inner class) has the same name as a variable declared in an outer scope.
- you can look up the mapping between the UTF-8 scheme and figure out it's binary (base 2), base 10, hexadecimal and actual mapping on wiki.
- the pattern in go is, keyword identifier type e.g. `var a int`
- fn return single type `func foo() int {}` fn return multiple types `func bar() (int, string) {}`



# sql linter learning
```go
// are the last two chars of line 3 \n\n?
chars := []rune(line)
fmt.Println("runes: ", chars)
fmt.Printf("%U\n", chars)
```
// what i learnt here... to look at lines from a string, you must get a slice of runes, don't think about it like it's python.
// secondly, the reason the line dones't contain '\n' is because the read of the file uses a function that defines lines by the \n! I.e. it doesn't exist in the lines. Therefore, multiple new lines in my code should be defined by two consecutive lines with nothing in them.

use as you need, dont rush into them unless you're doing it to learn them proper, most newcomers end up overusing concurrency. interfaces and pointers are not needed yet i dont imagine but as the project evolves here are some uses for types and concurrency:
u can for example have a doc in a type,
type document struct{
 original content []string 
offendinglines []line
suggestedChnages []line
// whatever metadata
timechanged time
}
type line struct{
lineNo index
content string
}

concurrency you can use while you're going through folder of files to lint
for doc in folder{
go parse(file)
}
this way u launch one goroutine per file
issue becomes if they need to print on screen, u can have each print on it own, u want them to pass those messages to a channel? to print them

# FLUP Questions
difference between const and var?
