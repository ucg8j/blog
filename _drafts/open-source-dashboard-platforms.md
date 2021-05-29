# Metabase

Quickstart
`docker run -d -p 3000:3000 --name metabase metabase/metabase`

Has demo data and dashbaords.

Concept of asking a question
http://localhost:3000/question/new

3 ways to do this
  - simple
  - custom (notebook style)
  - SQL editor

Once done with your question, save it.

You can now search for this question in perpertuity building up org knowledge/analytics infrastructure.

Good for both simple users and advanced analysts.

version control on dashboards

permissions for groups of users

set up alerts / subscriptions - autodelivery
  - email or slack

@jack - comms used by unions?

Admin panel
  - define canonical metrics
      - useful for ensureing some basics don't get broken
  - auth
    - login/password
    - google
    - ldap

  - can enable publicly viewable graphs / dashboards
    - could embed in union websites etc

  - 


# Questions
## does it have csv support?
Not directly, requires csv -> db e.g. sqllite -> metabase

## supported dbs
https://www.metabase.com/docs/latest/administration-guide/01-managing-databases.html#officially-supported-databases

## licence
**Any issue with selfhosted / making money?**

## general health of repo

----------------

# Redash
## install take 1
Install via docker is much heavier, took a long time. plus npm
https://redash.io/help/open-source/dev-guide/docker

Errors encountered
```
FileNotFoundError

FileNotFoundError: [Errno 2] No such file or directory: '/app/redash/settings/../../client/dist/index.html'
```

Try without docker.

## install take 2
https://redash.io/help/open-source/dev-guide/setup

```
ERROR: Command errored out with exit status 1: /usr/local/opt/python@3.9/bin/python3.9 -u -c 'import sys, setuptools, tokenize; sys.argv[0] = '"'"'/private/var/folders/gd/7806sc2j17v8syz837twsffc0000gn/T/pip-install-exnjo1bp/gevent_ab5eacd65f784ba1b7c64436a4457622/setup.py'"'"'; __file__='"'"'/private/var/folders/gd/7806sc2j17v8syz837twsffc0000gn/T/pip-install-exnjo1bp/gevent_ab5eacd65f784ba1b7c64436a4457622/setup.py'"'"';f=getattr(tokenize, '"'"'open'"'"', open)(__file__);code=f.read().replace('"'"'\r\n'"'"', '"'"'\n'"'"');f.close();exec(compile(code, __file__, '"'"'exec'"'"'))' install --record /private/var/folders/gd/7806sc2j17v8syz837twsffc0000gn/T/pip-record-vhs9drcq/install-record.txt --single-version-externally-managed --compile --install-headers /usr/local/include/python3.9/gevent Check the logs for full command output.
```
**TODO: try in virtualenv and possibly try again with docker**


## cool features
https://redash.io/help/user-guide/integrations-and-api/how-to-use-google-spreadsheets-importdata-function
https://redash.io/help/user-guide/integrations-and-api/creating-a-zap


# Questions
## does it have csv support?
>You can’t upload files to Redash directly. Instead, you have to pull them from somewhere
https://redash.io/help/data-sources/querying/csv-files

## supported dbs
https://redash.io/help/data-sources/querying/supported-data-sources

## licence
**Any issue with selfhosted / making money?**

## general health of repo comment on tech



-----------------

# Superset
## install



## does it have csv support?


## supported dbs
https://superset.apache.org/docs/databases/installing-database-drivers

## licence
**Any issue with selfhosted / making money?**

## general health of repo

---------------

# open questions... 
 - slack usage
