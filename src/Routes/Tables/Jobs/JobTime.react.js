import { Tag, Typography } from 'antd';
import HumanizeDuration from 'humanize-duration';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Moment from 'react-moment';

const { Text } = Typography;

const SEC = 1000;

const JobTime = ({ results, startTime, length }) => {
  const diffTime = useCallback(
    (from = new Date()) =>
      HumanizeDuration(results ? results.timeTook * SEC : startTime - from, {
        maxDecimalPoints: 2,
      }).slice(0, length),
    [results, startTime, length]
  );

  const [time, setTime] = useState(diffTime());
  const intervalId = useRef();

  useEffect(() => {
    const id = setInterval(() => {
      setTime(diffTime());
    }, 2 * SEC);
    intervalId.current = id;
    return () => clearInterval(intervalId.current);
  }, [diffTime, intervalId]);

  useEffect(() => {
    if (results) {
      clearInterval(intervalId.current);
    }
  }, [results]);

  return (
    <Tag>
      <Moment format="DD/MM/YY HH:mm:ss" style={{ marginRight: '1ch' }}>
        {startTime}
      </Moment>
      <Text strong>{time}</Text>
    </Tag>
  );
};

JobTime.propTypes = {
  length: PropTypes.number,
  startTime: PropTypes.number.isRequired,
  // TODO: detail the props
  /* eslint-disable */
  results: PropTypes.object,
  /* eslint-enable */
};

JobTime.defaultProps = {
  length: 15,
};

export default React.memo(JobTime);
