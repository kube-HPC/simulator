import styled from 'styled-components';
import { Button, Tag, Typography, Card } from 'antd';
import { ClockCircleOutlined, FileSearchOutlined } from '@ant-design/icons';
import {
  getSystemColors,
  CHECKBOX_COL_WIDTH,
  NAME_COL_WIDTH,
  METRICS_COL_WIDTH,
  LOGS_COL_WIDTH,
  DEPTH_INDENT,
  MAX_DEPTH_INDENT,
} from '../traceConstants';
import { getContrastTextColor } from '../traceUtils';

const { Title, Text } = Typography;

export const RowContainer = styled.div`
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
  position: relative;
  ${props =>
    props.$isHovered && props.$isDark
      ? 'box-shadow: 0 2px 8px rgba(255, 0, 0, 0.2);'
      : ''}
`;

export const RowContent = styled.div`
  display: flex;
  align-items: stretch;
`;

export const RootCheckboxCell = styled.div`
  flex: 0 0 ${CHECKBOX_COL_WIDTH}px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid
    ${props => {
      const colors = getSystemColors(props.$isDark);
      return props.$isDark ? '#3d5a7e' : colors.borderLight;
    }};
`;

/*
 * The name column width is driven by NAME_COL_WIDTH so it always matches the
 * header (TraceTimeline) and the time-marker alignment (TimelineMarkers).
 *
 * Depth indentation is clamped to MAX_DEPTH_INDENT so deeply nested spans
 * can't squeeze the service tag and operation name into an unreadable sliver.
 * The column compensates by shrinking its flex-basis by the actual indent so
 * the total visual width stays constant.
 */
export const SpanNameWrapper = styled.div`
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
  min-height: ${props => props.$rowHeight}px;
  font-size: 14px;
  border-right: 1px solid
    ${props => {
      const colors = getSystemColors(props.$isDark);
      return props.$isDark ? '#3d5a7e' : colors.borderLight;
    }};

  /*
   * Clamp indentation: each depth level adds DEPTH_INDENT px up to the cap.
   * flex-basis shrinks by the same amount so the right edge of this column
   * stays pinned at NAME_COL_WIDTH from the left side of the row, keeping
   * the timeline bar perfectly aligned across all nesting levels.
   */
  ${props => {
    const indent = Math.min(props.$depth * DEPTH_INDENT, MAX_DEPTH_INDENT);
    return `
      margin-left: ${indent}px;
      flex: 0 0 ${NAME_COL_WIDTH - indent}px;
    `;
  }}

  min-width: 0;
  overflow: hidden;
`;

export const SpanNameContent = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  cursor: pointer;
`;

export const ExpandButton = styled(Button)`
  margin-right: 8px;
  min-width: 22px;
  height: 22px;
  padding: 0;
  flex-shrink: 0;
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

export const Spacer = styled.span`
  width: 22px;
  flex-shrink: 0;
  display: inline-block;
`;

export const SpanInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0; /* allow children to truncate */
  overflow: hidden;
`;

export const ServiceTag = styled(Tag)`
  margin: 0;
  font-weight: 600;
  flex-shrink: 0; /* keep the service badge from shrinking */

  background-color: ${props => (props.$isDark ? 'transparent' : props.$color)};

  color: ${props => {
    if (props.$isDark) return props.$color;
    return getContrastTextColor(props.$color);
  }};

  border: ${props => (props.$isDark ? `2px solid ${props.$color}` : 'none')};

  box-shadow: ${props =>
    props.$isDark ? '0 1px 3px rgba(0, 0, 0, 0.3)' : 'none'};
`;

export const OperationText = styled(Text)`
  font-size: 13px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: ${props => {
    const colors = getSystemColors(props.$isDark);
    return props.$isDark ? '#d1d5db' : colors.textSecondary;
  }};
`;

export const SpanBarContainer = styled.div`
  flex: 1;
  margin: 0 12px;
  height: ${props => props.$rowHeight}px;
  display: flex;
  align-items: center;
  position: relative;
  background: ${props => {
    const colors = getSystemColors(props.$isDark);
    return props.$isDark ? '#1a2332' : colors.background;
  }};
  overflow: visible;
  min-width: 0;
`;

export const SpanBarTrack = styled.div`
  width: 100%;
  height: ${props => Math.max(props.$rowHeight - 12, 14)}px;
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

export const SpanBar = styled.div`
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

export const DurationLabel = styled.span`
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

export const HoverTooltip = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 11px;
  white-space: nowrap;
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

export const TooltipServiceName = styled.span`
  font-weight: 600;
  color: ${props => {
    const colors = getSystemColors(props.$isDark);
    return colors.text;
  }};
`;

export const TooltipDivider = styled.span`
  color: ${props => {
    const colors = getSystemColors(props.$isDark);
    return colors.textSecondary;
  }};
  font-size: 10px;
`;

