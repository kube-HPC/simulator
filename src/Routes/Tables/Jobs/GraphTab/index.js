import { Empty } from 'antd';
import { Fallback, FallbackComponent } from 'components/common';
import { setOptions as defaultSetOptions } from 'config/template/graph-options.template';
import { useNodeInfo, useSettings } from 'hooks';
import PropTypes from 'prop-types';
import React, { lazy, useEffect, useMemo, useReducer } from 'react';
import styled from 'styled-components';
import { COLOR_LAYOUT } from 'styles';
import { formatEdge, formatNode } from 'utils';
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
`;

const EmptyHeight = styled(Empty)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 136px;
`;

const GraphTab = ({
  graph,
  pipeline,
  setOptions = defaultSetOptions,
  isMinified = false,
}) => {
  const adaptedGraph = useMemo(
    () => ({
      nodes: []
        .concat(graph.nodes)
        .filter(item => item)
        .map(formatNode),
      edges: []
        .concat(graph.edges)
        .filter(item => item)
        .map(formatEdge),
    }),
    [graph]
  );

  const isValidGraph = adaptedGraph.nodes.length !== 0;

  const { node, events } = useNodeInfo({ graph, pipeline });
  const { graphDirection: direction } = useSettings();

  const [showGraph, toggleForceUpdate] = useReducer(p => !p, true);

  useEffect(() => {
    toggleForceUpdate();
    setTimeout(() => {
      toggleForceUpdate();
    }, 500);
  }, [direction]);

  return (
    <>
      <GraphContainer
        isMinified={isMinified}
        style={{
          pointerEvents: !isMinified ? `all` : `none`,
          maxWidth: !isMinified ? `100%` : `40vw`,
        }}>
        {isValidGraph ? (
          showGraph ? (
            <Fallback>
              <Graph
                graph={adaptedGraph}
                options={setOptions({ direction })}
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
      {!isMinified && isValidGraph && (
        <Card>
          <Details node={node} jobId={graph.jobId} />
        </Card>
      )}
    </>
  );
};

GraphTab.propTypes = {
  // TODO: detail the props
  /* eslint-disable */
  graph: PropTypes.object.isRequired,
  pipeline: PropTypes.object,
  setOptions: PropTypes.func,
  isMinified: PropTypes.bool,
  className: PropTypes.string,
  /* eslint-enable */
};

const isSameGraph = (a, b) =>
  a.graph && b.graph ? a.graph.timestamp === b.graph.timestamp : true;

export default React.memo(GraphTab, isSameGraph);