import { STATE_SOURCES } from 'const';
import { useActions } from 'hooks';
import { useSelector } from 'react-redux';
import { createStore } from 'reusable';

const useDrawer = () => {
  const { isVisible, content } = useSelector(state => state[STATE_SOURCES.DRAWER]);
  const { drawerOpen } = useActions();
  return { isVisible, content, drawerOpen };
};

export default createStore(useDrawer);
