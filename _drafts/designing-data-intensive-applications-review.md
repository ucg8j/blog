---
title: Designing Data Intensive Applications Review
permalink: /designing-data-intensive-applications-review/
slug: designing-data-intensive-applications-review
date: 2021-06-18
tags: book, review, software
excerpt: 
layout: layouts/post.njk
---

📚 Book: [Designing Data-Intensive Applications: The Big Ideas Behind Reliable, Scalable, and Maintainable Systems]()

⭐️ Rating: 

![]()

# PART 1
## Chapter 1
Walks through example of Twitter and the bootlenecks being faced. Tradeoff between work done at write vs read time. As the main demand is on twitter timelines (read), work to insert new tweets into Twitter timeline caches is done at write time.

### Notes
3 concerns of the book
- Reliability
- Scalability
- Maintainability

>Latency and response time are often used synonymously, but they are not the same. The response time is what the client sees: besides the actual time to process the request (the service time ), it includes network delays and queueing delays. Latency is the duration that a request is waiting to be handled during which it is latent, awaiting service Even if you only make the same request over and over again, you’ll get a slightly different response time on every try. In practice, in a system handling a variety of requests, the response time can vary a lot. We therefore need to think of response time not as a single number, but as a distribution of values that you can measure.

>High percentiles become especially important in backend services that are called multiple times as part of serving a single end-user request. Even if you make the calls in parallel, the end-user request still needs to wait for the slowest of the parallel calls to complete. It takes just one slow call to make the entire end-user request slow, as illustrated in Figure 1-5 . Even if only a small percentage of backend calls are slow, the chance of getting a slow call increases if an end-user request requires multiple backend calls, and so a higher proportion of end-user requests end up being slow (an effect known as tail latency amplification [ 24 ]).

>People often talk of a dichotomy between scaling up ( vertical scaling , moving to a more powerful machine) and scaling out ( horizontal scaling , distributing the load across multiple smaller machines). Distributing load across multiple machines is also known as a shared-nothing architecture. A system that can run on a single machine is often simpler, but high-end machines can become very expensive, so very intensive workloads often can’t avoid scaling out. In reality, good architectures usually involve a pragmatic mixture of approaches: for example, using several fairly powerful machines can still be simpler and cheaper than a large number of small virtual machines. 

>the majority of the cost of software is not in its initial development, but in
its ongoing maintenance fixing bugs, keeping its systems operational, investigating failures,
adapting it to new platforms, modifying it for new use cases, repaying technical debt, and adding
new features.


>One of the best tools we have for removing accidental complexity is abstraction . A good
abstraction can hide a great deal of implementation detail behind a clean, simple-to-understand
façade. A good abstraction can also be used for a wide range of different applications. Not only is
this reuse more efficient than reimplementing a similar thing multiple times, but it also leads to
higher-quality software, as quality improvements in the abstracted component benefit all
applications that use it. 

### Chapter 2

>Data models are perhaps the most important part of developing software, because they have such a
profound effect: not only on how the software is written, but also on how we think about the problem that we are solving. 

>The name “NoSQL” is unfortunate, since it doesn’t actually refer to any particular technology it was
originally intended simply as a catchy Twitter hashtag for a meetup on open source, distributed, nonrelational
databases in 2009 [ 3 ]. 

>There is a one-to-many relationship from the user to these items, which can be represented in various ways:
- In the traditional SQL model (prior to SQL:1999), the most common normalized representation is to
put positions, education, and contact information in separate tables, with a foreign key reference
to the users table, as in Figure 2-1 .
- Later versions of the SQL standard added support for structured datatypes and XML data;
this allowed multi-valued data to be stored within a single row, with support for querying and
indexing inside those documents. These features are supported to varying degrees by Oracle, IBM
DB2, MS SQL Server, and PostgreSQL. A JSON datatype is also supported by several databases, including IBM DB2, MySQL, and PostgreSQL
- A third option is to encode jobs, education, and contact info as a JSON or XML document, store it on a text column
in the database, and let the application interpret its structure and content. In this setup,
you typically cannot use the database to query for values inside that encoded column.

