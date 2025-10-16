import React, { lazy, useEffect, useMemo, useReducer } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Empty, Spin } from 'antd';
import { Fallback } from 'components/common';
import { useNodeInfo, useSettings } from 'hooks';
import { generateStyles, formatEdge, formatNode } from '../graphUtils';

const CenterImage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100px;
  height: 50%;
`;

const FallbackComponent = () => (
  <CenterImage>
    <Spin size="large" />
  </CenterImage>
);

const Graph = lazy(() => import(`react-graph-vis`));

const GraphContainer = styled.div`
  pointer-events: none;
  max-width: 40vw;
`;

const EmptyHeight = styled(Empty)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 136px; // TODO: get rid of this
`;

const JobGraph = ({ graph, pipeline }) => {
  const normalizedPipeline = useMemo(
    () =>
      pipeline.nodes?.reduce(
        (acc, item) => ({ ...acc, [item.nodeName]: item }),
        {}
      ) || {},
    [pipeline]
  );

  const adaptedGraph = useMemo(
    () => ({
      nodes: []
        .concat(graph.nodes)
        .filter(item => item)
        .map(formatNode(normalizedPipeline, pipeline?.kind)),
      edges: []
        .concat(graph.edges)
        .filter(item => item)
        .map(formatEdge),
    }),
    [graph, pipeline, normalizedPipeline]
  );

  const isValidGraph = adaptedGraph.nodes.length !== 0;

  const { events } = useNodeInfo({ graph, pipeline });
  const { graphDirection: direction } = useSettings();

  const [showGraph, toggleForceUpdate] = useReducer(p => !p, true);

  useEffect(() => {
    toggleForceUpdate();
    setTimeout(() => {
      toggleForceUpdate();
    }, 500);
  }, [direction]);

  const graphOptions = useMemo(
    () => generateStyles({ direction, isMinified: true }),
    [direction]
  );

  return (
    <GraphContainer>
      {isValidGraph ? (
        showGraph ? (
          <Fallback>
            <Graph
              graph={adaptedGraph}
              options={graphOptions}
              events={events}
            />
          </Fallback>
        ) : (
          <FallbackComponent />
        )
      ) : (
        <EmptyHeight image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </GraphContainer>
  );
};

JobGraph.propTypes = {
  pipeline: PropTypes.shape({
    kind: PropTypes.string.isRequired,
    nodes: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  graph: PropTypes.shape({
    nodes: PropTypes.arrayOf(PropTypes.object).isRequired,
    edges: PropTypes.arrayOf(PropTypes.object).isRequired,
    jobId: PropTypes.string.isRequired,
    timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
};

const normalizeTimestamp = ts =>
  ts === undefined || ts === null ? ts : String(ts);

const isSameGraph = (a, b) =>
  a.graph && b.graph
    ? normalizeTimestamp(a.graph.timestamp) ===
      normalizeTimestamp(b.graph.timestamp)
    : true;

export default React.memo(JobGraph, isSameGraph);
