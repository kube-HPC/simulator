import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import TraceHeader from './TraceHeader';
import TraceTimeline from './TraceTimeline';
import TraceTimelineMinimap from './TraceTimelineMinimap';
import SpanRow from './SpanRow';
import { getCurrentTheme, getSystemColors } from './traceConstants';

/*
 * VIEWPORT_OFFSET — height of everything outside ViewerContainer
 * (top navbar + page padding/margins). Adjust if the app shell changes.
 */
const VIEWPORT_OFFSET = 120;

const ViewerContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: calc(100vh - ${VIEWPORT_OFFSET}px);
  min-height: 400px;
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
  position: relative;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  background: ${props => {
    const colors = getSystemColors(props.$isDark);
    return props.$isDark ? '#1f2937' : colors.background;
  }};
  border-bottom: 1px solid
    ${props => {
      const colors = getSystemColors(props.$isDark);
      return colors.border;
    }};

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
  const [minimapMode, setMinimapMode] = useState('highlight');
  const [isDark, setIsDark] = useState(getCurrentTheme() === 'DARK');

  const spanListRef = useRef(null);
  const spanRowRefs = useRef({});
  const [pendingScrollSpanId, setPendingScrollSpanId] = useState(null);

  useEffect(() => {
    const checkTheme = () => setIsDark(getCurrentTheme() === 'DARK');
    const interval = setInterval(checkTheme, 500);
    window.addEventListener('storage', checkTheme);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', checkTheme);
    };
  }, []);

  const toggleSpanDetails = spanId => {
    const newExpanded = new Set(expandedSpans);
    if (newExpanded.has(spanId)) newExpanded.delete(spanId);
    else newExpanded.add(spanId);
    setExpandedSpans(newExpanded);
  };

  const toggleChildrenVisibility = spanId => {
    const newCollapsed = new Set(collapsedChildren);
    if (newCollapsed.has(spanId)) newCollapsed.delete(spanId);
    else newCollapsed.add(spanId);
    setCollapsedChildren(newCollapsed);
  };

  const spanHierarchy = useMemo(() => {
    if (!data || !data.spans) return [];

    const { spans } = data;

    let filteredSpans = spans;
    if (minimapMode === 'selection' && selectedTimeRange) {
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

      hierarchy.push({ ...span, depth, hasChildren: children.length > 0 });

      if (!collapsedChildren.has(span.spanID)) {
        children.forEach(child => addSpanAndChildren(child, depth + 1));
      }
    };

    const rootSpans = filteredSpans.filter(span => {
      if (!span.references || span.references.length === 0) return true;
      return !span.references.some(
        ref => ref.refType === 'CHILD_OF' && spanById.has(ref.spanID)
      );
    });

    rootSpans.sort((a, b) => a.startTime - b.startTime);
    rootSpans.forEach(span => addSpanAndChildren(span));

    return hierarchy;
  }, [data, collapsedChildren, selectedTimeRange, minimapMode]);

  // ── Scroll helper ─────────────────────────────────────────────────────────
  // Resolves the topmost visible ancestor of the target span, then scrolls
  // the container so that row is vertically centered in the visible area.
  // Uses getBoundingClientRect() instead of offsetParent walk — immune to
  // CSS positioning context issues.
  // Snaps with behavior:'instant' before measuring to cancel any in-flight
  // smooth scroll and ensure stable layout measurements.
  const scrollToRootOf = useCallback(
    targetSpanId => {
      const container = spanListRef.current;
      if (!container) return;

      // Build parent lookup from CHILD_OF references
      const parentOf = new Map();
      spanHierarchy.forEach(span => {
        span.references?.forEach(ref => {
          if (ref.refType === 'CHILD_OF') {
            parentOf.set(span.spanID, ref.spanID);
          }
        });
      });

      const spanIndexMap = new Map(
        spanHierarchy.map((span, i) => [span.spanID, i])
      );

      // Walk up to the topmost visible ancestor in the rendered hierarchy
      const getRootAncestor = spanId => {
        let current = spanId;
        let ancestor = spanId;
        while (parentOf.has(current)) {
          const p = parentOf.get(current);
          if (spanIndexMap.has(p)) ancestor = p;
          current = p;
        }
        return ancestor;
      };

      const rootId = getRootAncestor(targetSpanId);
      const node =
        spanRowRefs.current[rootId] || spanRowRefs.current[targetSpanId];
      if (!node) return;

      // Cancel any in-flight smooth scroll before measuring so
      // getBoundingClientRect() returns stable positions
      container.scrollTo({ top: container.scrollTop, behavior: 'instant' });

      const containerRect = container.getBoundingClientRect();
      const nodeRect = node.getBoundingClientRect();

      const rowTopRelativeToContainer =
        nodeRect.top - containerRect.top + container.scrollTop;

      const containerHeight = container.clientHeight;
      const rowHeight = node.offsetHeight;
      const scrollTarget =
        rowTopRelativeToContainer - containerHeight / 2 + rowHeight / 2;

      container.scrollTo({
        top: Math.max(0, scrollTarget),
        behavior: 'smooth',
      });
    },
    [spanHierarchy]
  );

  // ── Post-render scroll effect ──────────────────────────────────────────────
  // Fires only when pendingScrollSpanId state changes, guaranteeing that
  // spanHierarchy has already settled before we read DOM positions.
  useEffect(() => {
    if (!pendingScrollSpanId) return;

    const frameId = requestAnimationFrame(() => {
      scrollToRootOf(pendingScrollSpanId);
      setPendingScrollSpanId(null);
    });

    return () => cancelAnimationFrame(frameId);
  }, [pendingScrollSpanId, scrollToRootOf]);

  const registerSpanRef = useCallback((spanId, node) => {
    if (node) spanRowRefs.current[spanId] = node;
    else delete spanRowRefs.current[spanId];
  }, []);

  const handleTimeRangeSelection = range => {
    setSelectedTimeRange(range);

    if (range === null || minimapMode !== 'highlight') return;

    const { startTime, endTime } = range;

    // Find the earliest span (by rendered order) that overlaps the range
    let bestIndex = Infinity;
    let bestSpanId = null;

    spanHierarchy.forEach((span, i) => {
      const spanStart = span.relativeStartTime;
      const spanEnd = spanStart + span.duration;
      if (spanEnd >= startTime && spanStart <= endTime && i < bestIndex) {
        bestIndex = i;
        bestSpanId = span.spanID;
      }
    });

    if (bestSpanId) setPendingScrollSpanId(bestSpanId);
  };

  const handleModeChange = newMode => {
    setSelectedTimeRange(null);
    setMinimapMode(newMode);
  };

  return (
    <ViewerContainer $isDark={isDark}>
      <TraceHeader
        traceData={data}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      <TraceTimelineMinimap
        traceData={data}
        processes={data.processes}
        onSelectionChange={handleTimeRangeSelection}
        minimapMode={minimapMode}
        onModeChange={handleModeChange}
      />
      <TraceTimeline traceData={data} />
      <SpanListContainer $isDark={isDark} ref={spanListRef}>
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
            rowRef={node => registerSpanRef(span.spanID, node)}
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
