import { useSelector } from 'react-redux';
import { notification } from 'utils';
import axios from 'axios';
import { useCallback } from 'react';
import { selectors } from 'reducers';

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
  const { socketURL: url } = useSelector(selectors.connection.stats);
  const asyncFetch_ = useCallback(props => asyncFetch({ url, type })(props), [
    url,
    type,
  ]);

  const fetch_ = useCallback(props => fetch({ url, type })(props), [url, type]);
  const apply_ = useCallback(props => apply({ url, type })(props), [url, type]);
  const post_ = useCallback(props => post({ url, type })(props), [url, type]);

  return {
    fetch: fetch_,
    asyncFetch: asyncFetch_,
    apply: apply_,
    post: post_,
  };
};

useReadme.TYPES = TYPES;

export default useReadme;
