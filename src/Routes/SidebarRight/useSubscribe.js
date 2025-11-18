import { useCallback, useState, useRef } from 'react';
import { createStore } from 'reusable';

const useSubscribe = () => {
  const [subscribers, setSubscribers] = useState({});
  const idCounter = useRef(0);

  const generateId = () => {
    idCounter.current += 1;
    return idCounter.current.toString();
  };

  const unsubscribe = useCallback(
    id =>
      setSubscribers(state => {
        const { [id]: removed, ...rest } = state;
        return rest;
      }),
    []
  );

  const subscribe = useCallback(
    f => {
      const id = generateId();
      setSubscribers(s => ({ ...s, [id]: f }));
      return () => unsubscribe(id);
    },
    [unsubscribe]
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
