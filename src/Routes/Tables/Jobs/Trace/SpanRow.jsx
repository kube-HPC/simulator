import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, Tag, Typography, Card, Space } from 'antd';
import {
  CaretDownOutlined,
  CaretRightOutlined,
  ClockCircleOutlined,
  ApiOutlined,
} from '@ant-design/icons';
import {
  formatDuration,
  formatTime,
  getServiceColor,
  getContrastTextColor,
} from './traceUtils';
import { getCurrentTheme, getSystemColors } from './traceConstants';

const { Title, Text } = Typography;

const RowContainer = styled.div`
  border-bottom: 1px solid
    ${props => {
      const colors = getSystemColors(props.$isDark);
      return colors.border;
    }};
  transition: all 0.2s ease;
  background-color: ${props => {
    const colors = getSystemColors(props.$isDark);
    if (props.$isHovered) {
      return props.$isDark ? '#233447' : colors.hover;
    }
    return props.$isDark ? '#1a2332' : colors.background;
  }};
  cursor: pointer;
  ${props =>
    props.$isHovered && props.$isDark
      ? 'box-shadow: 0 2px 8px rgba(255, 0, 0, 0.2);'
      : ''}
`;

const RowContent = styled.div`
  display: flex;
  align-items: stretch;
`;

const SpanNameWrapper = styled.div`
  background: ${props => {
    const colors = getSystemColors(props.$isDark);
    if (props.$isHovered) {
      return props.$isDark ? '#293548' : colors.hover;
    }
    return props.$isDark ? '#1f2937' : colors.cardBackground;
  }};
  padding: 8px 12px;
  display: flex;
  align-items: center;
  min-height: 36px;
  font-size: 14px;
  border-right: 1px solid
    ${props => {
      const colors = getSystemColors(props.$isDark);
      return props.$isDark ? '#3d5a7e' : colors.borderLight;
    }};
  margin-left: ${props => props.$depth * 20}px;
  flex: 0 0 250px;
`;

const SpanNameContent = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  cursor: pointer;
`;

const ExpandButton = styled(Button)`
  margin-right: 8px;
  min-width: 22px;
  height: 22px;
  padding: 0;
  color: ${props => {
    const colors = getSystemColors(props.$isDark);
    return colors.blue;
  }};

  &:hover {
    background-color: ${props =>
      props.$isDark
        ? 'rgba(64, 169, 255, 0.15)'
        : 'rgba(48, 127, 230, 0.1)'} !important;
    color: ${props => {
      const colors = getSystemColors(props.$isDark);
      return colors.blueLight;
    }} !important;
  }
`;

const Spacer = styled.span`
  width: 22px;
  display: inline-block;
`;

const SpanInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
`;

const ServiceTag = styled(Tag)`
  margin: 0;
  font-weight: 600;

  /* Background Color */
  background-color: ${
    props => (props.$isDark ? 'transparent' : props.$color) // Dark: transparent, Light: colored
  };

  color: ${props => {
    if (props.$isDark) {
      return props.$color; // Dark mode: colored text
    }
    // Light mode: calculate contrast color based on background
    return getContrastTextColor(props.$color);
  }};

  /* Border */
  border: ${
    props => (props.$isDark ? `2px solid ${props.$color}` : 'none') // Dark: colored border, Light: no border
  };

  /* Shadow */
  box-shadow: ${props =>
    props.$isDark ? '0 1px 3px rgba(0, 0, 0, 0.3)' : 'none'};
`;

const OperationText = styled(Text)`
  font-size: 13px;
  color: ${props => {
    const colors = getSystemColors(props.$isDark);
    return props.$isDark ? '#d1d5db' : colors.textSecondary;
  }};
`;

const SpanBarContainer = styled.div`
  flex: 1;
  margin: 0 12px;
  height: 36px;
  display: flex;
  align-items: center;
  position: relative;
  background: ${props => {
    const colors = getSystemColors(props.$isDark);
    return props.$isDark ? '#1a2332' : colors.background;
  }};
  overflow: visible;
`;

