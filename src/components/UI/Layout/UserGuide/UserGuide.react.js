import React from 'react';
import { useSelector } from 'react-redux';

import Joyride, { EVENTS, ACTIONS } from 'react-joyride';

import useUserGuide from 'hooks/useUserGuide.react';
import { LEFT_SIDEBAR_NAMES } from 'constants/table-names';
import userGuideSteps from './UserGuideSteps.react';
import UserGuideTooltip from './UserGuideTooltip.react';

export default function UserGuide({ triggerLeftVisible, setLeftValue }) {
  const { isOn } = useSelector(state => state.userGuide);
  const { triggerUserGuide, changeStep } = useUserGuide();

  const handleJoyrideCallback = data => {
    const { type, index, action } = data;

    const stepAction = [ACTIONS.NEXT, ACTIONS.PREV, ACTIONS.INIT];

    if (type === EVENTS.TOUR_START) {
      setLeftValue(LEFT_SIDEBAR_NAMES.JOBS);
    } else if (type === EVENTS.TOUR_END) {
      triggerLeftVisible();
      triggerUserGuide();
    } else if (stepAction.includes(action) && type === EVENTS.STEP_BEFORE) {
      changeStep(index);
    }
  };

  return (
    <Joyride
      callback={handleJoyrideCallback}
      steps={userGuideSteps}
      tooltipComponent={UserGuideTooltip}
      // for dev
      // stepIndex={userGuideSteps.length - 1}
      run={isOn}
      continuous
      showSkipButton
      disableScrollParentFix
      disableScrolling
      disableOverlayClose
    />
  );
}
