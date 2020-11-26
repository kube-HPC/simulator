
#!/bin/bash
set +x
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
echo $DIR
mkdir -p ./bin
echo 222
curl -LO https://storage.googleapis.com/kubernetes-release/release/v1.19.4/bin/linux/amd64/kubectl --output ./bin/kubectl
echo 333
chmod +x ./bin/kubectl
echo 444
echo "export PATH=$PWD/bin:$PATH" > setPath
source ./setPath
mkdir -p ~/.kube/
envsubst < ${DIR}/kube-config-template.yml > ~/.kube/config
kubectl cluster-info
