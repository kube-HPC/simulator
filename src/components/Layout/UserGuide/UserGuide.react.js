import React, { useCallback } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import Joyride, { EVENTS, ACTIONS } from 'react-joyride';

import {
  triggerUserGuide,
  changeStep as _changeStep
} from 'actions/userGuide.action';

import { LEFT_SIDEBAR_NAMES } from 'constants/sidebar-names';
import userGuideSteps from './UserGuideSteps.react';
import UserGuideTooltip from './UserGuideTooltip.react';

const stepAction = [ACTIONS.NEXT, ACTIONS.PREV, ACTIONS.INIT, ACTIONS.UPDATE];

const UserGuide = ({ triggerLeftVisible, setLeftValue }) => {
  const { isOn } = useSelector(state => state.userGuide, shallowEqual);
  const dispatch = useDispatch();

  const trigger = useCallback(() => dispatch(triggerUserGuide()), [dispatch]);
  const changeStep = useCallback(step => dispatch(_changeStep(step)), [
    dispatch
  ]);

  const callback = useCallback(
    data => {
      const { type, index, action } = data;

      if (type === EVENTS.TOUR_START) {
        setLeftValue(LEFT_SIDEBAR_NAMES.JOBS);
      } else if (type === EVENTS.TOUR_END) {
        triggerLeftVisible();
        trigger();
      } else if (stepAction.includes(action) && type === EVENTS.STEP_BEFORE) {
        changeStep(index);
      }
    },
    [changeStep, setLeftValue, trigger, triggerLeftVisible]
  );

  return (
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
  );
};

export default UserGuide;

Joyride.whyDidYourRender = true;
