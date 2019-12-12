import { createStore } from 'reusable';
import { useDispatch } from 'react-redux';
import {
  init,
  socketInit,
  triggerUserGuide,
  execRawPipeline,
  drawerOpen,
  drawerToggle,
} from 'actions';
import fromEntries from 'object.fromentries';

if (!Object.fromEntries) {
  fromEntries.shim();
}

const actions = { init, socketInit, triggerUserGuide, execRawPipeline, drawerOpen, drawerToggle };

const useActions = () => {
  const dispatch = useDispatch();
  const createDispatch = action => params => dispatch(action(params));
  const objectMapped = Object.entries(actions).map(([key, value]) => [key, createDispatch(value)]);
  const dispatcher = Object.fromEntries(objectMapped);

  return dispatcher;
};

export default createStore(useActions);
