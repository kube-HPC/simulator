import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Space } from 'antd';
import { ApiOutlined, ClockCircleOutlined } from '@ant-design/icons';
import TimelineMarkers from './TimelineMarkers';
import { systemColors } from './traceConstants';

const TimelineHeader = styled.div`
  background: ${systemColors.border};
  border-bottom: 1px solid ${systemColors.border};
  padding: 12px 16px;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  color: ${systemColors.text};
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
  color: ${systemColors.blue};
`;

const TraceTimeline = ({ traceData }) => {
  const { duration } = traceData;

  return (
    <>
      <TimelineHeader>
        <ServiceColumn>
          <Space>
            <StyledIcon as={ApiOutlined} />
            Service & Operation
          </Space>
        </ServiceColumn>
        <TimelineColumn>
          <Space>
            <StyledIcon as={ClockCircleOutlined} />
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
