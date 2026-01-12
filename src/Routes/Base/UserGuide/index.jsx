import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import Joyride, { EVENTS, ACTIONS } from 'react-joyride';
import { useNavigate } from 'react-router-dom';
import { selectors } from 'reducers';
import {
  triggerUserGuide,
  changeStep as _changeStep,
} from 'actions/userGuide.action';

// import userGuideSteps from './UserGuideSteps.react';
// import UserGuideTooltip from './UserGuideTooltip.react';

const stepAction = [ACTIONS.NEXT, ACTIONS.PREV, ACTIONS.INIT, ACTIONS.UPDATE];

const UserGuide = () => {
  const navigate = useNavigate();

  const { isOn } = useSelector(selectors.userGuide);
  const dispatch = useDispatch();

  const trigger = useCallback(() => dispatch(triggerUserGuide()), [dispatch]);
  const changeStep = useCallback(
    step => dispatch(_changeStep(step)),
    [dispatch]
  );

  const callback = useCallback(
    data => {
      const { type, index, action } = data;

      if (type === EVENTS.TOUR_START) {
        navigate('/jobs');
      } else if (type === EVENTS.TOUR_END) {
        trigger();
      } else if (stepAction.includes(action) && type === EVENTS.STEP_BEFORE) {
        changeStep(index);
      }
    },
    [changeStep, navigate, trigger]
  );

  return (
    <></>
    /*
    isOn && (
      <Joyride
        callback={callback}
        steps={userGuideSteps}
        tooltipComponent={UserGuideTooltip}
        run={isOn}
        continuous
        showSkipButton
        disableScrollParentFix
        disableScrolling
        disableOverlayClose
      /> 
    )*/
  );
};

export default React.memo(UserGuide);
