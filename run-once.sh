#!/bin/bash
PROJECT_PATH=$1
NODE_PATH=$2

cd $PROJECT_PATH

$NODE_PATH dist/index.js scalp-all -h --incognito
