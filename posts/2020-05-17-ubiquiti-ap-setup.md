---
title: How to setup a Ubiquiti Access Point
slug: ubiquiti-ap-setup
date_published: 2020-05-17T21:10:47.000Z
date_updated: 2020-05-17T21:10:47.000Z
tags: network, wifi
excerpt: How to setup a Ubiquiti Access Point to resolve Wifi deadzones. And, how to avoid some mistakes in setting it up.
layout: post.njk
---

**Aim**: Have strong WiFi across a property. In other words elimate the deadzone.

**Solution:** Keep existing ISP provided router and plugin a Ubiquiti Long Range Access Point.

**tl:dr** - ✅ Solved - No deadzone. But, setting up up commercial grade wifi was not user friendly.

**Ingredients:**

- [Ubiquiti Networks UAP-AC-LR 175.7 x 43.2 mm 2.4-5 GHz 802.11ac Dual-Radio Long Range Access Point - White](https://www.amazon.co.uk/gp/r.html?C=38VLIQ1P7ES9H&amp;K=32BU4EO7DARI&amp;M=urn:rtn:msg:20200430132013e0b9bda6501e4b1fa04e0a873fc0p0eu&amp;R=O36YOI0VYLLB&amp;T=C&amp;U=https%3A%2F%2Fwww.amazon.co.uk%2Fdp%2FB016K5A06C%2Fref%3Dpe_3187911_189395841_TE_dp_1&amp;H=HKVAUIQE2WJTRQIFRXVXS8OPE24A&amp;ref_=pe_3187911_189395841_TE_dp_1)
- 2m Ethernet Cable (+ later a 10m)

There are various ways to solve internet problems. I've tried stronger routers, stronger receivers, 30m ethernet cables, TP-Link powerlines. Except for the 30m cable, all the others were disappointments. But a cable doesn't solve the WiFi. So some reading on network topologies led me to evaluating mesh networks, boosters and access points. With a trusted friends recommendation I was swayed to go with a commercial grade access point. There were many failures along the way.

## 🤦‍♀️ Unboxing...

🛑 Mistake 1 - Doesn't come with an ethernet cable.
Yes this £100 solution doesn't come with even the shortest of ethernet cables to connect it to my router. I also had no power adaptor space. Amazon Prime to the rescue.

## 🤔 All plugged in: Now how do I connect it up?

The instructions that come with it don't help. Next stop, interwebs. I start to hit a lot of content that is sending me wayward. 

🛑 Mistake 2 - This is not the [UniFi software controller](https://play.google.com/store/apps/details?id=com.ubnt.unifi.edu) you are looking for. This android app was the first UniFi app to come up and was a pure dead end.

🛑 Mistake 3 - [N](https://play.google.com/store/apps/details?id=com.ubnt.unifi.edu)ext attempt was the OSX software controller. Run for the hills if you see this error:
![](/content/images/2020/05/Screen-Shot-2020-05-17-at-22.02.26.png)
I messed around with some open JDKs but ultimately was entering a rabbit hole. Seems like others have shared this 'nightmare' and didn't come up with much in the way of solution. 

> [Ubiquiti Unifi Controller 4.11.47 and Java Runtime nightmare](https://tongfamily.com/2019/10/08/ubiquiti-unifi-controller-4-11-47-and-java-runtime-nightmare/)

<!--//--><![CDATA[//><!--
		/*! This file is auto-generated */
		!function(d,l){"use strict";var e=!1,o=!1;if(l.querySelector)if(d.addEventListener)e=!0;if(d.wp=d.wp||{},!d.wp.receiveEmbedMessage)if(d.wp.receiveEmbedMessage=function(e){var t=e.data;if(t)if(t.secret||t.message||t.value)if(!/[^a-zA-Z0-9]/.test(t.secret)){var r,a,i,s,n,o=l.querySelectorAll('iframe[data-secret="'+t.secret+'"]'),c=l.querySelectorAll('blockquote[data-secret="'+t.secret+'"]');for(r=0;r<c.length;r++)c[r].style.display="none";for(r=0;r<o.length;r++)if(a=o[r],e.source===a.contentWindow){if(a.removeAttribute("style"),"height"===t.message){if(1e3<(i=parseInt(t.value,10)))i=1e3;else if(~~i<200)i=200;a.height=i}if("link"===t.message)if(s=l.createElement("a"),n=l.createElement("a"),s.href=a.getAttribute("src"),n.href=t.value,n.host===s.host)if(l.activeElement===a)d.top.location.href=t.value}}},e)d.addEventListener("message",d.wp.receiveEmbedMessage,!1),l.addEventListener("DOMContentLoaded",t,!1),d.addEventListener("load",t,!1);function t(){if(!o){o=!0;var e,t,r,a,i=-1!==navigator.appVersion.indexOf("MSIE 10"),s=!!navigator.userAgent.match(/Trident.*rv:11\./),n=l.querySelectorAll("iframe.wp-embedded-content");for(t=0;t<n.length;t++){if(!(r=n[t]).getAttribute("data-secret"))a=Math.random().toString(36).substr(2,10),r.src+="#?secret="+a,r.setAttribute("data-secret",a);if(i||s)(e=r.cloneNode(!0)).removeAttribute("security"),r.parentNode.replaceChild(e,r)}}}}(window,document);
//--><!]]>

I started to think I needed a physical controller since most of the docs are oriented around his setup. However, I revisted the Android options and downloaded the [Unifi Network app](https://play.google.com/store/apps/details?id=com.ubnt.easyunifi&amp;hl=en). Upon opening you get the following screen:
![](/content/images/2020/05/Screenshot_20200517-223735-1.png)
Again with the controller emphasis. Unintuitively, if you click on account you can then access setting up 'Standalone Devices'.
![](/content/images/2020/05/Screenshot_20200517-223744-1.png)
It's at this point you can search and add your new Unifi device. Once added, you can then tinker with the configuration. What's really nice is that the 2G and 5G by default share the same SSID - i.e. unlike lots of homes that have a network for each, the UniFi device optimises the network based on the strength of connection with a device on the network. 😎
![](/content/images/2020/05/Screenshot_20200517-221603-4.png)
## Results 

I had installed the access point right next to the router. I experienced immediate results as I walked through the deadzone. My mobile switched automatically to the Unifi network once a little way down the garden. And all the way to the garden shed. What I didn't test was inside the shed - it's amazing how buildings kill WiFi. Patch at best to no signal inside. 🤯
I decided to run a 10m cable between the router and the Unifi AP such that the Unifi device sits right at the window onlooking the garden. Now getting very strong signal across the garden - significant drop off ~80% once inside the shed, but at least it was a consistent connection. Based on several speed tests, I was getting 3mbs - 13mbs. That'll do pig. 👍

### Semi-helpful docs
[

UniFi - Device Adoption Methods for Remote UniFi Controllers

Overview This article describes several different layer-3 methods for adopting and deploying UniFi devices remotely. Our recommended methods are found below under the Chrome Web Browser and Mobile...

![](https://theme.zdassets.com/theme_assets/77613/9582a1ec2edfbb499a97e723894d2e9a4d8c66dd.png)Ubiquiti Networks Support and Help Center

![](https://theme.zdassets.com/theme_assets/77613/ff7ff89edfceb228b54443702ffba57c08d686fc.png)
](http://help.ui.com/hc/en-us/articles/204909754)
