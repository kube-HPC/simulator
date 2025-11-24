import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import TraceHeader from './TraceHeader';
import SearchBox from './SearchBox';
import TraceTimeline from './TraceTimeline';
import TraceTimelineMinimap from './TraceTimelineMinimap';
import SpanRow from './SpanRow';
import { getCurrentTheme, getSystemColors } from './traceConstants';

const ViewerContainer = styled.div`
  position: relative;
  background: ${props => {
    const colors = getSystemColors(props.$isDark);
    return colors.background;
  }};
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid
    ${props => {
      const colors = getSystemColors(props.$isDark);
      return colors.border;
    }};
`;

const SpanListContainer = styled.div`
  background: ${props => {
    const colors = getSystemColors(props.$isDark);
    return props.$isDark ? '#1f2937' : colors.background;
  }};
  max-height: 600px;
  overflow-y: auto;
  border-bottom: 1px solid
    ${props => {
      const colors = getSystemColors(props.$isDark);
      return colors.border;
    }};

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => (props.$isDark ? '#1f2937' : '#f1f1f1')};
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => (props.$isDark ? '#3d5a7e' : '#888')};
    border-radius: 5px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${props => (props.$isDark ? '#4a6a92' : '#555')};
  }
`;

const ModernTraceViewer = ({ data }) => {
  const [expandedSpans, setExpandedSpans] = useState(new Set());
  const [collapsedChildren, setCollapsedChildren] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState(null);
  const [isDark, setIsDark] = useState(getCurrentTheme() === 'DARK');

  // Listen for theme changes
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

  const toggleSpanDetails = spanId => {
    const newExpanded = new Set(expandedSpans);
    if (newExpanded.has(spanId)) {
      newExpanded.delete(spanId);
    } else {
      newExpanded.add(spanId);
    }
    setExpandedSpans(newExpanded);
  };

  const toggleChildrenVisibility = spanId => {
    const newCollapsed = new Set(collapsedChildren);
    if (newCollapsed.has(spanId)) {
      newCollapsed.delete(spanId);
    } else {
      newCollapsed.add(spanId);
    }
    setCollapsedChildren(newCollapsed);
  };

  const spanHierarchy = useMemo(() => {
    if (!data || !data.spans) {
      return [];
    }

    const { spans } = data;

    let filteredSpans = spans;
    if (selectedTimeRange) {
      filteredSpans = spans.filter(span => {
        const spanStart = span.relativeStartTime;
        const spanEnd = span.relativeStartTime + span.duration;
        return (
          spanEnd >= selectedTimeRange.startTime &&
          spanStart <= selectedTimeRange.endTime
        );
      });
    }

    const hierarchy = [];
    const processedSpans = new Set();
    const spanById = new Map(filteredSpans.map(span => [span.spanID, span]));

    const addSpanAndChildren = (span, depth = 0) => {
      if (processedSpans.has(span.spanID)) return;

      processedSpans.add(span.spanID);

      const children = filteredSpans.filter(
        s =>
          s.references &&
          s.references.some(
            ref => ref.refType === 'CHILD_OF' && ref.spanID === span.spanID
          )
      );

      hierarchy.push({
        ...span,
        depth,
        hasChildren: children.length > 0,
      });

      if (!collapsedChildren.has(span.spanID)) {
        children.forEach(child => addSpanAndChildren(child, depth + 1));
      }
    };

    const rootSpans = filteredSpans.filter(span => {
      if (!span.references || span.references.length === 0) return true;
      const hasParentInSpanSet = span.references.some(
        ref => ref.refType === 'CHILD_OF' && spanById.has(ref.spanID)
      );
      return !hasParentInSpanSet;
    });

    rootSpans.sort((a, b) => a.startTime - b.startTime);
    rootSpans.forEach(span => addSpanAndChildren(span));

    return hierarchy;
  }, [data, collapsedChildren, selectedTimeRange]);

  const handleTimeRangeSelection = range => {
    setSelectedTimeRange(range);
  };

  return (
    <ViewerContainer $isDark={isDark}>
      <TraceHeader traceData={data} />
      <SearchBox searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <TraceTimelineMinimap
        traceData={data}
        processes={data.processes}
        onSelectionChange={handleTimeRangeSelection}
      />
      <TraceTimeline traceData={data} />
      <SpanListContainer $isDark={isDark}>
        {spanHierarchy.map(span => (
          <SpanRow
            key={span.spanID}
            span={span}
            totalDuration={data.duration}
            traceStartTime={data.startTime}
            isExpanded={expandedSpans.has(span.spanID)}
            onToggle={toggleSpanDetails}
            hasChildren={span.hasChildren}
            depth={span.depth}
            processes={data.processes}
            searchTerm={searchTerm}
            isChildrenVisible={!collapsedChildren.has(span.spanID)}
            onToggleChildren={toggleChildrenVisibility}
          />
        ))}
      </SpanListContainer>
    </ViewerContainer>
  );
};

ModernTraceViewer.propTypes = {
  data: PropTypes.shape({
    spans: PropTypes.array.isRequired,
    processes: PropTypes.object.isRequired,
    duration: PropTypes.number.isRequired,
    startTime: PropTypes.number.isRequired,
  }).isRequired,
};

export default React.memo(ModernTraceViewer);
