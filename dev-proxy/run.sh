#! /bin/bash

PROXY_DIR_PATH=${PWD}

if [[ $PWD != *"dev-proxy"* ]]; then
  PROXY_DIR_PATH="$PROXY_DIR_PATH/dev-proxy"
fi

docker run \
  --rm \
  -d \
  --name dev-proxy \
  --net=host \
  -v ${PROXY_DIR_PATH}/nginx.conf:/etc/nginx/conf.d/nginx.conf \
  nginx:latest
