import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Card, Tag, Space, Typography } from 'antd';
import { formatDuration, formatDateTime } from './traceUtils';
import { getCurrentTheme } from './traceConstants';

const { Title } = Typography;

const StyledCard = styled(Card)`
  margin: 0;
  border-radius: 8px 8px 0 0;
  background: ${props =>
    props.$isDark
      ? 'linear-gradient(135deg, #2c4a6e 0%, #3d5a7e 100%)'
      : '#a3d4f5'};
  border: none;
  box-shadow: ${props =>
    props.$isDark ? '0 2px 8px rgba(0, 0, 0, 0.3)' : 'none'};

  .ant-card-body {
    padding: 20px 16px;
    background: transparent;
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
    color: ${props => (props.$isDark ? '#69c0ff' : '#1d76db')};
    font-weight: 600;
    text-shadow: ${props =>
      props.$isDark ? '0 1px 2px rgba(0, 0, 0, 0.3)' : 'none'};
  }
`;

const StyledSpace = styled(Space)`
  margin-top: 8px;
`;

const StyledTag = styled(Tag)`
  margin: 0;

  background-color: ${props => {
    if (!props.$isDark) return 'auto';

    switch (props.color) {
      case 'success':
        return '#173d17ff';
      case 'warning':
        return '#3d2817';
      case 'error':
        return '#3d1a1a';
      default:
        return '#1e3a52';
    }
  }} !important; // 👈 !important goes HERE, not inside the return

  color: ${props => {
    if (!props.$isDark) return 'auto';

    switch (props.color) {
      case 'success':
        return '#ffffff';
      case 'warning':
        return '#ffffff';
      case 'error':
        return '#ffffff';
      default:
        return '#ffffff';
    }
  }} !important; // 👈 HERE

  border-color: ${props => {
    if (!props.$isDark) return 'auto';

    switch (props.color) {
      case 'success':
        return '#52c41a';
      case 'warning':
        return '#ffa940';
      case 'error':
        return '#ff4d4f';
      default:
        return '#40a9ff';
    }
  }} !important; // 👈 HERE

  font-weight: 500;
  box-shadow: ${props =>
    props.$isDark ? '0 1px 3px rgba(0, 0, 0, 0.2)' : 'none'};
`;

const TraceHeader = ({ traceData }) => {
  const [isDark, setIsDark] = useState(getCurrentTheme() === 'DARK');

  // Listen for theme changes
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

  const serviceCount = Object.keys(traceData.processes).length;
  const spanCount = traceData.spans.length;

  return (
    <StyledCard $isDark={isDark}>
      <HeaderContainer>
        <HeaderContent>
          <StyledTitle level={4} $isDark={isDark}>
            Trace Details
          </StyledTitle>
          <StyledSpace size={20}>
            <StyledTag color="default" $isDark={isDark}>
              Start: {formatDateTime(traceData.startTime)}
            </StyledTag>
            <StyledTag color="success" $isDark={isDark}>
              Duration: {formatDuration(traceData.duration)}
            </StyledTag>
            <StyledTag color="processing" $isDark={isDark}>
              Services: {serviceCount}
            </StyledTag>
            <StyledTag color="warning" $isDark={isDark}>
              Depth: 1
            </StyledTag>
            <StyledTag color="error" $isDark={isDark}>
              Total Spans: {spanCount}
            </StyledTag>
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
