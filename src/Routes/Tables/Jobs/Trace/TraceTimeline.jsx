import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Space, Checkbox, Button, Tooltip } from 'antd';
import {
  ApiOutlined,
  ClockCircleOutlined,
  ExpandOutlined,
} from '@ant-design/icons';
import TimelineMarkers from './TimelineMarkers';
import {
  getCurrentTheme,
  getSystemColors,
  ZOOM_COL_WIDTH,
  CHECKBOX_COL_WIDTH,
  NAME_COL_WIDTH,
  METRICS_COL_WIDTH,
  LOGS_COL_WIDTH,
} from './traceConstants';

const TimelineHeader = styled.div`
  background: ${props => {
    const colors = getSystemColors(props.$isDark);
    return props.$isDark ? '#1f2937' : colors.border;
  }};
  border-bottom: 1px solid
    ${props => {
      const colors = getSystemColors(props.$isDark);
      return props.$isDark ? '#3d5a7e' : colors.border;
    }};
  padding: 12px 16px;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  color: ${props => {
    const colors = getSystemColors(props.$isDark);
    return colors.text;
  }};
`;

const CheckboxColumn = styled.div`
  flex: 0 0 ${CHECKBOX_COL_WIDTH}px;
  display: flex;
  justify-content: center;
`;

const ZoomColumn = styled.div`
  flex: 0 0 ${ZOOM_COL_WIDTH}px;
  display: flex;
  justify-content: center;
  margin-left: -16px;
`;

const ZoomButton = styled(Button)`
  height: 24px;
  width: 24px;
  padding: 0;
`;

/*
 * Fixed width driven by the shared constant so it always matches SpanRow's
 * name column and TimelineMarkers' left padding.
 */
const ServiceColumn = styled.div`
  flex: 0 0 ${NAME_COL_WIDTH}px;
  min-width: 0; /* allow text to truncate rather than overflow */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const TimelineColumn = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-width: 0;
`;

const BulkToggleButton = styled(Button)`
  height: 24px;
  padding: 0 10px;
  margin-left: 17px;
`;

/*
 * Hide the metrics column on narrow viewports (< 500px) where there is not
 * enough horizontal space to show it alongside the name column and timeline bar.
 * SpanRow's SpanTiming is hidden at the same breakpoint.
 */
const MetricsColumn = styled.div`
  flex: 0 0 ${METRICS_COL_WIDTH}px;
  text-align: center;

  @media (max-width: 500px) {
    display: none;
  }
`;

const LogsColumn = styled.div`
  flex: 0 0 ${LOGS_COL_WIDTH}px;
  text-align: center;
`;

const StyledIcon = styled.span`
  color: ${props => {
    const colors = getSystemColors(props.$isDark);
    return colors.blue;
  }};
`;

const TraceTimeline = ({
  traceData,
  allRootsSelected,
  rootsIndeterminate,
  onToggleSelectAll,
  bulkToggleLabel,
  onBulkToggle,
  isBulkToggleDisabled,
  onZoomAll,
  enableZoom = true,
  showZoomColumn = true,
}) => {
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

  const { duration } = traceData;

  return (
    <>
      <TimelineHeader $isDark={isDark}>
        {showZoomColumn && (
          <ZoomColumn>
            {enableZoom && (
              <Tooltip title="Open full trace in fullscreen">
                <ZoomButton
                  type="text"
                  size="small"
                  icon={<ExpandOutlined />}
                  onClick={onZoomAll}
                />
              </Tooltip>
            )}
          </ZoomColumn>
        )}
        <CheckboxColumn>
          <Checkbox
            checked={allRootsSelected}
            indeterminate={rootsIndeterminate}
            onChange={event => onToggleSelectAll(event.target.checked)}
          />
        </CheckboxColumn>
        <ServiceColumn>
          <Space>
            <StyledIcon as={ApiOutlined} $isDark={isDark} />
            Service & Operation
          </Space>
          <BulkToggleButton
            size="small"
            onClick={onBulkToggle}
            disabled={isBulkToggleDisabled}>
            {bulkToggleLabel}
          </BulkToggleButton>
        </ServiceColumn>
        <TimelineColumn>
          <Space>
            <StyledIcon as={ClockCircleOutlined} $isDark={isDark} />
            Timeline
          </Space>
        </TimelineColumn>
        <MetricsColumn>
          <Space size={12}>
            <span>Start Time</span>
            <span>Duration</span>
          </Space>
        </MetricsColumn>
        <LogsColumn>Logs</LogsColumn>
      </TimelineHeader>
      <TimelineMarkers duration={duration} showZoomColumn={showZoomColumn} />
    </>
  );
};

TraceTimeline.propTypes = {
  traceData: PropTypes.shape({
    duration: PropTypes.number.isRequired,
  }).isRequired,
  allRootsSelected: PropTypes.bool,
  rootsIndeterminate: PropTypes.bool,
  onToggleSelectAll: PropTypes.func,
  bulkToggleLabel: PropTypes.string,
  onBulkToggle: PropTypes.func,
  isBulkToggleDisabled: PropTypes.bool,
  onZoomAll: PropTypes.func,
  enableZoom: PropTypes.bool,
  showZoomColumn: PropTypes.bool,
};

TraceTimeline.defaultProps = {
  allRootsSelected: false,
  rootsIndeterminate: false,
  onToggleSelectAll: () => {},
  bulkToggleLabel: 'Collapse',
  onBulkToggle: () => {},
  isBulkToggleDisabled: true,
  onZoomAll: () => {},
  showZoomColumn: true,
};

export default React.memo(TraceTimeline);
