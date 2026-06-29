import React from 'react';
import PropTypes from 'prop-types';
import { getServiceColor } from '../traceUtils';
import { useTraceRowResize } from '../useTraceRowHeight';
import { useSpanRowTheme } from './useSpanRowTheme';
import { matchesSpanSearch, getSpanActionState } from './spanRowUtils';
import SpanRowMainRow from './SpanRowMainRow';
import SpanRowDetailsCard from './SpanRowDetailsCard';

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
  rowRef,
  onOpenLogs,
  onOpenKibana,
  isKibanaConfigured,
  rowHeight,
  onRowHeightChange,
  isRootSelected,
  onRootSelectionChange,
  onZoom,
  enableZoom = true,
  showZoomColumn = true,
}) => {
  const isDark = useSpanRowTheme();

  const process = processes[span.processID];
  const serviceName = process?.serviceName || 'unknown';
  const color = getServiceColor(serviceName, isDark);
  const relativeStart = (span.relativeStartTime / totalDuration) * 100;
  const width = Math.max((span.duration / totalDuration) * 100, 0.5);

  const { startRowResize } = useTraceRowResize({
    rowHeight,
    onRowHeightChange,
  });

  const matchesSearch = matchesSpanSearch({
    searchTerm,
    operationName: span.operationName,
    serviceName,
    tags: span.tags,
  });

  if (!matchesSearch) {
    return null;
  }

  const {
    taskId,
    podName,
    nodeKind,
    canOpenLogs,
    canOpenKibana,
    shouldShowDisabledIcons,
  } = getSpanActionState({
    spanTaskId: span.taskId,
    spanTags: span.tags,
    processTags: process?.tags,
    depth,
    isKibanaConfigured,
  });

  return (
    <>
      <SpanRowMainRow
        span={span}
        rowRef={rowRef}
        isDark={isDark}
        rowHeight={rowHeight}
        depth={depth}
        hasChildren={hasChildren}
        isChildrenVisible={isChildrenVisible}
        onToggle={onToggle}
        onToggleChildren={onToggleChildren}
        serviceName={serviceName}
        color={color}
        relativeStart={relativeStart}
        width={width}
        traceStartTime={traceStartTime}
        startRowResize={startRowResize}
        isRootSelected={isRootSelected}
        onRootSelectionChange={onRootSelectionChange}
        onZoom={onZoom}
        enableZoom={enableZoom}
        showZoomColumn={showZoomColumn}
        canOpenLogs={canOpenLogs}
        canOpenKibana={canOpenKibana}
        shouldShowDisabledIcons={shouldShowDisabledIcons}
        taskId={taskId}
        podName={podName}
        nodeKind={nodeKind}
        onOpenLogs={onOpenLogs}
        onOpenKibana={onOpenKibana}
      />

      <SpanRowDetailsCard
        isExpanded={isExpanded}
        span={span}
        process={process}
        color={color}
        isDark={isDark}
        serviceName={serviceName}
        traceStartTime={traceStartTime}
      />
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
    taskId: PropTypes.string,
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
  rowRef: PropTypes.func,
  onOpenLogs: PropTypes.func,
  onOpenKibana: PropTypes.func,
  isKibanaConfigured: PropTypes.bool,
  rowHeight: PropTypes.number.isRequired,
  onRowHeightChange: PropTypes.func.isRequired,
  isRootSelected: PropTypes.bool,
  onRootSelectionChange: PropTypes.func,
  onZoom: PropTypes.func,
  enableZoom: PropTypes.bool,
  showZoomColumn: PropTypes.bool,
};

SpanRow.defaultProps = {
  rowRef: null,
  onOpenLogs: () => {},
  onOpenKibana: () => {},
  isKibanaConfigured: false,
  isRootSelected: false,
  onRootSelectionChange: () => {},
  onZoom: () => {},
  showZoomColumn: true,
};

export default React.memo(SpanRow);
