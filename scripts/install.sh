
#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
chmod +x ~/kubectl
mkdir -p ~/bin
echo "export PATH=$HOME/bin:$PATH" > setPath
source ./setPath
mv ./kubectl $HOME/bin/kubectl
kubectl cluster-info