const SpanBarTrack = styled.div`
  width: 100%;
  height: 24px;
  background: ${props => {
    const colors = getSystemColors(props.$isDark);
    return props.$isDark ? '#1a2332' : colors.lightGrey;
  }};
  position: relative;
  border: 1px solid
    ${props => {
      const colors = getSystemColors(props.$isDark);
      return props.$isDark ? '#3d5a7e' : colors.border;
    }};
  border-radius: 2px;
  box-shadow: ${props =>
    props.$isDark ? 'inset 0 1px 3px rgba(250, 0, 187, 0.2)' : 'none'};
`;

const SpanBar = styled.div`
  height: 100%;
  position: absolute;
  display: flex;
  align-items: center;
  padding-left: 6px;
  font-size: 12px;
  color: white;
  font-weight: 500;
  overflow: hidden;
  border-radius: 2px;
  left: ${props => props.$left}%;
  width: ${props => props.$width}%;
  background-color: ${props => props.$color};
`;

const DurationLabel = styled.span`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  pointer-events: none;
  z-index: 10;
  color: ${props => (props.$isDark ? '#ffffff' : 'inherit')};
  text-shadow: ${props =>
    props.$isDark ? '0 1px 3px rgba(0, 0, 0, 0.8)' : 'none'};
  ${props => {
    const colors = getSystemColors(props.$isDark);
    if (props.$width >= 95) {
      return `
        left: calc(${props.$left}% + 6px);
        color: white;
        text-shadow: 0 1px 2px rgba(0,0,0,0.3);
      `;
    }
    if (props.$left + props.$width > 85) {
      return `
        right: calc(${100 - (props.$left + props.$width)}% + 6px);
        color: ${colors.text};
      `;
    }
    return `
        left: calc(${props.$left + props.$width}% + 6px);
        color: ${colors.text};
      `;
  }}
`;

const HoverTooltip = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 11px;
  whitespace: nowrap;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: ${props =>
    props.$isDark ? 'rgba(31, 41, 55, 0.98)' : 'rgba(255, 255, 255, 0.95)'};
  padding: 4px 10px;
  border-radius: 4px;
  border: 1px solid
    ${props => {
      const colors = getSystemColors(props.$isDark);
      return props.$isDark ? colors.blue : colors.borderLight;
    }};
  box-shadow: ${props =>
    props.$isDark
      ? '0 4px 12px rgba(0, 0, 0, 0.4)'
      : '0 1px 3px rgba(0, 0, 0, 0.08)'};
  ${props => {
    if (props.$width >= 95) {
      return `left: calc(${props.$left}% + 40px);`;
    }
    if (props.$left + props.$width > 85) {
      return `right: calc(${100 - (props.$left + props.$width)}% + 40px);`;
    }
    return `left: calc(${props.$left + props.$width}% + 40px);`;
  }}
`;

const TooltipServiceName = styled.span`
  font-weight: 600;
  color: ${props => {
    const colors = getSystemColors(props.$isDark);
    return colors.text;
  }};
`;

const TooltipDivider = styled.span`
  color: ${props => {
    const colors = getSystemColors(props.$isDark);
    return colors.textSecondary;
  }};
  font-size: 10px;
`;

const TooltipOperation = styled.span`
  color: ${props => {
    const colors = getSystemColors(props.$isDark);
    return colors.textSecondary;
  }};
`;

const SpanTiming = styled.div`
  background: ${props => {
    const colors = getSystemColors(props.$isDark);
    return props.$isDark ? '#1f2937' : colors.cardBackground;
  }};
  color: ${props => {
    const colors = getSystemColors(props.$isDark);
    return colors.text;
  }};
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 140px;
  font-family: monospace;
  font-size: 12px;
  border-left: 1px solid
    ${props => {
      const colors = getSystemColors(props.$isDark);
      return props.$isDark ? '#3d5a7e' : colors.border;
    }};
