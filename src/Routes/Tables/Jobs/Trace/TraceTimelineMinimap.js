import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, Space, Tooltip } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import {
  MINIMAP_HEIGHT,
  getCurrentTheme,
  getSystemColors,
} from './traceConstants';
import { formatDuration, getServiceColor, hasError } from './traceUtils';

const MinimapContainer = styled.div`
  background-color: ${props => {
    const colors = getSystemColors(props.$isDark);
    return colors.background;
  }};
  border-bottom: 2px solid
    ${props => {
      const colors = getSystemColors(props.$isDark);
      return colors.border;
    }};
  padding: 0;
  position: relative;
`;

const HeaderSection = styled.div`
  background-color: ${props => {
    const colors = getSystemColors(props.$isDark);
    return props.$isDark ? '#1a2332' : colors.background;
  }};
  padding: 8px 16px;
  border-bottom: 1px solid
    ${props => {
      const colors = getSystemColors(props.$isDark);
      return props.$isDark ? '#304a6d' : colors.borderLight;
    }};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${props => {
    const colors = getSystemColors(props.$isDark);
    return props.$isDark ? '#ffffff' : colors.text;
  }};
`;

const TimeMarkersContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 6px 16px;
  font-size: 11px;
  color: ${props => (props.$isDark ? '#b8bfc7' : '#4a4a4a')};
  font-weight: 600;
  background-color: ${props => {
    const colors = getSystemColors(props.$isDark);
    return props.$isDark ? '#15202e' : colors.background;
  }};
  border-bottom: 1px solid
    ${props => {
      const colors = getSystemColors(props.$isDark);
      return props.$isDark ? '#2d4663' : colors.borderLight;
    }};
`;

const MinimapWrapper = styled.div`
  padding: 12px 16px;
  background-color: ${props => {
    const colors = getSystemColors(props.$isDark);
    return props.$isDark ? '#192737' : colors.background;
  }};
`;

const MinimapCanvas = styled.div`
  position: relative;
  height: ${MINIMAP_HEIGHT}px;
  background-color: ${props => {
    const colors = getSystemColors(props.$isDark);
    return props.$isDark ? '#0f1923' : colors.minimapBg;
  }};
  cursor: crosshair;
  border: ${props => (props.$isDark ? '2px solid #2d4663' : '1px solid')};
  border-color: ${props => {
    const colors = getSystemColors(props.$isDark);
    return props.$isDark ? '#2d4663' : colors.border;
  }};
  border-radius: 4px;
  overflow: visible;
  box-shadow: ${props =>
    props.$isDark ? 'inset 0 2px 6px rgba(0, 0, 0, 0.3)' : 'none'};
`;

const ServiceLane = styled.div`
  position: absolute;
  top: ${props => props.$top}px;
  height: ${props => props.$height}px;
  width: 100%;
  border-bottom: ${props =>
    props.$showBorder
      ? `1px solid ${props.$isDark ? '#2d4663' : props.$borderColor}`
      : 'none'};
`;

const ServiceLabel = styled.div`
  position: absolute;
  left: 4px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 9px;
  font-weight: 500;
  color: ${props => {
    const colors = getSystemColors(props.$isDark);
    return props.$isDark ? '#d7d7d7' : colors.textSecondary;
  }};
  pointer-events: none;
  z-index: 5;
  text-shadow: ${props =>
    props.$isDark
      ? '0 0 3px #182039, 0 0 3px #182039'
      : '0 0 3px white, 0 0 3px white'};
`;

const SpanBar = styled.div`
  position: absolute;
  left: ${props => props.$left}%;
  width: ${props => props.$width}%;
  height: ${props => props.$height}px;
  top: ${props => props.$top}px;
  background-color: ${props => props.$color};
  opacity: 0.8;
  border-radius: 2px;
`;

const SelectionOverlay = styled.div`
  position: absolute;
  left: ${props => props.$left}%;
  width: ${props => props.$width}%;
  height: 100%;
  background-color: ${props =>
    props.$isDark ? 'rgba(64, 169, 255, 0.2)' : 'rgba(48, 127, 230, 0.25)'};
  border: 2px solid
    ${props => {
      const colors = getSystemColors(props.$isDark);
      return colors.blue;
    }};
  pointer-events: none;
  z-index: 10;
  box-sizing: border-box;
`;

const HoverLine = styled.div`
  position: absolute;
  left: ${props => props.$left}%;
  height: 100%;
  width: 2px;
  background-color: ${props => {
    const colors = getSystemColors(props.$isDark);
    return colors.blue;
  }};
  pointer-events: none;
  z-index: 11;
