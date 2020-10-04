---
title: A Review and Summary of the Javascript30 Course
permalink: "/summary-of-javascript30/"
slug: summary-of-javascript30
date_published: 2020-05-06T21:13:40.000Z
date_updated: 2020-06-03T20:31:11.000Z
layout: layouts/post.njk
excerpt: "For someone with some programming experience and understanding who wants to focus on improving JavaScript skills, working with the APIs and developing with the browser this is a fantastic course."
---

📚Course: [Javascript30](https://javascript30.com/)
💰Price: Free
⭐️Rating: 8.5/10

## Review

What could be better? Not a lot. I think Wes (the instructor) could have thought harder about prompting learners to pause the video and trying solo for themselves. He does once or twice somewhere in the first 10 lessons. But didn't do it after, which meant I tended to follow along waiting for the prompt. There are a couple of mistakes here and there - one was on a resource Wes was hosting returning a `404` for one of the lessons, but after emailing Wes fixed it about a week later. I thought some items could have been explained better e.g. CSS query selectors and the different syntax to use. For someone with some programming experience and understanding who wants to focus on improving JavaScript skills, working with the APIs and developing with the browser this is a fantastic course. A couple of lessons are out-of-date however the finished solutions available in the repo are mostly up-to-date. I really like the honesty in the mistakes and even debugging his lesson code on video - it gives a much more honest representation of what programming is like. If a JavaScript jedi like Wes makes mistakes and spends time debugging so too will you.

## 01 - JavaScript Drum Kit

- There's an `<audio>` div [tag for embedded audio.](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio)
- Adding event listeners is easy, in this example :
```js
window.addEventListener('keydown', function (e) {
    const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
});
```

- [HTML data attributes](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes) - store additional info on html elements using `data-` prefix:
- The data of the elements can then be accessed using `dataset`:
```html
<input id="spacing"... data-sizing="px">
```
```js
function handleUpdate() {
  const suffix = this.dataset;
}

inputs.forEach(node => node.addEventListener('change', handleUpdate));
```

## 02 - Clock

- Select any element with `document.querySelector('.second-hand');`. Where `.second-hand` is a class name. Known as [CSS selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors).
- Use `setInterval(yourfn, 1000)` to run a function on a repeated time interval.

## 03 - CSS Variables

- Pattern, get all elements you want to manipulate, create a function defining that change, create trigger for that function.
```js
const inputs = document.querySelectorAll('.controls input');

function handleUpdate() {
  const suffix = this.dataset.sizing || '';
  document.documentElement.style.setProperty(`--${this.name}`, this.value+suffix);
}

inputs.forEach(node => node.addEventListener('change', handleUpdate));
inputs.forEach(node => node.addEventListener('mousemove', handleUpdate));
```

## 04 - array cardio day 1

*Array methods map(), reduce(), reduce()  and  filter() are introduced.*

- Log a table to the console, i.e. a list of objects
```js
console.table(sorted);
```

# 05 - Flex panels

- Light touch on some flex panels (pretty foreign though, without much intro)
- Pattern of applying some transforms and transitions css using js
```js
// grab relevant elements
var panels = document.querySelectorAll('.panel');

// function to toggle
function toggleOpen(e) {
  this.classList.toggle('open');
}

// event listener to toggle
panels.forEach(x => x.addEventListener('click', toggleOpen));
```

## 06 - Type Ahead

Implement a search box against json data.

- Get data via a promise:
```js
const cities = [];
fetch(endpoint)
  .then(blob => blob.json())
  .then(data => cities.push(...data))
```

- Regex can be used like this:
```js
// (g)lobal, (i)nsensitive
const regex = new RegExp(wordToMatch, 'gi');
return place.city.match(regex)
```

## 07 - array cardio day 2

*Some extra array methods*

- `Array.prototype.some()` - checks if at least one element meets a condition is met. Returns Boolean.
- `Array.prototype.every()` -  - checks if all elements meet a condition is met. Returns Boolean.
- `Array.prototype.find()` - returns element from array that meets the specified condition.
- `Array.prototype.findIndex()` - like `find()` but returns the index.
- `Array.prototype.splice()` - delete the element at a given index.

## 08 - Fun with HTML5 Canvas

*Could have provided more context on the why of canvas vs alternatives of divs, could have been more structured as well. What is canvas? What are its features? etc*

- Canvas has a context, where you can update it's properties:
```html
<body>
<canvas id="draw" width="800" height="800"></canvas>
<script>
const canvas = document.querySelector("#draw");
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.strokeStyle = '#BBDA55';
</script>
```
- Instead of `rbg()` or hex colors you can set color using hsl(): `style="color: hsl(200, 100%, 50%)"`

## 09 - Dev Tools Domination

*Depending on how familiar one is with the dev tools, some very good tips to be had*

- Various methods of `console`, e.g. `console.warn()``console.info()`
- Break on a paticular element action, inspect the element, right click on element in dev tools and add a 'break on' -> '*choose an option*'
- `console.groupCollapsed()` group a bunch console logs and display them by default as collapsed.
```js
console.groupCollapsed('my group')
console.log('part1 collapsed')
console.log('part2 collapsed')
console.groupEnd('end of my group')
```

- `console.count` will print the contents and also the count of how many times that content has been logged
- `console.time('X operation took:)` put your code you want to time and end it with `console.timeEnd(X operation took:)`
- *Covered in earlier episodes but very handy* display in the console in tabular form an array of objects `console.table(myArrayOfObjects)`

## 10 - Hold Shift and Check Checkboxes

*I found this one hard - and then returned to it after a 7mth break 😱*

- No new techniques in this lesson, but a harder application of the pattern of, select DOM elements, define callback function

// select the divs
const checkboxes = document.querySelectorAll('.inbox input[type="checkbox"]');
```js
function handleCheck(e) {
  // check if shiftkey pressed AND box is checked
  let inBetween = false;
  if (e.shiftKey && this.checked) {
    // loop through each checkbox
    checkboxes.forEach(checkbox => {
      // these are the outer bounds of the selection
      if (checkbox === this || checkbox === lastChecked) {
        inBetween = !inBetween;
      }
      // whilst in between is true - check those boxes
      if (inBetween === true) {
        checkbox.checked = true;
      }
    });
  }
  lastChecked = this;
}

// add event listener to handle clicks
checkboxes.forEach(checkbox => checkbox.addEventListener('click', handleCheck) );
```

## 11 - Custom Video Player

- I found this easier to fly solo on but also a good few hours of work, you get a video in a page, but the buttons to play/pause, skip etc don't work. The first thing I needed was some documentation on what events I could use on the `video`. W3 Schools was the first link, but not too helpful. Mozilla to the rescue with a nice list of [video events](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#Events).
- You'll also need to know what the [video attributes are](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#Attributes).

## 12 - Key Sequence Detection

- This was a half hour one, much better after day 11. The aim is to do some action on the detection of some sequence of keystrokes, which TIL is called a [Konami_Code](https://en.wikipedia.org/wiki/Konami_Code).
- Solution involved adding an eventlistener to the event `keydown`, push the keys in an array, and checking for a sequence matching the konami code.
- And another amazing tidbit
```js
// Add this script tag
<script type="text/javascript" src="https://www.cornify.com/js/cornify.js"></script>
...
// Then call this function to put corny shit on your webpage
cornify_add()
```

## 13 - Slide in on Scroll

*Tip* - At this point I'm getting a little tired of the `CMD+S` to save in VS Code, `CMD+TAB` to switch applications to the browser and then `CMD+SHIFT+R` to hard refresh. The [Live Server extension](https://github.com/ritwickdey/vscode-live-server) solves that problem - as soon as you save, the page reloads in the browser you launch with it.

- For the interest of keeping JS30 plain js Wes copies in the [`debounce` function](https://lodash.com/docs/4.17.15#debounce) from the [`lodash` library](https://lodash.com/). I personally think importing this library and a brief explainer on why lodash is such a widely popular library would have been good.
- Calculating how far someone has scrolled on a web page:
- `window.scrollY` - how far you have scrolled measured at the top of the window [(mdn ref)](https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY).
- `window.innerHeight` - the height of the window, measured using the viewport, i.e. what is visible [(mdn ref)](https://developer.mozilla.org/en-US/docs/Web/API/Window/innerHeight).
- `HTMLElement.offsetTop` - the distance of the element relative to the offsetParent node, in this tutorial that is the body [(mdn ref)](https://developer.mozilla.org/en-US/docs/Web/API/HTMLelement/offsetParent).
- `Element.classList` - '... class attributes of the element. This can then be used to manipulate the class list.' [(mdn ref)](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList).
- crux of the lesson is utilising the above properties to work out where on a page the user has currently scrolled and to conditionally apply CSS already written for you.
```js
if (conditions) {
  image.classList.add('active');
} else {
  image.classList.remove('active');
}
```

Simplified CSS
```css
/* take half a second to transition,  initial set to invisible*/
.slide-in {
  opacity: 0;
  transition: all .5s;
}

/* on active,  set to invisible*/
.slide-in.active {
  opacity: 1;
}
```

## 14 - JavaScript References VS Copying

- This covers some js idiosyncrasies on reassignment and copying variables, arrays and objects.
- Starting off with variables, variables can be reassigned. `const` is not covered which behaves differently. [mdn ref](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Invalid_const_assignment)
```js
// const
const age = 100;
const age2 = age;
age2 = "new"; // 🛑 TypeError: invalid assignment to const

// both var + let behave the same
let num = 100;
let num2 = num;
num2 = 200;
console.log(num, num2) // 👍 100 200 
```

- Arrays are different:
```js
// Make a copy of an array
const players = ['Wes', 'Sarah', 'Ryan', 'Poppy'];
const team = players;
team[1] = "new";
console.log(players, team)
// [ "Wes", "new", "Ryan", "Poppy" ]
// [ "Wes", "new", "Ryan", "Poppy" ]
// 🛑 changes both `team` and `players` because `team` is just a pointer to `players`

// solution
const players = ['Wes', 'Sarah', 'Ryan', 'Poppy'];
const team = players.slice();
team[1] = "new";
console.log(players, team)
// [ "Wes", "Sarah", "Ryan", "Poppy" ]
// [ "Wes", "new", "Ryan", "Poppy" ]
// 👍 could also do `const team = [...players];`
```

- Objects also need a special method to copy, however, the following will only do one level deep of the object.
```js
// with Objects
const person = {
  name: 'Wes Bos',
  age: 80
};

// attempt to make a copy:
const captain = person;
captain.number = 99;
console.log(person)
// Object { name: "Wes Bos", age: 80, number: 99 }
// 🛑 this has modified the original

// solution
const captain2 = Object.assign({}, person)
captain2.number = 100;
console.log(person)
// Object { name: "Wes Bos", age: 80, number: 99 } 👍
```

- lodash has a [cloneDeep method](https://lodash.com/docs/4.17.15#cloneDeep) to do a full object copy

## 15 - Local Storage and Event Delegation

N.b - this one is big, video is over 30mins.

- This covers topics that seem like a precursor to react, storing state and using parent elements to instruct child elements.
- When working with forms and wanting to perform actions upon form submission, the appropriate event to listen for is `submit`. By default the submit form event will reload the page. To prevent this use `e.preventDefault()` in the handler.
- Persist data on the client by using local storage, a key value store, where your value needs to be a string
```js
// args are key value
localStorage.setItem('items', JSON.stringify(myObject))
```

- If your data is not what you expect and you see `[object Object]` instead - you most likely have tried to convert an object to a string `Object().toString()`. There are [other variations of this behaviour](https://stackoverflow.com/a/25419538/3691003) - because everything in javascript is an object.

## 16 - CSS Text Shadow Mouse Move Effect

- Wes takes a weird approach of grabbing the hero elements offset x and y values and the event's offset x and y values. When the mousemove event occurs over another element on the page the x and  y values are then calculated from [*the the padding edge of the target node*](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/offsetX). A much simpler approach is taking the clientX and clientY values. Wes approach:
```js
const { offsetWidth: width, offsetHeight: height} = hero
let { offsetX: x, offsetY: y } = e;

// uses this if statement to handle when the target is the whole screen, to then add on the screen offset
if (this !== e.target) {
  x = x + e.target.offsetLeft;
  y = y + e.target.offsetTop;
}
```

Much easier to use the following:
```js
let { clientX: x, clientY: y} = e;
```

- A graphic effect is applied using the following
```js
const walk = 100 //px
const xWalk = (x / width * walk) - (walk / 2);
const yWalk = (y / height * walk) - (walk / 2);

text.style.textShadow = `${xWalk}px ${yWalk}px 0 rgba(255,0,255,0.7)`
```

## 17 - Sorting Band Names without articles

N.b. An 'article', being one of the grammatical articles. In this coding example, The definite article 'the' or the indefinite articles 'an' or 'a'.

- Wes takes a really nice and succinct approach here utilising the [Array.prototype.sort()](Array.prototype.sort()). However I prefer the mdn docs approach which is a little more verbose:
```js
let sorted = bandsArray.sort((a,b) => {
  if (strip(a) > strip(b)) {
    return 1
  }
  if (strip(a) < strip(b)) {
    return -1
  }
  return 0
})
```

- To append this to a div, e.g. [the unordered list `<ul>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul):
```js
document.querySelector('#ulDivId').innerHTML =
  sortedArray.map(item =>
    `<li>${item}</li>`
  ).join('');
```

## 18 - Tally String Times with Reduce

N.b. simple if you have some knowledge of map [reduce functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce).
My answer pretty similar to Wes's except instead of using a forEach to append the values into an array, he used a much nicer `const timeNodes = Array.from(document.querySelectorAll('[data-time]'));`. My answer:
```js
const videos = document.querySelectorAll('li')
const times = [];

videos.forEach(vid => {
  times.push(vid.dataset.time)
});

const totalTime = times.map(x => {
  const [min, sec] = x.split(':');
  return Number(min) * 60 + Number(sec);
}).reduce((acc, val) => {
  return acc + val;
})

const mins = Math.trunc(totalTime / 60);
const secs = totalTime % 60;
console.log(mins, ':', secs)
// 298 : 58 - I should handle hours but meh 🤷‍
```

## 19 - Unreal Webcam Fun

*N.b. This was a slower start with a few issues to iron out cover in the first 3 bullet points...*

- The files so far have been read locally into the browser, such that in the address bar you'll find the file path `file://` instead of `https://`. However the use of the webcam requires a server due to accessing the computer's camera and the security requirement that the website is a secure origin, `https` or `localhost`. Therefore we need to spin up a local server. If developing with [VSCode with the Live Server extension](#13-slide-in-on-scroll) this has already been done for you. I've used Python's ``http.server`` (used to be called ``SimpleHTTPServer``). [Browsersync](https://www.browsersync.io/)  seems like the JavaScript equilavent.
- I got some intitial `404` errors where the html template pointed to a file that no longer exists. I fixed this by downloading a camera sound locally.
```html
<!-- 404 -->
<audio class="snap" src="https://wesbos.com/demos/photobooth/snap.mp3" hidden></audio>
<!-- replace with a local sound file -->
<audio class="snap" src="camera_sound.mp3" hidden></audio>
```
- The video tutorial for this instructs you to use [`createObjectURL` which has now been deprecated](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL). I wasted some time here, checking I had done things correctly, searching for the error until I saw a note in the solution on this to use `[srcObject](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/srcObject)`.
- To access a user's web camera use [`[navigator.mediaDevices.getUserMedia()](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/mediaDevices/getUserMedia). This returns a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) that resolves to a [`MediaStream`](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream) object.
```js
function getVideo() {
  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
  }).then(localMediaStream => {
    video.srcObject = localMediaStream;
    video.play();
  })
  .catch(
    err => {
      console.error("Whoops Error: ", err);
    });
}
```
- [The Navigator interface](https://developer.mozilla.org/en-US/docs/Web/API/Navigator) enables you to query some interesting properties of the user e.g. `[geolocation](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/geolocation)`, `[connection](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/connection)`  and `[webdriver](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/webdriver)`.
- If you want to pause the execution and enter the debugger at a particular point of your code, just write `debugger`.
```js
console.log(pixels);
debugger
```
## 20 - Native Speech Recognition

N.b. This was definitely a frustrating first 5mins of the tutorial, where if you're following along you don't get anything like what Wes is getting. This is because he is demonstrating the finished app on the left half of the screen whilst coding from scratch the app. It's not until 5mins when switches that he realises that it's not working.

- This only works on Chrome, not Firefox.
```js
const recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.lang = 'en-US';

let p = document.createElement('p');
const words = document.querySelector('.words')
words.appendChild(p)

recognition.addEventListener('result', e => {
  const transcript = Array.from(e.results)
    .map(result => result[0])
    .map(result => result.transcript)
    .join('')

  p.textContent = transcript;
  // create a new paragraph if the speaking has finished
  if (e.results[0].isFinal) {
    p = document.createElement('p')
    words.appendChild(p);
  }
  console.log(transcript); // the results
})

recognition.addEventListener('end', recognition.start)
recognition.start()
```

## 21 - Geolocation based Speedometer and Compass

- This requires using Xcode to simulate someone using there phone whilst moving around.

![](/content/images/2020/05/Screen-Shot-2020-05-09-at-20.19.21.png)
- Once the simulator boots you'll have an iphone on screen. Then turn on a 'City Run'.

![](/content/images/2020/05/Screen-Shot-2020-05-09-at-20.20.36.png)
- Then open Safari to connect the dev tools to the simulator iphone

![](/content/images/2020/05/Screen-Shot-2020-05-09-at-20.35.50.png)
- And to access the geo data:
```js
// the request to use the geolocation of the client will ask for permissions from user
navigator.geolocation.watchPosition((data) => {
  console.log(data) // see the data object

  // update dom elements with the data
  speed.textContent = data.coords.speed;
  arrow.style.transform = `rotate(${data.coords.heading}deg)`
}, (err) => {
  // if they reject the permissions
  console.log(err)
  alert("you privacy nut")
}
```
## 22 - Follow Along Links

*N.b. lesson applies an element that hovers over the link the mouse is currently positioned over.*

- Method: Create a 'highlight' DOM element, and transition it based on the `mouseenter` event on any `<a>` divs.
- Create event listener
```js
const triggers = document.querySelectorAll('a');
triggers.forEach(a => {
    a.addEventListener('mouseenter', addHighlight)
}
```
- To get the coodinates and size of the current `a` div, use `[getBoundingClientRect()](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)` in the callback.
```js
function addHighlight(e) {
    const domDimension = this.getBoundingClientRect();
}
```
- `[translate(Xpx, Ypx)](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/translate)` - CSS function that repositions an element. Use this in the call back to transition the highlight element. Wes uses the `top` and `left` properties, but X and Y works just the same and makes more sense to me.
```js
const highlight = document.createElement('span');
highlight.classList.add('highlight');
document.body.appendChild(highlight);

function addHighlight(e) {
    ...
    highlight.style.width = `${domDimension.width}px`
    highlight.style.height = `${domDimension.height}px`
    highlight.style.transform = `translate(${domDimension.x}px,${domDimension.y}px)`
}
```
## 23 - Speech Synthesis

N.b. - Firefox wasn't returning the voice objects from `speechSynthesis.getVoices()` at page load - switched to Chrome for this one.

- Use the experimental [SpeechSynthesis API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis).
- When filtering an array based on a singular user selection, I naturally wanted to `[filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)` however this returns an array which you will have to select an element from. However, `[find()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)`will return the first element that meets the match critera.
```js
msg.voice = voices.filter(v => v.name === this.value)[0]
// vs find
msg.voice = voices.find(v => v.name === this.value)
```

## 24 - Sticky Nav

*Fix a navbar to the top as you scroll down.*

- Add an event listenr on the navbar and for the callback place a control statement to detect when the *fixing* of the nav should apply.
```js
const navbar = document.querySelector('#main');
// top of navbar location
const navHeight = navbar.offsetTop;

function moveNavBar(e) {
  const scrollAmt = window.scrollY;

  if (scrollAmt >= navHeight) {
    document.body.classList.add('fixed-nav');
    document.body.style.paddingTop = `${navbar.offsetHeight}px`

  } else {
    document.body.style.paddingTop = 0
    document.body.classList.remove('fixed-nav');
  }
}

document.addEventListener('scroll', _.debounce(moveNavBar, 10));
```
- To find the hight of a DOM element there looks to be to properties you could use. Here's the [difference between clientHeight vs offsetHeight,](https://stackoverflow.com/a/4106585/3691003) go with offsetHeight.

## 25 - Event Capture, Propagation, Bubbling and Once

*This is a very quick practical on the concept of bubbling up and propagation. Requires some extra research if new to the concept.*

- [Event propagation](https://www.sitepoint.com/event-bubbling-javascript/) - is the blanket term for both event bubbling and event capturing.
- If you have 3 divs nested and place an event listener on those divs. Then load the page and click on the inner most div and log which div has been clicked on. The browser will show all divs from inner most to outer most `<body>` as having been clicked on - this is *bubbling up.*
- Behind the scenes the browser is first capturing the event by 'trickling down' the DOM hierarchy until the target on which the event occurred i.e. the click, is reached.
- To make use of the third argument to an event listener:
```js
divs.forEach(div => {
  div.addEventListener('click', logText, {
    capture: true, // 'trickle' down events
    once: true // removeEventLister - unbind once event occurs once
  })
});
```
## 26 - Stripe Follow Along Dropdown

*Extension of 22.*

- I was trying to access the child nodes of `this` within the context of a callback by traversing the tree e.g. `this.children.item(0)`. But of course, you can just `this.querySelector` to query the tree of `this`.
- The crux of the logic relied on adding and removing CSS classes. The pared down version:
```js
const triggers = document.querySelectorAll('.cool > li')
const background = document.querySelector('.dropdownBackground')

function handleEnter() {
  background.classList.add('open')
  this.classList.add('trigger-enter');
  this.classList.add('trigger-enter-active');

  // don't forget you can querySelector on `this`
  const dropdown = this.querySelector('.dropdown');
  const dropdownDim = dropdown.getBoundingClientRect();
  background.style.setProperty('width', `${dropdownDim.width}px`)
}

function handleLeave(params) {
  this.classList.remove('trigger-enter', 'trigger-enter-active')
}

triggers.forEach(trigger => trigger.addEventListener('mouseenter', handleEnter));
triggers.forEach(trigger => trigger.addEventListener('mouseleave', handleLeave));
```    

## 27 - Click and Drag to Scroll

- Lesson centres on making use of 4 mouse events `mousedown`, `mouseleave`, `mouseup` and `mousemove` to build the controls around clicking and dragging.
- As flexible as you think `let` is, you will encounter errors if you try to redeclare a variable created with `let`.
```js
// 🛑 errors
let yourVar = true;
let yourVar = false;

// ✅ happy days
let yourVar = true;
yourVar = false;
```
- You can `console.log` the var name and value at the same time by wrapping it in an object:
```js
const yourVarName = 10;
// slow way
console.log('yourVarName', yourVarName);
// fast way
console.log({yourVarName});
```
- [MouseEvent.pageX](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX) - "returns the X (horizontal) coordinate (in pixels) at which the mouse was clicked, relative to the left edge of the entire document. This includes any portion of the document not currently visible."
- [HTMLElement.offsetLeft](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetLeft) - "The **`HTMLElement.offsetLeft`** read-only property returns the number of pixels that the *upper left corner* of the current element is offset to the left within the [`HTMLElement.offsetParent`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent) node."

## 28 - Video Speed Controller UI

*This is a small lesson at ~9mins and doesn't introduce any new content.  Mostly a simpler version of Lesson 11.*

## 29 - Countdown Clock

*Not a lot new in this one - but it is a fun use of the skills learnt to date in making a countdown clock.*

- `setInteval` will continue to run. So, if using it within a function that gets called multiple times, you may need to have a `clearInterval()` call to clear any existing process.
- If an html element has a name attribute, it can be accessed directly from the document.
```html
<form name="customForm" id="custom">
    <input type="text" name="minutes" placeholder="Enter Minutes">
</form>
```
```js
document.customForm.addEventListener('submit', function(e){...})
// Nested elements can be accessed too
document.customForm.minutes.addEventListener('onhover', function(e){...})
```

## 30 - Whack A Mole Game

*As the title suggests this is a bit of a fun simple game that is using the concepts learnt in previous lessons - a good way to end the course.*

- On event's [there is a `isTrusted` boolean property](https://developer.mozilla.org/en-US/docs/Web/API/Event/isTrusted) that can be utilised to ensure the action on the web page is user generated. 

## Addendum

- TODO write summary and find good doc on document.querySelector(THISBIT), by id, class, attribute e.g. `data-time`
