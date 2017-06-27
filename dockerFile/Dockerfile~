FROM private.registry.rms:5000/rms/rms-base:v1
ARG git_commit=unknown
ARG version=unknown
ARG user=unknown
MAINTAINER Maty Zisserman <matyz@rafael.co.il>

LABEL git_commit=$git_commit \
      version=$version \
      user=$user
ENV git_commit=$git_commit \
      version=$version \
      user=$user
RUN apt-get update && apt-get install -y --force-yes ssh-client && apt-get clean && rm -rf /var/lib/apt/lists/*
RUN npm --registry=http://cir-srv01:4873  install -g nodemon
RUN mkdir /vod
COPY . /vod
WORKDIR /vod/worker-statistics-client
CMD ["npm","start"]

