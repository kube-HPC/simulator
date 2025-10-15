import React from 'react';
import PropTypes from 'prop-types';
import { Space } from 'antd';
import { ApiOutlined, ClockCircleOutlined } from '@ant-design/icons';
import TimelineMarkers from './TimelineMarkers';
import { systemColors } from './traceConstants';

const TraceTimeline = ({ traceData }) => {
  const { duration } = traceData;

  return (
    <>
      <div
        style={{
          background: systemColors.border,
          borderBottom: `1px solid ${systemColors.border}`,
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          fontSize: '14px',
          fontWeight: '600',
          color: systemColors.text,
        }}>
        <div style={{ flex: '0 0 250px' }}>
          <Space>
            <ApiOutlined style={{ color: systemColors.blue }} />
            Service & Operation
          </Space>
        </div>
        <div style={{ flex: '1', textAlign: 'center' }}>
          <Space>
            <ClockCircleOutlined style={{ color: systemColors.blue }} />
            Timeline
          </Space>
        </div>
        <div style={{ flex: '0 0 140px', textAlign: 'center' }}>
          <Space size={12}>
            <span>Start Time</span>
            <span>Duration</span>
          </Space>
        </div>
      </div>
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
