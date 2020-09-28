---
title: How to setup pyspark (with JupyterLab)
slug: lkasdjflksajdf
date_published: 1970-01-01T00:00:00.000Z
date_updated: 2019-03-08T14:01:28.000Z
draft: true
---

## Prerequsite

Ensure you have Java 8 or greater:

    $ java -version
    java version "1.8.0_171"
    Java(TM) SE Runtime Environment (build 1.8.0_171-b11)
    Java HotSpot(TM) 64-Bit Server VM (build 25.171-b11, mixed mode)
    

## Step 1 - Download the latest Apache Spark

[Download the latest Apache Spark](https://spark.apache.org/downloads.html) pre-built for the latest version of Apache Hadoop.

    # Unzip
    $ tar -xzf spark-1.2.0-bin-hadoop2.4.tgz
    # Where you move it to is up to you
    $ mv spark-2.3.1-bin-hadoop2.7 ~/spark
    

## Step 2 - Export the path for Bash

In other words, tell your terminal where to find spark.

    export SPARK_HOME=~/spark
    export PATH=$SPARK_HOME/bin:$PATH
    

At this point you should be able to launch pyspark form your terminal.

    $ pyspark
    Python 2.7.15 (default, Jul 23 2018, 21:27:06)
    [GCC 4.2.1 Compatible Apple LLVM 9.1.0 (clang-902.0.39.2)] on darwin
    Type "help", "copyright", "credits" or "license" for more information.
    2018-08-12 16:14:53 WARN  NativeCodeLoader:62 - Unable to load native-hadoop library for your platform... using builtin-java classes where applicable
    Setting default log level to "WARN".
    To adjust logging level use sc.setLogLevel(newLevel). For SparkR, use setLogLevel(newLevel).
    Welcome to
          ____              __
         / __/__  ___ _____/ /__
        _\ \/ _ \/ _ `/ __/  '_/
       /__ / .__/\_,_/_/ /_/\_\   version 2.3.1
          /_/
    
    Using Python version 2.7.15 (default, Jul 23 2018 21:27:06)
    SparkSession available as 'spark'.
    

If like me pyspark launch with python2.7 fix it by running the following command:

    export PYSPARK_PYTHON=python3
    

## Step 3 - Launch pyspark with JupyterLab

[JupyterLab](http://jupyterlab.readthedocs.io/en/stable/) is my preferred Python IDE when it comes to working with data. To install JupyterLab see [these instructions](https://github.com/jupyterlab/jupyterlab#installation). There are two options to launch with JupyterLab.

You can test whether you have successfully launched pyspark by using the Pi Estimation code from [Apache Spark's docs](https://spark.apache.org/examples.html) (small adjustments made for python3):

    # python 2
    import random
    NUM_SAMPLES = 1000000
    
    def inside(p):
        x, y = random.random(), random.random()
        return x*x + y*y < 1
    
    count = sc.parallelize(xrange(0, NUM_SAMPLES)) \
                 .filter(inside).count()
    print "Pi is roughly %f" % (4.0 * count / NUM_SAMPLES)
    

### Option 1 - FindSpark package (recommended)

Findspark adds pyspark to sys.path at runtime.

Install `findspark`:

    $ pip3 install findspark
    

This option is recommended as a limitation of JupyterLab is you can't link a text file to an existing Console per Option 2. This approach starts with an editor (e.g. cool_spark_code.py) and when you right-click you can select the option *Create Console for Editor*.

### Option 2 - Export the Pyspark Driver for Python

This tells your terminal what to launch with pyspark.

    export PYSPARK_DRIVER_PYTHON="jupyter"
    `
    

## Resources

- [Jupyter Lab Github Issue](https://github.com/jupyterlab/jupyterlab/issues/3334)
- [Get Started with PySpark and Jupyter Notebook in 3 Minutes](https://blog.sicara.com/get-started-pyspark-jupyter-guide-tutorial-ae2fe84f594f)
