// JobTimingSmartDots.jsx - WITH FALLBACK QUEUE CALCULATION
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import moment from 'moment';

const QUEUE_THRESHOLD = 0.75; // 0.75 seconds
const SEC = 1000; // Matching JobTime constant

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  height: 100%;
`;

const DotItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.color};
  border: 2px solid ${props => props.borderColor};
  box-shadow: 0 0 6px ${props => props.glowColor};
`;

const TimeText = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: #262626;
`;

const Connector = styled.div`
  min-width: ${props => (props.hasQueue ? '30px' : '20px')};
  width: auto;
  padding: 12px 0;
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  background: transparent !important;

  &:hover {
    background: transparent !important;
  }

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 2px;
    background: ${props => props.gradient};
  }
`;

const ConnectorLabel = styled.span`
  position: relative;
  z-index: 1;
  font-size: 9px;
  font-weight: 700;
  color: ${props => props.color};
  background: white;
  padding: 1px 4px;
  border-radius: 4px;
  white-space: nowrap;
  margin: 0 auto;
  display: block;
  text-align: center;
  margin-top: -4px;
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  margin: 0;
  padding: 0 7px;
  color: rgba(0, 0, 0, 0.85);
  font-size: 12px;
  line-height: 20px;
  white-space: nowrap;
  background: #fafafa;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  opacity: 1;
  transition: all 0.2s;

  /* Override with custom colors when provided */
  ${props => props.bg && `background: ${props.bg};`}
  ${props => props.color && `color: ${props.color};`}
  ${props => props.border && `border-color: ${props.border};`}
