import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from 'antd';
import { formatDuration } from './traceUtils';
import { systemColors } from './traceConstants';

const { Text } = Typography;

const TimelineMarkers = ({ duration }) => {
  const markers = [];
  const markerCount = 5;

  for (let i = 0; i <= markerCount; i++) {
    const time = (duration * i) / markerCount;
    markers.push(
      <Text
        key={i}
        style={{
          fontSize: '11px',
          color: '#4a4a4a',
          fontWeight: 'bold',
        }}>
        {formatDuration(time)}
      </Text>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '8px 16px',
        paddingLeft: '266px',
        background: systemColors.cardBackground,
        borderBottom: `1px solid ${systemColors.border}`,
      }}>
      {markers}
    </div>
  );
};

TimelineMarkers.propTypes = {
  duration: PropTypes.number.isRequired,
};

export default React.memo(TimelineMarkers);
