import { Tag, Typography } from 'antd';
import styled from 'styled-components';
import HumanizeDuration from 'humanize-duration';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Moment from 'react-moment';

const { Text } = Typography;

const SEC = 1000;
/**
 * @param {object} props
 * @param {React.CSSProperties} props.style
 */

const TimeText = styled(Text)`
  font-size: 10px;
`;

const JobTime = ({ results, startTime, length, style }) => {
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
    <Tag style={style}>
      <Moment format="DD/MM/YY HH:mm:ss" style={{ marginRight: '1ch' }}>
        {+startTime}
      </Moment>
      <TimeText strong>{time}</TimeText>
    </Tag>
  );
};

JobTime.propTypes = {
  length: PropTypes.number,
  startTime: PropTypes.number,
  // TODO: detail the props
  /* eslint-disable */
  style: PropTypes.object,
  results: PropTypes.object,
  /* eslint-enable */
};

JobTime.defaultProps = {
  length: 15,
  startTime: 0,
};

export default React.memo(JobTime);
