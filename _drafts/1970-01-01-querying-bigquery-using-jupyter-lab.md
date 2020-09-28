---
title: Querying Bigquery using Jupyter Lab
slug: querying-bigquery-using-jupyter-lab
date_published: 1970-01-01T00:00:00.000Z
date_updated: 2020-04-17T13:46:38.000Z
draft: true
---

    # Terminal commands prior to running
    #   $ gcloud auth application-default login
    #   $ pip3 install --user --upgrade google-api-python-client
    # ref: https://googleapis.dev/python/bigquery/latest/magics.html
    # 
    from google.cloud import bigquery
    %load_ext google.cloud.bigquery
    # Set your default project here
    from google.cloud.bigquery import magics
    from google.oauth2 import service_account
    magics.context.project = 'monzo-analytics'
    
    %%bigquery
    SELECT distinct staff_user_id
    FROM `monzo-analytics.prod.stg_staff_events_no_pii`
    where end_date < start_date

## Reference

- [This one got me started - but I got quite a few errors, so documented what worked for me](https://towardsdatascience.com/using-jupyter-notebook-to-manage-your-bigquery-analytics-c4dc7b2a4113)
