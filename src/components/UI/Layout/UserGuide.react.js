import React from 'react';
import styled from 'styled-components';

import Joyride, { STATUS } from 'react-joyride';
import { LOCAL_STORAGE_KEYS } from 'constants/states';
import USER_GUIDE from 'constants/user-guide';
import { Typography, Select, Button, Row, Col } from 'antd';
import { COLOR } from 'constants/colors';

const { Title, Text, Paragraph } = Typography;

const steps = [
  {
    target: USER_GUIDE.CONTACT,
    title: (
      <>
        Welcome to HKube Dashboard!{' '}
        <span role="img" aria-label="Party">
          🥳
        </span>
      </>
    ),
    content: (
      <>
        <Paragraph>
          HKube is a cloud-native open source framework to run distributed
          pipeline of algorithms.
        </Paragraph>
        <Paragraph>
          We use the <Text strong>Dashboard</Text> for deploying and monitoring
          user algorithms and pipelines.
        </Paragraph>
        <Title level={4}>Pick a Tutorial</Title>
        <Select defaultValue="introduction" style={{ width: '100%' }}>
          <Select.OptGroup label="Beginner">
            <Select.Option value="introduction">Introduction</Select.Option>
            <Select.Option value="addPipeline">Add Pipeline</Select.Option>
            <Select.Option value="addAlgorithm">Add Algorithm</Select.Option>
          </Select.OptGroup>
          <Select.OptGroup label="Intermediate">
            <Select.Option value="complexPipeline">
              Add Complex Pipeline
            </Select.Option>
          </Select.OptGroup>
        </Select>
      </>
    ),
    locale: { skip: 'Skip' },
    placement: 'center'
  },
  {
    target: USER_GUIDE.TABLES_SIDEBAR,
    title: (
      <>
        Tables Menu{' '}
        <span role="img" aria-label="Party">
          🗂
        </span>
      </>
    ),
    content: (
      <Paragraph ellipsis={{ rows: 2 }}>
        Switch between <Text strong>tables</Text> like{' '}
        <Text code>Pipelines</Text>,<Text code>Algorithms</Text> and
        <Text code>Jobs</Text>.
      </Paragraph>
    ),
    placement: 'right-start',
    spotlightPadding: 0
  },
  {
    target: USER_GUIDE.TABLE,
    title: (
      <>
        Table Data{' '}
        <span role="img" aria-label="Party">
          🕵️‍
        </span>
      </>
    ),
    content: (
      <Paragraph>
        <Text strong>Monitor</Text> your deployed data!
      </Paragraph>
    ),
    placement: 'bottom'
  },
  {
    target: USER_GUIDE.OP_SIDEBAR,
    title: (
      <>
        Operations Sidebar{' '}
        <span role="img" aria-label="Party">
          🖊
        </span>
      </>
    ),
    content: (
      <Paragraph ellipsis={{ rows: 2 }}>
        Here we use actions which <Text strong>deploy</Text> data, like{' '}
        <Text code>Add Pipeline</Text> and <Text code>Add Algorithm</Text>
      </Paragraph>
    ),
    placement: 'left'
  }
];

const fixedCSSClassNames = steps.map(step => ({
  ...step,
  target: `.${step.target}`
}));

const TooltipBody = styled.div`
  text-align: center;
  background-color: #fff;
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
  background-color: ${COLOR.transparentGrey};
  padding: 10px;

  * + * {
    margin-left: 0.5rem;
  }
`;

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
  return (
    <TooltipBody {...tooltipProps}>
      <TooltipContent>
        {step.title && <Title level={3}>{step.title}</Title>}
        {step.content && <>{step.content}</>}
      </TooltipContent>
      <TooltipFooter type="flex" justify="space-between">
        <Col>
          {!isLastStep && (
            <Button type="dashed" {...skipProps}>
              Skip
            </Button>
          )}
        </Col>
        <Col>
          {index > 0 && <Button {...backProps}>Back</Button>}
          <Button type="primary" {...primaryProps}>
            {isLastStep ? 'Finish' : 'Next'}
          </Button>
        </Col>
      </TooltipFooter>
    </TooltipBody>
  );
};

export default function UserGuide(props) {
  const { run, setRun, triggerLeftVisible } = props;

  const handleJoyrideCallback = data => {
    const { status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER_GUIDE, false);
      triggerLeftVisible();
      setRun(false);
    }
  };

  return (
    <Joyride
      callback={handleJoyrideCallback}
      steps={fixedCSSClassNames}
      tooltipComponent={Tooltip}
      run={run}
      continuous
      showSkipButton
      disableScrollParentFix
      disableScrolling
      debug
    />
  );
}
