const version = `v${process.env.REACT_APP_VERSION}`;

const appInfo = {
  websiteUrl: `http://hkube.io/`,
  githubUrl: `https://github.com/kube-HPC/hkube`,
  version,
  tagUrl: `https://github.com/kube-HPC/simulator/releases/tag/${version}`,
  swaggerUrl: `/hkube/api-server/swagger-ui/`,
};

export default appInfo;
