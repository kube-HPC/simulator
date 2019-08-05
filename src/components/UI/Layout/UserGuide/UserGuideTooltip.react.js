import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import LOCAL_STORAGE_KEYS from 'constants/local-storage';
import { Typography, Button, Row, Col, Checkbox } from 'antd';
import { COLOR } from 'constants/colors';

import { setLSItem, getBooleanLSItem } from 'utils/localStorage';

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

const CheckboxUnClickable = styled(Checkbox)`
  pointer-events: none;
`;

const isOnFromLS = getBooleanLSItem(LOCAL_STORAGE_KEYS.USER_GUIDE_STATUS);

const UserGuideTooltip = ({
  continuous,
  index,
  isLastStep,
  step,
  backProps,
  primaryProps,
  skipProps,
  tooltipProps
}) => {
  const [isRunOnStartup, setIsRunOnStartup] = useState(isOnFromLS);

  const toggle = () => setIsRunOnStartup(p => !p);

  useEffect(
    () => {
      setLSItem(LOCAL_STORAGE_KEYS.USER_GUIDE_STATUS, isRunOnStartup);
    },
    [isRunOnStartup]
  );

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
                <Button type="dashed" onClick={() => toggle()}>
                  <CheckboxUnClickable checked={isRunOnStartup}>
                    Run on Startup
                  </CheckboxUnClickable>
                </Button>
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

export default UserGuideTooltip;
