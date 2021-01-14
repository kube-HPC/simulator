import { useCallback, useState } from 'react';
import { notification, transformTraceData } from 'utils';
import client from './../client';

const { TYPES } = notification;

const fetch = ({ callback }) => ({ jobId }) =>
  client
    .get(`/jaeger`, {
      params: {
        jobId,
      },
    })
    .then(({ data }) => {
      const [traceData] = data.data;
      callback(transformTraceData(traceData || {}));
    })
    .catch(({ message: description }) =>
      notification({
        message: 'Error fetching Trace data',
        description,
        type: TYPES.WARNING,
      })
    );

const useTraceData = () => {
  const [traceData, setTraceData] = useState(undefined);
  const _fetch = useCallback(() => fetch({ callback: setTraceData }), [
    setTraceData,
  ]);
  return { traceData, fetch: _fetch };
};

export default useTraceData;
