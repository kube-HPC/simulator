import { useDispatch } from 'react-redux';
import { triggerUserGuide, changeStep } from 'actions/userGuide.action';
import { useCallback } from 'react';

export default function useUserGuide() {
  const dispatch = useDispatch();
  const setCallback = useCallback(func => dispatch(func), [dispatch]);

  return {
    triggerUserGuide: () => setCallback(triggerUserGuide()),
    changeStep: step => setCallback(changeStep(step))
  };
}