The advantage of using an ID is that because it has no meaning to humans, it never needs to change:
the ID can remain the same, even if the information it identifies changes. Anything that is
meaningful to humans may need to change sometime in the future and if that information is duplicated,
all the redundant copies need to be updated. That incurs write overheads, and risks
inconsistencies (where some copies of the information are updated but others aren’t). Removing such
duplication is the key idea behind normalization in
databases. 

If the database itself does not support joins, you have to emulate a join in application code by
making multiple queries to the database. (In this case, the lists of regions and industries are
probably small and slow-changing enough that the application can simply keep them in memory. But
nevertheless, the work of making the join is shifted from the database to the application code.) 

#### Relational Versus Document Databases Today
>The main arguments in favor of the document data model are schema flexibility, better performance
due to locality, and that for some applications it is closer to the data structures used by the
application. The relational model counters by providing better support for joins, and many-to-one
and many-to-many relationships. 

*Which data model leads to simpler application code?*

>If the data in your application has a document-like structure (i.e., a tree of one-to-many
relationships, where typically the entire tree is loaded at once), then it’s probably a good idea to
use a document model. The relational technique of shredding splitting a document-like structure
into multiple tables (like positions , education , and contact_info in
Figure 2-1 ) can lead to cumbersome schemas and unnecessarily complicated
application code. 

>However, if your application does use many-to-many relationships, the document model becomes less
appealing. It’s possible to reduce the need for joins by denormalizing, but then the application
code needs to do additional work to keep the denormalized data consistent. Joins can be emulated in
application code by making multiple requests to the database, but that also moves complexity into
the application and is usually slower than a join performed by specialized code inside the
database. In such cases, using a document model can lead to significantly more complex application
code and worse performance 

>For highly interconnected data, the document model is awkward, the relational model is acceptable, and graph models (see
“Graph-Like Data Models” ) are the most natural. 

*Schema flexibility in the document model*

>Document databases are sometimes called schemaless , but that’s misleading, as the code that reads
the data usually assumes some kind of structure i.e., there is an implicit schema, but it is not
enforced by the database [ 20 ]. A more accurate term is schema-on-read (the structure
of the data is implicit, and only interpreted when the data is read), in contrast with
schema-on-write (the traditional approach of relational databases, where the schema is explicit
and the database ensures all written data conforms to it)

>The difference between the approaches is particularly noticeable in situations where an application
wants to change the format of its data. For example, say you are currently storing each user’s full
name in one field, and you instead want to store the first name and last name separately.

In a document database, you would just start writing new documents with the new fields and have
code in the application that handles the case when old documents are read. For example:
```js
if ( user && user . name && ! user . first_name ) {
  // Documents written before Dec 8, 2013 don't have first_name user.
  first_name = user . name . split ( " " )[ 0 ];
} 
```
On the other hand, in a “statically typed” database schema, you would typically perform a migration along the lines of:
```sql
ALTER TABLE users ADD COLUMN first_name text ;
UPDATE users SET first_name = split_part ( name , ' ' , 1 ); -- PostgreSQL
```

*Data locality for queries*

A document is usually stored as a single continuous string, encoded as JSON, XML, or a binary variant
thereof (such as MongoDB’s BSON). If your application often needs to access the entire document
(for example, to render it on a web page), there is a performance advantage to this storage
locality . If data is split across multiple tables, like in Figure 2-1 , multiple
index lookups are required to retrieve it all, which may require more disk seeks and take more time. 

