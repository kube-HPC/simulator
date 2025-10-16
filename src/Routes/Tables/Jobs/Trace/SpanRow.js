import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, Tag, Typography, Card, Space } from 'antd';
import {
  CaretDownOutlined,
  CaretRightOutlined,
  ClockCircleOutlined,
  ApiOutlined,
} from '@ant-design/icons';
import { formatDuration, formatTime, getServiceColor } from './traceUtils';
import { systemColors } from './traceConstants';

const { Title, Text } = Typography;

const RowContainer = styled.div`
  border-bottom: 1px solid ${systemColors.borderLight};
  transition: all 0.2s ease;
  background-color: ${props =>
    props.$isHovered ? systemColors.hover : systemColors.background};
  cursor: pointer;
`;

const RowContent = styled.div`
  display: flex;
  align-items: stretch;
`;

const SpanNameWrapper = styled.div`
  background: ${props =>
    props.$isHovered ? systemColors.hover : systemColors.cardBackground};
  padding: 8px 12px;
  display: flex;
  align-items: center;
  min-height: 36px;
  font-size: 14px;
  border-right: 1px solid ${systemColors.borderLight};
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
  color: ${systemColors.blue};
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
  background-color: ${props => props.$color};
  color: white;
  border: none;
`;

const OperationText = styled(Text)`
  font-size: 13px;
  color: ${systemColors.textSecondary};
`;

const SpanBarContainer = styled.div`
  flex: 1;
  margin: 0 12px;
  height: 36px;
  display: flex;
  align-items: center;
  position: relative;
  background: ${systemColors.background};
  overflow: visible;
`;

const SpanBarTrack = styled.div`
  width: 100%;
  height: 24px;
  background: ${systemColors.lightGrey};
  position: relative;
  border: 1px solid ${systemColors.border};
  border-radius: 2px;
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
  ${props => {
    if (props.$width >= 95) {
      return `
        left: calc(${props.$left}% + 6px);
        color: white;
        text-shadow: 0 1px 2px rgba(0,0,0,0.3);
      `;
    } if (props.$left + props.$width > 85) {
      return `
        right: calc(${100 - (props.$left + props.$width)}% + 6px);
        color: ${systemColors.text};
      `;
    } 
      return `
        left: calc(${props.$left + props.$width}% + 6px);
        color: ${systemColors.text};
      `;
    
  }}
`;

const HoverTooltip = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 11px;
  white-space: nowrap;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: rgba(255, 255, 255, 0.95);
  padding: 4px 10px;
  border-radius: 4px;
  border: 1px solid ${systemColors.borderLight};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  ${props => {
    if (props.$width >= 95) {
      return `left: calc(${props.$left}% + 40px);`;
    } if (props.$left + props.$width > 85) {
      return `right: calc(${100 - (props.$left + props.$width)}% + 40px);`;
    } 
      return `left: calc(${props.$left + props.$width}% + 40px);`;
    
  }}
`;

const TooltipServiceName = styled.span`
  font-weight: 600;
  color: ${systemColors.text};
`;

const TooltipDivider = styled.span`
  color: ${systemColors.textSecondary};
  font-size: 10px;
`;

const TooltipOperation = styled.span`
  color: ${systemColors.textSecondary};
`;

const SpanTiming = styled.div`
  background: ${systemColors.cardBackground};
  color: ${systemColors.text};
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 140px;
  font-family: monospace;
  font-size: 12px;
  border-left: 1px solid ${systemColors.border};
`;

const StyledIcon = styled(ClockCircleOutlined)`
  color: ${systemColors.blue};
`;

const TimingText = styled(Text)`
  color: ${systemColors.text};
  font-size: 13px;
`;

const DurationText = styled(Text)`
  color: ${systemColors.greenDark};
  font-size: 13px;
