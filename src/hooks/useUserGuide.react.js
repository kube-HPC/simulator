import { useDispatch } from 'react-redux';
import { triggerUserGuide, nextStep } from 'actions/userGuide.action';

export default function useUserGuide() {
  const dispatch = useDispatch();

  return {
    triggerUserGuide: () => dispatch(triggerUserGuide()),
    nextStep: () => dispatch(nextStep())
  };
}
