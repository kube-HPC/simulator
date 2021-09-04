import { useEffect } from 'react';

const usePolling = (query, interval) => {
  useEffect(() => {
    query.startPolling(interval);
    console.log('polling');
    return () => {
      query.stopPolling();
      console.log('stop polling');
    };
  }, [query, interval]);
};

export default usePolling;
