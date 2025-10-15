import React from 'react';
import PropTypes from 'prop-types';
import { Card, Tag, Space, Typography } from 'antd';
import { formatDuration, formatDateTime } from './traceUtils';

const { Title } = Typography;

const TraceHeader = ({ traceData }) => {
  const serviceCount = Object.keys(traceData.processes).length;
  const spanCount = traceData.spans.length;

  return (
    <Card
      style={{
        margin: 0,
        borderRadius: '8px 8px 0 0',
        background: '#a3d4f5',
        border: 'none',
      }}
      bodyStyle={{ padding: '20px 16px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <div>
          <Title level={4} style={{ margin: 0, color: '#1d76db' }}>
            Trace Details
          </Title>
          <Space size={20} style={{ marginTop: '8px' }}>
            <Tag color="default" style={{ margin: 0, fontSize: '12px' }}>
              Start: {formatDateTime(traceData.startTime)}
            </Tag>
            <Tag color="success" style={{ margin: 0, fontSize: '12px' }}>
              Duration: {formatDuration(traceData.duration)}
            </Tag>
            <Tag color="processing" style={{ margin: 0, fontSize: '12px' }}>
              Services: {serviceCount}
            </Tag>
            <Tag color="warning" style={{ margin: 0, fontSize: '12px' }}>
              Depth: 1
            </Tag>
            <Tag color="error" style={{ margin: 0, fontSize: '12px' }}>
              Total Spans: {spanCount}
            </Tag>
          </Space>
        </div>
      </div>
    </Card>
  );
};

TraceHeader.propTypes = {
  traceData: PropTypes.shape({
    processes: PropTypes.object.isRequired,
    spans: PropTypes.array.isRequired,
    startTime: PropTypes.number.isRequired,
    duration: PropTypes.number.isRequired,
  }).isRequired,
};

export default React.memo(TraceHeader);
