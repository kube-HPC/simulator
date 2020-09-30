import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Joyride, { EVENTS, ACTIONS } from 'react-joyride';
import { useHistory } from 'react-router-dom';
import {
  triggerUserGuide,
  changeStep as _changeStep,
} from 'actions/userGuide.action';

import { useLeftSidebar } from 'hooks';
import userGuideSteps from './UserGuideSteps.react';
import UserGuideTooltip from './UserGuideTooltip.react';

const stepAction = [ACTIONS.NEXT, ACTIONS.PREV, ACTIONS.INIT, ACTIONS.UPDATE];

const isOnEqual = (a, b) => a.isOn === b.isOn;

const UserGuide = () => {
  const history = useHistory();
  const { setCollapsed } = useLeftSidebar();

  const { isOn } = useSelector(state => state.userGuide, isOnEqual);
  const dispatch = useDispatch();

  const trigger = useCallback(() => dispatch(triggerUserGuide()), [dispatch]);
  const changeStep = useCallback(step => dispatch(_changeStep(step)), [
    dispatch,
  ]);

  const callback = useCallback(
    data => {
      const { type, index, action } = data;
      if (type === EVENTS.TOUR_START) {
        history.push('/jobs');
      } else if (type === EVENTS.TOUR_END) {
        setCollapsed(false);
        trigger();
      } else if (stepAction.includes(action) && type === EVENTS.STEP_BEFORE) {
        changeStep(index);
      }
    },
    [changeStep, history, trigger, setCollapsed]
  );

  return (
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
    )
  );
};

export default React.memo(UserGuide);
