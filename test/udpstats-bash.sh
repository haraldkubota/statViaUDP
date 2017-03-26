#!/bin/bash

L="/dev/udp/opz3.lan/41234"
APP="$0"

function logStart {
echo "$APP $1 START" >$L
}

function logMsg {
echo "$APP $1 LOG $2" >$L
}

function logError {
echo "$APP $1 ERROR" >$L
}

function logEnd {
echo "$APP $1 END" >$L
}

