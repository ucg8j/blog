---
title: A foray into Text Mining -  Part I
slug: a-foray-into-text-mining-part-i
date_published: 1970-01-01T00:00:00.000Z
date_updated: 2015-07-31T04:59:18.000Z
draft: true
---

have a go on mac using the apis wrapped in this package
[https://cran.r-project.org/web/packages/indicoio/index.html](https://cran.r-project.org/web/packages/indicoio/index.html)

    #helpful links
    # http://web.stanford.edu/class/cs124/lec/sentiment.pdf
    #
    library(tm)         
    library(wordcloud)
    library(SnowballC)
    library(dplyr)
    library(ggplot2)
    library(stringr)
    library(RWeka)
    
    setwd("/home/ucg8j/workforce/ScriptsMisc/Wordcloud/")
    
    # load text ####
    text <- readLines("/home/ucg8j/workforce/ScriptsMisc/Wordcloud/Corpora/2015CensusComments.txt")
    censusComments <- Corpus(VectorSource(text)) #vector source required in order to findAssoc() 
    
    # CLEANING COMMANDS ####
    # stripWhitespace
    censusComments <- tm_map(censusComments, stripWhitespace)  
    # command to lower case
    censusComments <- tm_map(censusComments, tolower)
    # remove common english words
    censusComments <- tm_map(censusComments, removeWords, stopwords("english"))
    # rule below useful for removing suffixes for the common 'stem'.
    censusComments <- tm_map(censusComments, stemDocument)
    # remove punctuation
    censusComments <- tm_map(censusComments, removePunctuation)
    # error fix...
    censusComments <- tm_map(censusComments, PlainTextDocument)
    
    # word cloud ####
    set.seed(123) #to replicate the same cloud
    #png("2015CensusCloud3.png", width = 12, height = 8, res = 300)
    wordcloud(censusComments
              , scale=c(5,0.1)
              , max.words=180
              , random.order=FALSE
              , rot.per=0.35 #rot[ate].per[centage] the amt of vertical words
              , use.r.layout=FALSE
              , colors=brewer.pal(8, "Dark2"))
    #dev.off() 
    
    # document-term matrix / frequency of terms ####
    dtm <- TermDocumentMatrix(censusComments)
    # tt <- findFreqTerms(dtm, lowfreq = 450)         #min of 450x mentioned
    # termFrequency <- rowSums(as.matrix(dtm[tt,]))
    
    # BAR PLOT w. some data manipulation ####
    m <- as.matrix(dtm)
    v <- sort(rowSums(m), decreasing = T)
    d <- data.frame(word = names(v), freq=v)
    d <- transform(d,word = reorder(word, freq))
    qplot(d[1:15,]$word, d[1:15,]$freq, geom = "bar", stat = "identity", ylab = "Mentions", xlab = "Words") +
       coord_flip()
    ggsave("termFreqBarPlotOrdered.png")
    
    # word associations ( not working)
    # assoc <- findAssocs(dtm, terms = "management", corlimit = 0.2)
    
    # Bi-Gram Frequency ####
    BigramTokenizer <- function(x) NGramTokenizer(x,
                                                  Weka_control(min=2,max=2))
    dtm2 <- DocumentTermMatrix(censusComments, control = list(tokenize = BigramTokenizer))
    freq <- sort(colSums(as.matrix(dtm2)), decreasing = T)
    wof <- data.frame(word=names(freq), freq=freq)
    wof <- transform(wof,word = reorder(word, freq))
    qplot(wof[1:15,]$word, wof[1:15,]$freq, geom = "bar", stat = "identity", ylab = "Mentions", xlab = "Words") +
        coord_flip()
    ggsave("BigramFreq.png")
    
    # Tri-Gram Frequency ####
    TrigramTokenizer <- function(x) NGramTokenizer(x,
                                                  Weka_control(min=3,max=3))
    dtm3 <- DocumentTermMatrix(censusComments, control = list(tokenize = TrigramTokenizer))
    freq <- sort(colSums(as.matrix(dtm3)), decreasing = T)
    wof <- data.frame(word=names(freq), freq=freq)
    wof <- transform(wof,word = reorder(word, freq))
    qplot(wof[1:15,]$word, wof[1:15,]$freq, geom = "bar", stat = "identity", ylab = "Mentions", xlab = "Words") +
        coord_flip()
    ggsave("TrigramFreq.png")
    
    # Quad-Gram Frequency ####
    QuadgramTokenizer <- function(x) NGramTokenizer(x,
                                                   Weka_control(min=4,max=4))
    dtm4 <- DocumentTermMatrix(censusComments, control = list(tokenize = QuadgramTokenizer))
    freq <- sort(colSums(as.matrix(dtm4)), decreasing = T)
    wof <- data.frame(word=names(freq), freq=freq)
    wof <- transform(wof,word = reorder(word, freq))
    qplot(wof[1:15,]$word, wof[1:15,]$freq, geom = "bar", stat = "identity", ylab = "Mentions", xlab = "Words") +
        coord_flip()
    ggsave("QuadgramFreq.png")
    
    #wordcloud...
    
    # correlation plot (NOT SO GOOD)
    # plot(dtm, 
    #      terms = findFreqTerms(dtm, lowfreq = 40)[1:25],
    #      corThreshold = 0.2)
    
    #Word Clustering Dendogram
    # tdmat <- as.matrix(
    #     removeSparseTerms(dtm, sparse = 0.8)
    # )
    # distMatrix <- dist(scale(dtm))
    # fit <- hclust(distMatrix, method="ward.D2")
    # plot(fit)
    
    # Sentiment Analysis (Jeffrey Breen attempt) ####
    #notes - improve the pos/neg txt inputs
    # - match in Groups/BSLs
    
    library(plyr)
    library(stringr)
    
    
    # function score.sentiment
    score.sentiment = function(sentences, pos.words, neg.words, .progress='none')
    {
        # Parameters
        # sentences: vector of text to score
        # pos.words: vector of words of postive sentiment
        # neg.words: vector of words of negative sentiment
        # .progress: passed to laply() to control of progress bar
        
        # create simple array of scores with laply
        scores = laply(sentences,
                       function(sentence, pos.words, neg.words)
                       {
                           # remove punctuation
                           sentence = gsub("[[:punct:]]", "", sentence)
                           # remove control characters
                           sentence = gsub("[[:cntrl:]]", "", sentence)
                           # remove digits?
                           sentence = gsub('\\d+', '', sentence)
                           
                           # define error handling function when trying tolower
                           tryTolower = function(x)
                           {
                               # create missing value
                               y = NA
                               # tryCatch error
                               try_error = tryCatch(tolower(x), error=function(e) e)
                               # if not an error
                               if (!inherits(try_error, "error"))
                                   y = tolower(x)
                               # result
                               return(y)
                           }
                           # use tryTolower with sapply 
                           sentence = sapply(sentence, tryTolower)
                           
                           # split sentence into words with str_split (stringr package)
                           word.list = str_split(sentence, "\\s+")
                           words = unlist(word.list)
                           
                           # compare words to the dictionaries of positive & negative terms
                           pos.matches = match(words, pos.words)
                           neg.matches = match(words, neg.words)
                           
                           # get the position of the matched term or NA
                           # we just want a TRUE/FALSE
                           pos.matches = !is.na(pos.matches)
                           neg.matches = !is.na(neg.matches)
                           
                           # final score
                           score = sum(pos.matches) - sum(neg.matches)
                           return(score)
                       }, pos.words, neg.words, .progress=.progress )
        
        # data frame with scores for each sentence
        scores.df = data.frame(text=sentences, score=scores)
        return(scores.df)
    }
    
    # import positive and negative words
    pos = readLines("positive_words.txt")
    neg = readLines("negative_words.txt")
    
    # apply function score.sentiment
    scores = score.sentiment(text, pos, neg, .progress='text')
    
    # add variables to data frame
    scores$very.pos = as.numeric(scores$score >= 2)
    scores$very.neg = as.numeric(scores$score <= -2)
    
    # how many very positives and very negatives
    numpos = sum(scores$very.pos)
    numneg = sum(scores$very.neg)
    
    # global score
    global_score = round( 100 * numpos / (numpos + numneg) )
    
    # boxplot
    ggplot(scores, aes(y=score))+
        geom_boxplot(aes(fill=drink))
    
    # write csv / view comments and score
    write.csv(scores, "censusCommentsSentiment.csv", row.names = F)
    
    # Sentiment Analysis (Bayesian approach - not yet tested) ####
    library(sentiment)
    
    some_txt <- text
    
    # remove retweet entities
    some_txt = gsub("(RT|via)((?:\\b\\W*@\\w+)+)", "", some_txt)
    # remove at people
    some_txt = gsub("@\\w+", "", some_txt)
    # remove punctuation
    some_txt = gsub("[[:punct:]]", "", some_txt)
    # remove numbers
    some_txt = gsub("[[:digit:]]", "", some_txt)
    # remove html links
    some_txt = gsub("http\\w+", "", some_txt)
    # remove unnecessary spaces
    some_txt = gsub("[ \t]{2,}", "", some_txt)
    some_txt = gsub("^\\s+|\\s+$", "", some_txt)
    
    # define "tolower error handling" function 
    try.error = function(x)
    {
        # create missing value
        y = NA
        # tryCatch error
        try_error = tryCatch(tolower(x), error=function(e) e)
        # if not an error
        if (!inherits(try_error, "error"))
            y = tolower(x)
        # result
        return(y)
    }
    # lower case using try.error with sapply 
    some_txt = sapply(some_txt, try.error)
    
    # remove NAs in some_txt
    some_txt = some_txt[!is.na(some_txt)]
    names(some_txt) = NULL
    
    # classify emotion
    class_emo = classify_emotion(some_txt, algorithm="bayes", prior=1.0)
    # get emotion best fit
    emotion = class_emo[,7]
    # substitute NA's by "unknown"
    emotion[is.na(emotion)] = "unknown"
    
    # classify polarity
    class_pol = classify_polarity(some_txt, algorithm="bayes")
    # get polarity best fit
    polarity = class_pol[,4]
    
    
