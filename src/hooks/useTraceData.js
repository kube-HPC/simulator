import { useState } from 'react';
import { notification, transformTraceData } from 'utils';
import Axios from 'axios';
import { STATE_SOURCES } from 'const';
import { useSelector } from 'react-redux';

const { TYPES } = notification;

const fetch = ({ url, callback }) => ({ jobId }) =>
  Axios.get(`${url}/jaeger`, {
    params: {
      jobId,
    },
  })
    .then(({ data }) => {
      const [traceData] = data.data;
      callback(transformTraceData(traceData || {}));
    })
    .catch(({ message: description }) =>
      notification({ message: 'Error fetching Trace data', description, type: TYPES.WARNING }),
    );

const useTraceData = () => {
  const [traceData, setTraceData] = useState(undefined);
  const url = useSelector(state => state[STATE_SOURCES.SOCKET_URL]);
  return { traceData, fetch: fetch({ url, callback: setTraceData }) };
};

export default useTraceData;
