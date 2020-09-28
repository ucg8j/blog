---
title: The Best Self-Hosted RSS Feed Readers
slug: rss-feed-reader
date_published: 2020-05-31T14:06:00.000Z
date_updated: 2020-05-31T15:32:54.000Z
tags: rss, foss, tech, self-host
layout: layouts/post.njk
---

## What is [RSS](https://en.wikipedia.org/wiki/RSS)?

It aims to be an open standard for the open web, where applications can get updates from websites. This runs against the current closed off portions of the web like Facebook that keep content behind their account login - i.e. the internet's ['walled gardens'](https://en.wikipedia.org/wiki/Closed_platform). For a while, a lot of people used the popular [Google Reader](https://en.wikipedia.org/wiki/Google_Reader) RSS application - unfortunately, as with many loved Google projects it got killed off because of declining usage and it didn't generate revenue.

So why get one now?

- Ideals of an open web. I don't have a Facebook account. I believe there are interesting blogs out there that I don't necessarily see unless they surfaced through the front page of search results or aggregators like Hacker News or Reddit.
- Solve the problem of - *huh this blog/site was really interesting. How do I keep track of new content without signing up to a thousand newsletters or entering a walled garden?*

## My Starting Point

There's a bunch of open source Feed Readers listed on the [Feed Reader section of Awesome Self-Hosted](https://github.com/awesome-selfhosted/awesome-selfhosted#feed-readers). My criteria to filter the list were:

- Minimum 1000 Github Stars
- Commit in the last 6 months

This is what I was left with. Which I then filtered based on my UI and tech preferences i.e. don't be ugly and don't use PHP/Java.

## 👨‍👩‍👧‍👧 The Contenders

### [Winds](https://getstream.io/winds/)

*The kitchen sink reader*
Github Stars: 7.5k
Built With: JavaScript (React + Express)
Test Website: No, but free account creation
Features:

- Recommender service via external service
- Very nice UI
- 'Listen and read' i.e. podcast player too

### [Stringer](https://github.com/swanson/stringer)

*Stringer is simple... 'has no external dependencies, no social recommendations/sharing, and no fancy machine learning algorithms.'*
Github Stars: 3.2k
Built With: Ruby
Test Website: No, but has a click to deploy to Heroku option
Features:

