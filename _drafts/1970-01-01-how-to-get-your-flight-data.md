---
title: How to get your flight data
slug: how-to-get-your-flight-data
date_published: 1970-01-01T00:00:00.000Z
date_updated: 2019-10-10T01:36:11.000Z
draft: true
---

Assumption:

- you use gmail

One advantage of having the Google mothership scanning all of your emails is to take advantage of getting what they know about you back. A little known piece of data google gives you access to is all Reservations, Flights and Purchases.

Once downloaded, how do I filter the jsons to flights only? Unfortunately Google doesn't make this easy by naming flight files with, I don't know, 'flight_xxxx.json'. Instead, looking at the jsons, the keys inside help e.g. it's very likely I am getting only flights if I search for orders with the key 'flightReservation'.

    # create a destination folder for flights
    mkdir only_flights
    
    # filter jsons, ensure unique and copy to only_flights
    grep -il 'flightReservation' * | \
      sort | \
      uniq | \
      xargs -I{} cp {} only_flights/
      
    # how many flights is that?
    ls | wc -l
    #195
    
