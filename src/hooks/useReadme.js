import { notification } from 'utils';
import { useCallback } from 'react';
import client from 'client';

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

const URL = ({ type, name }) => `/readme/${type}/${name}`;

const fetch =
  ({ type }) =>
  ({ name, callback }) =>
    client
      .get(URL({ type, name }))
      .then(({ data: { readme } }) => {
        callback(readme);
      })
      .catch(err => {
        console.warn('readme fetch error:', err);

        try {
          callback(null);
        } catch (e) {
          // If caller didn't provide a callback or it throws, just ignore.
        }
      });

const asyncFetch =
  ({ type }) =>
  async ({ name }) => {
    try {
      const {
        data: { readme },
      } = await client.get(URL({ type, name }));
      return readme;
    } catch (err) {
      console.warn('async readme fetch error:', err);
      return null;
    }
  };

const apply =
  ({ type }) =>
  ({ name, formData }) =>
  () =>
    client
      .put(URL({ type, name }), formData)
      .then(successNotification)
      .catch(errorNotification);

const post =
  ({ type }) =>
  ({ name, readme }) => {
    const formData = new FormData();
    formData.append('README.md', new File([new Blob([readme])], 'README.md'));
    client
      .post(URL({ type, name }), formData)
      .then(successNotification)
      .catch(errorNotification);
  };

const useReadme = type => {
  const asyncFetch_ = useCallback(props => asyncFetch({ type })(props), [type]);
  const fetch_ = useCallback(props => fetch({ type })(props), [type]);
  const apply_ = useCallback(props => apply({ type })(props), [type]);
  const post_ = useCallback(props => post({ type })(props), [type]);

  return {
    fetch: fetch_,
    asyncFetch: asyncFetch_,
    apply: apply_,
    post: post_,
  };
};

useReadme.TYPES = TYPES;

export default useReadme;
