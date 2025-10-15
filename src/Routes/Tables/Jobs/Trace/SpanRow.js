import React, { useState } from 'react';
import PropTypes from 'prop-types';
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

  const indentStyle = {
    marginLeft: `${depth * 20}px`,
  };

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

  const rowStyle = {
    borderBottom: `1px solid ${systemColors.borderLight}`,
    transition: 'all 0.2s ease',
    backgroundColor: isHovered ? systemColors.hover : systemColors.background,
    cursor: 'pointer',
  };

  const spanNameWrapperStyle = {
    background: isHovered ? systemColors.hover : systemColors.cardBackground,
    padding: '8px 12px',
    display: 'flex',
    alignItems: 'center',
    minHeight: '36px',
    fontSize: '14px',
    borderRight: `1px solid ${systemColors.borderLight}`,
  };

  const spanBarContainerStyle = {
    flex: '1',
    margin: '0 12px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    background: systemColors.background,
    overflow: 'visible',
  };

  const spanBarTrackStyle = {
    width: '100%',
    height: '24px',
    background: systemColors.lightGrey,
    position: 'relative',
    border: `1px solid ${systemColors.border}`,
    borderRadius: '2px',
  };

  const spanBarStyle = {
    height: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '6px',
    fontSize: '12px',
    color: 'white',
    fontWeight: '500',
    overflow: 'hidden',
    borderRadius: '2px',
    left: `${relativeStart}%`,
    width: `${width}%`,
    backgroundColor: color,
  };

  const spanTimingStyle = {
    background: systemColors.cardBackground,
    color: systemColors.text,
    padding: '8px 12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: '140px',
    fontFamily: 'monospace',
    fontSize: '12px',
    borderLeft: `1px solid ${systemColors.border}`,
  };

  return (
    <>
      <div
        style={rowStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
        <div style={{ display: 'flex', alignItems: 'stretch' }}>
          <div
            style={{
              ...spanNameWrapperStyle,
              ...indentStyle,
              flex: '0 0 250px',
            }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                cursor: 'pointer',
              }}
              onClick={() => onToggle(span.spanID)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onToggle(span.spanID);
                }
              }}
              role="button"
              tabIndex={0}>
              {hasChildren && (
                <Button
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
                  style={{
                    marginRight: '8px',
                    minWidth: '22px',
                    height: '22px',
                    padding: 0,
                    color: systemColors.blue,
                  }}
                />
              )}
              {!hasChildren && (
                <span style={{ width: '22px', display: 'inline-block' }} />
              )}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flex: 1,
                }}>
                <Tag
                  style={{
                    margin: 0,
                    fontWeight: '600',
                    backgroundColor: color,
                    color: 'white',
                    border: 'none',
                  }}>
                  {serviceName}
                </Tag>
                <Text
                  type="secondary"
                  style={{
                    fontSize: '13px',
                    color: systemColors.textSecondary,
                  }}>
                  {span.operationName}
                </Text>
              </div>
            </div>
          </div>

          <div
            style={spanBarContainerStyle}
            onMouseEnter={() => setIsTimelineHovered(true)}
            onMouseLeave={() => setIsTimelineHovered(false)}>
            <div style={spanBarTrackStyle}>
              <div style={spanBarStyle} />
              <span
                style={{
                  position: 'absolute',
                  ...(width >= 95
                    ? {
                        left: `calc(${relativeStart}% + 6px)`,
                        color: 'white',
                        textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                      }
                    : relativeStart + width > 85
                      ? {
                          right: `calc(${100 - (relativeStart + width)}% + 6px)`,
                          color: systemColors.text,
                        }
                      : {
                          left: `calc(${relativeStart + width}% + 6px)`,
                          color: systemColors.text,
                        }),
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '12px',
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  zIndex: 10,
                }}>
                {formatDuration(span.duration)}
              </span>

              {isTimelineHovered && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    ...(width >= 95
                      ? {
                          left: `calc(${relativeStart}% + 40px)`,
                        }
                      : relativeStart + width > 85
                        ? {
                            right: `calc(${100 - (relativeStart + width)}% + 40px)`,
                          }
                        : {
                            left: `calc(${relativeStart + width}% + 40px)`,
                          }),
                    fontSize: '11px',
                    whiteSpace: 'nowrap',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    border: `1px solid ${systemColors.borderLight}`,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                  }}>
                  <span
                    style={{
                      fontWeight: '600',
                      color: systemColors.text,
                    }}>
                    {serviceName}
                  </span>
                  <span
                    style={{
                      color: systemColors.textSecondary,
                      fontSize: '10px',
                    }}>
                    •
                  </span>
                  <span style={{ color: systemColors.textSecondary }}>
                    {span.operationName}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div style={spanTimingStyle}>
            <Space size={8}>
              <ClockCircleOutlined style={{ color: systemColors.blue }} />
              <Text code style={{ color: systemColors.text, fontSize: '13px' }}>
                {formatTime(span.startTime, traceStartTime)}
              </Text>
            </Space>
            <Text
              strong
              style={{ color: systemColors.greenDark, fontSize: '13px' }}>
              {formatDuration(span.duration)}
            </Text>
          </div>
        </div>
      </div>

      {isExpanded && (
        <Card
          size="small"
          style={{
            margin: '0 24px 12px 24px',
            backgroundColor: systemColors.cardBackground,
            borderLeft: `4px solid ${color}`,
            border: `1px solid ${systemColors.border}`,
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
          }}
          bodyStyle={{ padding: '16px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
              paddingBottom: '12px',
              borderBottom: `1px solid ${systemColors.borderLight}`,
            }}>
            <Title
              level={5}
              style={{
                margin: 0,
                color: systemColors.primary,
                fontSize: '17px',
              }}>
              {span.operationName}
            </Title>
            <div
              style={{
                display: 'flex',
                gap: '20px',
                fontSize: '14px',
                color: systemColors.textSecondary,
              }}>
              <span>
                <strong style={{ color: systemColors.text }}>Service:</strong>{' '}
                <Tag color="blue" style={{ fontSize: '12px' }}>
                  {serviceName}
                </Tag>
              </span>
              <span>
                <strong style={{ color: systemColors.text }}>Duration:</strong>{' '}
                <Tag color="orange" style={{ fontSize: '12px' }}>
                  {formatDuration(span.duration)}
                </Tag>
              </span>
              <span>
                <strong style={{ color: systemColors.text }}>Start:</strong>{' '}
                <Tag color="cyan" style={{ fontSize: '12px' }}>
                  {formatTime(span.startTime, traceStartTime)}
                </Tag>
              </span>
            </div>
          </div>

          <div
            style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
            {span.tags && span.tags.length > 0 && (
              <div style={{ flex: '1' }}>
                <div
                  style={{
                    fontSize: '15px',
                    fontWeight: '600',
                    marginBottom: '10px',
                    color: systemColors.primary,
                    borderBottom: `2px solid ${systemColors.blueLight}`,
                    paddingBottom: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                  <ApiOutlined />
                  Tags
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr',
                    gap: '10px 16px',
                    fontSize: '13px',
                    alignItems: 'baseline',
                  }}>
                  {span.tags.map(tag => (
                    <React.Fragment key={tag.key}>
                      <div
                        style={{
                          fontWeight: '500',
                          color: systemColors.primary,
                          textAlign: 'right',
                        }}>
                        {tag.key}:
                      </div>
                      <Tag
                        color="geekblue"
                        style={{
                          margin: 0,
                          fontSize: '12px',
                          fontFamily: 'monospace',
                        }}>
                        {String(tag.value)}
                      </Tag>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            {process && (
              <div style={{ flex: '1' }}>
                <div
                  style={{
                    fontSize: '15px',
                    fontWeight: '600',
                    marginBottom: '10px',
                    color: systemColors.primary,
                    borderBottom: `2px solid ${systemColors.blueLight}`,
                    paddingBottom: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                  <ApiOutlined />
                  Process
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr',
                    gap: '10px 16px',
                    fontSize: '13px',
                    alignItems: 'baseline',
                  }}>
                  {process.tags?.map(tag => (
                    <React.Fragment key={tag.key}>
                      <div
                        style={{
                          fontWeight: '500',
                          color: systemColors.primary,
                          textAlign: 'right',
                        }}>
                        {tag.key}:
                      </div>
                      <Tag
                        color="geekblue"
                        style={{
                          margin: 0,
                          fontSize: '12px',
                          fontFamily: 'monospace',
                        }}>
                        {String(tag.value)}
                      </Tag>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div
            style={{
              textAlign: 'right',
              marginTop: '16px',
              paddingTop: '12px',
              borderTop: `1px solid ${systemColors.borderLight}`,
            }}>
            <span
              style={{
                fontSize: '13px',
                color: systemColors.primary,
                fontWeight: '600',
                marginRight: '8px',
              }}>
              Span ID:
            </span>
            <Text
              style={{
                fontSize: '10px',
                fontFamily: 'monospace',
                color: systemColors.textSecondary,
                backgroundColor: systemColors.lightGrey,
                padding: '2px 6px',
                borderRadius: '3px',
              }}>
              {span.spanID}
            </Text>
          </div>
        </Card>
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
