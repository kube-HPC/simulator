import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

export default function useDispatchCallback() {
  const dispatch = useDispatch();
  const dispatchMemo = useCallback(func => dispatch(func), [dispatch]);

  return dispatchMemo;
}
