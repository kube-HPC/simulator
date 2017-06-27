#patch|minor|major
#REPONAME="worker-statistics-client:"
echo
echo
#echo -e "\e[32m"
echo  "========================================================="
echo  "script is running:                                      =" 
echo  "you can choose the follows for passing as arguments     ="
echo  "patch/minor/major (default is patch)                    ="
echo  "example: arg=minor npm run build                        ="
echo  "========================================================="
#echo -e "\e[39m"
echo
echo



echo "DOCKER LOGS"
echo "**********************************************************"
REPONAME=$1
REGISTRYNAME=private.registry.rms:5000/vod/$REPONAME

if [ -n "$2"  ]
then
VERSIONTYPE=$2
else
VERSIONTYPE="patch" 
fi

WORKSPACE=$HOME/dev/vod/$REPONAME
GIT_COMMIT=$(git log -1 --pretty=%H 2> /dev/null)
GIT_USER="$(git log -1 --pretty=%aN 2> /dev/null)"
VERSION=${npm_package_version}
CURRENTTAG="$REPONAME:$VERSION"
LATESTTAG=$REPONAME":latest"
REMOTECURRENTTAG="$REGISTRYNAME:$VERSION"
REMOTELATESTTAG=$REGISTRYNAME":latest"
docker build --build-arg version=$VERSION --build-arg git_commit=$GIT_COMMIT --build-arg user="$GIT_USER" -t $REMOTECURRENTTAG -t $REMOTELATESTTAG  -f ./dockerFile/Dockerfile .
docker push $REMOTECURRENTTAG
docker push $REMOTELATESTTAG
docker rmi $REMOTELATESTTAG $REMOTECURRENTTAG

echo "**********************************************************"
echo
echo
#echo -e "\e[32m"
echo  "========================================================================================================================================"
echo  "script successed for $REPONAME"
echo  "version is updated to $VERSIONTYPE with version $VERSION"
echo  "docker images was build and pushed with the following tags: $CURRENTTAG , $LATESTTAG"
echo  "enjoy :)"
echo  "========================================================================================================================================"
#echo -e "\e[39m"
echo
echo