`;

const JobTimingSmartDots = ({ data }) => {
  const { pipeline, results } = data;
  const {
    startTime,
    activeTime,
    queueTimeSeconds: backendQueueTimeSeconds,
  } = pipeline;

  // Get job status from results, not status (status.status is always 'active' for running pipelines)
  const isJobFinished = ['completed', 'stopped', 'failed', 'crashed'].includes(
    results?.status
  );

  // State for real-time updates
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Update current time every 2 seconds (matching JobTime)
  useEffect(() => {
    // Only set up interval if job is still running (not finished and no results timestamp)
    if (startTime && !results) {
      const interval = setInterval(() => {
        setCurrentTime(Date.now());
      }, 2 * SEC); // Update every 2 seconds (matching JobTime)

      return () => clearInterval(interval);
    }
  }, [startTime, results]);

  if (!startTime) return <span>---</span>;

  const finishTime = results?.timestamp || null;

  // Calculate queue time: use backend value if available, otherwise calculate client-side
  let queueTimeSeconds = 0;
  if (
    backendQueueTimeSeconds !== null &&
    backendQueueTimeSeconds !== undefined
  ) {
    queueTimeSeconds = backendQueueTimeSeconds;
  } else if (activeTime && startTime) {
    queueTimeSeconds = (activeTime - startTime) / SEC;
  }

  // Treat as no queue if queueTime is less than 0.75 seconds
  const hasNoQueue = queueTimeSeconds < QUEUE_THRESHOLD;

  // Match JobTime logic: use results.timeTook for finished jobs, calculate for running
  const totalTimeTook = results?.timeTook
    ? results.timeTook * SEC
    : currentTime - startTime;

  // Use finishTime if job is finished, otherwise use currentTime for live updates
  const endTime = finishTime || (isJobFinished ? Date.now() : currentTime);

  const runningTime = activeTime ? endTime - activeTime : 0;

  const isRunning = !!(activeTime && !finishTime && !isJobFinished);

  const formatTime = timestamp => moment(timestamp).format('HH:mm:ss');
  const formatFullTime = timestamp =>
    moment(timestamp).format('MMM D, YYYY HH:mm:ss');

  // Enhanced time formatting with days, hours, minutes, and seconds
  const formatDuration = milliseconds => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const parts = [];

    if (days > 0) {
      parts.push(`${days}d`);
      if (hours > 0) parts.push(`${hours}h`);
      if (minutes > 0) parts.push(`${minutes}m`);
    } else if (hours > 0) {
      parts.push(`${hours}h`);
      if (minutes > 0) parts.push(`${minutes}m`);
      parts.push(`${seconds}s`);
    } else if (minutes > 0) {
      parts.push(`${minutes}m`);
      parts.push(`${seconds}s`);
    } else {
      parts.push(`${seconds}s`);
    }

    return parts.join(' ');
  };

  // Unified orange for all queue connectors and labels
  const queueGradient = 'linear-gradient(90deg, #ffa940 0%, #fa8c16 100%)';
  const queueColor = '#fa8c16';

  return (
    <Container>
      {/* Case 1: queueTime < 0.75s → show only active dot + duration */}
      {hasNoQueue ? (
        <>
          <Tooltip
            title={
              <div>
                <div>
                  ▶{' '}
                  {activeTime ? 'Active Time (Started Running)' : 'Start Time'}
                </div>
                <div>{formatFullTime(activeTime || startTime)}</div>
              </div>
            }>
            <DotItem>
              <Dot
                color="#1890ff"
                borderColor="#ffffff"
                glowColor="rgba(24, 144, 255, 0.3)"
              />
              <TimeText>{formatTime(activeTime || startTime)}</TimeText>
            </DotItem>
          </Tooltip>

          <Tooltip
            title={
              <div>
                <div>{isRunning ? 'Currently Running' : 'Completed'}</div>
                <div>
                  Duration:{' '}
                  {formatDuration(activeTime ? runningTime : totalTimeTook)}
                </div>
                {finishTime && (
                  <>
                    <div style={{ marginTop: 4 }}>
                      Finished: {formatFullTime(finishTime)}
                    </div>
                    <div style={{ marginTop: 4 }}>
                      Total Time: {formatDuration(totalTimeTook)}
                    </div>
                  </>
                )}
              </div>
            }>
            <StatusBadge>
              {formatDuration(activeTime ? runningTime : totalTimeTook)}
            </StatusBadge>
          </Tooltip>
        </>
      ) : (
        /* Case 2: queueTime >= 0.75s → full timeline with queue */
        <>
          {/* Start Time Dot */}
          <Tooltip
            title={
              <div>
                <div>⏱ Start Time (Requested)</div>
                <div>{formatFullTime(startTime)}</div>
                <div style={{ marginTop: 4 }}>Pipeline submitted to queue</div>
              </div>
            }>
            <DotItem>
              <Dot
                color="#1890ff"
                borderColor="#ffffff"
                glowColor="rgba(24, 144, 255, 0.3)"
              />
              <TimeText>{formatTime(startTime)}</TimeText>
            </DotItem>
          </Tooltip>

          {activeTime && (
            <>
              {/* Queue Connector — always orange */}
              <Tooltip
                title={
                  <div>
                    <div>⏱ Queue Time</div>
                    <div>
                      Waited {formatDuration(queueTimeSeconds * SEC)} in queue
                    </div>
                  </div>
                }>
                <Connector
                  gradient={queueGradient}
                  hasQueue={queueTimeSeconds > 0}>
                  {queueTimeSeconds > 0 && (
                    <ConnectorLabel color={queueColor}>
                      {formatDuration(queueTimeSeconds * SEC)}
                    </ConnectorLabel>
                  )}
                </Connector>
              </Tooltip>

              {/* Active Time Dot */}
              <Tooltip
                title={
                  <div>
                    <div>▶ Active Time (Started Running)</div>
                    <div>{formatFullTime(activeTime)}</div>
                  </div>
                }>
                <DotItem>
                  <Dot
                    color="#1890ff"
                    borderColor="#ffffff"
                    glowColor="rgba(24, 144, 255, 0.3)"
                  />
                  <TimeText>{formatTime(activeTime)}</TimeText>
                </DotItem>
              </Tooltip>

              {/* Running Time Badge */}
              <Tooltip
                title={
                  <div>
                    <div>{isRunning ? 'Currently Running' : 'Completed'}</div>
                    <div>Active Duration: {formatDuration(runningTime)}</div>
                    {finishTime && (
                      <>
                        <div style={{ marginTop: 4 }}>
                          Finished: {formatFullTime(finishTime)}
                        </div>
                        <div style={{ marginTop: 4 }}>
                          Total Time: {formatDuration(totalTimeTook)}
                        </div>
                      </>
                    )}
                  </div>
                }>
                <StatusBadge>{formatDuration(runningTime)}</StatusBadge>
              </Tooltip>
            </>
          )}
        </>
      )}
    </Container>
  );
};

JobTimingSmartDots.propTypes = {
  data: PropTypes.shape({
    pipeline: PropTypes.shape({
      startTime: PropTypes.number,
      activeTime: PropTypes.number,
      queueTimeSeconds: PropTypes.number,
    }).isRequired,
    results: PropTypes.shape({
      timestamp: PropTypes.number,
      timeTook: PropTypes.number,
    }),
    status: PropTypes.shape({
      status: PropTypes.string,
    }),
  }).isRequired,
};

export default JobTimingSmartDots;
