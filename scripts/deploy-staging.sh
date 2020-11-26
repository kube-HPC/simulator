#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
echo "export PATH=$PWD/bin:$PATH" > setPath
source ./setPath
echo TRAVIS_PULL_REQUEST_BRANCH=$TRAVIS_PULL_REQUEST_BRANCH
# export PR_NAME="${TRAVIS_PULL_REQUEST_BRANCH,,}"
export PR_NAME="${PR_NAME,,}"
export PR_NAME="${PR_NAME//_/-}"
echo TAG=$PR_NAME
envsubst < ${DIR}/staging-template.yaml > ~/staging.yaml
kubectl apply -f ~/staging.yaml
kubectl patch deployment simulator-${PR_NAME} -p "{\"spec\": {\"template\": {\"metadata\": { \"labels\": {  \"redeploy\": \"$(date +%s)\"}}}}}"