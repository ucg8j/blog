---
title: How to Make a Local Backup of a Remote Postgres db Using SSL
slug: how-to-make-a-local-backup-of-a-remote-postgres-db-using-ssl
date_published: 1970-01-01T00:00:00.000Z
date_updated: 2018-01-29T12:03:24.000Z
draft: true
---

Here I've made a local copy of a remote postgres database (db) that requires an SSL connection. Ensuring you use an SSL connection with a remote db is one way to mitigate man-in-the-middle attacks whilst you transfer potentially sensitive data across the net.

One piece of kit I haven't come across before is [postgres.app](https://postgresapp.com/), I've installed Postgres on a MacBook a year or two ago and found it quite a fiddly error prone process. Postgres.app makes the setup incredibly easy, providing a nice little GUI to create and run local db servers and sorts out all the command line tools associated with Postgres.

    # set SSL remote
    export PGSSLMODE=require 
    
    # get user/roles
    pg_dumpall -h hostname -U username postgres --globals-only > globals.sql
    
    # download data
    pg_dump -C -h acrotrendproduct-postgresql.postgres.database.azure.com -U acrotrend@acrotrendproduct-postgresql postgres > gsd_dump2.sql
    
    # unset
    unset PGSSLMODE
    
    # populate user/roles
    psql -h localhost -U luke.singham -d postgres -p 5432 -f globals.sql
    
    # populate
    psql -h localhost -U luke.singham -d postgres -p 5432 < gsd_dump.sql
    

#### Further Resources

- [Very helpful SO on the difference between `pg_dump` and `pg_dumpall`](https://stackoverflow.com/a/16619878/3691003)
