---
title: How to Deploy Plotly's Dash using Shinyproxy
slug: how-to-deploy-plotlys-dash-using-shinyproxy
date_published: 2017-11-14T13:44:50.000Z
date_updated: 2019-08-04T12:16:05.000Z
tags: python, docker, dash.py, shinyproxy
layout: post.njk
---

In a [previous post](/shiny-containers-with-shinyproxy/#addingadditionalnonshinyapps) I established that I could easily deploy a 'Hello World' [flask.py](http://flask.pocoo.org/) web application using [Shinyproxy](https://www.shinyproxy.io/). Therefore, I thought it would be straightforward to deploy a [Dash](https://plot.ly/dash/) app which is built on top of [flask.py](http://flask.pocoo.org/). However, it proved to be a little more difficult than that. This blog post runs through the errors and eventual solution to deploying a Dash app on Shinyproxy.

##### The Issue

Dash apps, like most web apps, load additional static resources, but upon deploying on Shinyproxy these aren't being delivered to the client (browser) as the URL path is wrong. This results in the all too familiar **404 Not Found**. *Disclaimer*: I haven't programmed in Java or SpringBoot (yet!). However, as far as I can see from looking at [Chrome dev tools](https://developer.chrome.com/devtools) there are two ways Shinyproxy delivers static files to the client. I'm taking a look first at how it works with a [Shiny](https://shiny.rstudio.com/) app.

1. 
**Webjars** - I can see that the [main template of shinyproxy](https://github.com/openanalytics/shinyproxy/blob/master/src/main/resources/templates/app.html) loads the bootstrap CSS which also gets utilised by each Shiny app.

2. 
**Load from the container** - Additional static content for shiny apps is requested by using the container name, in this case `peaceful_jepsen` e.g.:

    Request URL:http://<my-ip-address>/peaceful_jepsen/dt-core-1.10.12/css/jquery.dataTables.min.css
    

Now let's move on to it not working with Dash...

## Deploying a Dash App on Shinyproxy

Using `react.min.js` as an example, I'm going to contrast how the app fetches static content on my local machine in a container vs Shinyproxy on a remote server. I'll do this by inspecting the path for the `GET` requests using [Chrome dev tools](https://developer.chrome.com/devtools). Firstly, what is the default behaviour of Dash.

> By default, dash serves the JavaScript and CSS resources from the online CDNs.
> 
> Source: [Dash Docs](https://plot.ly/dash/external-resources)

**Dash Container on my Local Machine**
![local-dash-cdn-get](/content/images/2017/11/local-dash-cdn-get.png)

All resources loaded and the application displayed correctly.

**Dash Container on Shinyproxy**
![shinyproxy-dash-cdn-get](/content/images/2017/11/shinyproxy-dash-cdn-get.png)

On Shinyproxy `react.min.js` gets loaded however `_dash-layout` and `_dash-dependencies` fail to GET the necessary resources from the `Request URL: http://<my-ip-address>/_dash-layout`. As we know from the Shiny app, the container name should be in there e.g. `Request URL: http://<my-ip-address>/<container_name>/_dash-layout`. This is how Dash is supposed to behave, looking at [the source code](https://github.com/plotly/dash/blob/4ee769d3593d5297602c2bb6faca0eb63884d480/dash/dash.py#L74) we can see a configurable `routes_pathname_prefix` (I'll come back to this later in the post). So a possible solution is to get the Dash app to obtain the container name from which it is running.

The [Dash Docs](https://plot.ly/dash/external-resources) have the following lines of code to serve content locally.

    app.css.config.serve_locally = True
    app.scripts.config.serve_locally = True
    

Let's see how that changes the behaviour.

**Dash Container on my Local Machine**
![local-dash-serve-local-get](/content/images/2017/11/local-dash-serve-local-get.png)

Since all static content is now requested from Dash this is probably going to prevent all content from being loaded on Shinyproxy.

**Dash Container on Shinyproxy**
![shinyproxy-dash-serve-local-get](/content/images/2017/11/shinyproxy-dash-serve-local-get.png)

Yup! A whole lot of red 404s.

Essentially it doesn't matter if you configure Dash to serve static files locally, the underlying issue is the relative URL route prefix. We know from the [Dash source code](https://github.com/plotly/dash/blob/master/dash/dash.py#L50) how we could prefix the URL route. However, Shinyproxy is already doing this for Shiny apps, what's different for the requests from Dash?

I started scouring the Shinyproxy Java code base. I found the construction of the `containerPath` in [Shinyproxy's AppController.java](https://github.com/openanalytics/shinyproxy/blob/f934f108573f1ed1d24a719d9e0815012240e11f/src/main/java/eu/openanalytics/controllers/AppController.java#L74). But since I am not a Java developer I decided that this would probably not be the best allocation of my efforts. However, what the `containerPath` does show is the construction of the path begins with `'/'`.

Another approach I thought of was obtaining the container name from within the Dash application and appending that to the GET URL requests initiated Dash. Alas, Docker doesn't allow that. You can access the ContainerID but not the ContainerName. There is a [3 year old open issue regarding this](https://github.com/moby/moby/issues/8427). I then started looking for an easy way to pass into the container the containerName but I couldn't find a non-hacky way to do that either.

**Sidenote** - I was wondering what the logic was on the container name generation e.g. `adorin_raman`. If you look at the docker source code you will find [some go-lang code called `names-generator.go`.](https://github.com/moby/moby/blob/master/pkg/namesgenerator/names-generator.go) This contains two lists, a list of adjectives and a list of "notable scientists and hackers". The function that randomly combines these into a container name formatted as "adjective_surname" has one funny exception:

    if name == "boring_wozniak" /* Steve Wozniak is not boring */ {
    	goto begin
    }
    

Two other approaches that weren't very appealing would have been managing the resources as [webjars](https://www.webjars.org/) or an [Nginx](https://nginx.org/en/) redirect.

## The Final Solution

I posted [a question to the shinyproxy forum](https://support.openanalytics.eu/t/what-is-the-best-way-of-delivering-static-assets-to-the-client-for-custom-apps/363/5), [Frederick](http://www.fcm-consulting.be/resume.html) one of the main authors responded with:

> Then that means the href being used was `/_dash-layout` and not `_dash-layout`.
> 
> Do you control the hrefs? If so, removing the slash may solve your issue. If not, it becomes trickier… you could use javascript and extract the correct URL from window.location.

If we dig into the [dash.py code](https://github.com/plotly/dash/blob/master/dash/dash.py) We can see the construction of the URL paths for `_dash-layout``_dash-dependencies` occurs on lines 73-80:

    add_url(
        '{}_dash-layout'.format(self.config['routes_pathname_prefix']),
        self.serve_layout)
    
    add_url(
    	'{}_dash-dependencies'.format(self.config['routes_pathname_prefix']), self.dependencies)
    

The next question is, where is `routes_pathname_prefix` defined? On lines 46-51 `routes_pathname_prefix` is mapped to `url_base_pathname`:

    self.url_base_pathname = url_base_pathname
    self.config = _AttributeDict({
        'suppress_callback_exceptions': False,
        'routes_pathname_prefix': url_base_pathname,
        'requests_pathname_prefix': url_base_pathname
    })
    

Which begs the question, where is url `url_base_pathname` defined... on lines 20-28:

    class Dash(object):
        def __init__(
            self,
            name=None,
            server=None,
            static_folder=None,
            url_base_pathname='/',
            **kwargs
        ):
    

As Frederick said, the request should not have the `'/'` prefix in the GET request. Unsurprisingly, having `'//'` in your request paths is not good practice (see this [SO answer](https://stackoverflow.com/a/20524044/3691003) and [this one](https://stackoverflow.com/a/10161264/3691003)) as it can cause problems depending on how requests are handled. The [software layers of Shinyproxy](/shiny-containers-with-shinyproxy/#post-content) are reasonably complex with requests being handled my multiple technologies. The best solution after this trouble-shooting exercise is to use the following code in your Dash app.

    # In order to work on shinyproxy (and perhaps other middleware)
    app.config.supress_callback_exceptions = True
    app.config.update({
        # remove the default of '/'
        'routes_pathname_prefix': '',
    
        # remove the default of '/'
        'requests_pathname_prefix': ''
    })
    

If you've found this content helpful why not...
.bmc-button img{width: 27px !important;margin-bottom: 1px !important;box-shadow: none !important;border: none !important;vertical-align: middle !important;}.bmc-button{line-height: 36px !important;height:37px !important;text-decoration: none !important;display:inline-flex !important;color:#000000 !important;background-color:#FFDD00 !important;border-radius: 3px !important;border: 1px solid transparent !important;padding: 1px 9px !important;font-size: 22px !important;letter-spacing: 0.6px !important;box-shadow: 0px 1px 2px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5) !important;margin: 0 auto !important;font-family:'Cookie', cursive !important;-webkit-box-sizing: border-box !important;box-sizing: border-box !important;-o-transition: 0.3s all linear !important;-webkit-transition: 0.3s all linear !important;-moz-transition: 0.3s all linear !important;-ms-transition: 0.3s all linear !important;transition: 0.3s all linear !important;}.bmc-button:hover, .bmc-button:active, .bmc-button:focus {-webkit-box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5) !important;text-decoration: none !important;box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5) !important;opacity: 0.85 !important;color:#000000 !important;}[buy me a coffee](https://www.buymeacoffee.com/6uRXFwMJD)
