ARG BASE_PRIVATE_REGISTRY=""
FROM ${BASE_PRIVATE_REGISTRY}hkube/base-node:v1.2.0
LABEL maintainer="yehiyam@gmail.com"
RUN mkdir /hkube
COPY . /hkube/simulator
RUN cd /hkube/simulator 
WORKDIR /hkube/simulator
CMD ["npm", "run", "start:server"]
