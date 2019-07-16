import React, { useState } from 'react';
import styled from 'styled-components';
import Joyride, { STATUS } from 'react-joyride';

const FlexBox = styled.div`
  margin: 20px;
  padding: 20px;
  border: 2px solid palevioletred;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  > div {
    margin: 20px;
  }
`;

const steps = [
  {
    target: 'body',
    content: <h2>Let's begin our journey!</h2>,
    locale: { skip: <strong aria-label="skip">S-K-I-P</strong> },
    run: false,
    placement: 'center'
  },
  {
    target: '.sidebar',
    content: 'This is the sidebar',
    placement: 'center'
  }
];

export default function UserGuide({ run, setRun }) {
  const handleJoyrideCallback = data => {
    const { status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
    if (finishedStatuses.includes(status)) setRun(false);
  };
  return (
    <Joyride
      callback={handleJoyrideCallback}
      steps={steps}
      debug
      continuous
      run={run}
      showSkipButton
      scrollToFirstStep
      showProgress
    />
  );
}
