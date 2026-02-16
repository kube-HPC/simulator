import { Tag, Typography, Tooltip } from 'antd';
import styled from 'styled-components';
import HumanizeDuration from 'humanize-duration';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';

const { Text } = Typography;

const SEC = 1000;
const QUEUE_THRESHOLD = 0.75; // 0.75 seconds

/**
 * @param {object} props
 * @param {React.CSSProperties} props.style
 */

const TimeText = styled(Text)`
  font-size: 10px;
`;

const TooltipRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  font-size: 12px;
  padding: 2px 0;
`;

const TooltipLabel = styled.span`
  color: rgba(255, 255, 255, 0.65);
`;

const TooltipValue = styled.span`
  color: #fff;
  font-weight: 600;
`;

const JobTime = ({
  results,
  startTime = 0,
  activeTime,
  queueTimeSeconds: backendQueueTimeSeconds,
  length = 15,
  style,
}) => {
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

  // Backend sends queueTimeSeconds in SECONDS - use directly
  const queueTimeSeconds = backendQueueTimeSeconds || 0;
  const hasSignificantQueue = queueTimeSeconds >= QUEUE_THRESHOLD;

  const formatDuration = ms => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  const tooltipContent = (
    <div>
      <TooltipRow>
        <TooltipLabel>Start Time</TooltipLabel>
        <TooltipValue>
          {dayjs(+startTime).format('DD/MM/YY HH:mm:ss')}
        </TooltipValue>
      </TooltipRow>
      {hasSignificantQueue && activeTime && (
        <TooltipRow>
          <TooltipLabel>Active Time</TooltipLabel>
          <TooltipValue>
            {dayjs(+activeTime).format('DD/MM/YY HH:mm:ss')}
          </TooltipValue>
        </TooltipRow>
      )}
      {hasSignificantQueue && (
        <TooltipRow>
          <TooltipLabel style={{ color: '#ffa940' }}>Queue Time</TooltipLabel>
          <TooltipValue style={{ color: '#ffa940' }}>
            {formatDuration(queueTimeSeconds * SEC)}
          </TooltipValue>
        </TooltipRow>
      )}
    </div>
  );

  return (
    <Tooltip title={tooltipContent} placement="bottomLeft">
      <Tag style={style}>
        <span style={{ marginRight: '1ch' }}>
          {dayjs(+startTime).format('DD/MM/YY HH:mm:ss')}
        </span>
        <TimeText strong>{time}</TimeText>
      </Tag>
    </Tooltip>
  );
};

JobTime.propTypes = {
  length: PropTypes.number,
  startTime: PropTypes.number,
  activeTime: PropTypes.number,
  queueTimeSeconds: PropTypes.number,
  // TODO: detail the props
  /* eslint-disable */
  style: PropTypes.object,
  results: PropTypes.object,
  /* eslint-enable */
};

export default React.memo(JobTime);