`;

const HoverTooltip = styled.div`
  position: absolute;
  left: ${props => props.$left}%;
  top: -45px;
  transform: ${props =>
    props.$alignRight ? 'translateX(-100%)' : 'translateX(-50%)'};
  background-color: ${props => (props.$isDark ? '#1f2937' : '#e8f4fd')};
  color: ${props => {
    const colors = getSystemColors(props.$isDark);
    return colors.text;
  }};
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 100;
  box-shadow: ${props =>
    props.$isDark
      ? '0 4px 12px rgba(0, 0, 0, 0.4)'
      : '0 2px 6px rgba(0, 0, 0, 0.15)'};
  border: 1px solid
    ${props => {
      const colors = getSystemColors(props.$isDark);
      return colors.blue;
    }};
`;

const TooltipServiceName = styled.div`
  font-weight: 600;
  margin-bottom: 2px;
  color: ${props => {
    const colors = getSystemColors(props.$isDark);
    return props.$isDark ? '#69c0ff' : colors.blue;
  }};
`;

const TooltipOperation = styled.div`
  margin-bottom: 1px;
  font-size: 10px;
`;

const TooltipDuration = styled.div`
  font-size: 10px;
  color: ${props => {
    const colors = getSystemColors(props.$isDark);
    return colors.textSecondary;
  }};
`;

const SelectionBanner = styled.div`
  padding: 8px 16px;
  font-size: 12px;
  color: ${props => {
    const colors = getSystemColors(props.$isDark);
    return colors.text;
  }};
  background-color: ${props => (props.$isDark ? '#373e60' : '#fff3cd')};
  border-top: 1px solid ${props => (props.$isDark ? '#586a93' : '#ffeaa7')};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FilterBadge = styled.span`
  margin-left: 12px;
  padding: 2px 8px;
  background-color: ${props => (props.$isDark ? '#447fa8ff' : '#ffeaa7')};
  color: white;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 600;
`;

const SecondaryText = styled.span`
  color: ${props => {
    const colors = getSystemColors(props.$isDark);
    return colors.textSecondary;
  }};
`;

const StyledButton = styled(Button)`
  margin-left: 12px;
  background-color: ${props => (props.$isDark ? '#ff4d4f' : 'auto')} !important;
  border-color: ${props => (props.$isDark ? '#ff4d4f' : 'auto')} !important;
  color: ${props => (props.$isDark ? '#ffffff' : 'auto')} !important;

  &:hover {
    background-color: ${props =>
      props.$isDark ? '#a83e40ff' : 'auto'} !important;
    border-color: ${props => {
      props.$isDark ? '#e90307ff' : 'auto';
    }} !important;
    color: ${props => (props.$isDark ? '#b8bfc7' : 'auto')} !important;
  }
`;

const MinimapButton = styled(Button)`
  background-color: ${props => (props.$isDark ? '#1e3a52' : 'auto')} !important;
  border-color: ${props => (props.$isDark ? '#3d5a7e' : 'auto')} !important;
  color: ${props => (props.$isDark ? '#b8bfc7' : 'auto')} !important;

  &:hover {
    background-color: ${props =>
      props.$isDark ? '#2d4a6b' : 'auto'} !important;
    border-color: ${props => {
      const colors = getSystemColors(props.$isDark);
      return colors.blue;
    }} !important;
    color: ${props => (props.$isDark ? '#ffffff' : 'auto')} !important;
  }

  &.ant-btn-primary {
    background-color: ${props => {
      const colors = getSystemColors(props.$isDark);
      return colors.blue;
    }} !important;
    border-color: ${props => {
      const colors = getSystemColors(props.$isDark);
      return colors.blue;
    }} !important;
    color: #ffffff !important;
    box-shadow: ${props =>
      props.$isDark ? '0 2px 6px rgba(24, 144, 255, 0.3)' : 'none'};
  }
`;

