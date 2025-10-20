import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Typography } from 'antd';
import { formatDuration } from './traceUtils';
import { getCurrentTheme, getSystemColors } from './traceConstants';

const { Text } = Typography;

const MarkersContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 16px;
  padding-left: 266px;
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

  return <MarkersContainer $isDark={isDark}>{markers}</MarkersContainer>;
};

TimelineMarkers.propTypes = {
  duration: PropTypes.number.isRequired,
};

export default React.memo(TimelineMarkers);
