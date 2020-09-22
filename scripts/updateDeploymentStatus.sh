curl -X POST https://api.github.com/repos/${TRAVIS_REPO_SLUG}/deployments/${DEPLOYMENT_ID}/statuses \
     -H "Authorization: token ${GH_TOKEN}" \
     -H "Content-Type: text/json; charset=utf-8" \
     -H "Accept: application/vnd.github.flash-preview+json" \
     -H "Accept: application/vnd.github.ant-man-preview+json" \
     -d @- <<EOF
{
  "environment":"qa",
  "state":"${STATUS}",
  "log_url": "${TRAVIS_BUILD_WEB_URL}",
  "environment_url":"https://${KUBERNETES_MASTER_IP}/hkube/simulator-${PR_NAME}/"
}
EOF