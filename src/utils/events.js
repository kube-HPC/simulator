const createEventEmitter = () => {
  const events = {};

  const on = (event, listener) => {
    if (!events[event]) {
      events[event] = [];
    }
    events[event].push(listener);
  };

  const off = (event, listener) => {
    if (!events[event]) return;
    events[event] = events[event].filter(l => l !== listener);
  };

  const emit = (event, ...args) => {
    if (!events[event]) return;
    events[event].forEach(listener => listener(...args));
  };

  return { on, off, emit };
};

export const events = createEventEmitter();
