import { Empty } from 'antd';
import { Fallback, FallbackComponent } from 'components/common';
import { useNodeInfo, useSettings } from 'hooks';
import PropTypes from 'prop-types';
import React, { lazy, useEffect, useMemo, useReducer } from 'react';
import styled from 'styled-components';
import setGraphStyles from '../setGraphStyles';
import { formatEdge, formatNode } from './../graph';

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

const JobGraph = ({ graph, pipeline, setOptions = setGraphStyles }) => {
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

  const { events } = useNodeInfo({ graph, pipeline });
  const { graphDirection: direction } = useSettings();

  const [showGraph, toggleForceUpdate] = useReducer(p => !p, true);

  useEffect(() => {
    toggleForceUpdate();
    setTimeout(() => {
      toggleForceUpdate();
    }, 500);
  }, [direction]);

  return (
    <GraphContainer>
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
  );
};

JobGraph.propTypes = {
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

export default React.memo(JobGraph, isSameGraph);
