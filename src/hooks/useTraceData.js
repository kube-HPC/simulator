import { useCallback, useState } from 'react';
import { notification, transformTraceData } from 'utils';
import client from './../client';

const { TYPES } = notification;

const useTraceData = () => {
  const [traceData, setTraceData] = useState(undefined);
  const fetch = useCallback(
    async ({ jobId, algorithms }) => {
      let response;
      try {
        response = await client.get('/jaeger', {
          params: {
            jobId,
          },
        });
      } catch ({ message: description }) {
        notification({
          message: 'Error fetching Trace data',
          description,
          type: TYPES.WARNING,
        });
        return null;
      }
      const [nextTraceData] = response.data.data;
      setTraceData(transformTraceData(nextTraceData || {}, algorithms));
      return response.data.data;
    },
    [setTraceData]
  );
  return { traceData, fetch };
};

export default useTraceData;
