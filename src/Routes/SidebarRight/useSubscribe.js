import { useCallback, useState } from 'react';
import { createStore } from 'reusable';
import { v4 } from 'uuid';

const useSubscribe = () => {
  const [subscribers, setSubscribers] = useState({});

  const unsubscribe = useCallback(
    id =>
      setSubscribers(state => {
        const { [id]: removed, ...rest } = state;
        return rest;
      }),
    [setSubscribers]
  );

  const subscribe = useCallback(
    f => {
      const id = v4();
      setSubscribers(s => ({ ...s, [id]: f }));
      return () => unsubscribe(id);
    },
    [unsubscribe, setSubscribers]
  );

  const publish = useCallback(() => {
    Object.values(subscribers).forEach(f => f());
  }, [subscribers]);

  return {
    publish,
    subscribe,
  };
};

export default createStore(useSubscribe);
