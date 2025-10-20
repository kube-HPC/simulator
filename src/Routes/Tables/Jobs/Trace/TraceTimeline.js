import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Space } from 'antd';
import { ApiOutlined, ClockCircleOutlined } from '@ant-design/icons';
import TimelineMarkers from './TimelineMarkers';
import { getCurrentTheme, getSystemColors } from './traceConstants';

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

const ServiceColumn = styled.div`
  flex: 0 0 250px;
`;

const TimelineColumn = styled.div`
  flex: 1;
  text-align: center;
`;

const MetricsColumn = styled.div`
  flex: 0 0 140px;
  text-align: center;
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
