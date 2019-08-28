RES=$(curl -X POST https://api.github.com/repos/kube-HPC/${TRAVIS_REPO_SLUG}/deployments \
     -H "Authorization: token ${GH_TOKEN}" \
     -H "Content-Type: text/json; charset=utf-8" \
     -H "Accept: application/vnd.github.flash-preview+json" \
     -d @- <<EOF
{
    "ref":"${TRAVIS_PULL_REQUEST_BRANCH}", "environment":"qa","auto_merge":false, "required_contexts":[]
}
EOF
)
export DEPLOYMENT_ID=$(echo $RES | grep -oP '"id": \K(.*)(?=,)' ~/res.json | head -n 1)