The locality advantage only applies if you need large parts of the document at the same time. The
database typically needs to load the entire document, even if you access only a small portion of it,
which can be wasteful on large documents. On updates to a document, the entire document usually
needs to be rewritten only modifications that don’t change the encoded size of a document can
easily be performed in place [ 19 ]. For these
reasons, it is generally recommended that you keep documents fairly small and avoid writes that
increase the size of a document [ 9 ]. These
performance limitations significantly reduce the set of situations in which document databases are
useful. 

#### Query Languages for Data 
Many commonly used programming languages are imperative. For example, if you have a list of animal
species, you might write something like this to return only the sharks in the list:
```js
function getSharks () {
  var sharks = [];
  for ( var i = 0 ; i < animals . length ; i ++ ) {
    if ( animals [ i ].family === "Sharks") {
      sharks.push( animals[ i ]); 
      }
    }
    return sharks;
}
```
In the relational algebra, you would instead write:

sharks = σ<sub>family = “Sharks”</sub> (animals)

where σ (the Greek letter sigma) is the selection operator, returning only those animals that
match the condition family = “Sharks” . When SQL was defined, it followed the structure of the relational algebra fairly closely: SELECT * FROM animals WHERE family = 'Sharks' ; An imperative language tells the computer to perform certain operations in a certain order. You can
imagine stepping through the code line by line, evaluating conditions, updating variables, and
deciding whether to go around the loop one more time. In a declarative query language, like SQL or relational algebra, you just specify the pattern of the
data you want what conditions the results must meet, and how you want the data to be transformed (e.g.,
sorted, grouped, and aggregated) but not how to achieve that goal. It is up to the database
system’s query optimizer to decide which indexes and which join methods to use, and in which order
to execute various parts of the query. 


Finally, declarative languages often lend themselves to parallel execution. Today, CPUs are getting
faster by adding more cores, not by running at significantly higher clock speeds than before
[ 31 ].
Imperative code is very hard to parallelize across multiple cores and multiple machines, because it
specifies instructions that must be performed in a particular order. Declarative languages have a
better chance of getting faster in parallel execution because they specify only the pattern of the
results, not the algorithm that is used to determine the results. The database is free to use a
parallel implementation of the query language, if appropriate

>MapReduce is a fairly low-level programming model for distributed execution on a cluster of
machines. Higher-level query languages like SQL can be implemented as a pipeline of MapReduce
operations (see Chapter 10 ), but there are also many distributed implementations of SQL that don’t
use MapReduce. Note there is nothing in SQL that constrains it to running on a single machine, and
MapReduce doesn’t have a monopoly on distributed query execution. 

#### Graph-Like Data Models
If your application has mostly one-to-many relationships (tree-structured
data) or no relationships between records, the document model is appropriate. But what if many-to-many relationships are very common in your data? The relational model can handle
simple cases of many-to-many relationships, but as the connections within your data become more
complex, it becomes more natural to start modeling your data as a graph. 

(summary)
Historically, data started out being represented as one big tree (the hierarchical model), but that
wasn’t good for representing many-to-many relationships, so the relational model was invented to
solve that problem. More recently, developers found that some applications don’t fit well in the
relational model either. New nonrelational “NoSQL” datastores have diverged in two main
directions: Document databases target use cases where data comes in self-contained documents and
relationships between one document and another are rare.
Graph databases go in the opposite direction, targeting use cases where anything is potentially
related to everything.
All three models (document, relational, and graph) are widely used today, and each is good in its
respective domain. One model can be emulated in terms of another model for example, graph data can
be represented in a relational database but the result is often awkward. That’s why we have
different systems for different purposes, not a single one-size-fits-all solution. One thing that document and graph databases have in common is that they typically don’t enforce a
schema for the data they store, which can make it easier to adapt applications to changing
requirements. However, your application most likely still assumes that data has a certain structure;
it’s just a question of whether the schema is explicit (enforced on write) or implicit (handled on
read). 

