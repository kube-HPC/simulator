#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
echo "export PATH=$PWD/bin:$PATH" > setPath
source ./setPath
export PR_NAME="${TRAVIS_PULL_REQUEST_BRANCH,,}"; export PR_NAME="${PR_NAME//_/-}"
envsubst < ${DIR}/staging-template.yaml > ~/staging.yaml
kubectl apply -f ~/staging.yaml
kubectl patch deployment simulator-${PR_NAME} -p "{\"spec\": {\"template\": {\"metadata\": { \"labels\": {  \"redeploy\": \"$(date +%s)\"}}}}}"