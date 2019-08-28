RES=$(curl -X POST https://api.github.com/repos/${TRAVIS_REPO_SLUG}/deployments \
     -H "Authorization: token ${GH_TOKEN}" \
     -H "Content-Type: text/json; charset=utf-8" \
     -H "Accept: application/vnd.github.flash-preview+json" \
     -d @- <<EOF
{
    "ref":"${TRAVIS_PULL_REQUEST_BRANCH}", "environment":"qa","auto_merge":false, "required_contexts":[]
}
EOF
)
echo "$RES" > /tmp/res.json
DEPLOYMENT_ID=$(grep -oP '"id": \K(.*)(?=,)' /tmp/res.json | head -n 1)
echo $DEPLOYMENT_ID