FROM node:8-alpine
LABEL maintainer="yehiyam@gmail.com"
RUN apk --update add nano && \
    rm -rf /var/cache/apk/*
RUN mkdir /hkube
COPY . /hkube/simulator
RUN cd /hkube/simulator && npm rebuild
WORKDIR /hkube/simulator
CMD ["npm", "run", "start:server"]
