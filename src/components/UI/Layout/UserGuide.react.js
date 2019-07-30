import React, { useState } from 'react';
import styled from 'styled-components';
import Joyride, { STATUS } from 'react-joyride';
import { LOCAL_STORAGE_KEYS } from 'constants/states';

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
    content: <h2>Welcome to HKube</h2>,
    locale: { skip: 'Skip' },
    run: false,
    placement: 'center'
  },
  {
    title: 'Tables',
    target: '.table-sidebar',
    content: 'This is the sidebar',
    placement: 'right'
  },
  {
    title: 'Operations',
    target: '.operations-sidebar',
    content: 'This is the operations sidebar',
    placement: 'left'
  }
];

export default function UserGuide({ run, setRun }) {
  const handleJoyrideCallback = data => {
    const { status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
    if (finishedStatuses.includes(status)) setRun(false);

    if (status === STATUS.SKIPPED) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER_GUIDE, false);
    }
  };
  return (
    <Joyride
      callback={handleJoyrideCallback}
      steps={steps}
      debug
      continuous
      run={run}
      showSkipButton
      showProgress
      disableScrollParentFix
      disableScrolling
    />
  );
}
