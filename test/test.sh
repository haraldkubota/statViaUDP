#!/bin/bash

. ./udpstats-bash.sh

logStart a1
logStart a2
logEnd a1
logEnd a2

logStart b1
logMsg b1 "Testing logs 1"
logEnd b1

logStart b1
logMsg b1 "Testing logs 1"
logMsg b1 "Testing logs 1"
logEnd b1

logStart b1
logMsg b1 "Testing logs 1"
logError b1

logError b2
logEnd b3

date
for i in {1..10000} ; do
echo $i >/dev/null
done

date
for i in {1..10000} ; do
logStart p$i
logMsg p$i Hall$i
logEnd p$i
done
date