`;

const DetailsCard = styled(Card)`
  margin: 0 24px 12px 24px;
  background-color: ${systemColors.cardBackground};
  border-left: 4px solid ${props => props.$color};
  border: 1px solid ${systemColors.border};
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);

  .ant-card-body {
    padding: 16px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${systemColors.borderLight};
`;

const CardTitle = styled(Title)`
  &.ant-typography {
    margin: 0;
    color: ${systemColors.primary};
    font-size: 17px;
  }
`;

const CardMetadata = styled.div`
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: ${systemColors.textSecondary};
`;

const MetadataLabel = styled.strong`
  color: ${systemColors.text};
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
  color: ${systemColors.primary};
  border-bottom: 2px solid ${systemColors.blueLight};
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
  color: ${systemColors.primary};
  text-align: right;
`;

const TagValue = styled(Tag)`
  margin: 0;
  font-size: 12px;
  font-family: monospace;
`;

const CardFooter = styled.div`
  text-align: right;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid ${systemColors.borderLight};
`;

const SpanIdLabel = styled.span`
  font-size: 13px;
  color: ${systemColors.primary};
  font-weight: 600;
  margin-right: 8px;
`;

const SpanIdValue = styled(Text)`
  font-size: 10px;
  font-family: monospace;
  color: ${systemColors.textSecondary};
  background-color: ${systemColors.lightGrey};
  padding: 2px 6px;
  border-radius: 3px;
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
  const process = processes[span.processID];
  const serviceName = process?.serviceName || 'unknown';
  const color = getServiceColor(serviceName);

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
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
        <RowContent>
          <SpanNameWrapper $isHovered={isHovered} $depth={depth}>
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
                />
              )}
              {!hasChildren && <Spacer />}

              <SpanInfo>
                <ServiceTag $color={color}>{serviceName}</ServiceTag>
                <OperationText type="secondary">
                  {span.operationName}
                </OperationText>
              </SpanInfo>
            </SpanNameContent>
          </SpanNameWrapper>

          <SpanBarContainer
            onMouseEnter={() => setIsTimelineHovered(true)}
            onMouseLeave={() => setIsTimelineHovered(false)}>
            <SpanBarTrack>
              <SpanBar $left={relativeStart} $width={width} $color={color} />
              <DurationLabel $left={relativeStart} $width={width}>
                {formatDuration(span.duration)}
              </DurationLabel>

              {isTimelineHovered && (
                <HoverTooltip $left={relativeStart} $width={width}>
                  <TooltipServiceName>{serviceName}</TooltipServiceName>
                  <TooltipDivider>•</TooltipDivider>
                  <TooltipOperation>{span.operationName}</TooltipOperation>
                </HoverTooltip>
              )}
            </SpanBarTrack>
          </SpanBarContainer>

          <SpanTiming>
            <Space size={8}>
              <StyledIcon />
              <TimingText code>
                {formatTime(span.startTime, traceStartTime)}
              </TimingText>
            </Space>
            <DurationText strong>{formatDuration(span.duration)}</DurationText>
          </SpanTiming>
        </RowContent>
      </RowContainer>

      {isExpanded && (
        <DetailsCard size="small" $color={color}>
          <CardHeader>
            <CardTitle level={5}>{span.operationName}</CardTitle>
            <CardMetadata>
              <span>
                <MetadataLabel>Service:</MetadataLabel>{' '}
                <Tag color="blue" style={{ fontSize: '12px' }}>
                  {serviceName}
                </Tag>
              </span>
              <span>
                <MetadataLabel>Duration:</MetadataLabel>{' '}
                <Tag color="orange" style={{ fontSize: '12px' }}>
                  {formatDuration(span.duration)}
                </Tag>
              </span>
              <span>
                <MetadataLabel>Start:</MetadataLabel>{' '}
                <Tag color="cyan" style={{ fontSize: '12px' }}>
                  {formatTime(span.startTime, traceStartTime)}
                </Tag>
              </span>
            </CardMetadata>
          </CardHeader>

          <CardContent>
            {span.tags && span.tags.length > 0 && (
              <Section>
                <SectionTitle>
                  <ApiOutlined />
                  Tags
                </SectionTitle>
                <TagGrid>
                  {span.tags.map(tag => (
                    <React.Fragment key={tag.key}>
                      <TagKey>{tag.key}:</TagKey>
                      <TagValue color="geekblue">{String(tag.value)}</TagValue>
                    </React.Fragment>
                  ))}
                </TagGrid>
              </Section>
            )}

            {process && (
              <Section>
                <SectionTitle>
                  <ApiOutlined />
                  Process
                </SectionTitle>
                <TagGrid>
                  {process.tags?.map(tag => (
                    <React.Fragment key={tag.key}>
                      <TagKey>{tag.key}:</TagKey>
                      <TagValue color="geekblue">{String(tag.value)}</TagValue>
                    </React.Fragment>
                  ))}
                </TagGrid>
              </Section>
            )}
          </CardContent>

          <CardFooter>
            <SpanIdLabel>Span ID:</SpanIdLabel>
            <SpanIdValue>{span.spanID}</SpanIdValue>
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
