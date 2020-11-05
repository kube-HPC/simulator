import { useState, useCallback } from 'react';

export default initialState => {
  const [isOn, setState] = useState(initialState);
  const setOn = useCallback(() => setState(true), [setState]);
  const setOff = useCallback(() => setState(false), [setState]);
  const toggle = useCallback(() => setState(state => !state), [setState]);
  return {
    isOn,
    setOn,
    setOff,
    toggle,
  };
};
