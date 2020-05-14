#!/bin/bash

#####
# usage: from project main run ./scripts/build-brance.sh
# will update helm values at ${HOME}/dev/hkube/helm/hkube/values.yaml
# to install: helm upgrade -i -f regular-values.yaml ${HOME}/dev/hkube/helm/hkube
#####
set -eo pipefail
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
export OUT_VALUES_DIR=${DIR}/../deployment/
mkdir -p ${OUT_VALUES_DIR}
export REPO=simulator
export TRAVIS_PULL_REQUEST=true
export TRAVIS_PULL_REQUEST_BRANCH=$(git rev-parse --abbrev-ref HEAD)
export PREV_BUILD_ID=$(cat ${OUT_VALUES_DIR}BUILD_ID)
export PREV_BUILD_ID=${PREV_BUILD_ID:-"0"}

echo PREV_BUILD_ID=$PREV_BUILD_ID
export TRAVIS_JOB_NUMBER=${BUILD_ID:-$((PREV_BUILD_ID+1))}

export OUT_VALUES=${OUT_VALUES:-${HOME}/dev/hkube/helm/hkube/values.yaml}
touch ${OUT_VALUES}
echo ${TRAVIS_JOB_NUMBER}>${OUT_VALUES_DIR}/BUILD_ID
echo "building branch ${TRAVIS_PULL_REQUEST_BRANCH} with id ${TRAVIS_JOB_NUMBER}"
VERSION=v$(jq -r .version ./package.json)
VERSION=${VERSION}-${TRAVIS_PULL_REQUEST_BRANCH}-${TRAVIS_JOB_NUMBER}
export PR_NAME=${VERSION}
echo building ${REPO}:${VERSION}
export PRIVATE_REGISTRY=docker.io/hkube
npm run build
yq w -i ${OUT_VALUES} $(echo ${REPO}|tr '-' '_').image.tag ${VERSION}

echo "build done for ${REPO}"
echo "all builds done."