### Chapter 3
>An index is an additional structure that is derived from the primary data. Many databases allow
you to add and remove indexes, and this doesn’t affect the contents of the database; it only affects
the performance of queries. Maintaining additional structures incurs overhead, especially on writes. For
writes, it’s hard to beat the performance of simply appending to a file, because that’s the simplest
possible write operation. Any kind of index usually slows down writes, because the index also needs
to be updated every time data is written. This is an important trade-off in storage systems: well-chosen indexes speed up read queries, but
every index slows down writes. For this reason, databases don’t usually index everything by default,
but require you the application developer or database administrator to choose indexes
manually, using your knowledge of the application’s typical query patterns. You can then choose the
indexes that give your application the greatest benefit, without introducing more overhead than
necessary. 

*Hash Indexes*

>Key-value stores are quite similar to the dictionary type that you can find in most programming languages, and which is usually implemented as a hash map (hash table)... Since we already have hash maps for our in-memory data structures, why not use them to index our data on disk? Let’s say our data storage consists only of appending to a file, as in the preceding example. Then the simplest possible indexing strategy is this: keep an in-memory hash map where every key is mapped to a byte offset in the data file the location at which the value can be found... Whenever you append a new key-value pair to the file, you also update the hash map to reflect the offset of the data you just wrote (this works both for inserting new keys and for updating existing keys). When you want to look up a value, use the hash map to find the offset in the data file, seek to that location, and read the value.

>As described so far, we only ever append to a file so how do we avoid eventually running out of disk space? A good solution is to break the log into segments of a certain size by closing a segment file when it reaches a certain size, and making subsequent writes to a new segment file. We can then perform compaction on these segments, as illustrated in Figure 3-2 . Compaction means throwing away duplicate keys in the log, and keeping only the most recent update for each key. Figure 3-2. Compaction of a key-value update log (counting the number of times each cat video was played), retaining only the most recent value for each key. Moreover, since compaction often makes segments much smaller (assuming that a key is overwritten
several times on average within one segment), we can also merge several segments together at the same time as performing the compaction, as shown in Figure 3-3. Segments are never modified after they have been written, so the merged segment is written to a new file. The merging and compaction of frozen segments can be done in a background thread, and while it is going on, we can still continue to serve read and write requests as normal, using the old segment files. After the merging process is complete, we switch read requests to using the new merged segment instead of the old segments and then the old segment files can simply be deleted.

>the hash table index also has limitations: The hash table must fit in memory, so if you have a very large number of keys, you’re out of luck. In principle, you could maintain a hash map on disk, but unfortunately it is difficult to make an on-disk hash map perform well. It requires a lot of random access I/O, it is expensive to grow when it becomes full, and hash collisions require fiddly logic. Range queries are not efficient. For example, you cannot easily scan over all keys between kitty00000 and kitty99999 you’d have to look up each key individually in the hash maps.

>each log-structured storage segment is a sequence of key-value pairs.
These pairs appear in the order that they were written, and values later in the log take precedence
over values for the same key earlier in the log. Apart from that, the order of key-value pairs in
the file does not matter. Now we can make a simple change to the format of our segment files: we require that the sequence of
key-value pairs is sorted by key . At first glance, that requirement seems to break our ability to
use sequential writes, but we’ll get to that in a moment. We call this format Sorted String Table , or SSTable for short. We also require that each key
only appears once within each merged segment file (the compaction process already ensures that).
SSTables have several big advantages over log segments with hash indexes: 
**TODO - summarise the advantages**

*B Trees*

The log-structured indexes we have discussed so far are gaining acceptance, but they are not the
most common type of index. The most widely used indexing structure is quite different: the B-tree . Introduced in 1970 [ 17 ] and called “ubiquitous” less than 10 years later
[ 18 ],
B-trees have stood the test of time very well. They remain the standard index implementation in
almost all relational databases, and many nonrelational databases use them too. Like SSTables, B-trees keep key-value pairs sorted by key, which allows efficient key-value lookups
and range queries. 

