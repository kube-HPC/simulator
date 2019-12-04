import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { notification } from 'utils';
import { STATE_SOURCES } from 'const';
import axios from 'axios';

const errorNotification = ({ message }) => notification({ message });

const fetch = ({ url, name, callback }) =>
  axios.get(`${url}/readme/algorithms/${name}`).then(({ data: { readme } }) => {
    callback(readme);
  });

const apply = ({ url, name }) => () =>
  axios.put(`${url}/readme/algorithms/${name}`).catch(errorNotification);

const useAlgorithmReadme = name => {
  const [source, setSource] = useState(undefined);
  const url = useSelector(state => state[STATE_SOURCES.SOCKET_URL]);

  useEffect(() => {
    fetch({ url, name, callback: setSource });
  }, []);

  return {
    source,
    apply: apply({ url, name }),
  };
};

export default useAlgorithmReadme;
