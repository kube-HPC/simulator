import { useSelector } from 'react-redux';
import { notification } from 'utils';
import { STATE_SOURCES } from 'const';
import axios from 'axios';

const errorNotification = ({ message }) => notification({ message });

const URL = ({ url, name }) => `${url}/readme/algorithms/${name}`;

const fetch = url => ({ name, callback }) =>
  axios
    .get(URL({ url, name }))
    .then(({ data: { readme } }) => {
      callback(readme);
    })
    // Catch but don't use
    .catch(() => {});

const asyncFetch = url => async ({ name }) => {
  const {
    data: { readme },
  } = await axios.get(URL({ url, name }));
  return readme;
};

const apply = url => ({ name, formData }) => () =>
  axios.put(URL({ url, name }), formData).catch(errorNotification);

const post = url => ({ name, readme }) => {
  const formData = new FormData();
  formData.append('README.md', new File([new Blob([readme])], 'README.md'));
  axios.post(URL({ url, name }), formData).catch(errorNotification);
};

const useAlgorithmReadme = () => {
  const url = useSelector(state => state[STATE_SOURCES.SOCKET_URL]);

  return {
    fetch: fetch(url),
    asyncFetch: asyncFetch(url),
    apply: apply(url),
    post: post(url),
  };
};

export default useAlgorithmReadme;
