FROM node:8
MAINTAINER yehiyam@gmail.com
RUN apt update && apt install nano
RUN mkdir /hkube
COPY . /hkube/simulator
WORKDIR /hkube/simulator
CMD ["npm", "start"]