Each page can be identified using an address or location, which allows one page to refer to
another similar to a pointer, but on disk instead of in memory. 

>One page is designated as the root of the B-tree; whenever you want to look up a key in the index,
you start here. The page contains several keys and references to child pages.
Each child is responsible for a continuous range of keys, and the keys between the references indicate
where the boundaries between those ranges lie. In the example in Figure 3-6 , we are looking for the key 251, so we know that we need to
follow the page reference between the boundaries 200 and 300. That takes us to a similar-looking
page that further breaks down the 200–300 range into subranges. Eventually we get down to a
page containing individual keys (a leaf page ), which either contains the value for each key
inline or contains references to the pages where the values can be found. The number of references to child pages in one page of the B-tree is called the branching factor .

>If you want to update the value for an existing key in a B-tree, you search for the leaf page
containing that key, change the value in that page, and write the page back to disk (any references
to that page remain valid). If you want to add a new key, you need to find the page whose range
encompasses the new key and add it to that page. If there isn’t enough free space in the page to
accommodate the new key, it is split into two half-full pages, and the parent page is updated to
account for the new subdivision of key ranges see
Figure 3-7 . ii Figure 3-7. Growing a B-tree by splitting a page. This algorithm ensures that the tree remains balanced : a B-tree with n keys always has a depth
of O (log  n ). Most databases can fit into a B-tree that is three or four levels deep, so
you don’t need to follow many page references to find the page you are looking for. (A four-level
tree of 4 KB pages with a branching factor of 500 can store up to 256 TB.) 

>A compromise between a clustered index (storing all row data within the index) and a nonclustered
index (storing only references to the data within the index) is known as a covering index or
index with included columns , which stores some of a table’s columns within the index
[ 33 ].
This allows some queries to be answered by using the index alone (in which case, the index is said
to cover the query) [ 32 ]. As with any kind of duplication of data, clustered and covering indexes can speed up reads, but they
require additional storage and can add overhead on writes. Databases also need to go to additional
effort to enforce transactional guarantees, because applications should not see inconsistencies due
to the duplication. 

>Counterintuitively, the performance advantage of in-memory databases is not due to the fact that
they don’t need to read from disk. Even a disk-based storage engine may never need to read from disk
if you have enough memory, because the operating system caches recently used disk blocks in memory
anyway. Rather, they can be faster because they can avoid the overheads of encoding in-memory data
structures in a form that can be written to disk

#### Transaction Processing or Analytics? 

At first, the same databases were used for both transaction processing and analytic queries. SQL
turned out to be quite flexible in this regard: it works well for OLTP-type queries as well as
OLAP-type queries. Nevertheless, in the late 1980s and early 1990s, there was a trend for companies
to stop using their OLTP systems for analytics purposes, and to run the analytics on a separate
database instead. This separate database was called a data warehouse . 


| Property             | Transactions Processing OLTP                      | Analytics OLAP                            |
| -------------------- | ------------------------------------------------- | ----------------------------------------- |
| Main read pattern    | Small number of records per query, fetched by key | Aggregate over large number of records    |
| Main write pattern   | Random-access, low-latency writes from user input | Bulk import (ETL) or event stream         |
| Primarily used by    | End user/customer, via web application            | Internal analyst, for decision support    |
| What data represents | Latest state of data (current point in time)      | History of events that happened over time |
| Dataset size         | Gigabytes to terabytes                            | Terabytes to petabytes                    |

