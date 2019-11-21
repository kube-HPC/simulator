const mockData = [
  {
    key: 0,
    timestamp: 1574165354695,
    level: 'info',
    message: 'got message from worker: initialize\n',
  },
  {
    key: 1,
    timestamp: 1574165354695,
    level: 'info',
    message: 'sending message to worker: initialized\n',
  },
  {
    key: 2,
    timestamp: 1574165354759,
    level: 'info',
    message: 'got message from worker: start\n',
  },
  {
    key: 3,
    timestamp: 1574165354759,
    level: 'warning',
    message: 'running with input: 1\n',
  },
  {
    key: 4,
    timestamp: 1574165354759,
    level: 'info',
    message: 'sending message to worker: started\n',
  },
  {
    key: 5,
    timestamp: 1574165354766,
    level: 'silly',
    message: 'start eval code...\n',
  },
  {
    key: 6,
    timestamp: 1574165354767,
    level: 'trace',
    message: 'sending message to worker: startSpan\n',
  },
  {
    key: 7,
    timestamp: 1574165354768,
    level: 'debug',
    message: 'end eval code\n',
  },
  {
    key: 8,
    timestamp: 1574165354768,
    level: 'error',
    message: 'sending message to worker: finishSpan\n',
  },
  {
    key: 9,
    timestamp: 1574165354768,
    level: 'critical',
    message: 'sending message to worker: done\n',
  },
];

