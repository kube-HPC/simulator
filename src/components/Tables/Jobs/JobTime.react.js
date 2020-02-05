import { Tag, Typography } from 'antd';
import { FlexBox } from 'components/common';
import HumanizeDuration from 'humanize-duration';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import Moment from 'react-moment';

const { Text } = Typography;

const SEC = 1000;

const JobTime = ({ results, startTime, length = 15 }) => {
  const [time, setTime] = useState(Date.now());
  const intervalId = useRef();

  useEffect(() => {
    const id = setInterval(() => {
      setTime(Date.now());
    }, 2 * SEC);
    intervalId.current = id;
    return () => clearInterval(intervalId.current);
  }, []);

  useEffect(() => {
    if (results) {
      clearInterval(intervalId.current);
    }
  }, [results]);

  return (
    <FlexBox.Auto justify="start">
      <Tag>
        <Moment format="DD/MM/YY HH:mm:ss">{startTime}</Moment>
        {` `}
        <Text strong>
          {HumanizeDuration(results ? results.timeTook * 1000 : time - startTime, {
            maxDecimalPoints: 2,
          }).slice(0, length)}
        </Text>
      </Tag>
    </FlexBox.Auto>
  );
};

JobTime.propTypes = {
  startTime: PropTypes.number,
  length: PropTypes.number,
  results: PropTypes.object,
};

export default JobTime;