OLTP systems are usually expected to be highly available and to process transactions with low
latency, since they are often critical to the operation of the business. Database administrators
therefore closely guard their OLTP databases. They are usually reluctant to let business analysts
run ad hoc analytic queries on an OLTP database, since those queries are often expensive, scanning
large parts of the dataset, which can harm the performance of concurrently executing transactions. A data warehouse , by contrast, is a separate database that analysts can query to their hearts’
content, without affecting OLTP operations
[ 48 ].
The data warehouse contains a read-only copy of the data in all the various OLTP systems in the
company. Data is extracted from OLTP databases (using either a periodic data dump or a continuous
stream of updates), transformed into an analysis-friendly schema, cleaned up, and then loaded into
the data warehouse. 
Data warehouses now exist in almost all large enterprises, but in small companies they are almost
unheard of. This is probably because most small companies don’t have so many different OLTP systems,
and most small companies have a small amount of data small enough that it can be queried in a
conventional SQL database, or even analyzed in a spreadsheet. In a large company, a lot of heavy
lifting is required to do something that is simple in a small company. 

For data warehouse queries that need to scan over millions of rows, a big bottleneck is the
bandwidth for getting data from disk into memory. However, that is not the only bottleneck.
Developers of analytical databases also worry about efficiently using the bandwidth from
main memory into the CPU cache, avoiding branch mispredictions and bubbles in the CPU instruction
processing pipeline, and making use of single-instruction-multi-data (SIMD) instructions in modern
CPUs [ 59 ,
60 ]. Besides reducing the volume of data that needs to be loaded from disk, column-oriented storage
layouts are also good for making efficient use of CPU cycles. For example, the query engine can take
a chunk of compressed column data that fits comfortably in the CPU’s L1 cache and iterate through
it in a tight loop (that is, with no function calls). A CPU can execute such a loop much faster than code
that requires a lot of function calls and conditions for each record that is processed. Column
compression allows more rows from a column to fit in the same amount of L1 cache. Operators, such as
the bitwise AND and OR described previously, can be designed to operate on such chunks of
compressed column data directly. This technique is known as vectorized processing 


## Chapter 4 - Enconding and Evolution

### Protocol Buffers (protobuf)
- uses binary encoding
- require a schema (to decode), a valuable source of documentation
- enables code generation fo statically typed languages
- an e.g. JSON of 81 bytes, encoded as a protobuf is 33 bytes

APIs frequently use JSON, readability is a big factor here. Internally to an org, this might be less of a concern and speed of data transfer likely higher - hence the use of binary encoding formats like protobufs.

## Quotes
>Programs usually work with data in (at least) two different representations: In memory, data is kept in objects, structs, lists, arrays, hash tables, trees, and so on. These
data structures are optimized for efficient access and manipulation by the CPU (typically using
pointers).
When you want to write data to a file or send it over the network, you have to encode it as some
kind of self-contained sequence of bytes (for example, a JSON document). Since a pointer wouldn’t
make sense to any other process, this sequence-of-bytes representation looks quite different from
the data structures that are normally used in
memory. 

Java has java.io.Serializable [ 1 ], Ruby has Marshal [ 2 ], Python has pickle [ 3 ],
and so on. Many third-party libraries also exist, such as Kryo for Java
[ 4 ]. These encoding libraries are very convenient, because they allow in-memory objects to be saved and
restored with minimal additional code. However, they also have a number of deep problems: The encoding is often tied to a particular programming language, and reading the data in another
language is very difficult. If you store or transmit data in such an encoding, you are committing
yourself to your current programming language for potentially a very long time, and precluding
integrating your systems with those of other organizations (which may use different languages).
In order to restore data in the same object types, the decoding process needs to be able to
instantiate arbitrary classes. This is frequently a source of security problems
[ 5 ]: if an attacker can get your application to decode an arbitrary
byte sequence, they can instantiate arbitrary classes, which in turn often allows them to do
terrible things such as remotely executing arbitrary code
[ 6 ,
7 ].
Versioning data is often an afterthought in these libraries: as they are intended for quick and
easy encoding of data, they often neglect the inconvenient problems of forward and backward
compatibility.
Efficiency (CPU time taken to encode or decode, and the size of the encoded structure) is also
often an afterthought. For example, Java’s built-in serialization is notorious for its bad
performance and bloated encoding [ 8 ].
For these reasons it’s generally a bad idea to use your language’s built-in encoding for anything
other than very transient purposes. 

