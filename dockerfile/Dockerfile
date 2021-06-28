ARG BASE_PRIVATE_REGISTRY=""
FROM ${BASE_PRIVATE_REGISTRY}node:14.5.0 as install
ADD ./package-lock.json ./package.json /hkube/simulator/
WORKDIR /hkube/simulator
RUN npm ci --production

ARG BASE_PRIVATE_REGISTRY=""
FROM ${BASE_PRIVATE_REGISTRY}hkube/base-node:v1.2.0
LABEL maintainer="yehiyam@gmail.com"
COPY ./package.json ./package-lock.json /hkube/simulator/
COPY build /hkube/simulator/build
COPY server /hkube/simulator/server
COPY --from=install /hkube/simulator/node_modules /hkube/simulator/node_modules
WORKDIR /hkube/simulator
CMD ["npm", "run", "start:server"]