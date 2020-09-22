import { useSelector } from 'react-redux';
import { notification } from 'utils';
import { STATE_SOURCES } from 'const';
import axios from 'axios';

const errorNotification = ({ message }) => notification({ message });
const successNotification = () =>
  notification({
    message: 'Markdown Applied',
    type: notification.TYPES.SUCCESS,
  });

const TYPES = {
  PIPELINE: 'pipelines',
  ALGORITHM: 'algorithms',
};

const URL = ({ url, type, name }) => `${url}/readme/${type}/${name}`;

const fetch = ({ url, type }) => ({ name, callback }) =>
  axios
    .get(URL({ url, type, name }))
    .then(({ data: { readme } }) => {
      callback(readme);
    })
    // Catch but don't use
    .catch(() => {});

const asyncFetch = ({ url, type }) => async ({ name }) => {
  const {
    data: { readme },
  } = await axios.get(URL({ url, type, name }));
  return readme;
};

const apply = ({ url, type }) => ({ name, formData }) => () =>
  axios
    .put(URL({ url, type, name }), formData)
    .then(successNotification)
    .catch(errorNotification);

const post = ({ url, type }) => ({ name, readme }) => {
  const formData = new FormData();
  formData.append('README.md', new File([new Blob([readme])], 'README.md'));
  axios
    .post(URL({ url, type, name }), formData)
    .then(successNotification)
    .catch(errorNotification);
};

const useReadme = type => {
  const url = useSelector(state => state[STATE_SOURCES.SOCKET_URL]);

  return {
    fetch: fetch({ url, type }),
    asyncFetch: asyncFetch({ url, type }),
    apply: apply({ url, type }),
    post: post({ url, type }),
  };
};

useReadme.TYPES = TYPES;

export default useReadme;
