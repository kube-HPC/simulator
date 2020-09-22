import { STATE_SOURCES } from 'const';
import { useSelector } from 'react-redux';
import { createStore } from 'reusable';
import useActions from './useActions';

const useViewType = () => {
  const { isTableView, loadedOnce } = useSelector(
    state => state[STATE_SOURCES.VIEW_TYPE]
  );
  const { toggleViewType, firstLoad } = useActions();

  return { isTableView, loadedOnce, toggleViewType, firstLoad };
};

export default createStore(useViewType);
