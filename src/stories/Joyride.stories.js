import React, { useState, useRef } from 'react';
import { storiesOf } from '@storybook/react';
import Joyride, { STATUS } from 'react-joyride';
import styled from 'styled-components';

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

function JoyrideContainer() {
  const [run, setRun] = useState(true);
  const step1 = useRef(null);
  const step2 = useRef();

  const steps = [
    {
      run: false,
      content: <h2>Let's begin our journey!</h2>,
      locale: { skip: <strong aria-label="skip">S-K-I-P</strong> },
      placement: 'center',
      target: 'body'
    },
    {
      target: '.step-1',
      content: 'This is my awesome feature!'
    },
    {
      target: '.step-2',
      content: 'This another awesome feature!'
    }
  ];

  const handleJoyrideCallback = data => {
    const { status, type } = data;

    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
    }
  };
  return (
    <>
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
      <FlexBox>
        <button
          onClick={() => {
            setRun(true);
            console.log(step1);
          }}
        >
          Start Guide
        </button>
        <FlexBox className="step-1" ref={step1}>
          <div>Step 1</div>
        </FlexBox>
        <FlexBox className="step-2" ref={step2}>
          <div>Step 2</div>
        </FlexBox>
      </FlexBox>
    </>
  );
}

storiesOf('BASICS|Joyride', module).add('Example', () => <JoyrideContainer />);
