FROM hkube/base-node:v1.0.0
LABEL maintainer="yehiyam@gmail.com"
RUN mkdir /hkube
COPY . /hkube/simulator
RUN cd /hkube/simulator 
WORKDIR /hkube/simulator
CMD ["npm", "run", "start:server"]
