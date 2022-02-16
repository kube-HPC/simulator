import { Button, Checkbox, Col, Row, Typography } from 'antd';
import LOCAL_STORAGE_KEYS from 'const/local-storage';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getBooleanLSItem, getLsItem, setLsItem } from 'utils/localStorage';

const TooltipBody = styled.div`
  text-align: center;
  background-color: ${props => props.theme.Styles.UserGuideTooltip.TooltipBody};
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

// When LS not available,
// the default behavior is "Run on Startup" is un-checked.
const isOnInitial = getLsItem(LOCAL_STORAGE_KEYS.USER_GUIDE_STATUS)
  ? getBooleanLSItem(LOCAL_STORAGE_KEYS.USER_GUIDE_STATUS)
  : false;

const UserGuideTooltip = ({
  index,
  isLastStep,
  step,
  backProps,
  primaryProps,
  skipProps,
  tooltipProps,
}) => {
  const [isRunOnStartup, setIsRunOnStartup] = useState(isOnInitial);

  const toggle = () => setIsRunOnStartup(p => !p);

  useEffect(() => {
    setLsItem(LOCAL_STORAGE_KEYS.USER_GUIDE_STATUS, isRunOnStartup);
  }, [isRunOnStartup]);

  return (
    // eslint-disable-next-line
    <TooltipBody {...tooltipProps}>
      <TooltipContent>
        {step.title && (
          <Typography.Title level={3}>{step.title}</Typography.Title>
        )}
        {step.content && step.content}
      </TooltipContent>
      <TooltipFooter type="flex" justify="space-between">
        <Col>
          <RowCenter type="flex" gutter={10}>
            {!isLastStep && (
              <Col>
                <Button
                  type="dashed"
                  // eslint-disable-next-line
                  {...skipProps}>
                  Skip
                </Button>
              </Col>
            )}
            {index === 0 && (
              <Col>
                <Button type="dashed" onClick={toggle}>
                  <CheckboxUnClickable checked={isRunOnStartup}>
                    Run on Startup
                  </CheckboxUnClickable>
                </Button>
              </Col>
            )}
          </RowCenter>
        </Col>
        <Col>
          <RowCenter type="flex" gutter={10}>
            {index > 0 && (
              <Col>
                <Button
                  // eslint-disable-next-line
                  {...backProps}>
                  Back
                </Button>
              </Col>
            )}
            <Col>
              <Button
                type="primary"
                // eslint-disable-next-line
                {...primaryProps}>
                {isLastStep ? `Finish` : `Next`}
              </Button>
            </Col>
          </RowCenter>
        </Col>
      </TooltipFooter>
    </TooltipBody>
  );
};

UserGuideTooltip.propTypes = {
  index: PropTypes.number.isRequired,
  isLastStep: PropTypes.bool.isRequired,
  step: PropTypes.number.isRequired,
  // TODO: detail the props
  /* eslint-disable */
  backProps: PropTypes.object.isRequired,
  primaryProps: PropTypes.object.isRequired,
  skipProps: PropTypes.object.isRequired,
  tooltipProps: PropTypes.object.isRequired,
  /* eslint-enable */
};

export default UserGuideTooltip;
