
#!/bin/bash
set +x
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

curl -LO https://storage.googleapis.com/kubernetes-release/release/v1.19.4/bin/linux/amd64/kubectl
chmod +x ./kubectl
mkdir -p ./bin
echo "export PATH=$PWD/bin:$PATH" > setPath
source ./setPath
mv ./kubectl $PWD/bin/kubectl
mkdir -p ~/.kube/
envsubst < ${DIR}/kube-config-template.yml > ~/.kube/config
kubectl cluster-info
