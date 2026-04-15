import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Space } from 'antd';
import { ApiOutlined, ClockCircleOutlined } from '@ant-design/icons';
import TimelineMarkers from './TimelineMarkers';
import {
  getCurrentTheme,
  getSystemColors,
  NAME_COL_WIDTH,
  METRICS_COL_WIDTH,
} from './traceConstants';

const TimelineHeader = styled.div`
  background: ${props => {
    const colors = getSystemColors(props.$isDark);
    return props.$isDark ? '#1f2937' : colors.border;
  }};
  border-bottom: 1px solid
    ${props => {
      const colors = getSystemColors(props.$isDark);
      return props.$isDark ? '#3d5a7e' : colors.border;
    }};
  padding: 12px 16px;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  color: ${props => {
    const colors = getSystemColors(props.$isDark);
    return colors.text;
  }};
`;

/*
 * Fixed width driven by the shared constant so it always matches SpanRow's
 * name column and TimelineMarkers' left padding.
 */
const ServiceColumn = styled.div`
  flex: 0 0 ${NAME_COL_WIDTH}px;
  min-width: 0; /* allow text to truncate rather than overflow */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const TimelineColumn = styled.div`
  flex: 1;
  text-align: center;
  min-width: 0;
`;

/*
 * Hide the metrics column on narrow viewports (< 500px) where there is not
 * enough horizontal space to show it alongside the name column and timeline bar.
 * SpanRow's SpanTiming is hidden at the same breakpoint.
 */
const MetricsColumn = styled.div`
  flex: 0 0 ${METRICS_COL_WIDTH}px;
  text-align: center;

  @media (max-width: 500px) {
    display: none;
  }
`;

const StyledIcon = styled.span`
  color: ${props => {
    const colors = getSystemColors(props.$isDark);
    return colors.blue;
  }};
`;

const TraceTimeline = ({ traceData }) => {
  const [isDark, setIsDark] = useState(getCurrentTheme() === 'DARK');

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(getCurrentTheme() === 'DARK');
    };

    const interval = setInterval(checkTheme, 500);
    window.addEventListener('storage', checkTheme);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', checkTheme);
    };
  }, []);

  const { duration } = traceData;

  return (
    <>
      <TimelineHeader $isDark={isDark}>
        <ServiceColumn>
          <Space>
            <StyledIcon as={ApiOutlined} $isDark={isDark} />
            Service & Operation
          </Space>
        </ServiceColumn>
        <TimelineColumn>
          <Space>
            <StyledIcon as={ClockCircleOutlined} $isDark={isDark} />
            Timeline
          </Space>
        </TimelineColumn>
        <MetricsColumn>
          <Space size={12}>
            <span>Start Time</span>
            <span>Duration</span>
          </Space>
        </MetricsColumn>
      </TimelineHeader>
      <TimelineMarkers duration={duration} />
    </>
  );
};

TraceTimeline.propTypes = {
  traceData: PropTypes.shape({
    duration: PropTypes.number.isRequired,
  }).isRequired,
};

export default React.memo(TraceTimeline);