- Simple and nice UI
- Keyboard shortcuts (I use [Vimium](https://vimium.github.io/) so not sold on this)

## [selfoss](https://selfoss.aditu.de/)

*Didn't look further at this one PHP+ugly =* 😱🏃‍♂️.
Github Stars: 1.9k
Built With: PHP
Test Website: No

## [Miniflux](https://github.com/miniflux/miniflux)

*Ultra simplicity in terms of stack and UI. Slightly ugly, but I agree with the software philosophy of keeping it simple.*
Github Stars: 1.9k
Built With: Plain go-lang+minimal vanilla JavaScript
Test Website: No
Features:

- Support multiple enclosures/attachments (Podcasts, videos, music, and images)
- Play videos from YouTube channels directly inside Miniflux
- Categories
- Bookmarks
- Fetch website icons (favicons)
- Save articles to third-party services e.g. Pocket
- Dark theme (otherwise kind of ugly)
- Optional keyboard shortcuts

## [FreshRSS](https://github.com/FreshRSS/FreshRSS)

*Like Selfoss - Didn't look further at this one PHP+ugly =* 😱🏃‍♂️.
Github Stars: 2.3k
Built With: PHP
Test website: [Yes](https://demo.freshrss.org/i/)

## [feedbin](https://github.com/feedbin/feedbin)

*Didn't look further as the app tech + ui wasn't appealing to me*.
Github Stars: 2.5k
Built With: Ruby on Rails
Test Website: No - but free trial

## [Commafeed](https://github.com/Athou/commafeed)

*Github at the time had a **🛑build error** + Java turned me away*
Github Stars: 1.7k
Built With: Java 😱 at the time of reviewing had a 'build: error'
Test Website: no - but free trial

**Final round contenders: Miniflux, Stringer and Winds**

## 🏁 Top 3 contenders - Install and Review

N.B. I'm running these locally to assess before deploying to my server.

### [Stringer](https://github.com/swanson/stringer)
```bash
$ docker run --rm -it -e DATABASE_URL="sqlite3:':memory:'" -p 8080:8080 mdswanson/stringer
```

Opened on `localhost:8080` - Simple as that. UI feels nice and simple. Unfortunately, the only import methods are from the long defunct Google Reader or with one URL at a time.
![](/content/images/2020/05/image.png)
I tried importing the OPML file through this method but that seemed to crash the application - poor error handling?
![](/content/images/2020/05/image-1.png)
Once you do manually load some feeds the `/feeds` interface is nice and clean.
![](/content/images/2020/05/image-2.png)
The `/news` view is well laid out and the fonts used are a nice reading experience.
![](/content/images/2020/05/Screen-Shot-2020-05-31-at-09.41.46.png)
Lastly, whilst poking around the Github repo I found this comment on [this recent issue](https://github.com/swanson/stringer/issues/512):

> ... I don't think anyone is currently developing new features. I'm available to review code and merge it if you want to submit a patch.

So whilst the UI is nice and the setup is incredibly easy. The active development of  Miniflux and Wind have started to look more appealing.

⭐️ 6.5 / 10 - Easy install, nice UI, functionality is low and active development has slowed.

### [Miniflux](https://github.com/miniflux/miniflux)

1. You need postgres which I had not setup on my mac. I recommend doing this the easy way with [postgres.app](https://postgresapp.com/).
2. The [instructions ](https://miniflux.app/docs/installation.html#docker)here are a little hairy. I went with saving the following to a `docker-compose.yml`. I couldn't get it working on port 80 so switched the port to 8050.

```docker
version: '3'
services:
  miniflux:
    image: miniflux/miniflux:latest
    ports:
      - "8050:8080"
    depends_on:
      - db
    environment:
      - DATABASE_URL=postgres://miniflux:secret@db/miniflux?sslmode=disable
      - RUN_MIGRATIONS=1
      - CREATE_ADMIN=1
      - ADMIN_USERNAME=admin
      - ADMIN_PASSWORD=test123
  db:
    image: postgres:latest
    environment:
      - POSTGRES_USER=miniflux
      - POSTGRES_PASSWORD=secret
    volumes:
      - miniflux-db:/var/lib/postgresql/data
volumes:
  miniflux-db:
```

Then run the following commands and go to `localhost:8050` once the containers have finished booting:

    $ docker-compose up -d db
    $ docker-compose up miniflux

Firstly, the initial UI is *very *simple, whilst incredibly plain is very functional. Navigating the app is explicit with text whereas Stringer you had to poke around using icons without text descriptions.
![](/content/images/2020/05/Screen-Shot-2020-05-31-at-09.46.28.png)
There are several integrations to apps like Pocket, Instapaper and Wallabag. And after changing the theme. the reader is quite nice. Albeit, I do notice the entire page refresh from the server side oriented app - but I have to tell myself that the simplicity philosophy trumps the complexity of introducing a frontend framework.
![](/content/images/2020/05/Screen-Shot-2020-05-31-at-13.36.10.png)
⭐️ 8.5 / 10 - Whilst being minimalistic has all the features you need, dark theme and the most active development of them all with a clear software philosophy.

## [Winds](https://getstream.io/winds/)

The install is relatively long particularly with the external dependencies which include:

- [Stream](https://getstream.io/) - an API for building activity feeds + handle personalization (machine learning).
- [Algolia](https://www.algolia.com/) - for search
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - a DB as a service (DBaaS)

At this point I opt to sign up for a free account to try it out. I get the [app from the apple store](https://apps.apple.com/us/app/winds-by-getstream-io/id1381446741). Upon opening Winds, you are first confronted with a selection of interests like 'Programming', 'News' etc. I pick a couple and click next. I then have to create an account 😑 which I do. Then once logged in I have a very populated set of feeds and podcasts.
![](/content/images/2020/05/Screen-Shot-2020-05-31-at-14.02.22.png)
I then want to try and remove all of these and start fresh, which no amount of clicking around can I figure out how to do other than clicking individually on each feed to remove it. I could create a new account and then add my OPML file - however at this point I'm already missing the bloat free approach of Miniflux.

⭐️ 7 / 10  - for a non self-hosted piece of software I can see this is actually really nice. However major downsides of the installation complexity for self-hosted installation combined with features I don't particularly want. For instance, I don't want a recommender system - I can find my own content and probably consume too much as it is! If I want reinforcing recommender systems I'd go into a walled garden like Facebook.

## 🎉 Winner - Miniflux 🎉

## RSS Tips

Do you have a list of websites you want to follow?

- A lot of sites you can just `/rss` e.g `domainname.com/rss`
- For medium sites add `/feed/` e.g. [`https://medium.com/feed/@verygoodblogger/`](https://medium.com/feed/@cjolowicz/)
- I used [this site](https://opml-gen.ovh/) to convert a list feeds into an OPML file I could mass import to the various RSS feed reader apps.
- About a decade ago I used blogspot/blogger. It had a feed reader, but no export facility. Nostagilically, I thought I'd get the list from there. Here's a hack to export the list. First navigate to '[Manage blogs I'm following](https://www.blogger.com/manage-blogs-following.g)', then open your browser dev tools and run the following JavaScript to get a list of the links.

```js
const urls = document.querySelectorAll('.blogUrl');
const url_list = [];

urls.forEach(url => {
  url_list.push(url.innerText);
});
console.log(url_list);
```

## Related Interesting Projects

- [RSS-Bridge](https://github.com/RSS-Bridge/rss-bridge) - Create RSS feeds for websites without a feed.
- [Wallabag](https://github.com/wallabag/wallabag) - Save articles from RSS feeds.
- [Archivebox](https://archivebox.io/) - Save all content e.g. videos, entire web pages and configure that save in multiple format. Solves link rot issues.
