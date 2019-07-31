import React, { useState, useEffect } from 'react';
import Joyride, { STATUS, EVENTS, ACTIONS, LIFECYCLE } from 'react-joyride';
import { LOCAL_STORAGE_KEYS } from 'constants/states';
import USER_GUIDE from 'constants/user-guide';
import { Typography } from 'antd';
import { COLOR } from 'constants/colors';

const { Title, Text, Paragraph } = Typography;

const steps = [
  {
    target: USER_GUIDE.CONTACT,
    content: (
      <>
        <Title level={3}>
          Welcome to HKube Dashboard!{' '}
          <span role="img" aria-label="Party">
            🥳
          </span>
        </Title>
        <Paragraph>
          HKube is a cloud-native open source framework to run distributed
          pipeline of algorithms.
        </Paragraph>
        <Paragraph>
          We use the <Text strong>Dashboard</Text> for deploying and monitoring
          user algorithms and pipelines.
        </Paragraph>
      </>
    ),
    locale: { skip: 'Skip Tutorial' },
    placement: 'center'
  },
  {
    target: USER_GUIDE.TABLES_SIDEBAR,
    content: (
      <>
        <Title level={3}>
          Tables Menu{' '}
          <span role="img" aria-label="Party">
            🗂
          </span>{' '}
        </Title>
        <Paragraph>
          <br />
          Here we <Text strong>monitor</Text> the deployed data,
          <br />
          like <Text code>Pipelines</Text>,<Text code>Algorithms</Text> and{' '}
          <Text code>Jobs</Text>
        </Paragraph>
      </>
    ),
    placement: 'right-start',
    spotlightPadding: 0
  },
  {
    target: USER_GUIDE.TABLE,
    content: (
      <>
        <Title level={3}>
          Table Example{' '}
          <span role="img" aria-label="Party">
            🖊
          </span>{' '}
        </Title>
        <Paragraph>
          <br />
          Here is table <Text strong>deploy</Text> data,
          <br />
          like <Text code>Add Pipeline</Text> and{' '}
          <Text code>Add Algorithm</Text>
        </Paragraph>
      </>
    ),
    placement: 'top-start',
    styles: {
      options: {
        height: '300px'
      }
    }
  },
  {
    target: USER_GUIDE.OP_SIDEBAR,
    content: (
      <>
        <Title level={3}>
          Operations Menu{' '}
          <span role="img" aria-label="Party">
            🖊
          </span>{' '}
        </Title>
        <Paragraph>
          <br />
          Here we use actions which <Text strong>deploy</Text> data,
          <br />
          like <Text code>Add Pipeline</Text> and{' '}
          <Text code>Add Algorithm</Text>
        </Paragraph>
      </>
    ),
    placement: 'left'
  }
];

const fixedCSSClassNames = steps.map(step => ({
  ...step,
  target: `.${step.target}`
}));

export default function UserGuide(props) {
  const { menuIsOpen, run, setRun } = props;

  const handleJoyrideCallback = data => {
    const { status, index, type, action } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER_GUIDE, false);
      setRun(false);
    }
  };

  return (
    <Joyride
      callback={handleJoyrideCallback}
      steps={fixedCSSClassNames}
      debug
      continuous
      run={run}
      showSkipButton
      disableScrollParentFix
      disableScrolling
      styles={{
        options: {
          arrowColor: COLOR.white,
          backgroundColor: COLOR.white,
          primaryColor: COLOR.blue,
          zIndex: 1000
        }
      }}
    />
  );
}
