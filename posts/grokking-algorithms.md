---
title: Grokking Algorithms - Summary
permalink: /grokking-algorithms/
date: 2021-01-04
tags: book, software, algorithms
excerpt: Grokking Algorithms* is a beautifully formatted book that explains complex material simply using pictures, analogies and high level practical explanations. This post is a review and summary of the Grokking Algorithms book.
layout: layouts/post.njk
---

📚 Book: [Grokking Algorithms](https://amzn.to/2MqMMyg)

⭐️ Rating: 5/5 I don't think you could manage to produce a more friendly introduction to algorithms.

![](/content/images/2020/grokking-algorithms-frontcover.png#thumbnail)

I highly recommend this book for anyone who hasn't studied algorithms. You do not need to be a good programmer or to remember all of your high school maths you have probably forgotten. *Grokking Algorithms* is a beautifully formatted book that explains complex material simply using pictures, analogies and high level practical explanations.

The only criticism I have of the book is the lightness of the last two chapters. Chapter 10 seems to detour into machine learning. And chapter 11 gives a very very quick skim over a few other algorithms not covered. I would have preferred to have seen more of the previous chapters - additional algorithms could have been covered to similar depth of the other chapters.

For anyone who has done a university level course in Algorithms - this book is not deep enough. Although it might help as a light refresher that you can pick up and put down easily, as opposed to getting out an in-depth (hard)core algorithms book like [Introduction to Algorithms](https://amzn.to/35aXK1h).

# Summary
This is my personal summary of *Grokking Algorithms*. The headings match that of the book, so if a section needs fleshing out you should find the relevant section of the book. Italics reflect direct quotations. Not all sections are included as I felt not all needed summarising.
# 1. Introduction to Algorithms
*An algorithm is a set of instructions for accomplishing a task.*

## Binary Search
- Data: List
- Requirement: List is alpha sorted
- Most efficient alg: Binary Search
- Analogy: Searching through an address/phone book

```python
def binary_search(list, item):
  # keep track of what part of the list your searching
  # initialised with the full list
  low = 0
  high = len(list) - 1

  while low <= high:
    # check the middle element
    mid = int((low + high) / 2)
    guess = list[mid]
    if guess == item:
      return mid
    if guess > item:
      high = mid - 1
    else:
      low = mid + 1
  return None

my_list = [1, 3, 5, 7, 9]

# Find the index of 3 in the list
print(binary_search(my_list, 3)) # 1

# Find the index of -1 in the list
print(binary_search(my_list, -1)) # None
```

## Running Time
- Let, list = 4 billion
- Linear time - Simple Search, starting at the beginning of the list until you find the right element, could take 4 billion steps
- Logarithmic time - Finding the right element takes log 4 billion = 32 (rounded)

Lesson: Algorithm run times grow at different rates. Timing two different algs is not enough because it doesn't reflect how the run time will grow at different scales.

## Big O Notation
>It's called Big O notation because you put a “big O” in front of the number of operations (it sounds like a joke, but it’s true!)
>*Big O notation is about the worst-case scenario.*

### Some Common Big O Run Times
- **O(log n)** *log time*. E.g. Binary search.
- **O(n)** *linear time*. E.g. Simple search.
- **O(n * log n)** *log linear time*. E.g. A fast sorting algorithm, like quicksort (see [chapter 4](#4.-quicksort)).
- **O(n<sup>2</sup>)** *quadratic time* E.g. A slow sorting algorithm, like selection sort (see [chapter 2](#2.-selection-sort)).
- **O(n!)** *factorial time* E.g. A really slow algorithm, like the traveling salesperson (see [next!](#the-traveling-salesperson)).

Note: O(1) is constant time e.g. Is a number odd or even?

![](/content/images/2020/bigO_complexity_graphs.svg)

## The Traveling Salesperson
Is a classic example of a task that takes O(n!) to complete. To find the shortest route possible for a travelling salesperson covering *n* cities. All possible combinations of cities must be calculated to find the combination with the shortest distance.


# 2. Selection Sort
>Each time you want to store an item in memory, you ask the computer for some space, and it gives you an address where you can store your item. If you want to store multiple items, there are two basic ways to do so: arrays and lists

#### Memory:
- **Arrays** - require contiguous memory. I.e. require slots in memory that are side by side.
- **Linked Lists** - Do not require contiguous memory, instead each element contains an address to the next element in the list.

#### Adding more elements to a lists:
- **Arrays** - will need to find a slot in memory large enough for all elements or have been defined initially reserving extra space (trade off being a potential waste of memory).
- **Linked Lists** - update easily without having to reserve or pre-allocate memory.

#### Reading:
- **Arrays** are very fast at reading any element since the address is logically deduced using simple maths e.g. If the first element is at memory address 0 then where is element 5? It's at address 4.
- **Linked lists** are slower since you have to read each element's address to find the next elements address.

*Terminology:* The position in memory is known as it's 'index'.

#### Inserts:
If you want to insert an item into the middle of a list:
- **Arrays** - you will need to move the location of all downstream elements to new memory locations. At worse, you will need to find an entire new memory slot to cater for the contiguous memory need.
- **Linked Lists** - only need one repoint of memory.

**Deletions:**
>Unlike insertions, deletions will always work. Insertions can fail sometimes when there’s no space leſt in memory. But you can always delete an element... There are two different types of access: random access and sequential access. Sequential access means reading the elements one by one, starting at the first element. Linked lists can only do sequential access.

|           | Arrays | Lists |
| --------- | ------ | ----- |
| Reading   | O(1)   | O(n)  |
| Insertion | O(n)   | O(1)  |
| Deletion  | O(n)   | O(1)  |


## Selection sort
One method of sorting a list e.g.

| artist  | play count |
| ------: | ---------- |
| kooks   | 10         |
| Beatles | 15         |
| ...     | ...        |

Would be to iterate n (number of artists) times through the list and create a new list. The first search would be for the 1st highest playcount, then the 2nd and so on. Each search would be O(n) for O(n) artists, i.e. O(n<sup>2</sup>).

```python
def findSmallest(arr):
  smallest = arr[0]
  smallest_index = 0
  for i in range(1, len(arr)):
    if arr[i] < smallest:
      smallest = arr[i]
      smallest_index = i
  return smallest_index

def selectionSort(arr):
  newArr = []
  for i in range(len(arr)):
    smallest = findSmallest(arr)
    newArr.append(arr.pop(smallest))
  return newArr

print(selectionSort([5, 3, 6, 2, 10]))
```

# 3. Recursion
>“Loops may achieve a performance gain for your program. Recursion may achieve a performance gain for your programmer. Choose which is more important in your situation!”

## Base case and recursive case
>Because a recursive function calls itself, it’s easy to write a function incorrectly that ends up in an infinite loop.
```python
def countdown(i):
  print(i)
  countdown(i-1)
```
The above code will run indefinitely. Like a `while` loop without a clause.

>... every recursive function has two parts: the base case, and the recursive case

Re-written with a base case:

```python
def countdown(i):
  print(i)
  if i <= 0: # base case
    return
  else:      # Recursive case
    countdown(i-1)
```

## The Stack
The *call stack* of computer is conceptually like stacking sticky notes on top of each other. This has it's own simple data structure, *the stack*. If a function, `greet()`, calls another function `how_are_you()`, the computer first allocates a slot in memory for the function call, then places variables used in that slot e.g. `Rowan`. Therefore, a call to `greet()` creates the first 'empty sticky note' in the call stack. It then get's filled with `Rowan`. The next sticky note to go onto the stack is when the call to `how_are_you()` is made.

>when you call a function from another function, the calling function is paused in a partially completed state.

## The Call Stack With Recursion
Below is a recursive function to calculate a factorial.
```python
def fact(x):
  if x == 1:
    return 1
  else:
    return x * fact(x-1)
```
If you call `fact(3)`, each time the base case is not met, `fact()` will call itself, pausing the previous function call on the stack. The subsequent call of `fact()` until the base case is met. At which point each function called in the stack get's popped off i.e. resolves all the way back down the stack to the original call of `fact(3)`.

Stacks have two operations:
- **`push()`** adds an element to the collection, and
- **`pop()`** removes the most recently added element that has not yet been removed

In the case where `fact(3)` is called. The first sticky note in the stack is `fact(3)`, the last is `fact(1)`. Before the final result are display the each result of `fact()` is multiplied by each of the copies of the function in the call stack with the variable x (per the logic of the function). E.g. 3x2x1 = 6.

Using the call stack is convenient but can take lots of memory if the stack becomes too tall. Alternatively, you could rewrite your code as a loop or use tail recursion (not covered by book).

# 4. Quicksort

## Divide and Conquer (D&C)
D&C algorithms are recursive. The two steps to solving a problem using D&C:

1. What is the base case? (Simplest possible)
2. Divide the problem until it becomes the base case.

Example: Say you have to divide up a piece of land into the largest possible squares and all squares have to be the same size. The plot of land is 400 x 240m. The largest possible square is 240. But there is a left over land, 240 x 160m. Now apply the same technique to the remainder, the largest possible square is 160m. The remainder becomes 160 x 80m - 80m is the base case as any further division would leave no remainder. See [Euclid's Algorithm](https://en.wikipedia.org/wiki/Euclidean_algorithm)

>D&C isn’t a simple algorithm that you can apply to a problem. Instead, it’s a way to think about a problem.

## For Loop vs Recursion To Sum An Array
### For Loop
For each item in the array, increment the total by the value of the item:
```python
def sum(array):
  total = 0
  for item in array:
    total += item
```

### Recursion
What is the simplest 'base case' array? One with either 1 or 0 elements.
Divide the problem up.
```python
def sum(array):
  # Base case
  if array == []:
    return 0
  else:
    # divide the problem up
    return array[0] + sum[1:]
```

## Quicksort
- Is faster than selection sort.
- Also uses a divide and conquer strategy.

Let's say you have an array of `[33,15,10]`. Quicksort will:
1. Pick a number *the pivot* e.g. 33
2. Partition into two subarrays:
  a. all elements greater than the pivot
  b. all elements less than the pivot
  Such that you will have the pivot `[33]`, an array of number/s smaller than the pivot `[15,10]` and an array for numbers larger than the pivot `[]`.

3. Call quicksort recursively on the two subarrays

## Aside: Inductive Proofs
Is a method to test and prove an algorithm works. An inductive proof contains two steps:

1. The base case.
2. The inductive case.

E.g. You want to climb a ladder, the inductive case is that given a rung you can go to the next rung.
The base case is that your legs are on rung 1 of the ladder.

#### Python Quicksort
```python
def quicksort(array):
  # base case an with 1 or less elements.
  if len(array) <2:
    return array
  else:
    # recursive case
    pivot = array[0]
    less = [i for i in array[1:] if i <= pivot]
    greater = [i for i in array[1:] if i > pivot]

  return quicksort(less) + pivot + quicksort(greater)
```

## Big O Notation
- Selection Sort is O(n<sup>2</sup>)
- Quick Sort is O(n<sup>2</sup>)
  - Worst case O(n<sup>2</sup>)
  - Avg. case O(n log n)
- Merge Sort is O(n log n)

If the avg. case of quicksort is O(n log n) why not use merge sort?

## Merge sort vs quicksort
If you have two algorithms that print a list of numbers in a `for` loop where one sleeps for a second between each print operation. Both algorithms will be O(n) time. However we know in practice one is faster than the other. This is because really Big 0 notation is `c x n` where `c` is some fixed amount of time. Usually the constant doesn't matter. e.g. simple search vs binary search. Let's say the constant is 10ms for simple search and we penalise binary search with a constant of 1sec. If we had to search 4 billion records simple search would take 463 days vs binary taking 32 seconds.

However, sometimes, like in the case of mergesort vs quicksort. Quicksort has a smaller constant than mergesort. Therefore, if quicksort is O(n log n) time then quicksort is faster.

## Average case vs worst case
The performance of quicksort depends on the chosen pivot. E.g. if the first element is always chosen and the array is already sorted it would take a call stack of 8 to sort the array O(n). On the other hand, picking the middle of the array each time would result in a call stack of 4 to sort the array O(log n). Both of these involve touching every element O(n). Therefore, the worst case is O(n) * O(n) = O(n<sup>2</sup>) and the best case (average case) is O(n) * O(log n) = O(n log n). Therefore, if you choose the pivot randomly the runtime of quicksort is O(n log n).


# 5. Hash Tables
A hash function returns the index of a value removing the need to perform a search. For this to work a hash function must:
- consistently map an input to the same index
- map different strings to different indexes
- not return indexes outside the size of the array

A hash function combined with an array is a hash table. Hash tables are are a complex data structure also known as maps, dictionaries and associative arrays.

## Use cases
DNS resolution - mapping domain names to IP addresses
Caching - Frequently requested pages are commonly cached in server memory.

## Collisions
It's extremely difficult to write a hash function that doesn't experience collisions. E.g. a grocery store with an alphabetical array with 26 slots. Apples goes to the first slot, then bananas in the second slot. But what if the store now needs to store a price for avocados? It would need to be stored at the slot where apples is. There are many ways to deal with collisions, however having a linked list at the slot is a common solution. If the linked list is small, then the performance hit is negligible. If a store only sold products starting with A, an alphabetical index would perform very poorly.
*Take away*: you want an index that distributes the items as evenly as possible.

## Performance
Average case: O(1) constant time
Worst case: 0(n) linear time

To avoid worst case performance, collisions must be avoided. To avoid collisions:
- Have a low load factor (number of items / total number of slots). When the items grow and hence the load factor, you should *resize* the hash table and increase the slots. Rule of thumb, when LF > .07
- a good hash function

# 6. Breadth First Search (BFS)
BFS is great at Shortest Path problems, examples of which include:
- fewest moves to victory in a checkers game
- fewest edits from a misspelt word to a correct word
- find the closest doctor

To solve these problems, first model them as a graph then apply BFS.

## What is a graph?
Graphs are ways to model how different things are connected to each other, they have nodes (things) and edges (how things are connected/related to each other).

## BFS
Can answer:
- is there a path between A and B?
- what is the shortest path between A and B?

First degree nodes will be searched first before second degree nodes. Therefore, nodes will be queued in a FIFO manner.

## Implementing the graph
e.g. You have 3 friends, this can be implemented in a hash table.
```python
graph = {}
graph['you'] = ['alice', 'bob', 'claire']
```

Where your friends are contained in an array. Extending this a little:
```python
graph['alice'] = ['peggy']
graph['peggy'] = ['bob']
```

The ordering of which you add to the graph doesn't matter as hash tables do not have ordering. This is an example of a Directed Graph, where two nodes can have 'directed' relationships, e.g. A -> B. Alice points to Peggy, but Peggy doesn't point back to Alice.

## Implementing the algorithm
1. Keep a queue of items
2. Dequeue an item
3. Check if the item meets the condition
4. Does it meet the connection?
    a. meets condition `END`
    b. Add all connected nodes to the condition
5. Loop
6. If the queue is empty then `END`.

```py
from collections import deque

# example graph
graph = {}
graph['you'] = ['alice', 'bob', 'claire']
graph['bob'] = ['anuj', 'peggy']
graph['alice'] = ['peggy']
graph['claire'] = ['thom', 'jonny']
graph['anuj'] = []
graph['peggy'] = []
graph['thom'] = []
graph['jonny'] = []

def person_is_seller(name):
  '''Silly example - If the name ends w. 'm' then seller'''
  return name[-1] == 'm'

def bfs_search(name):
  search_queue = deque() # create queue
  search_queue += graph["you"]
  searched = []

  # while the queue isn't empty, get the first item check
  while search_queue:
    person = search_queue.popleft()
    if not person in searched:
      if person_is_seller(person):
        print(person + " is a mango seller!")
        return True
      else:
        search_queue += graph[person]
  return False

bfs_search('you')
```

## Run Time
Searching each vertice (V) plus adding a person (Edge) to a queue will take O(V+E).


# 7. Dijkstra's Algorithm
In contrast to BFS which finds the fewest vertices between two nodes. Dijkstra's algorithm uses graphs that have weights (e.g. travel time between two points) finds the smallest total weight between two nodes. Dijkstra's Algorithm has 4 steps:
1. Find the cheapest node
2. Check if there's a cheaper path to the neighbours of the cheapest nodes, if so update their costs.
3. Repeat for all nodes in the graph.
4. Calculate final path.

N.B. - Dijkstra's algorithm only works with directed acyclic graph (DAGs).
- You can only use positive weights for negatively weighted graphs see the  [Bellman-Ford algorithm](https://en.wikipedia.org/wiki/Bellman%E2%80%93Ford_algorithm).

## Implementation
```py
# wieghted graph
graph['start'] = {}
graph['start']['a'] = 6
graph['start']['b'] = 2
graph['a'] = {}
graph['a']['fin'] = 1
graph['b'] = {}
graph['b']['a'] = 3
graph['b']['fin'] = 5
graph['fin'] = {}

# graph for updating costs
infinity = float('inf')
costs = {}
costs['a'] = 6
costs['b'] = 2
costs['fin'] = infinity

# hash table for parents
parents = {}
parents['a'] = 'start'
parents['b'] = 'start'
parents['fin'] = None

# array to track processed nodes
processed = []

def find_lowest_cost_node(costs):
  lowest_cost = float('inf')
  lowest_cost_node = None
  # Go through each node.
  for node in costs:
    cost = costs[node]
    # If it’s the lowest cost so far and hasn’t been processed
    if cost < lowest_cost and node not in processed:
      # set it as the new lowest-cost node.
      lowest_cost = cost
      lowest_cost_node = node
  return lowest_cost_node

# find the lowest cost node that you haven’t processed yet.
node = find_lowest_cost_node(costs)

while node is not None:
  cost = costs[node]
  neighbors = graph[node]
  # go through all the neighbors of this node.
  for n in neighbors.keys():
    new_cost = cost + neighbors[n]
    # If it’s cheaper to get to this neighbor by going through this node
    # update the cost for this node.
    if costs[n] > new_cost:
        costs[n] = new_cost
        # this node becomes the new parent for this neighbor
        parents[n] = node
    # mark the node as processed.
  processed.append(node)
  # Find the next node to process, and loop.
  node = find_lowest_cost_node(costs)
```

# 8. Greedy Algorithms
>Greedy algorithms optimize locally, hoping to end up with a global optimum. Greedy algorithms are easy to write and fast to run, so they make good approximation algorithms.

## The Classroom Scheduling problem
With overlapping classroom run times how does one maximise the amount of classes to be held? The algorithm is very simple:
1. Pick the class that ends the soonest, this will be the first class.
2. Now pick a class that starts after the first class and ends the soonest. Repeat.

## The Knapsack problem
You are trying to maximise the value of the items one can place in a small bag 35lbs. The items are:
- Stereo $3000 30lbs
- Laptop $2000 20lbs
- Guitar $1500 15lbs

The greedy strategy is to take the most expensive item. Buut the stereo leaves room for nothing else. $3000 get's pretty close to the optimal solution of $3500 (Laptop + Guitar).

## The Set Covering Problem
You want to broadcast a radio show in the USA and reach listeners in all states. To minimise cost you want to minimise the number of stations you have to pay whilst maximising the states they broadcast to.
1. To list every possible subset of stations is called the *power set*.
2. From this pick the set with the smallest number of stations that covers all 50 states.

Calculating the power set is a O(2<sup>n</sup>) problem. If there are only 32 stations it would take 13.6 years to calculate at 10 subsets a second.

## Approximation Algorithms
A greedy algorithm will get close to the optimal solution with much less computation, e.g.:
1. Pick a station that covers the most stations.
2. Repeat until all states are covered.
N.b some overlap will occur.

An approximation algorithm is judged on speed and how close the optimal solution they get.

### Python set operations
```py
>>> fruits = set([“avocado”, “tomato”, “banana”])
>>> vegetables = set([“beets”, “carrots”, “tomato”])

# This is a set union.
>>> fruits | vegetables
set([“avocado”, “beets”, “carrots”, “tomato”, “banana”])

# This is a set intersection.
>>> fruits & vegetables
set([“tomato”])

# This is a set difference.
>>> fruits – vegetables
set([“avocado”, “banana”])
```

The greedy solution to the state problem:
```py
states_needed = set(['mt', 'wa', 'or', 'id', 'nv', 'ut', 'ca', 'az'])

stations = {}
stations['kone'] = set(['id', 'nv', 'ut'])
stations['ktwo'] = set(['wa', 'id', 'mt'])
stations['kthree'] = set(['or', 'nv', 'ca'])
stations['kfour'] = set(['nv', 'ut'])
stations['kfive'] = set(['ca', 'az'])

final_stations = set()

while states_needed:
  best_station = None
  states_covered = set()

  for station, states_for_station in stations.items():
    # states that in both needed and for_station
    covered = states_needed & states_for_station

    # check this station covers more than the current best station if so, assign as the new best station
    if len(covered) > len(states_covered):
      best_station = station
      states_covered = covered

  final_stations.add(best_station) # add to list of stations
  states_needed -= states_covered # rm states covered from those needed

print(final_stations)
# {'kfive', 'kone', 'kthree', 'ktwo'}
```

## NP-Complete Problems
### Traveling Salesperson
Problem: A salesperson has to find the shortest distance when traveling to say 5 cities.

For each additional cities the number goes up in a factorial fashion, here's an an example:

>1 start city * 1 route = 1 total route
2 start cities * 1 route = 2 total routes
3 start cities * 2 route = 6 total routes
4 start cities * 6 route = 24 total routes
5 start cities * 24 route = 120 total routes
6 start cities * 120 route = 720 total routes
...
10 start cities * 362,880 route = 3,628,800 total routes

A good approximation algorithm would be to pick an arbitrary starting city and pick the closest non-visited city next.

### How to tell if a problem is NP complete?
There's no easy way! Here's some clues:
- Runs fine with small n, but slow with big n
- "All combinations of X" / can't be broken into smaller problems
- Problem that involve sequences e.g. cities
- Problem that involve sets e.g. radio stations

In short:
- Greedy algorithms optimise locally, hopefully it will be a global optimum
- NP complete problems have no known fast solution
- Approximation algorithms including greedy algorithms are used to solve NP complete problems


# 9. Dynamic Programming
## The Knapsack Problem (revisited)
You're a thief with Knapsack capacity of 4kgs. There are 3 items to steal:
- Stereo $3000 4kgs
- Laptop $2000 3kgs
- Guitar $1500 1kg

The simplest algorithm would be to calculate every possible set of goods. However this doesn't scale, O(2<sup>n</sup>). The optimal solution can be calculated using dynamic programming.

#### Dynamic Programming Steps:
- start by solving subproblems and builds up to solving the big problem
- start with a grid
- fill each row out
- for rows beyond the first row the cell above is the current max for that column. Check the current row's item + remaining space is > than the previous max. e.g. at cell [stereo][4kg] previous max is $1500. Placing the Stereo in the bag is greater than the previous max so this is the solution for this cell.

#### Returning to the knapsack problem.
Make a grid where items go down one side and knapsack weights go down the other

If we start with the Guitar and ignore the rest of the products we can fill out the top row with the most value we can steal quite easily. This becomes our current best guess.

<div class='twrap'>

|                   | 1kg   | 2kg   | 3kg   | 4kg   |
| :---------------- | :---- | :---- | :---- | :---- |
| Guitar $1500 1kg  | $1500 | $1500 | $1500 | $1500 |
| Stereo $3000 4kgs |       |       |       |       |
| Laptop $2000 3kgs |       |       |       |       |

</div>

With the Stereo, it can't fit in any bag smaller than 4kg. Therefore, we can take the value from the cell immediately above for columns <4kg. In the 4kg column, the value is $3000 as that is much better than taking the Guitar at half the Stereo's value.


<div class='twrap'>

|                   | 1kg   | 2kg   | 3kg   | 4kg   |
| :---------------- | :---- | :---- | :---- | :---- |
| Guitar $1500 1kg  | $1500 | $1500 | $1500 | $1500 |
| Stereo $3000 4kgs | $1500 | $1500 | $1500 | $3000 |
| Laptop $2000 3kgs |       |       |       |       |

</div>

For the Laptop, it can't fit in any bag <3kg. So we drop down the values from the cell immediately above. At 3kg, taking the Laptop at $2000 is better than the cell value immediately above. Lastly, at 4kg *only* taking the laptop would be less than the value above of $3000. However, if we took the Laptop wit hthe 4kg bag, we would have 1kg left over. What's the best possible thing we could take at 1kg - a Guitar. Therefore, the optimal solution for 4kg is a Laptop + Guitar.

<div class='twrap'>

|                   | 1kg   | 2kg   | 3kg   | 4kg   |
| :---------------- | :---- | :---- | :---- | :---- |
| Guitar $1500 1kg  | $1500 | $1500 | $1500 | $1500 |
| Stereo $3000 4kgs | $1500 | $1500 | $1500 | $3000 |
| Laptop $2000 3kgs | $1500 | $1500 | $2000 | $3500 |

</div>

## Dynamic Programming FAQs
#### What happens if you add another item?
All previously calculated values stay the same. You just work out the new rows values.

#### What happens if you add a smaller item e.g. necklace 0.5kg?
For original problem, the column increments were set on the smallest product weight, the Guitar at 1kg. To include a necklace, the columns would need to increment by 0.5kg starting at 0.5kg and ending at the max bag capacity 4kg.

#### Can you steal fractions of an item?
Using dynamic programming, no. But you could with a greedy algorithm.

#### Can DP handle items that depend on each other?
No.
> Dynamic programming only works when each subproblem is discrete - when it doesn't depend on other subproblems.

## Longest common substring
Suppose you need to create a search functionality on a website, and you want to have search suggestions when someone makes a typo. For example, someone types `hish` when they probably mean `fish`. How would you use DP to solve the problem? *There is no formula, but DP should provide a framework to develop your idea.*


|     | H   | I   | S   | H   |
| :-- | :-- | :-- | :-- | :-- |
| **F**   | 0   | 0   | 0   | 0   |
| **I**   | 0   | 1   | 0   | 0   |
| **S**   | 0   | 0   | 2   | 0   |
| **H**   | 0   | 0   | 0   | 3   |

1. If the letters don't match, then 0
2. If they do match, then the value is the top-left neighbor + 1

DP is used in the following applications:
- DNA sequencing, *how similar are two animals DNA?*
- `git diff`
- string similarity problems, *Levenshtein distance* applied to spell check to determining the amount of copyright content is in something uploaded.

## DP Takeaways
- DP is useful when you're trying to optimise something given a constraint
- DP is usable when the problem can be divided into discrete subproblems
- DP solutions always involve a grid
- each cell is a subproblem
- there is no single formula for DP solutions

# 10. K-Nearest Neighbours
You need to classify citrus fruit into oranges or grapefruits.

![](/content/images/2020/knn.svg)

To make a decision, you could see what the 3 nearest neighbours were, and which ever has the majority vote will classify the mystery fruit.

This can be generalised to any number of variables (i.e. features), in the above example there was only size and colour. So figuring out the distance between two points would be done by:

<math xmlns="http://www.w3.org/1998/Math/MathML"><mstyle displaystyle="true"><mi>d</mi><mo>=</mo><msqrt><mrow><msup><mrow><mo>(</mo><msub><mi>x</mi><mn>1</mn></msub><mo>-</mo><msub><mi>x</mi><mn>2</mn></msub><mo>)</mo></mrow><mrow><mn>2</mn></mrow></msup><mo>+</mo><msup><mrow><mo>(</mo><msub><mi>y</mi><mn>1</mn></msub><mo>-</mo><msub><mi>y</mi><mn>2</mn></msub><mo>)</mo></mrow><mrow><mn>2</mn></mrow></msup></mrow></msqrt></mstyle></math>

This expands to as many variables as required.

<math xmlns="http://www.w3.org/1998/Math/MathML"><mstyle displaystyle="true"><mi>d</mi><mo>=</mo><msqrt><mrow><msup><mrow><mo>(</mo><msub><mi>x</mi><mn>1</mn></msub><mo>-</mo><msub><mi>x</mi><mn>2</mn></msub><mo>)</mo></mrow><mrow><mn>2</mn></mrow></msup><mo>+</mo><msup><mrow><mo>(</mo><msub><mi>y</mi><mn>1</mn></msub><mo>-</mo><msub><mi>y</mi><mn>2</mn></msub><mo>)</mo></mrow><mrow><mn>2</mn></mrow></msup><mo>+</mo><msup><mrow><mo>(</mo><msub><mi>z</mi><mn>1</mn></msub><mo>-</mo><msub><mi>z</mi><mn>2</mn></msub><mo>)</mo></mrow><mrow><mn>2</mn></mrow></msup><mo>+</mo><mo>...</mo><mi>e</mi><mi>t</mi><mi>c</mi></mrow></msqrt></mstyle></math>

N.B. There were two more sections to this chapter *Regression* and *Intro to ML* which were very basic and not worth summarising.

# 11. Where To Go Next
This chapter does a very basic introduction to Binary Search Trees, Inverted Indexes, Fourier Transform, Parallel Algorithms, Map Reduce, Bloom Filters and a few others. They are summaries themselves.

## Other references
- [js Algorithms](https://github.com/trekhleb/javascript-algorithms)
- [Animation of Algs from the book publisher](https://www.youtube.com/watch?v=oo_sb4luiPo)