const TraceTimelineMinimap = ({ traceData, processes, onSelectionChange }) => {
  const [hoveredPosition, setHoveredPosition] = useState(null);
  const [hoveredSpan, setHoveredSpan] = useState(null);
  const [selection, setSelection] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [viewMode, setViewMode] = useState('depth-lanes');
  const [isDark, setIsDark] = useState(getCurrentTheme() === 'DARK');
  const containerRef = useRef(null);

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

  const { duration, spans } = traceData;
  const colors = getSystemColors(isDark);

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
        <ServiceLane
          key={serviceName}
          $top={serviceIndex * laneHeight}
          $height={laneHeight}
          $showBorder={serviceIndex < serviceNames.length - 1}
          $isDark={isDark}
          $borderColor={colors.borderLight}>
          {laneHeight > 15 && (
            <ServiceLabel $isDark={isDark}>{serviceName}</ServiceLabel>
          )}
          {serviceSpans.map(span => {
            const relativeStart = (span.relativeStartTime / duration) * 100;
            const width = Math.max((span.duration / duration) * 100, 0.15);
            const isError = hasError(span);

            return (
              <SpanBar
                key={span.spanID}
                $left={relativeStart}
                $width={width}
                $height={barHeight}
                $top={(laneHeight - barHeight) / 2}
                $color={isError ? (isDark ? '#b31b00' : '#e74c3c') : color}
                title={`${serviceName} - ${span.operationName}${isError ? ' [ERROR]' : ''}`}
              />
            );
          })}
        </ServiceLane>
      );
    });
  };

  const renderDepthLanesView = () => {
    const laneHeight = MINIMAP_HEIGHT / maxDepth;
    const barHeight = Math.max(Math.min(laneHeight * 0.75, 12), 6);

    return spans.map(span => {
      const process = processes[span.processID];
      const serviceName = process?.serviceName || 'unknown';
      const color = getServiceColor(serviceName, isDark);
      const depth = depthMap.get(span.spanID) || 0;
      const isError = hasError(span);

      const relativeStart = (span.relativeStartTime / duration) * 100;
      const width = Math.max((span.duration / duration) * 100, 0.15);

      return (
        <SpanBar
          key={span.spanID}
          $left={relativeStart}
          $width={width}
          $top={depth * laneHeight + (laneHeight - barHeight) / 2}
          $height={barHeight}
          $color={isError ? (isDark ? '#b31b00' : '#e74c3c') : color}
          title={`${serviceName} - ${span.operationName} (depth: ${depth})${isError ? ' [ERROR]' : ''}`}
        />
      );
    });
  };

  return (
    <MinimapContainer $isDark={isDark}>
      <HeaderSection $isDark={isDark}>
        <HeaderTitle $isDark={isDark}>Timeline Overview</HeaderTitle>
        <Space size="small">
          <Tooltip title="Service Lanes">
            <MinimapButton
              size="small"
              type={viewMode === 'service-lanes' ? 'primary' : 'default'}
              onClick={() => setViewMode('service-lanes')}
              $isDark={isDark}>
              Services
            </MinimapButton>
          </Tooltip>
          <Tooltip title="Depth Lanes">
            <MinimapButton
              size="small"
              type={viewMode === 'depth-lanes' ? 'primary' : 'default'}
              onClick={() => setViewMode('depth-lanes')}
              $isDark={isDark}>
              Depth
            </MinimapButton>
          </Tooltip>
        </Space>
      </HeaderSection>

      <TimeMarkersContainer $isDark={isDark}>
        {timeMarkers.map(marker => (
          <div key={marker.label}>{marker.label}</div>
        ))}
      </TimeMarkersContainer>

      <MinimapWrapper $isDark={isDark}>
        <MinimapCanvas
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
          $isDark={isDark}>
          {viewMode === 'service-lanes' && renderServiceLanesView()}
          {viewMode === 'depth-lanes' && renderDepthLanesView()}

          {selection && (
            <SelectionOverlay
              $left={selection.start}
              $width={selection.end - selection.start}
              $isDark={isDark}
            />
          )}

          {hoveredPosition !== null && !isDragging && (
            <>
              <HoverLine $left={hoveredPosition} $isDark={isDark} />
              {hoveredSpan && (
                <HoverTooltip
                  $left={Math.min(hoveredPosition, 85)}
                  $alignRight={hoveredPosition > 85}
                  $isDark={isDark}>
                  <TooltipServiceName $isDark={isDark}>
                    {hoveredSpan.serviceName}
                  </TooltipServiceName>
                  <TooltipOperation>
                    {hoveredSpan.operationName}
                  </TooltipOperation>
                  <TooltipDuration $isDark={isDark}>
                    {formatDuration(hoveredSpan.duration)}
                  </TooltipDuration>
                </HoverTooltip>
              )}
            </>
          )}
        </MinimapCanvas>
      </MinimapWrapper>

      {selection && (
        <SelectionBanner $isDark={isDark}>
          <span>
            <strong>Selected:</strong>{' '}
            {formatDuration((selection.start / 100) * duration)} →{' '}
            {formatDuration((selection.end / 100) * duration)}{' '}
            <SecondaryText $isDark={isDark}>
              (
              {formatDuration(
                ((selection.end - selection.start) / 100) * duration
              )}{' '}
              duration)
            </SecondaryText>{' '}
            <FilterBadge $isDark={isDark}>Filtering timeline view</FilterBadge>
          </span>
          <StyledButton
            size="small"
            danger
            icon={<ReloadOutlined />}
            onClick={clearSelection}
            $isDark={isDark}>
            Clear Filter
          </StyledButton>
        </SelectionBanner>
      )}
    </MinimapContainer>
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
