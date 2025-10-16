import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Card, Tag, Space, Typography } from 'antd';
import { formatDuration, formatDateTime } from './traceUtils';

const { Title } = Typography;

const StyledCard = styled(Card)`
  margin: 0;
  border-radius: 8px 8px 0 0;
  background: #a3d4f5;
  border: none;

  .ant-card-body {
    padding: 20px 16px;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderContent = styled.div``;

const StyledTitle = styled(Title)`
  &.ant-typography {
    margin: 0;
    color: #1d76db;
  }
`;

const StyledSpace = styled(Space)`
  margin-top: 8px;
`;

const StyledTag = styled(Tag)`
  margin: 0;
  font-size: 12px;
`;

const TraceHeader = ({ traceData }) => {
  const serviceCount = Object.keys(traceData.processes).length;
  const spanCount = traceData.spans.length;

  return (
    <StyledCard>
      <HeaderContainer>
        <HeaderContent>
          <StyledTitle level={4}>Trace Details</StyledTitle>
          <StyledSpace size={20}>
            <StyledTag color="default">
              Start: {formatDateTime(traceData.startTime)}
            </StyledTag>
            <StyledTag color="success">
              Duration: {formatDuration(traceData.duration)}
            </StyledTag>
            <StyledTag color="processing">Services: {serviceCount}</StyledTag>
            <StyledTag color="warning">Depth: 1</StyledTag>
            <StyledTag color="error">Total Spans: {spanCount}</StyledTag>
          </StyledSpace>
        </HeaderContent>
      </HeaderContainer>
    </StyledCard>
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
