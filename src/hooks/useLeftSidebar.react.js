import { useCallback, useState } from 'react';
import { createStore } from 'reusable';

const useLeftSidebar = () => {
  const [isCollapsed, setCollapsed] = useState(false);
  const toggle = useCallback(() => setCollapsed(state => !state), [
    setCollapsed,
  ]);
  return {
    isCollapsed,
    setCollapsed,
    toggle,
  };
};

export default createStore(useLeftSidebar);
