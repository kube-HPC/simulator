import { useDispatch } from 'react-redux';
import { triggerUserGuide, changeStep } from 'actions/userGuide.action';

export default function useUserGuide() {
  const dispatch = useDispatch();

  return {
    triggerUserGuide: () => dispatch(triggerUserGuide()),
    changeStep: step => dispatch(changeStep(step))
  };
}