const buildLog =
  '\nIMAGE_NAME=docker.io/hkubedev/reduce:v1.0.0\nBUILD_PATH=builds/nodejs/reduce\nBASE_IMAGE=node:10.17-slim\nDOCKER_PULL_REGISTRY=docker.io/hkube\nINSECURE_PULL=false\nSKIP_TLS_VERIFY_PULL=false\nDOCKER_PUSH_REGISTRY=docker.io/hkubedev\nSKIP_TLS_VERIFY=false\nINSECURE=false\nPACKAGES_REGISTRY=\nREMOVE_IMAGE=True\nTMP_FOLDER=/tmp\n\n\nBuilding image docker.io/hkubedev/reduce:v1.0.0\ncopy context from builds/nodejs/reduce to /tmp/workspace\n\u001b[36mINFO\u001b[0m[0000] Checking push permissions                    \n\u001b[36mINFO\u001b[0m[0001] Resolved base name ${baseImage} to node:10.17-slim \n\u001b[36mINFO\u001b[0m[0001] Resolved base name ${baseImage} to node:10.17-slim \n\u001b[36mINFO\u001b[0m[0001] Resolved base name ${baseImage} to node:10.17-slim \n\u001b[36mINFO\u001b[0m[0001] Resolved base name ${baseImage} to node:10.17-slim \n\u001b[36mINFO\u001b[0m[0001] Downloading base image node:10.17-slim       \n\u001b[36mINFO\u001b[0m[0003] Error while retrieving image from cache: getting file info: stat /cache/sha256:17df3b18bc0f1d3ebccbd91e8ca8e2b06d67cb4dc6ca55e8c09c36c39fd4535d: no such file or directory \n\u001b[36mINFO\u001b[0m[0003] Downloading base image node:10.17-slim       \n\u001b[36mINFO\u001b[0m[0010] Downloading base image node:10.17-slim       \n\u001b[36mINFO\u001b[0m[0010] Error while retrieving image from cache: getting file info: stat /cache/sha256:17df3b18bc0f1d3ebccbd91e8ca8e2b06d67cb4dc6ca55e8c09c36c39fd4535d: no such file or directory \n\u001b[36mINFO\u001b[0m[0010] Downloading base image node:10.17-slim       \n\u001b[36mINFO\u001b[0m[0017] Built cross stage deps: map[0:[/hkube/algorithm-runner/algorithm_unique_folder/]] \n\u001b[36mINFO\u001b[0m[0017] Downloading base image node:10.17-slim       \n\u001b[36mINFO\u001b[0m[0017] Error while retrieving image from cache: getting file info: stat /cache/sha256:17df3b18bc0f1d3ebccbd91e8ca8e2b06d67cb4dc6ca55e8c09c36c39fd4535d: no such file or directory \n\u001b[36mINFO\u001b[0m[0017] Downloading base image node:10.17-slim       \n\u001b[36mINFO\u001b[0m[0020] Unpacking rootfs as cmd RUN ../dockerfile/requirements.sh ${packagesRegistry} ${packagesToken} requires it. \n\u001b[36mINFO\u001b[0m[0037] Taking snapshot of full filesystem...        \n\u001b[36mINFO\u001b[0m[0042] LABEL maintainer="hkube.dev@gmail.com"       \n\u001b[36mINFO\u001b[0m[0042] Applying label maintainer=hkube.dev@gmail.com \n\u001b[36mINFO\u001b[0m[0042] Using files from context: [/workspace/algorithm_unique_folder] \n\u001b[36mINFO\u001b[0m[0042] COPY ./algorithm_unique_folder/ /hkube/algorithm-runner/algorithm_unique_folder/ \n\u001b[36mINFO\u001b[0m[0042] Taking snapshot of files...                  \n\u001b[36mINFO\u001b[0m[0042] Using files from context: [/workspace/dockerfile] \n\u001b[36mINFO\u001b[0m[0042] COPY ./dockerfile /hkube/algorithm-runner/dockerfile \n\u001b[36mINFO\u001b[0m[0042] Taking snapshot of files...                  \n\u001b[36mINFO\u001b[0m[0042] WORKDIR /hkube/algorithm-runner/algorithm_unique_folder \n\u001b[36mINFO\u001b[0m[0042] cmd: workdir                                 \n\u001b[36mINFO\u001b[0m[0042] Changed working directory to /hkube/algorithm-runner/algorithm_unique_folder \n\u001b[36mINFO\u001b[0m[0042] RUN ../dockerfile/requirements.sh ${packagesRegistry} ${packagesToken} \n\u001b[36mINFO\u001b[0m[0042] cmd: /bin/sh                                 \n\u001b[36mINFO\u001b[0m[0042] args: [-c ../dockerfile/requirements.sh ${packagesRegistry} ${packagesToken}] \nno npm credentials found\nnpm WARN saveError ENOENT: no such file or directory, open \'/hkube/algorithm-runner/algorithm_unique_folder/package.json\'\nnpm notice created a lockfile as package-lock.json. You should commit this file.\nnpm WARN enoent ENOENT: no such file or directory, open \'/hkube/algorithm-runner/algorithm_unique_folder/package.json\'\nnpm WARN algorithm_unique_folder No description\nnpm WARN algorithm_unique_folder No repository field.\nnpm WARN algorithm_unique_folder No README data\nnpm WARN algorithm_unique_folder No license field.\n\nup to date in 0.455s\nfound 0 vulnerabilities\n\n\u001b[36mINFO\u001b[0m[0043] Taking snapshot of full filesystem...        \n\u001b[36mINFO\u001b[0m[0045] Saving file /hkube/algorithm-runner/algorithm_unique_folder/ for later use. \n\u001b[36mINFO\u001b[0m[0045] Deleting filesystem...                       \n\u001b[36mINFO\u001b[0m[0045] Downloading base image node:10.17-slim       \n\u001b[36mINFO\u001b[0m[0047] Error while retrieving image from cache: getting file info: stat /cache/sha256:17df3b18bc0f1d3ebccbd91e8ca8e2b06d67cb4dc6ca55e8c09c36c39fd4535d: no such file or directory \n\u001b[36mINFO\u001b[0m[0047] Downloading base image node:10.17-slim       \n\u001b[36mINFO\u001b[0m[0059] Skipping unpacking as no commands require it. \n\u001b[36mINFO\u001b[0m[0059] Taking snapshot of full filesystem...        \n\u001b[36mINFO\u001b[0m[0059] Using files from context: [/workspace/wrapper] \n\u001b[36mINFO\u001b[0m[0059] COPY ./wrapper /hkube/algorithm-runner       \n\u001b[36mINFO\u001b[0m[0059] Taking snapshot of files...                  \n\u001b[36mINFO\u001b[0m[0059] Using files from context: [/workspace/packages] \n\u001b[36mINFO\u001b[0m[0059] COPY ./packages/ /hkube/algorithm-runner/    \n\u001b[36mINFO\u001b[0m[0059] Taking snapshot of files...                  \n\u001b[36mINFO\u001b[0m[0060] COPY --from=build /hkube/algorithm-runner/algorithm_unique_folder/ /hkube/algorithm-runner/algorithm_unique_folder/ \n\u001b[36mINFO\u001b[0m[0060] Taking snapshot of files...                  \n\u001b[36mINFO\u001b[0m[0060] WORKDIR /hkube/algorithm-runner              \n\u001b[36mINFO\u001b[0m[0060] cmd: workdir                                 \n\u001b[36mINFO\u001b[0m[0060] Changed working directory to /hkube/algorithm-runner \n\u001b[36mINFO\u001b[0m[0060] CMD ["npm", "start"]                         \nbuild done\nbuild finished with code 0\n\n';

export { buildLog, mockData };
