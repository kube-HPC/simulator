const version = `v${process.env.REACT_APP_VERSION}`;

const appInfo = {
  websiteUrl: `http://hkube.org/`,
  githubUrl: `https://github.com/kube-HPC/hkube`,
  version,
  tagUrl: `https://github.com/kube-HPC/simulator/releases/tag/${version}`,
  swaggerUrl: `/hkube/api-server/swagger-ui/`,
  specUrl: `http://hkube.org/spec/`,
};

export default appInfo;
