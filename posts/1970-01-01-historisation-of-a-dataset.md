---
title: learning notes on HDFS,  YARN, Spark
slug: historisation-of-a-dataset
date_published: 1970-01-01T00:00:00.000Z
date_updated: 2020-03-17T10:06:33.000Z
draft: true
---

### HDFS

- *Name node* knows where things go on the *data nodes
- *There is a *replication factor*, so if a data node goes down data is still available. So when data goes to a data node, the name node sends intructions of which data nodes the recieving data node should replicate to.
- how does the Name Node know where everything is? Firstly it has a FS image where everything is. And an edit log of changes that have been made.
- if the name node went down you wouldn’t know where to put/get things from HDFS. So there are two name nodes an active and a backup/passive one.

- on the name node, run hdfs balancer after pruning to try and recover nodes i.e. reudce them below 85% where they start to fail. Can also run this with different thresholds if necessary (see HDFS Runbook ([https://rtfm.palantir.build/docs/hadoop-runbook/master/maintenance/pages/rebalance.html](https://rtfm.palantir.build/docs/hadoop-runbook/master/maintenance/pages/rebalance.html))) and this [http://www.informit.com/articles/article.aspx?p=2755708&seqNum=5](http://www.informit.com/articles/article.aspx?p=2755708&amp;seqNum=5)

* you can increase bandwidth whilst (though why not before) hdfs balancer is running: ./hdfs dfsadmin -setBalancerBandwidth 104857760

* Check the bandwidth available on your ethernet card first ethtool eth0 could be eth1

## YARN

- Yarn a resource manager.
- Containers/executors spin up on boxes.
- Resource mgmt policies, e.g. fair share.
- Preemption.
- Dynamic resource allocation.

## SPARK

- Each executor is a JVM
- shuffling happens when the data that is required for a computation lives on different executors
- to determine what data goes where, a executor will divvy up it’s data and send it out to other executors
- (speaking physically about the data) there are shuffle joins which are useful when you have two large datasets. And there are broadcast joins, where the entire B dataset is sent to the executors that have parts of the A dataset.

E.g. table A is a TB, and table B is a MB. Doing a shuffle where the TB is sent out across the network will be take up a lot of network capacity. Whereas, sending table B to all the executors would be cheap.
- Joining on nulls is dangerous, so you have 5million nulls, spark will see that as the same key and ship them to one executor, if that’s say 10gig of data then you will get a OOM error.
- Non-splittable files are problematic, e.g. gzip files where spark will try and load it into memory, and if you have a big gzip this quickly becomes problematic. Better to added a prior step in your pipeline that breaks up the file prior to feeding it to spark.
- sparkContext is the connection to the driver

[https://johnpaton.net/posts/forward-fill-spark/](https://johnpaton.net/posts/forward-fill-spark/)

Colleague asked about solution on filling nulls in from last known good value. [https://stackoverflow.com/a/45374955/3691003](https://stackoverflow.com/a/45374955/3691003)

## MISC

    raise RuntimeError(output_df)
    

historicisation of a dataset that has a changing schema

- serialise all cols into a dataset containing one col blob (e.g json) then deserialise in a third datset

    def get_all_fieldnames(a_list_of_dfs):
        '''Return two sets:
            1. columns - all column names
            2. structs - all structFields'''
        columns = set([])
        structs = set([])
        for df in a_list_of_dfs:
            for col in df.schema.fieldNames():
                columns.add(col)
            for struct in df.schema:
                structs.add(struct)
    
        # when the length isn't the same, indicates more than one type used for same col name upstream
        assert len(columns) == len(structs)
        return columns, structs
    
    
    def get_super_dataset(df, columns, schema):
        '''Return a dataset with additional columns if additional columns are in provided schema'''
        missing_columns = [col for col in columns if col not in df.schema.fieldNames()]
        for col in missing_columns:
            for struct in schema:
                if col == struct.name:
                    df.withColumn(col, F.lit(None).cast(struct.typeName))
        return df
    
    
    # create test dfs
    df1 = spark_session.createDataFrame(
        data=['wibble', 'wobble'],
        schema=['foo', 'bar']
    )
    df2 = spark_session.createDataFrame(
        data=['wibble', 'wobble', 'whoah'],
        schema=['foo', 'bar', 'baz']
    )
    
    # create a list of dfs allowing for iteration
    list_of_dfs = [df1, df2]
    
    columns, structs = get_all_fieldnames(list_of_dfs)
    
    all_super_dfs = [get_super_dataset(df) for df in list_of_dfs] 
    
