FROM node:8
MAINTAINER yehiyam@gmail.com
RUN apt update && apt install nano build-essential
RUN mkdir /hkube
COPY . /hkube/simulator
WORKDIR /hkube/simulator
RUN cd /hkube/simulator && npm i
CMD ["npm", "start"]