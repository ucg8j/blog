---
title: Map of Australia Using OpenStreetMaps, PSMA, R and Leaflet.js
slug: map-of-australia-using-osm-psma-and-shiny
date_published: 2016-08-10T04:35:16.000Z
date_updated: 2020-04-21T20:22:32.000Z
tags: r, viz, javascript, geospatial, leaflet.js
---

**Aim:** To use GNAF (Geocoded National Address File) data to display the adminstrative boundaries (e.g. States) on top of Open Street Maps. Additionally, I want the user when hovering over a state to see summary statistics. I want an Australian version of [this](#leafletjs).

## Data

G-NAF, is data containing all Australian addresses with geocoding, shape files for boundaries of states, electorates, municipals. It is the geocoding of a nation. And finally was released on data.gov.au this year. [Here's a nice GNAF data overview.](https://docs.google.com/viewer?url=http%3A%2F%2Fminus34.com%2Fopendata%2Fintro-to-gnaf.pptx&amp;embedded=true&amp;chrome=false&amp;dov=1) N.B. One set of data that is missing from the release is the [postcode boundaries](https://www.psma.com.au/products/postcode-boundaries).

### State Boundaries

My initial geojson to get started was sourced from this [github repo](https://raw.githubusercontent.com/edwinsteele/d3-projects/master/data/au-states.geojson).

### Postcode Boundaries

I obtained [the shape file for Australian postcodes](http://www.abs.gov.au/AUSSTATS/abs@.nsf/DetailsPage/1270.0.55.003July%202011?OpenDocument) from the Australian Bureau of Statistics. I then converted the shapefile to geojson (helpful tutorial [here](http://ben.balter.com/2013/06/26/how-to-convert-shapefiles-to-geojson-for-use-on-github/)):

    # Convert shp file to geojson
    $ ogr2ogr -f GeoJSON -t_srs crs:84 au-postcodes.geojson POA_2011_AUST.shp
    

The resulting geojson is a whooping 201.1mb. There are two more processes to consider. Firstly, simplification of the polygons to reduce the load on the browser. The most popular algorithm to use for this is the [Ramer–Douglas–Peucker algorithm](https://en.wikipedia.org/wiki/Ramer%E2%80%93Douglas%E2%80%93Peucker_algorithm). In R have a look at [`gSimplify()`](http://www.inside-r.org/packages/cran/rgeos/docs/gSimplify) however I am going to use the [mapshaper command line tool](https://github.com/mbloch/mapshaper) as I prefer command line tools and mapshaper has a couple of implementations of Visvalingam's polygon simplification algorithm.

    # Install package
    $ npm install -g mapshaper
    
    # Run Visvalingam simplification retaining 10% of polygons
    $ mapshaper -i au-postcodes.geojson -simplify 10% -o au-postcodes-Visvalingam-0.1.geojson
    

The size of the `au-postcodes-Visvalingam-0.1.geojson` file is about 10% of the size of `au-postcodes.geojson` file.

![Polygon Simplification](/content/images/2017/08/polygon-simplification.gif)

Secondly, we may want to reduce the file size by 'minifying' or 'packing' the data by removing all spaces and new lines. This can be done using [geojson-minify](https://github.com/igorti/geojson-minifier). Packing the `au-postcodes.geojson` file from above with the command below reduced the file size to 19.1mb.

    $ npm install -g geojson-minifier
    $ geojson-minifier -o pack -f au-postcodes.geojson
    

## Maps

So `library(rgdal)` seems pretty essential but if you're using a mac like I am, here you run into some pain. If you try running `install.packages('rgdal')` it will exit with a status of 0. Installing the underlying `gdal` dependency fixes the problem.

    $ brew install gdal
    

After installing gdal, `install.packages('rgdal')` ran just fine.

## Adding Data to the Shapefile

I used R for this process, `rgdal` allows you to do joins on shape files so you can attribute data to the geographical areas.

    library(rgdal)      # Spatial data processing
    library(jsonlite)   # Read json files
    library(readr)      # Fast I/O
    
    # Postcode shape json
    gdal.postcodes <- readOGR("au-postcodes-Visvalingam-0.1-density.geojson", "OGRGeoJSON")
    
    # Read data you want to join to the shape file
    df <- read_csv("your_data.csv")
    
    # Change to character for leading 0s in NT postcodes
    df$cleaned_postcode <- sprintf("%04d", df$postcode)
    
    # Join agg values onto postcode (returns)
    gdal.postcodes@data <- sp::merge(gdal.postcodes@data, df , by.x = "POA_NAME", by.y = "cleaned_postcode", all.x = TRUE)
    
    # Write to a new file
    writeOGR(gdal.postcodes, 'au-postcodes-Visvalingam-0.1-density.geojson','spDf', driver = 'GeoJSON', check_exists = FALSE)
    

## Leaflet.js

To display the information in a standalone single page app I started with this [leaflet choropleth example](http://leafletjs.com/examples/choropleth-example.html).

There's a few things to customise to an Australian version:

### 1. Getting the Data into the Webpage

I modified the page to read `au-postcodes-Visvalingam-0.1-density.js`. You can't just read a `.json` file in the head of your page, for options on how to get data to load on your page see this [helpful SO answer](http://stackoverflow.com/a/13576588/3691003). I went with option two, I opened the `au-postcodes-Visvalingam-0.1-density.geosjson` and inserted `var postcodesData =` at the beginning of the data array and put a `;` to end the variable declaration.

    var postcodesData = {
    ...
    };
    

Then save as `.js`. Now you can read the `au-postcodes-Visvalingam-0.1-density.js` file in the `head` of your html.

    <head>
    <!-- load geojson data as "postcodeData" -->
    <script src="au-postcodes-Visvalingam-0.1-density.js"></script>
    ...
    </head>
    

At the bottom of your page you will need to ensure the `postcodesData` is referenced in the declaration of the `geojson` variable. This is also when the leaflet functions defining style and hover events are pointed to the postcode shapes.

    // add all options to the polygons
    geojson = L.geoJson(postcodesData, {
    	style: style,
    	onEachFeature: onEachFeature
    }).addTo(map);
    

### 2. Setting Initial Location and Zoom on Page Load

To open on Australia instead of the US the key piece of code you need to set is the latitude and longitude coordinates along with the zoom level. This required a little bit of playing around to get the desired look. N.b I set the zoom level to 4 in the code below, don't try finely tuning with decimal places as tiles are only available for integers. I learnt the hard way!

    // set up the map
    var map = L.map('map').setView([-27.833, 133.583], 4);
    

### 3. Dynamically Fit the Map to Fill the Device Screen Size

There is one issue with setting the zoom, since the zoom of the map is fixed and the device size is variable depending on the device being used. For example, if you set the zoom using your desktop screen, then loaded the page on a mobile device with a fraction of the screen real estate you will only see a fraction of Australia.

#### a. Set the Viewport

[Check out W3's intro to the viewport](http://www.w3schools.com/css/css_rwd_viewport.asp). Included the following in the head of your html.

    <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0"/>
    

#### b. Change the #map Styling

The leaflet choropleth example has the following styling applied to the `div` map:

    #map { width: 800px; height: 500px; }
    

This is a fixed size, we want to change this to be relative. The following will fit to any screensize

    #map { position: absolute; top: 0; right: 0; bottom: 0; left: 0; }
    

#### c. Set Relative Zoom

The steps before fix the filling of the screen. So now we have variable screen fill and fixed zoom. What we want is variable screen fill and variable zoom. That way, leaflet will automatically zoom to the maximum it can whilst keeping all of Australia visible on the device. Thankfully, leaflet provides a function for this, `fitbounds`. We need to change this:

    // set up the map
    var map = L.map('map').setView([-27.833, 133.583], 4);
    

If you imagine a box containing Australia, then draw a diagonal through that box, the latitude and longitude of the diagnoal line's endpoints are what the `fitBounds()` constructs as a container from. I picked a point at the south easter tip of Tasmania and the other to the north west of Western Australia. Here's the code:

    // set up the map
    var map = L.map('map').setView([-27.833, 133.583]).fitBounds(
    [ [-43.21, 147.8], [-12.5, 117.2] ]
    );
    

If you've found this content helpful why not...
.bmc-button img{width: 27px !important;margin-bottom: 1px !important;box-shadow: none !important;border: none !important;vertical-align: middle !important;}.bmc-button{line-height: 36px !important;height:37px !important;text-decoration: none !important;display:inline-flex !important;color:#000000 !important;background-color:#FFDD00 !important;border-radius: 3px !important;border: 1px solid transparent !important;padding: 1px 9px !important;font-size: 22px !important;letter-spacing: 0.6px !important;box-shadow: 0px 1px 2px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5) !important;margin: 0 auto !important;font-family:'Cookie', cursive !important;-webkit-box-sizing: border-box !important;box-sizing: border-box !important;-o-transition: 0.3s all linear !important;-webkit-transition: 0.3s all linear !important;-moz-transition: 0.3s all linear !important;-ms-transition: 0.3s all linear !important;transition: 0.3s all linear !important;}.bmc-button:hover, .bmc-button:active, .bmc-button:focus {-webkit-box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5) !important;text-decoration: none !important;box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5) !important;opacity: 0.85 !important;color:#000000 !important;}[buy me a coffee](https://www.buymeacoffee.com/6uRXFwMJD)
### Other Useful Resources Encountered

- 
[Shapefiles for all countries](http://gadm.org/country)

- 
[Creating maps in R](https://github.com/Robinlovelace/Creating-maps-in-R/blob/master/vignettes/geoJSON.Rmd)

- 
[Useful leaflet Github comments](https://github.com/rstudio/leaflet/issues/55)

- 
[Joe Cheng, as always a pioneeR](http://rpubs.com/jcheng/us-states-2)

- 
[Convert shape file formats](https://github.com/mbostock/topojson/wiki/Command-Line-Reference)
