const generateRandomName = (length = 10) => {
  const chars = 'abcdefghijklmopqrstuvwxyz';
  return new Array(length)
    .fill(0)
    .map(() => Math.floor(Math.random() * chars.length))
    .map(idx => chars[idx])
    .join('');
};

export const generateConfig = (kind = 'github') => ({
  name: generateRandomName(),
  git:
    kind === 'github'
      ? {
          endpoint: process.env.REACT_APP_GITHUB_HOST,
          token: process.env.REACT_APP_GITHUB_TOKEN,
          kind: 'github',
        }
      : {
          endpoint: process.env.REACT_APP_GITLAB_HOST,
          token: process.env.REACT_APP_GITLAB_TOKEN,
          tokenName: process.env.REACT_APP_GITLAB_TOKEN_NAME,
          kind: 'gitlab',
        },
  storage: {
    accessKeyId: process.env.REACT_APP_STORAGE_KEY_ID,
    secretAccessKey: process.env.REACT_APP_STORAGE_KEY,
    endpoint: process.env.REACT_APP_STORAGE_HOST,
    bucketName: process.env.REACT_APP_STORAGE_BUCKET,
    useSSL: false,
  },
});
