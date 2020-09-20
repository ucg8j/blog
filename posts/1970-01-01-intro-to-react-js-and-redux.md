---
title: Intro to React.js and Redux
slug: intro-to-react-js-and-redux
date_published: 1970-01-01T00:00:00.000Z
date_updated: 2017-05-13T08:27:51.000Z
draft: true
---

This post aims to give a high level overview of key concepts, principles and the structure of how React.js and [Redux](http://redux.js.org/) work.

# Redux

> The whole state of your app is stored in an object tree inside a single store.
> 
> The only way to change the state tree is to emit an action, an object describing what happened.
> 
> To specify how the actions transform the state tree, you write pure reducers.

Redux was motivated by a common problem in complicated web applications of multiple web components interacting with one or more models that then flow on to update one or more web components, which can then update one or more models, which can then... I think you get the point! Essentially, for a developer debugging the state of an application can be very hard. Enter Redux, which brings a design pattern where the whole state of the application is in a single read only store.

Redux has a uni-directional data flow.

current state -> ui component -> action -> reducer -> next state

## Redux folder Structure

    core
    ├── actions
    │   └── actions-ui.js
    ├── reducers
    │   ├── index.js
    │   └── reducer-ui.js
    ├── store
    │   └── configureStore.js
    └── types.js
    

**actions**

**Reducers** - this folder contains definitions of reducers. A reducer changes the state of the application as a result of an action. Effectively there is only one *reducer* however modularised code is much easier to manage (e.g. reducer-ui.js). Which means in the `reducer/index.js` file each discrete reducer needs to be referenced.

**store** - `configureStore.js` enables the configuration of middleware or extensions to redux.

**types.js** - common but not compulsory, acts as a main configuration file that contains the names of the actions and exports them as constants, which reduces typing elsewhere in your code.

# Routing

# Firebase Deployment Process

    npm build
    firebase deploy
    

# Manifest.json

Not strictly related to React.js or Redux, but handy to know about.
