import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button, Space, Tooltip } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { systemColors, MINIMAP_HEIGHT } from './traceConstants';
import { formatDuration, getServiceColor, hasError } from './traceUtils';

const TraceTimelineMinimap = ({ traceData, processes, onSelectionChange }) => {
  const [hoveredPosition, setHoveredPosition] = useState(null);
  const [hoveredSpan, setHoveredSpan] = useState(null);
  const [selection, setSelection] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [viewMode, setViewMode] = useState('depth-lanes');
  const containerRef = useRef(null);

  const { duration, spans } = traceData;

  const getSpanDepth = () => {
    const depthMap = new Map();
    const spanById = new Map(spans.map(span => [span.spanID, span]));

    const calculateDepth = (span, depth = 0) => {
      if (depthMap.has(span.spanID)) return depthMap.get(span.spanID);
      depthMap.set(span.spanID, depth);

      const children = spans.filter(s =>
        s.references?.some(
          ref => ref.refType === 'CHILD_OF' && ref.spanID === span.spanID
        )
      );

      children.forEach(child => calculateDepth(child, depth + 1));
      return depth;
    };

    const rootSpans = spans.filter(
      span =>
        !span.references?.some(
          ref => ref.refType === 'CHILD_OF' && spanById.has(ref.spanID)
        )
    );

    rootSpans.forEach(span => calculateDepth(span, 0));
    return depthMap;
  };

  const depthMap = getSpanDepth();
  const maxDepth = Math.max(...Array.from(depthMap.values()), 0) + 1;

  const spansByService = spans.reduce((acc, span) => {
    const process = processes[span.processID];
    const serviceName = process?.serviceName || 'unknown';
    if (!acc[serviceName]) acc[serviceName] = [];
    acc[serviceName].push(span);
    return acc;
  }, {});

  const serviceNames = Object.keys(spansByService);

  const timeMarkers = [];
  for (let i = 0; i <= 5; i++) {
    const time = (duration * i) / 5;
    timeMarkers.push({
      position: (i / 5) * 100,
      label: formatDuration(time),
    });
  }

  const handleMouseMove = e => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    let percentage = (x / rect.width) * 100;

    if (percentage < 0.3) percentage = 0;
    if (percentage > 99.7) percentage = 100;

    percentage = Math.max(0, Math.min(100, percentage));

    setHoveredPosition(percentage);

    const hoveredTime = (percentage / 100) * duration;
    const foundSpan = spans.find(span => {
      const spanStart = span.relativeStartTime;
      const spanEnd = span.relativeStartTime + span.duration;
      return hoveredTime >= spanStart && hoveredTime <= spanEnd;
    });

    if (foundSpan) {
      const process = processes[foundSpan.processID];
      setHoveredSpan({
        ...foundSpan,
        serviceName: process?.serviceName || 'unknown',
      });
    } else {
      setHoveredSpan(null);
    }

    if (isDragging && dragStart !== null) {
      const start = Math.min(dragStart, percentage);
      const end = Math.max(dragStart, percentage);
      setSelection({ start, end });
    }
  };

  const handleMouseDown = e => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    let percentage = (x / rect.width) * 100;

    if (percentage < 0.3) percentage = 0;
    if (percentage > 99.7) percentage = 100;

    percentage = Math.max(0, Math.min(100, percentage));

    setIsDragging(true);
    setDragStart(percentage);
    setSelection({ start: percentage, end: percentage });
  };

  const handleMouseUp = () => {
    setIsDragging(false);

    if (selection && onSelectionChange) {
      const startTime = (selection.start / 100) * duration;
      const endTime = (selection.end / 100) * duration;

      if (Math.abs(selection.end - selection.start) > 0.5) {
        onSelectionChange({ startTime, endTime });
      } else {
        setSelection(null);
        onSelectionChange(null);
      }
    }
  };

  const handleMouseLeave = () => {
    setHoveredPosition(null);
    setHoveredSpan(null);
    if (isDragging) {
      setIsDragging(false);
      if (selection && onSelectionChange) {
        const startTime = (selection.start / 100) * duration;
        const endTime = (selection.end / 100) * duration;
        if (Math.abs(selection.end - selection.start) > 0.5) {
          onSelectionChange({ startTime, endTime });
        } else {
          setSelection(null);
          onSelectionChange(null);
        }
      }
    }
  };

  const clearSelection = () => {
    setSelection(null);
    if (onSelectionChange) {
      onSelectionChange(null);
    }
  };

  const renderServiceLanesView = () => {
    const laneHeight = MINIMAP_HEIGHT / serviceNames.length;
    const barHeight = Math.max(Math.min(laneHeight * 0.75, 14), 6);

    return serviceNames.map((serviceName, serviceIndex) => {
      const serviceSpans = spansByService[serviceName];
      const color = getServiceColor(serviceName);

      return (
        <div
          key={serviceName}
          style={{
            position: 'absolute',
            top: `${serviceIndex * laneHeight}px`,
            height: `${laneHeight}px`,
            width: '100%',
            borderBottom:
              serviceIndex < serviceNames.length - 1
                ? `1px solid ${systemColors.borderLight}`
                : 'none',
          }}>
          {laneHeight > 15 && (
            <div
              style={{
                position: 'absolute',
                left: '4px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '9px',
                fontWeight: '600',
                color: systemColors.textSecondary,
                pointerEvents: 'none',
                zIndex: 5,
                textShadow: '0 0 3px white, 0 0 3px white',
              }}>
              {serviceName}
            </div>
          )}
          {serviceSpans.map(span => {
            const relativeStart = (span.relativeStartTime / duration) * 100;
            const width = Math.max((span.duration / duration) * 100, 0.15);
            const isError = hasError(span);

            return (
              <div
                key={span.spanID}
                style={{
                  position: 'absolute',
                  left: `${relativeStart}%`,
                  width: `${width}%`,
                  height: `${barHeight}px`,
                  top: `${(laneHeight - barHeight) / 2}px`,
                  backgroundColor: isError ? '#e74c3c' : color,
                  opacity: 0.8,
                  borderRadius: '2px',
                }}
                title={`${serviceName} - ${span.operationName}${isError ? ' [ERROR]' : ''}`}
              />
            );
          })}
        </div>
      );
    });
  };

  const renderDepthLanesView = () => {
    const laneHeight = MINIMAP_HEIGHT / maxDepth;
    const barHeight = Math.max(Math.min(laneHeight * 0.75, 12), 6);

    return spans.map(span => {
      const process = processes[span.processID];
      const serviceName = process?.serviceName || 'unknown';
      const color = getServiceColor(serviceName);
      const depth = depthMap.get(span.spanID) || 0;
      const isError = hasError(span);

      const relativeStart = (span.relativeStartTime / duration) * 100;
      const width = Math.max((span.duration / duration) * 100, 0.15);

      return (
        <div
          key={span.spanID}
          style={{
            position: 'absolute',
            left: `${relativeStart}%`,
            width: `${width}%`,
            top: `${depth * laneHeight + (laneHeight - barHeight) / 2}px`,
            height: `${barHeight}px`,
            backgroundColor: isError ? '#e74c3c' : color,
            opacity: 0.8,
            borderRadius: '2px',
          }}
          title={`${serviceName} - ${span.operationName} (depth: ${depth})${isError ? ' [ERROR]' : ''}`}
        />
      );
    });
  };

  return (
    <div
      style={{
        backgroundColor: systemColors.background,
        borderBottom: `2px solid ${systemColors.border}`,
        padding: '0',
        position: 'relative',
      }}>
      <div
        style={{
          backgroundColor: systemColors.background,
          padding: '8px 16px',
          borderBottom: `1px solid ${systemColors.borderLight}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <div
          style={{
            fontSize: '13px',
            fontWeight: '600',
            color: systemColors.text,
          }}>
          Timeline Overview
        </div>
        <Space size="small">
          <Tooltip title="Service Lanes">
            <Button
              size="small"
              type={viewMode === 'service-lanes' ? 'primary' : 'default'}
              onClick={() => setViewMode('service-lanes')}>
              Services
            </Button>
          </Tooltip>
          <Tooltip title="Depth Lanes">
            <Button
              size="small"
              type={viewMode === 'depth-lanes' ? 'primary' : 'default'}
              onClick={() => setViewMode('depth-lanes')}>
              Depth
            </Button>
          </Tooltip>
        </Space>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '6px 16px',
          fontSize: '11px',
          color: '#4a4a4a',
          fontWeight: '600',
          backgroundColor: systemColors.background,
        }}>
        {timeMarkers.map(marker => (
          <div key={marker.label}>{marker.label}</div>
        ))}
      </div>

      <div
        style={{
          padding: '0 16px 12px 16px',
          backgroundColor: systemColors.background,
        }}>
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          role="button"
          tabIndex={0}
          aria-label="Timeline minimap - drag to select time range"
          onKeyDown={e => {
            if (e.key === 'Escape' && selection) {
              clearSelection();
            }
          }}
          style={{
            position: 'relative',
            height: `${MINIMAP_HEIGHT}px`,
            backgroundColor: systemColors.minimapBg,
            cursor: 'crosshair',
            border: `1px solid ${systemColors.border}`,
            overflow: 'visible',
          }}>
          {viewMode === 'service-lanes' && renderServiceLanesView()}
          {viewMode === 'depth-lanes' && renderDepthLanesView()}

          {selection && (
            <div
              style={{
                position: 'absolute',
                left: `${selection.start}%`,
                width: `${selection.end - selection.start}%`,
                height: '100%',
                backgroundColor: 'rgba(48, 127, 230, 0.25)',
                border: `2px solid ${systemColors.blue}`,
                pointerEvents: 'none',
                zIndex: 10,
                boxSizing: 'border-box',
              }}
            />
          )}

          {hoveredPosition !== null && !isDragging && (
            <>
              <div
                style={{
                  position: 'absolute',
                  left: `${hoveredPosition}%`,
                  height: '100%',
                  width: '2px',
                  backgroundColor: systemColors.blue,
                  pointerEvents: 'none',
                  zIndex: 11,
                }}
              />
              {hoveredSpan && (
                <div
                  style={{
                    position: 'absolute',
                    left: `${Math.min(hoveredPosition, 85)}%`,
                    top: '-45px',
                    transform:
                      hoveredPosition > 85
                        ? 'translateX(-100%)'
                        : 'translateX(-50%)',
                    backgroundColor: '#e8f4fd',
                    color: systemColors.text,
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    zIndex: 100,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                    border: `1px solid ${systemColors.blue}`,
                  }}>
                  <div
                    style={{
                      fontWeight: '600',
                      marginBottom: '2px',
                      color: systemColors.blue,
                    }}>
                    {hoveredSpan.serviceName}
                  </div>
                  <div style={{ marginBottom: '1px', fontSize: '10px' }}>
                    {hoveredSpan.operationName}
                  </div>
                  <div
                    style={{
                      fontSize: '10px',
                      color: systemColors.textSecondary,
                    }}>
                    {formatDuration(hoveredSpan.duration)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {selection && (
        <div
          style={{
            padding: '8px 16px',
            fontSize: '12px',
            color: systemColors.text,
            backgroundColor: '#fff3cd',
            borderTop: `1px solid #ffeaa7`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <span>
            <strong>Selected:</strong>{' '}
            {formatDuration((selection.start / 100) * duration)} →{' '}
            {formatDuration((selection.end / 100) * duration)}{' '}
            <span style={{ color: systemColors.textSecondary }}>
              (
              {formatDuration(
                ((selection.end - selection.start) / 100) * duration
              )}{' '}
              duration)
            </span>{' '}
            <span
              style={{
                marginLeft: '12px',
                padding: '2px 8px',
                backgroundColor: systemColors.blue,
                color: 'white',
                borderRadius: '3px',
                fontSize: '11px',
                fontWeight: '600',
              }}>
              Filtering timeline view
            </span>
          </span>
          <Button
            size="small"
            danger
            icon={<ReloadOutlined />}
            onClick={clearSelection}
            style={{ marginLeft: '12px' }}>
            Clear Filter
          </Button>
        </div>
      )}
    </div>
  );
};
TraceTimelineMinimap.propTypes = {
  traceData: PropTypes.shape({
    duration: PropTypes.number.isRequired,
    spans: PropTypes.array.isRequired,
  }).isRequired,
  processes: PropTypes.object.isRequired,
  onSelectionChange: PropTypes.func.isRequired,
};

export default TraceTimelineMinimap;
