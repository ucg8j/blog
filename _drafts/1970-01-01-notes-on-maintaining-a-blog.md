---
title: Notes on Maintaining a Blog
slug: notes-on-maintaining-a-blog
date_published: 1970-01-01T00:00:00.000Z
date_updated: 2020-04-13T09:11:56.000Z
draft: true
---

## Chrome Page Audit

Use Chrome's Page Audit tool to get a sense of where to get the biggest impact to optimise your website.

## Image compression

`jpegoptim image.jpg` will losslessly compress an image and replace the file.

Reach a target kilabyte size using the size parameter `jpegoptim image.jpg -S 128`.

[Further usage](http://ask.xmodulo.com/compress-jpeg-images-command-line-linux.html).

## Transferring local files to server

`scp image.jpg user@103.276.25.13:/var/www/ghost/content/images/2017/07/`

## notes on running in a container

[https://blog.dteuchert.com/create-your-blog-with-ghost/](https://blog.dteuchert.com/create-your-blog-with-ghost/)
[https://blog.alexellis.io/keeping-shipping-your-blog/](https://blog.alexellis.io/keeping-shipping-your-blog/)

## Upgrade from V0 to V3 notes

    upgrade 0.5.10 to v1.25.5 [releases]https://github.com/TryGhost/Ghost/releases?after=1.24.2:
    https://www.ghostforbeginners.com/how-to-upgrade-from-ghost-0-11-x-to-ghost-1-0/
        test docker upgrade locally
        https://ghost.org/faq/upgrade-to-ghost-1-0/
            Backup content 
                Export the blog settings and data (exports a json) from website: https://lukesingham.com/ghost/settings/labs/
                backup content folder  scp -r root@104.236.76.13:/var/www/ghost/content .
            build docker image https://hub.docker.com/_/ghost/
                `docker pull ghost:1.26.2`
                https://github.com/docker-library/ghost/blob/e28a0e3482e710ed353fc2eecd8a4cf435fea045/1/debian/Dockerfile
            run v1.25.5 locally in docker
            docker run -d -p 3001:2368 -v /Users/lsingham/projects/lukesingham.com/contentBAK2018-09-15/content/images:/var/lib/ghost/content/images ghost-1.25.5
                mount content/images 
                    docker run -d -p 3001:2368 -v /Users/lsingham/projects/lukesingham.com/contentBAK2018-09-15/content/images:/var/lib/ghost/content/images ghost-1.25.5
            run import of json backup on local v1.25.5
                log into the new ghost interface by following the prompts
                n.b warnings on import are fine as auto fallback to user created
            delete default posts by deleting ghost user
            issue with churn R post - since embedded html in the post
                remove header div classes <div id="logistic" class="section level3">
                    And closing divs
                fix saved Users/lsingham/projects/lukesingham.com/R-churn-post-FIX.txt
                    not perfect, div width inheritance seems a little screwed:
                        check the closing divs?
                        start again
                            delete import from currently running docker? else re-run all steps up until here
            install docker on vps
                wget -qO- https://get.docker.com/ | sh # not sure if this gets the right version
                sudo usermod -aG docker $(whoami)
                sudo apt-get -y install python-pip
                docker pull ghost:1.26.2
                fix before runnign https://stackoverflow.com/questions/55746291/oci-runtimecontainer-linux-go348-error-in-docker
            save and transfer image to vps? 
            deploy v1
            code highlighting not working
    is certbot
        backup in repo
            nginx config
            certbot script
            /etc/cron.d/certbot
    now ghost is in a container, upgrade server from ubuntu 12 -> 16
        nginx config
        setup certbot https://certbot.eff.org/lets-encrypt/ubuntuother-nginx
        install docker
        run ghost docker
        sync files
    blog is running with:
    docker run -d -e url=https://lukesingham.com -p 3001:2368 --restart=always -v /var/www/ghost/content/images:/var/lib/ghost/content/images -t ghost:3.2.0-alpine
    backup
        export current json
        test locally latest image
            docker pull ghost:3.13.1-alpine
            copy content folder from serverii
            scp -r root@104.236.76.13:/var/www/ghost/content .
            docker run -d -e url=https://lukesingham.com -p 3001:2368 --restart=always -v content/images:/var/lib/ghost/content -t 3.13.1-alpine
            run image
            docker run -d -p 3001:2368 --restart=always -v content/images:/var/lib/ghost/content -t ghost:3.13.1-alpine
        update on server
            docker pull ghost:3.13.1-alpine
            stop container
            clear docker crud
                docker ps
                docker system prune -a
            docker run -d -e url=https://lukesingham.com -p 3001:2368 --restart=always -v /var/www/ghost/content:/var/lib/ghost/content -t ghost:3.13.1-alpine
    
