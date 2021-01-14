import { createStore } from 'reusable';
import { useDispatch } from 'react-redux';
import actions from 'actions';
import { useCallback } from 'react';

/** @typedef {typeof actions} Actions */

const useActions = () => {
  const dispatch = useDispatch();
  const createDispatch = useCallback(
    action => params => dispatch(action(params)),
    [dispatch]
  );
  const objectMapped = Object.entries(actions).map(([key, value]) => [
    key,
    createDispatch(value),
  ]);
  /** @type {Actions} */
  const dispatcher = Object.fromEntries(objectMapped);
  return dispatcher;
};

export default createStore(useActions);
