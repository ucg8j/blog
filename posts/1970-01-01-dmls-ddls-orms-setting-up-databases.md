---
title: DMLs, DDLs, ORMs... setting up databases
slug: dmls-ddls-orms-setting-up-databases
date_published: 1970-01-01T00:00:00.000Z
date_updated: 2018-03-16T11:32:38.000Z
draft: true
---

# definitions of dmls and ddls

[http://www.tomjewett.com/dbdesign/dbdesign.php?page=ddldml.php](http://www.tomjewett.com/dbdesign/dbdesign.php?page=ddldml.php)

migrate to a new db

    # get user/roles
    pg_dumpall -h acrotrendproduct-postgresql.postgres.database.azure.com -U acrotrend@acrotrendproduct-postgresql postgres --globals-only > globals.sql
    
    # populate user/roles
    psql -h localhost -U luke.singham -d gsd2901 -p 5432 -f globals29.1.18.sql
    
    # download data
    pg_dump -C -h acrotrendproduct-postgresql.postgres.database.azure.com -U acrotrend@acrotrendproduct-postgresql postgres > gsd_dump2.sql
    
    # unset
    unset PGSSLMODE
    
    # populate
    psql -h localhost -U luke.singham -d postgres -p 5432 < gsd_dump.sql
    
    pg_dump -C -h acrotrendproduct-postgresql.postgres.database.azure.com -U acrotrend@acrotrendproduct-postgresql postgres > gsd_dump29.1.18.sql
    
    
