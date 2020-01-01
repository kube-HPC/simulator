import { createStore } from 'reusable';
import { STATE_SOURCES } from 'const';
import { useSelector } from 'react-redux';

const useDrawer = () => {
  const state = useSelector(state => state[STATE_SOURCES.DRAWER]);
  return state;
};

export default createStore(useDrawer);
