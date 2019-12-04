import axios from 'axios';
import { notification } from 'utils';

const errorNotification = ({ message }) => notification({ message });

const fetchVersion = ({ url, algorithmName, callback }) =>
  axios
    .get(`${url}/versions/algorithms/${algorithmName}`)
    .then(({ data }) => {
      callback(data);
    })
    .catch(errorNotification);

export default fetchVersion;
