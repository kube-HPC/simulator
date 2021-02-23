import React, { lazy, useEffect, useMemo, useReducer } from 'react';
import PropTypes from 'prop-types';
import { Empty } from 'antd';
import styled from 'styled-components';
import { Fallback, FallbackComponent } from 'components/common';
import { useNodeInfo, useSettings } from 'hooks';
import { COLOR_LAYOUT } from 'styles';
import { generateStyles, formatEdge, formatNode } from '../graphUtils';
import Details from './Details';

const Card = styled.div`
  border: 1px solid ${COLOR_LAYOUT.border};
  overflow: auto;
  flex: 1;
`;

const Graph = lazy(() => import(`react-graph-vis`));

const GraphContainer = styled.div`
  flex: 1;
  max-height: 40vh;
  .vis-network {
    height: 100% !important;
  }
  .vis-tooltip {
    position: absolute;
    visibility: hidden;
    padding: 5px;
    white-space: nowrap;
    font-family: verdana;
    font-size: 16px;
    color: #000;
    background-color: #f5f4ed;
    -moz-border-radius: 3px;
    -webkit-border-radius: 3px;
    border-radius: 3px;
    border: 1px solid #808074;
    box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.2);
    pointer-events: none;
    z-index: 5;
  }
`;

const EmptyHeight = styled(Empty)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 136px;
`;

const GraphTab = ({ graph, pipeline }) => {
  const normalizedPipeline = useMemo(
    () =>
      pipeline.nodes.reduce(
        (acc, item) => ({ ...acc, [item.nodeName]: item }),
        {}
      ),
    [pipeline]
  );
  const adaptedGraph = useMemo(
    () => ({
      nodes: []
        .concat(graph.nodes)
        .filter(item => item)
        .map(formatNode(normalizedPipeline, pipeline.kind)),
      edges: []
        .concat(graph.edges)
        .filter(item => item)
        .map(formatEdge),
    }),
    [graph, normalizedPipeline, pipeline]
  );
  const isValidGraph = adaptedGraph.nodes.length !== 0;
  const { node, events } = useNodeInfo({ graph, pipeline });

  const { graphDirection: direction } = useSettings();

  const [showGraph, toggleForceUpdate] = useReducer(p => !p, true);

  const graphOptions = useMemo(() => generateStyles({ direction }), [
    direction,
  ]);

  useEffect(() => {
    toggleForceUpdate();
    setTimeout(() => {
      toggleForceUpdate();
    }, 500);
  }, [direction]);

  return (
    <>
      <GraphContainer
        style={{
          pointerEvents: `all`,
          maxWidth: `100%`,
        }}>
        {isValidGraph ? (
          showGraph ? (
            <Fallback>
              <Graph
                graph={adaptedGraph}
                options={{ ...graphOptions, height: '100px' }}
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
      {isValidGraph && (
        <Card>
          <Details node={node} jobId={graph.jobId} />
        </Card>
      )}
    </>
  );
};

GraphTab.propTypes = {
  pipeline: PropTypes.shape({
    kind: PropTypes.string.isRequired,
    nodes: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  graph: PropTypes.shape({
    nodes: PropTypes.arrayOf(PropTypes.object).isRequired,
    edges: PropTypes.arrayOf(PropTypes.object).isRequired,
    jobId: PropTypes.string.isRequired,
  }).isRequired,
};

const isSameGraph = (a, b) =>
  a.graph && b.graph ? a.graph.timestamp === b.graph.timestamp : true;

export default React.memo(GraphTab, isSameGraph);
