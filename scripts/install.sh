
#!/bin/bash
set +x
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
echo $DIR
mkdir -p ./bin
echo 222
curl -L --output ./bin/kubectl https://storage.googleapis.com/kubernetes-release/release/v1.19.4/bin/linux/amd64/kubectl 
echo 333
chmod +x ./bin/kubectl
echo 444
echo "export PATH=$PWD/bin:$PATH" > setPath
echo 555
source ./setPath
echo 666
mkdir -p ~/.kube/
echo 777
envsubst < ${DIR}/kube-config-template.yml > ~/.kube/config
echo 888
kubectl cluster-info
echo 999
