// JobTimingSmartDots.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import moment from 'moment';

const QUEUE_THRESHOLD = 750; // 0.75 sec in ms

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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  background: ${props => props.bg};
  border: 1px solid ${props => props.border};
  color: ${props => props.color};
  height: 20px;
  min-height: 20px;
  max-height: 20px;
  padding: 0 8px;
  font-size: 10px;
  font-weight: 700;
`;

const JobTimingSmartDots = ({ data }) => {
  const { pipeline, results } = data;
  const { startTime, activeTime, queueTime: backendQueueTime } = pipeline;

  // State for real-time updates
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Update current time every second for real-time duration
  useEffect(() => {
    // Only set up interval if job is still running
    if (activeTime && !results?.timestamp) {
      const interval = setInterval(() => {
        setCurrentTime(Date.now());
      }, 1000); // Update every second

      return () => clearInterval(interval);
    }
  }, [activeTime, results?.timestamp]);

  if (!startTime) return <span>---</span>;

  const finishTime = results?.timestamp || null;

  const queueTime = backendQueueTime || 0;
  // Treat as no queue if backend queueTime is less than 750ms
  const hasNoQueue = queueTime < QUEUE_THRESHOLD;

  const endTime = finishTime || currentTime; // Use currentTime for real-time updates
  const runningTime = activeTime ? endTime - activeTime : 0;
  const isRunning = !finishTime && activeTime;

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
      {/* Case 1: startTime === activeTime → show only active dot + duration */}
      {hasNoQueue ? (
        <>
          <Tooltip
            title={
              <div>
                <div>▶ Active Time</div>
                <div>{formatFullTime(activeTime)}</div>
                <div style={{ marginTop: 4 }}>
                  No queue wait — started immediately
                </div>
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
                      Total Time: {formatDuration(finishTime - startTime)}
                    </div>
                  </>
                )}
              </div>
            }>
            <StatusBadge
              bg={isRunning ? '#e6f7ff' : '#f6ffed'}
              color={isRunning ? '#1890ff' : '#52c41a'}
              border={isRunning ? '#91d5ff' : '#b7eb8f'}>
              {formatDuration(runningTime)}
            </StatusBadge>
          </Tooltip>
        </>
      ) : (
        /* Case 2: startTime !== activeTime → full timeline with queue */
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
                    <div>Waited {formatDuration(queueTime)} in queue</div>
                  </div>
                }>
                <Connector gradient={queueGradient} hasQueue={queueTime > 0}>
                  {queueTime > 0 && (
                    <ConnectorLabel color={queueColor}>
                      {formatDuration(queueTime)}
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
                    <div style={{ marginTop: 4 }}>Pipeline began execution</div>
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
                          Total Time: {formatDuration(finishTime - startTime)}
                        </div>
                      </>
                    )}
                  </div>
                }>
                <StatusBadge
                  bg={isRunning ? '#e6f7ff' : '#f6ffed'}
                  color={isRunning ? '#1890ff' : '#52c41a'}
                  border={isRunning ? '#91d5ff' : '#b7eb8f'}>
                  {formatDuration(runningTime)}
                </StatusBadge>
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
    }).isRequired,
    results: PropTypes.shape({
      timestamp: PropTypes.number,
    }),
  }).isRequired,
};

export default JobTimingSmartDots;
