import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Typography } from 'antd';
import { formatDuration } from './traceUtils';
import {
  getCurrentTheme,
  getSystemColors,
  NAME_COL_WIDTH,
  METRICS_COL_WIDTH,
  LOGS_COL_WIDTH,
} from './traceConstants';

const { Text } = Typography;

/*
 * Mirror TraceTimeline's column structure so markers are rendered only inside
 * the Timeline column width while staying aligned on responsive breakpoints.
 */
const MarkersContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background: ${props => {
    const colors = getSystemColors(props.$isDark);
    return colors.cardBackground;
  }};
  border-bottom: 1px solid
    ${props => {
      const colors = getSystemColors(props.$isDark);
      return colors.border;
    }};
`;

const ServiceSpacer = styled.div`
  flex: 0 0 ${NAME_COL_WIDTH}px;
`;

const TimelineColumn = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  min-width: 0;
`;

const MetricsSpacer = styled.div`
  flex: 0 0 ${METRICS_COL_WIDTH}px;

  @media (max-width: 500px) {
    display: none;
  }
`;

const LogsSpacer = styled.div`
  flex: 0 0 ${LOGS_COL_WIDTH}px;
`;

const MarkerText = styled(Text)`
  font-size: 11px;
  color: ${props => (props.$isDark ? '#b8bfc7' : '#4a4a4a')};
  font-weight: bold;
`;

const TimelineMarkers = ({ duration }) => {
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

  const markers = [];
  const markerCount = 5;

  for (let i = 0; i <= markerCount; i++) {
    const time = (duration * i) / markerCount;
    markers.push(
      <MarkerText key={i} $isDark={isDark}>
        {formatDuration(time)}
      </MarkerText>
    );
  }

  return (
    <MarkersContainer $isDark={isDark}>
      <ServiceSpacer />
      <TimelineColumn>{markers}</TimelineColumn>
      <MetricsSpacer />
      <LogsSpacer />
    </MarkersContainer>
  );
};

TimelineMarkers.propTypes = {
  duration: PropTypes.number.isRequired,
};

export default React.memo(TimelineMarkers);