export const TooltipOperation = styled.span`
  color: ${props => {
    const colors = getSystemColors(props.$isDark);
    return colors.textSecondary;
  }};
`;

export const SpanTiming = styled.div`
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
  width: ${METRICS_COL_WIDTH}px;
  flex-shrink: 0;
  font-family: monospace;
  font-size: 12px;
  border-left: 1px solid
    ${props => {
      const colors = getSystemColors(props.$isDark);
      return props.$isDark ? '#3d5a7e' : colors.border;
    }};

  @media (max-width: 500px) {
    display: none;
  }
`;

export const LogsActions = styled.div`
  width: ${LOGS_COL_WIDTH}px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border-left: 1px solid
    ${props => {
      const colors = getSystemColors(props.$isDark);
      return props.$isDark ? '#3d5a7e' : colors.border;
    }};
`;

export const ActionIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  color: ${props => {
    const colors = getSystemColors(props.$isDark);
    return props.$disabled ? colors.textSecondary : colors.blue;
  }};
  opacity: ${props => (props.$disabled ? 0.45 : 1)};
  cursor: ${props => (props.$disabled ? 'not-allowed' : 'pointer')};

  &:hover {
    background-color: ${props =>
      props.$disabled
        ? 'transparent'
        : props.$isDark
          ? 'rgba(64, 169, 255, 0.15)'
          : 'rgba(48, 127, 230, 0.1)'};
  }
`;

export const KibanaIconWrap = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
`;

export const RowResizeHandle = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 6px;
  cursor: row-resize;
  z-index: 5;
`;

export const StyledIcon = styled(ClockCircleOutlined)`
  color: ${props => {
    const colors = getSystemColors(props.$isDark);
    return colors.blue;
  }};
`;

export const LogsIcon = styled(FileSearchOutlined)`
  font-size: 17px;
`;

export const TimingText = styled(Text)`
  color: ${props => {
    const colors = getSystemColors(props.$isDark);
    return props.$isDark ? '#9ca3af' : colors.text;
  }};
  font-size: 13px;
`;

export const DurationText = styled(Text)`
  color: ${props => {
    const colors = getSystemColors(props.$isDark);
    return colors.green;
  }};
  font-size: 13px;
  font-weight: 700;
`;

export const DetailsCard = styled(Card)`
  margin: 8px 24px 12px 24px;
  background: ${props => {
    const colors = getSystemColors(props.$isDark);
    return props.$isDark
      ? 'linear-gradient(135deg, #1f2d3d 0%, #2a3f54 100%)'
      : colors.cardBackground;
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

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid
    ${props => {
      const colors = getSystemColors(props.$isDark);
      return props.$isDark ? '#3d5a7e' : colors.borderLight;
    }};
`;

export const CardTitle = styled(Title)`
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

export const CardMetadata = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px 20px;
  font-size: 14px;
  color: ${props => {
    const colors = getSystemColors(props.$isDark);
    return colors.textSecondary;
  }};
`;

export const MetadataLabel = styled.strong`
  color: ${props => {
    const colors = getSystemColors(props.$isDark);
    return colors.text;
  }};
`;

export const MetadataTag = styled(Tag)`
  background-color: ${props => (props.$isDark ? '#1e3a52' : 'auto')} !important;
  border: ${props => (props.$isDark ? '1px solid #3d5a7e' : 'auto')} !important;
  color: ${props => (props.$isDark ? '#ffffff' : 'auto')} !important;
  font-weight: 500;
`;

export const CardContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: flex-start;
`;

export const Section = styled.div`
  flex: 1;
  min-width: 200px; /* wrap to next line on very narrow cards */
`;

export const SectionTitle = styled.div`
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

export const TagGrid = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px 16px;
  font-size: 13px;
  align-items: baseline;
`;

export const TagKey = styled.div`
  font-weight: 500;
  color: ${props => {
    const colors = getSystemColors(props.$isDark);
    return props.$isDark ? '#91caff' : colors.primary;
  }};
  text-align: right;
`;

export const TagValue = styled(Tag)`
  margin: 0;
  font-size: 12px;
  font-family: monospace;
  word-break: break-all;
  background-color: ${props => (props.$isDark ? '#1e3a52' : 'auto')} !important;
  border: ${props => (props.$isDark ? '1px solid #3d5a7e' : 'auto')} !important;
  color: ${props => (props.$isDark ? '#b8bfc7' : 'auto')} !important;
`;

export const CardFooter = styled.div`
  text-align: right;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid
    ${props => {
      const colors = getSystemColors(props.$isDark);
      return props.$isDark ? '#3d5a7e' : colors.borderLight;
    }};
`;

export const SpanIdLabel = styled.span`
  font-size: 13px;
  color: ${props => {
    const colors = getSystemColors(props.$isDark);
    return props.$isDark ? '#69c0ff' : colors.primary;
  }};
  font-weight: 600;
  margin-right: 8px;
`;

export const SpanIdValue = styled(Text)`
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
