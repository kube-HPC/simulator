import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Typography } from 'antd';
import { formatDuration } from './traceUtils';
import { systemColors } from './traceConstants';

const { Text } = Typography;

const MarkersContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 16px;
  padding-left: 266px;
  background: ${systemColors.cardBackground};
  border-bottom: 1px solid ${systemColors.border};
`;

const MarkerText = styled(Text)`
  font-size: 11px;
  color: #4a4a4a;
  font-weight: bold;
`;

const TimelineMarkers = ({ duration }) => {
  const markers = [];
  const markerCount = 5;

  for (let i = 0; i <= markerCount; i++) {
    const time = (duration * i) / markerCount;
    markers.push(<MarkerText key={i}>{formatDuration(time)}</MarkerText>);
  }

  return <MarkersContainer>{markers}</MarkersContainer>;
};

TimelineMarkers.propTypes = {
  duration: PropTypes.number.isRequired,
};

export default React.memo(TimelineMarkers);
