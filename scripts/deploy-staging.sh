#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
echo "export PATH=$PWD/bin:$PATH" > setPath
source ./setPath
envsubst < ${DIR}/staging-template.yaml > ~/staging.yaml
kubectl apply -f ~/staging.yaml