`;

const StyledIcon = styled(ClockCircleOutlined)`
  color: ${props => {
    const colors = getSystemColors(props.$isDark);
    return colors.blue;
  }};
`;

const TimingText = styled(Text)`
  color: ${props => {
    const colors = getSystemColors(props.$isDark);
    return props.$isDark ? '#9ca3af' : colors.text;
  }};
  font-size: 13px;
`;

const DurationText = styled(Text)`
  color: ${props => {
    const colors = getSystemColors(props.$isDark);
    return colors.green;
  }};
  font-size: 13px;
  font-weight: 700;
`;

const DetailsCard = styled(Card)`
  margin: 8px 24px 12px 24px;
  background: ${props => {
    const colors = getSystemColors(props.$isDark);
    return props.$isDark
      ? 'linear-gradient(135deg, #1f2d3d 0%, #2a3f54 100%)' // Dark: gradient
      : colors.cardBackground; // Light: use system color
  }};
  border-left: 4px solid ${props => props.$color};
  border: ${props => (props.$isDark ? '2px solid #3d5a7e' : '1px solid')};
  border-color: ${props => {
    const colors = getSystemColors(props.$isDark);
    return props.$isDark ? '#3d5a7e' : colors.border;
  }};
  box-shadow: ${props =>
    props.$isDark
      ? '0 4px 12px rgba(0, 0, 0, 0.4)'
      : '0 1px 4px rgba(0, 0, 0, 0.1)'};
  border-radius: 8px;

  .ant-card-body {
    padding: 16px;
    background: transparent;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid
    ${props => {
      const colors = getSystemColors(props.$isDark);
      return props.$isDark ? '#3d5a7e' : colors.borderLight;
    }};
`;

const CardTitle = styled(Title)`
  &.ant-typography {
    margin: 0;
    color: ${props => {
      const colors = getSystemColors(props.$isDark);
      return props.$isDark ? '#69c0ff' : colors.primary;
    }};
    font-size: 17px;
    font-weight: 600;
  }
`;

const CardMetadata = styled.div`
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: ${props => {
    const colors = getSystemColors(props.$isDark);
    return colors.textSecondary;
  }};
`;

const MetadataLabel = styled.strong`
  color: ${props => {
    const colors = getSystemColors(props.$isDark);
    return colors.text;
  }};
`;

const MetadataTag = styled(Tag)`
  background-color: ${props => (props.$isDark ? '#1e3a52' : 'auto')} !important;
  border: ${props => (props.$isDark ? '1px solid #3d5a7e' : 'auto')} !important;
  color: ${props => (props.$isDark ? '#ffffff' : 'auto')} !important;
  font-weight: 500;
`;

const CardContent = styled.div`
  display: flex;
  gap: 40px;
  align-items: flex-start;
`;

const Section = styled.div`
  flex: 1;
`;

const SectionTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 10px;
  color: ${props => {
    const colors = getSystemColors(props.$isDark);
    return props.$isDark ? '#69c0ff' : colors.primary;
  }};
  border-bottom: 2px solid
    ${props => {
      const colors = getSystemColors(props.$isDark);
      return props.$isDark ? '#1890ff' : colors.blueLight;
    }};
  padding-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const TagGrid = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px 16px;
  font-size: 13px;
  align-items: baseline;
`;

const TagKey = styled.div`
  font-weight: 500;
  color: ${props => {
    const colors = getSystemColors(props.$isDark);
    return props.$isDark ? '#91caff' : colors.primary;
  }};
  text-align: right;
`;

const TagValue = styled(Tag)`
  margin: 0;
  font-size: 12px;
  font-family: monospace;
  background-color: ${props => (props.$isDark ? '#1e3a52' : 'auto')} !important;
  border: ${props => (props.$isDark ? '1px solid #3d5a7e' : 'auto')} !important;
  color: ${props => (props.$isDark ? '#b8bfc7' : 'auto')} !important;
`;

const CardFooter = styled.div`
  text-align: right;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid
    ${props => {
      const colors = getSystemColors(props.$isDark);
      return props.$isDark ? '#3d5a7e' : colors.borderLight;
    }};
`;

const SpanIdLabel = styled.span`
  font-size: 13px;
  color: ${props => {
    const colors = getSystemColors(props.$isDark);
    return props.$isDark ? '#69c0ff' : colors.primary;
  }};
  font-weight: 600;
  margin-right: 8px;
`;

const SpanIdValue = styled(Text)`
  font-size: 10px;
  font-family: monospace;
  color: ${props => {
    const colors = getSystemColors(props.$isDark);
    return props.$isDark ? '#8c8c8c' : colors.textSecondary;
  }};
  background-color: ${props => {
    const colors = getSystemColors(props.$isDark);
    return props.$isDark ? '#0f1923' : colors.lightGrey;
  }};
  padding: 3px 8px;
  border-radius: 4px;
  border: ${props => (props.$isDark ? '1px solid #2d4663' : 'none')};
`;

const SpanRow = ({
  span,
  totalDuration,
  traceStartTime,
  isExpanded,
  onToggle,
  hasChildren,
  depth,
  processes,
  searchTerm,
  isChildrenVisible,
  onToggleChildren,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isTimelineHovered, setIsTimelineHovered] = useState(false);
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

  const process = processes[span.processID];
  const serviceName = process?.serviceName || 'unknown';
  const color = getServiceColor(serviceName, isDark);
  const relativeStart = (span.relativeStartTime / totalDuration) * 100;
  const width = Math.max((span.duration / totalDuration) * 100, 0.5);

  const matchesSearch =
    !searchTerm ||
    span.operationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    span.tags?.some(
      tag =>
        tag.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(tag.value).toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (!matchesSearch) return null;

  return (
    <>
      <RowContainer
        $isHovered={isHovered}
        $isDark={isDark}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
        <RowContent>
          <SpanNameWrapper
            $isHovered={isHovered}
            $depth={depth}
            $isDark={isDark}>
            <SpanNameContent
              onClick={() => onToggle(span.spanID)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onToggle(span.spanID);
                }
              }}
              role="button"
              tabIndex={0}>
              {hasChildren && (
                <ExpandButton
                  type="text"
                  size="small"
                  icon={
                    isChildrenVisible ? (
                      <CaretDownOutlined />
                    ) : (
                      <CaretRightOutlined />
                    )
                  }
                  onClick={e => {
                    e.stopPropagation();
                    onToggleChildren(span.spanID);
                  }}
                  $isDark={isDark}
                />
              )}
              {!hasChildren && <Spacer />}

              <SpanInfo>
                <ServiceTag $color={color} $isDark={isDark}>
                  {serviceName}
                </ServiceTag>
                <OperationText type="secondary" $isDark={isDark}>
                  {span.operationName}
                </OperationText>
              </SpanInfo>
            </SpanNameContent>
          </SpanNameWrapper>

          <SpanBarContainer
            onMouseEnter={() => setIsTimelineHovered(true)}
            onMouseLeave={() => setIsTimelineHovered(false)}
            $isDark={isDark}>
            <SpanBarTrack $isDark={isDark}>
              <SpanBar $left={relativeStart} $width={width} $color={color} />
              <DurationLabel
                $left={relativeStart}
                $width={width}
                $isDark={isDark}>
                {formatDuration(span.duration)}
              </DurationLabel>

              {isTimelineHovered && (
                <HoverTooltip
                  $left={relativeStart}
                  $width={width}
                  $isDark={isDark}>
                  <TooltipServiceName $isDark={isDark}>
                    {serviceName}
                  </TooltipServiceName>
                  <TooltipDivider $isDark={isDark}>•</TooltipDivider>
                  <TooltipOperation $isDark={isDark}>
                    {span.operationName}
                  </TooltipOperation>
                </HoverTooltip>
              )}
            </SpanBarTrack>
          </SpanBarContainer>

          <SpanTiming $isDark={isDark}>
            <Space size={8}>
              <StyledIcon $isDark={isDark} />
              <TimingText code $isDark={isDark}>
                {formatTime(span.startTime, traceStartTime)}
              </TimingText>
            </Space>
            <DurationText strong $isDark={isDark}>
              {formatDuration(span.duration)}
            </DurationText>
          </SpanTiming>
        </RowContent>
      </RowContainer>

      {isExpanded && (
        <DetailsCard size="small" $color={color} $isDark={isDark}>
          <CardHeader $isDark={isDark}>
            <CardTitle level={5} $isDark={isDark}>
              {span.operationName}
            </CardTitle>
            <CardMetadata $isDark={isDark}>
              <span>
                <MetadataLabel $isDark={isDark}>Service:</MetadataLabel>{' '}
                <MetadataTag color="blue" $isDark={isDark}>
                  {serviceName}
                </MetadataTag>
              </span>
              <span>
                <MetadataLabel $isDark={isDark}>Duration:</MetadataLabel>{' '}
                <MetadataTag color="orange" $isDark={isDark}>
                  {formatDuration(span.duration)}
                </MetadataTag>
              </span>
              <span>
                <MetadataLabel $isDark={isDark}>Start:</MetadataLabel>{' '}
                <MetadataTag color="cyan" $isDark={isDark}>
                  {formatTime(span.startTime, traceStartTime)}
                </MetadataTag>
              </span>
            </CardMetadata>
          </CardHeader>

          <CardContent>
            {span.tags && span.tags.length > 0 && (
              <Section>
                <SectionTitle $isDark={isDark}>
                  <ApiOutlined />
                  Tags
                </SectionTitle>
                <TagGrid>
                  {span.tags.map(tag => (
                    <React.Fragment key={tag.key}>
                      <TagKey $isDark={isDark}>{tag.key}:</TagKey>
                      <TagValue color="geekblue" $isDark={isDark}>
                        {String(tag.value)}
                      </TagValue>
                    </React.Fragment>
                  ))}
                </TagGrid>
              </Section>
            )}

            {process && (
              <Section>
                <SectionTitle $isDark={isDark}>
                  <ApiOutlined />
                  Process
                </SectionTitle>
                <TagGrid>
                  {process.tags?.map(tag => (
                    <React.Fragment key={tag.key}>
                      <TagKey $isDark={isDark}>{tag.key}:</TagKey>
                      <TagValue color="geekblue" $isDark={isDark}>
                        {String(tag.value)}
                      </TagValue>
                    </React.Fragment>
                  ))}
                </TagGrid>
              </Section>
            )}
          </CardContent>

          <CardFooter $isDark={isDark}>
            <SpanIdLabel $isDark={isDark}>Span ID:</SpanIdLabel>
            <SpanIdValue $isDark={isDark}>{span.spanID}</SpanIdValue>
          </CardFooter>
        </DetailsCard>
      )}
    </>
  );
};

SpanRow.propTypes = {
  span: PropTypes.shape({
    spanID: PropTypes.string.isRequired,
    processID: PropTypes.string.isRequired,
    operationName: PropTypes.string.isRequired,
    relativeStartTime: PropTypes.number.isRequired,
    duration: PropTypes.number.isRequired,
    startTime: PropTypes.number.isRequired,
    tags: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        value: PropTypes.any.isRequired,
      })
    ),
  }).isRequired,
  totalDuration: PropTypes.number.isRequired,
  traceStartTime: PropTypes.number.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  hasChildren: PropTypes.bool.isRequired,
  depth: PropTypes.number.isRequired,
  processes: PropTypes.object.isRequired,
  searchTerm: PropTypes.string.isRequired,
  isChildrenVisible: PropTypes.bool.isRequired,
  onToggleChildren: PropTypes.func.isRequired,
};

export default React.memo(SpanRow);
