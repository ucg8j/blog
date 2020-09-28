---
title: Docker in 5 Minutes
slug: docker-in-5-minutes
date_published: 1970-01-01T00:00:00.000Z
date_updated: 2017-12-06T15:46:41.000Z
draft: true
---

[https://embano1.github.io/post/scratch/](https://embano1.github.io/post/scratch/)

## Tips

running out of space on a VM

    docker ps --filter status=dead --filter status=exited -aq \
      | xargs docker rm -v
    

OR

    sudo service docker restart 
    
