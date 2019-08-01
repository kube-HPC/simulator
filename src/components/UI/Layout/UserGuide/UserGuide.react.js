import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import Joyride, { EVENTS } from 'react-joyride';
import LOCAL_STORAGE_KEYS from 'constants/local-storage';
import { Typography, Button, Row, Col, Checkbox } from 'antd';
import { COLOR } from 'constants/colors';

import {
  setLocalStorageItem,
  getBooleanLocalStorageItem
} from 'utils/localStorage';

import { userGuide } from 'reducers/userGuide.reducer';
import userGuideSteps from './UserGuideSteps.react';
import { triggerUserGuide } from 'actions/userGuide.action';
import useUserGuide from 'hooks/useUserGuide.react';

const TooltipBody = styled.div`
  text-align: center;
  background-color: ${COLOR.white};
  min-width: 300px;
  max-width: 500px;
  position: relative;
  border-radius: 4px;
  font-size: 16px;
`;

const TooltipContent = styled.div`
  padding: 20px 20px 10px 20px;
`;

const TooltipFooter = styled(Row)`
  align-items: center;
  padding: 12px;
`;

const RowCenter = styled(Row)`
  align-items: center;
`;

const isRunOnStartupFromLocalStorage = getBooleanLocalStorageItem(
  LOCAL_STORAGE_KEYS.USER_GUIDE_STATUS
);

const Tooltip = ({
  continuous,
  index,
  isLastStep,
  step,
  backProps,
  primaryProps,
  skipProps,
  tooltipProps
}) => {
  const [isRunOnStartup, setIsRunOnStartup] = useState(
    isRunOnStartupFromLocalStorage
  );

  const toggle = () => setIsRunOnStartup(p => !p);

  return (
    <TooltipBody {...tooltipProps}>
      <TooltipContent>
        {step.title && (
          <Typography.Title level={3}>{step.title}</Typography.Title>
        )}
        {step.content && <>{step.content}</>}
      </TooltipContent>
      <TooltipFooter type="flex" justify="space-between">
        <Col>
          <RowCenter type="flex" gutter={10}>
            <Col>
              {!isLastStep && (
                <Button type="dashed" {...skipProps}>
                  Skip
                </Button>
              )}
            </Col>
            <Col>
              {index === 0 && (
                <Checkbox
                  checked={isRunOnStartup}
                  onChange={e => {
                    toggle();
                    setLocalStorageItem(
                      LOCAL_STORAGE_KEYS.USER_GUIDE_STATUS,
                      e.target.checked
                    );
                  }}
                >
                  Run on Startup
                </Checkbox>
              )}
            </Col>
          </RowCenter>
        </Col>
        <Col>
          <RowCenter type="flex" gutter={10}>
            <Col>{index > 0 && <Button {...backProps}>Back</Button>}</Col>
            <Col>
              <Button type="primary" {...primaryProps}>
                {isLastStep ? 'Finish' : 'Next'}
              </Button>
            </Col>
          </RowCenter>
        </Col>
      </TooltipFooter>
    </TooltipBody>
  );
};

export default function UserGuide({ triggerLeftVisible }) {
  const { isOn } = useSelector(state => state.userGuide);
  const { triggerUserGuide, nextStep } = useUserGuide();

  const handleJoyrideCallback = data => {
    const { type } = data;

    // TODO: Remove on finish
    // const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
    // const finishedActions = [ACTIONS.CLOSE, ACTIONS.SKIP];
    const finishEvents = [EVENTS.TOUR_END];

    const finishStep = [EVENTS.STEP_AFTER];

    if (finishEvents.includes(type)) {
      triggerLeftVisible();
      triggerUserGuide();
    }

    if (finishStep.includes(type)) {
      nextStep();
    }
  };

  return (
    <Joyride
      callback={handleJoyrideCallback}
      steps={userGuideSteps}
      tooltipComponent={Tooltip}
      run={isOn}
      continuous
      showSkipButton
      disableScrollParentFix
      disableScrolling
      disableOverlayClose
      debug
    />
  );
}
