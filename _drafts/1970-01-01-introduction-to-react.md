---
title: Introduction to React
slug: introduction-to-react
date_published: 1970-01-01T00:00:00.000Z
date_updated: 2018-02-07T16:01:24.000Z
draft: true
---

## JSX

## Virtual DOM

## Javascript

> The simple answer is that this refers to an instance of IceCreamGuy. The less simple answer is that this refers to the object on which this's enclosing method, in this case .render(), is called. It is almost inevitable that this object will be an instance of IceCreamGuy, but technically it could be something else...
> 
> ... You don't need those parentheses because .food is a getter method. You can tell this from the get in the above class declaration body.

There's nothing React-specific about getter methods, nor about this behaving in this way! However, in React you will see this used in this way almost constantly.

React components are complicated. Their syntax is complicated, and the reasoning behind their syntax is especially complicated.

components can interact: a component can render another component.

In this lesson, you will learn another way that components can interact: a component can pass information to another component.

Information that gets passed from one component to another is known as "props."

Here's how the naming convention works: first, think about what type of event you are listening for. In our example, the event type was "click."

If you are listening for a "click" event, then you name your event handler handleClick. If you are listening for a "keyPress" event, then you name your event handler handleKeyPress:

props is quite possibly the longest and most difficult lesson in all of our React courses. Congratulations on getting this far!

Here are some of the skills that you have learned:

Passing a prop by giving an attribute to a component instance

Accessing a passed-in prop via this.props.prop-name

Displaying a prop

Using a prop to make decisions about what to display

Defining an event handler in a component class

Passing an event handler as a prop

Receiving a prop event handler and attaching it to an event listener

Naming event handlers and event handler attributes according to convention

this.props.children

getDefaultProps

## state

Unlike props, a component's state is not passed in from the outside. A component decides its own state.

For an in-depth explanation of this kind of binding trickery, begin with the React docs. For the less curious, just know that in React, whenever you define an event handler that uses this, you need to add this.methodName = this.methodName.bind(this) to your constructor function.

Any time that you call this.setState(), this.setState() AUTOMATICALLY calls .render() as soon as the state has changed.

That is why you can't call this.setState() from inside of the .render() method! this.setState() automatically calls .render(). If .render() calls this.setState(), then an infinite loop is created.

Source: Codeadamemy

## constructors

- `super()` is necessary for constructors to assign methods and values like `props` to the component.
- `this.` is uninitialised without a call to `super()`
- `super(props)`is necessary if you want to access `this.props` inside the constructor

## TODO - google 'types of methods in js' e.g. getter method
