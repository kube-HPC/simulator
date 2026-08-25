#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
# echo "export PATH=$PWD/bin:$PATH" > setPath
# source ./setPath
echo TRAVIS_PULL_REQUEST_BRANCH=$TRAVIS_PULL_REQUEST_BRANCH
# export PR_NAME="${TRAVIS_PULL_REQUEST_BRANCH,,}"
# docker tags are case-sensitive, and the image is built with the branch name as-is,
# so the image tag must keep the original casing. k8s object names must be lowercase.
export IMAGE_TAG="${PR_NAME//_/-}"
export PR_NAME="${PR_NAME,,}"
export PR_NAME="${PR_NAME//_/-}"
echo TAG=$IMAGE_TAG
echo NAME=$PR_NAME
envsubst < ${DIR}/staging-template.yaml > /tmp/staging.yaml
KUBECTL_CONTEXT_ARGS=()
if [[ -n "$KUBE_CONTEXT" ]]; then
  KUBECTL_CONTEXT_ARGS=(--context "$KUBE_CONTEXT")
fi
kubectl "${KUBECTL_CONTEXT_ARGS[@]}" apply -f /tmp/staging.yaml
kubectl "${KUBECTL_CONTEXT_ARGS[@]}" patch deployment dashboard-${PR_NAME} -p "{\"spec\": {\"template\": {\"metadata\": { \"labels\": {  \"redeploy\": \"$(date +%s)\"}}}}}"