### JSON, XML, and Binary Variants 
JSON, XML, and CSV are textual formats, and thus somewhat human-readable (although the syntax is a
popular topic of debate). Besides the superficial syntactic issues, they also have some subtle
problems:
- There is a lot of ambiguity around the encoding of numbers. In XML and CSV, you cannot distinguish
between a number and a string that happens to consist of digits (except by referring to an external
schema). JSON distinguishes strings and numbers, but it doesn’t distinguish integers and
floating-point numbers, and it doesn’t specify a precision.
- JSON and XML have good support for Unicode character strings (i.e., human-readable text), but they
don’t support binary strings (sequences of bytes without a character encoding). Binary strings are a
useful feature, so people get around this limitation by encoding the binary data as text using
Base64. The schema is then used to indicate that the value should be interpreted as Base64-encoded.
This works, but it’s somewhat hacky and increases the data size by 33%.

Protocol Buffers rely on code generation: after a schema has been defined, you can
generate code that implements this schema in a programming language of your choice. This is useful
in statically typed languages such as Java, C++, or C#, because it allows efficient in-memory
structures to be used for decoded data, and it allows type checking and autocompletion in IDEs when
writing programs that access the data structures. 

### Dataflow Through Services: REST and RPC 
>In some ways, services are similar to databases: they typically allow clients to submit and query
data. However, while databases allow arbitrary queries using the query languages we discussed in
Chapter 2 , services expose an application-specific API that only allows inputs and outputs
that are predetermined by the business logic (application code) of the service
[ 33 ]. This restriction provides a degree of encapsulation: services can impose
fine-grained restrictions on what clients can and cannot do. A key design goal of a service-oriented/microservices architecture is to make the application easier
to change and maintain by making services independently deployable and evolvable. For example, each
service should be owned by one team, and that team should be able to release new versions of the
service frequently, without having to coordinate with other teams. In other words, we should expect
old and new versions of servers and clients to be running at the same time, and so the data encoding
used by servers and clients must be compatible across versions of the service API precisely what
we’ve been talking about in this chapter. 

>REST is not a protocol, but rather a design philosophy that builds upon the principles of HTTP
[ 34 , 35 ].
It emphasizes simple data formats, using URLs for identifying resources and using HTTP features for
cache control, authentication, and content type negotiation. REST has been gaining popularity
compared to SOAP, at least in the context of cross-organizational service integration
[ 36 ],
and is often associated with microservices
[ 31 ]. An API designed according to the
principles of REST is called RESTful . By contrast, SOAP is an XML-based protocol for making network API
requests. vii Although it is most commonly used over HTTP, it aims to be independent from HTTP and avoids using
most HTTP features. Instead, it comes with a sprawling and complex multitude of related standards
(the web service framework , known as WS-* ) that add various features
[ 37 ]. 

>Service compatibility is made harder by the fact that RPC is often used for communication across
organizational boundaries, so the provider of a service often has no control over its clients and
cannot force them to upgrade. Thus, compatibility needs to be maintained for a long time, perhaps
indefinitely. If a compatibility-breaking change is required, the service provider often ends up
maintaining multiple versions of the service API side by side. There is no agreement on how API versioning should work (i.e., how a client can indicate which
version of the API it wants to use [ 48 ]). For RESTful APIs, common approaches are to use a version
number in the URL or in the HTTP Accept header. For services that use API keys to identify a
particular client, another option is to store a client’s requested API version on the server and to
allow this version selection to be updated through a separate administrative interface

>Binary schema–driven formats like Thrift, Protocol Buffers, and Avro allow compact, efficient
encoding with clearly defined forward and backward compatibility semantics. The schemas can be
useful for documentation and code generation in statically typed languages. However, they have the
downside that data needs to be decoded before it is human-readable.

# Part 2
