import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Card, Tag, Space, Typography } from 'antd';
import { formatDuration, formatDateTime } from './traceUtils';
import { getCurrentTheme } from './traceConstants';
import SearchBox from './SearchBox';

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
    padding: 16px;
    background: transparent;
  }
`;

/*
 * HeaderContainer is a flex row that holds the metadata on the left and
 * the search box on the right. flex-wrap lets them stack on narrow screens
 * instead of overlapping.
 */
const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  flex-wrap: wrap;
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 0;
`;

const StyledTitle = styled(Title)`
  &.ant-typography {
    margin: 0;
    color: ${props => (props.$isDark ? '#69c0ff' : '#1d76db')};
    font-weight: 600;
    text-shadow: ${props =>
      props.$isDark ? '0 1px 2px rgba(0, 0, 0, 0.3)' : 'none'};
  }
`;

/*
 * Tags row: Ant Design Space with wrap={true} so the tags reflow to a second
 * line on narrow screens instead of overflowing the card.
 */
const TagsRow = styled(Space)`
  flex-wrap: wrap;
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
  }} !important;

  color: ${props => {
    if (!props.$isDark) return 'auto';
    return '#ffffff';
  }} !important;

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
  }} !important;

  font-weight: 500;
  box-shadow: ${props =>
    props.$isDark ? '0 1px 3px rgba(0, 0, 0, 0.2)' : 'none'};
`;

/*
 * SearchWrapper sits on the right of HeaderContainer. On narrow screens
 * (≤ 550px) it spans the full width so the input isn't tiny.
 */
const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  align-self: center;

  @media (max-width: 550px) {
    width: 100%;

    /* Let SearchBox's input stretch to fill */
    & > div {
      width: 100%;
    }
    & input,
    & .ant-input-affix-wrapper {
      width: 100% !important;
    }
  }
`;

const TraceHeader = ({ traceData, searchTerm, onSearchChange }) => {
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

  const serviceCount = Object.keys(traceData.processes).length;
  const spanCount = traceData.spans.length;

  return (
    <StyledCard $isDark={isDark}>
      <HeaderContainer>
        {/* Left: title + metadata tags */}
        <HeaderContent>
          <StyledTitle level={4} $isDark={isDark}>
            Trace Details
          </StyledTitle>
          <TagsRow size={[8, 6]} wrap>
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
          </TagsRow>
        </HeaderContent>

        {/* Right: search box — inline in the layout, never overlapping */}
        <SearchWrapper>
          <SearchBox searchTerm={searchTerm} onSearchChange={onSearchChange} />
        </SearchWrapper>
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
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};

export default React.memo(TraceHeader);
