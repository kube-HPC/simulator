import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Space, Tooltip, Checkbox } from 'antd';
import {
  CaretDownOutlined,
  CaretRightOutlined,
  ZoomInOutlined,
} from '@ant-design/icons';
import { ReactComponent as IconKibana } from 'images/kibana.svg';
import { formatDuration, formatTime } from '../traceUtils';
import {
  RowContainer,
  RowContent,
  ZoomCell,
  RootCheckboxCell,
  SpanNameWrapper,
  SpanNameContent,
  ExpandButton,
  Spacer,
  SpanInfo,
  ServiceTag,
  OperationText,
  SpanBarContainer,
  SpanBarTrack,
  SpanBar,
  DurationLabel,
  HoverTooltip,
  TooltipServiceName,
  TooltipDivider,
  TooltipOperation,
  SpanTiming,
  StyledIcon,
  TimingText,
  DurationText,
  LogsActions,
  ActionIcon,
  LogsIcon,
  KibanaIconWrap,
  RowResizeHandle,
} from './styles';

const SpanRowMainRow = ({
  span,
  rowRef,
  isDark,
  rowHeight,
  depth,
  hasChildren,
  isChildrenVisible,
  onToggle,
  onToggleChildren,
  serviceName,
  color,
  relativeStart,
  width,
  traceStartTime,
  startRowResize,
  isRootSelected,
  onRootSelectionChange,
  onZoom = () => {},
  enableZoom = true,
  showZoomColumn = true,
  canOpenLogs,
  canOpenKibana,
  shouldShowDisabledIcons,
  taskId,
  podName,
  nodeKind,
  onOpenLogs,
  onOpenKibana,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isTimelineHovered, setIsTimelineHovered] = useState(false);

  return (
    <RowContainer
      ref={rowRef}
      $isHovered={isHovered}
      $isDark={isDark}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <RowContent>
        {showZoomColumn && (
          <ZoomCell $isDark={isDark}>
            {enableZoom && depth === 0 && (
              <Tooltip title="Open subtree in fullscreen">
                <ActionIcon
                  role="button"
                  tabIndex={0}
                  $isDark={isDark}
                  onClick={event => {
                    event.stopPropagation();
                    onZoom(span.spanID);
                  }}
                  onKeyDown={event => {
                    if (event.key !== 'Enter' && event.key !== ' ') {
                      return;
                    }
                    event.preventDefault();
                    event.stopPropagation();
                    onZoom(span.spanID);
                  }}>
                  <ZoomInOutlined />
                </ActionIcon>
              </Tooltip>
            )}
          </ZoomCell>
        )}

        <RootCheckboxCell $isDark={isDark}>
          {depth === 0 && (
            <Checkbox
              checked={isRootSelected}
              onClick={event => event.stopPropagation()}
              onChange={event => {
                event.stopPropagation();
                onRootSelectionChange(span.spanID, event.target.checked);
              }}
            />
          )}
        </RootCheckboxCell>

        <SpanNameWrapper
          $isHovered={isHovered}
          $depth={depth}
          $rowHeight={rowHeight}
          $isDark={isDark}>
          <SpanNameContent
            onClick={() => onToggle(span.spanID)}
            onKeyDown={event => {
              if (event.key === 'Enter' || event.key === ' ') {
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
                onClick={event => {
                  event.stopPropagation();
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
          $rowHeight={rowHeight}
          $isDark={isDark}>
          <SpanBarTrack $isDark={isDark} $rowHeight={rowHeight}>
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

        <LogsActions $isDark={isDark}>
          {depth === 0 && (canOpenLogs || shouldShowDisabledIcons) && (
            <Tooltip
              title={
                canOpenLogs
                  ? `Open logs (${taskId})`
                  : 'TaskId or podName is missing for this step'
              }>
              <ActionIcon
                role="button"
                tabIndex={canOpenLogs ? 0 : -1}
                aria-disabled={!canOpenLogs}
                $isDark={isDark}
                $disabled={!canOpenLogs}
                onClick={event => {
                  event.stopPropagation();
                  if (!canOpenLogs) {
                    return;
                  }
                  onOpenLogs({
                    taskId,
                    podName,
                    nodeKind,
                    spanId: span.spanID,
                  });
                }}
                onKeyDown={event => {
                  if (event.key !== 'Enter' && event.key !== ' ') {
                    return;
                  }
                  event.preventDefault();
                  event.stopPropagation();
                  if (!canOpenLogs) {
                    return;
                  }
                  onOpenLogs({
                    taskId,
                    podName,
                    nodeKind,
                    spanId: span.spanID,
                  });
                }}>
                <LogsIcon />
              </ActionIcon>
            </Tooltip>
          )}

          {depth === 0 && (canOpenKibana || shouldShowDisabledIcons) && (
            <Tooltip
              title={
                canOpenKibana
                  ? 'Open in Kibana'
                  : 'Kibana URL or taskId is missing'
              }>
              <ActionIcon
                role="button"
                tabIndex={canOpenKibana ? 0 : -1}
                aria-disabled={!canOpenKibana}
                $isDark={isDark}
                $disabled={!canOpenKibana}
                onClick={event => {
                  event.stopPropagation();
                  if (!canOpenKibana) {
                    return;
                  }
                  onOpenKibana({
                    taskId,
                    startTime: span.startTime,
                  });
                }}
                onKeyDown={event => {
                  if (event.key !== 'Enter' && event.key !== ' ') {
                    return;
                  }
                  event.preventDefault();
                  event.stopPropagation();
                  if (!canOpenKibana) {
                    return;
                  }
                  onOpenKibana({
                    taskId,
                    startTime: span.startTime,
                  });
                }}>
                <KibanaIconWrap>
                  <IconKibana />
                </KibanaIconWrap>
              </ActionIcon>
            </Tooltip>
          )}
        </LogsActions>
      </RowContent>
      <RowResizeHandle
        role="separator"
        aria-label="Resize trace rows"
        aria-orientation="horizontal"
        onMouseDown={startRowResize}
      />
    </RowContainer>
  );
};

SpanRowMainRow.propTypes = {
  span: PropTypes.shape({
    spanID: PropTypes.string.isRequired,
    operationName: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    startTime: PropTypes.number.isRequired,
  }).isRequired,
  rowRef: PropTypes.func,
  isDark: PropTypes.bool.isRequired,
  rowHeight: PropTypes.number.isRequired,
  depth: PropTypes.number.isRequired,
  hasChildren: PropTypes.bool.isRequired,
  isChildrenVisible: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  onToggleChildren: PropTypes.func.isRequired,
  serviceName: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  relativeStart: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  traceStartTime: PropTypes.number.isRequired,
  startRowResize: PropTypes.func.isRequired,
  isRootSelected: PropTypes.bool.isRequired,
  onRootSelectionChange: PropTypes.func.isRequired,
  onZoom: PropTypes.func,
  enableZoom: PropTypes.bool,
  showZoomColumn: PropTypes.bool,
  canOpenLogs: PropTypes.bool.isRequired,
  canOpenKibana: PropTypes.bool.isRequired,
  shouldShowDisabledIcons: PropTypes.bool.isRequired,
  taskId: PropTypes.string,
  podName: PropTypes.string,
  nodeKind: PropTypes.string.isRequired,
  onOpenLogs: PropTypes.func.isRequired,
  onOpenKibana: PropTypes.func.isRequired,
};

SpanRowMainRow.defaultProps = {
  rowRef: null,
  showZoomColumn: true,
  taskId: '',
  podName: '',
};

export default SpanRowMainRow;
