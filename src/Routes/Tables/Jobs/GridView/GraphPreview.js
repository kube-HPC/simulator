import React, { lazy, useState, useEffect, useMemo, useReducer } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Empty } from 'antd';
import { Fallback, FallbackComponent } from 'components/common';
// import { useNodeInfo, useSettings } from 'hooks';
import { generateStyles, formatEdge, formatNode } from '../graphUtils';

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

const GraphPreview = ({ pipeline }) => {
  const [graphPreview] = useState({ nodes: [], edges: [] });

  const normalizedPipeline = useMemo(
    () =>
      pipeline.nodes?.reduce(
        (acc, item) => ({ ...acc, [item.nodeName]: item }),
        {}
      ) || {},
    [pipeline]
  );

  const adaptedGraph = useMemo(() => {
    console.log('graphPreview 1.', graphPreview);

    return {
      nodes: []
        .concat(graphPreview?.nodes)
        .filter(item => item)
        .map(formatNode(normalizedPipeline, pipeline?.kind)),
      edges: []
        .concat(graphPreview?.edges)
        .filter(item => item)
        .map(formatEdge),
    };
  }, [graphPreview, normalizedPipeline, pipeline?.kind]);
  console.log('adaptedGraph 2.', adaptedGraph);
  const isValidGraph = adaptedGraph.nodes.length !== 0;

  // const { events } = useNodeInfo({ graph, pipeline });
  // const { graphDirection: direction } = useSettings();

  const [showGraph] = useReducer(p => !p, true); // toggleForceUpdate

  useEffect(() => {
    //  toggleForceUpdate();
    //   setTimeout(() => {
    //    toggleForceUpdate();
    //  }, 500);
  }, []);

  const graphOptions = useMemo(
    () => generateStyles({ direction: 'LR', isMinified: true }),
    []
  );

  useEffect(() => {
    // res = await client.post(`/exec/getGraphByStreamingFlow`, { ...pipeline });
    /*  fetch(`/exec/getGraphByStreamingFlow`,
    {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({...pipeline})
  }
    
    )
      .then((res) => res.json())
      .then((data) =>{  console.log("data",data) ; setGraphPreview(data)}); */
  }, []);

  if (graphPreview === undefined) {
    return <>Still loading...</>;
  }

  return (
    <GraphContainer>
      {console.log('isValidGraph', isValidGraph)}
      {console.log('showGraph', showGraph)}
      {console.log('adaptedGraph', adaptedGraph)}
      {console.log('graphOptions', graphOptions)}
      {adaptedGraph.nodes.length !== 0 ? (
        showGraph ? (
          <Fallback>
            <Graph
              graph={adaptedGraph}
              options={graphOptions}
              //   events={events}
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

GraphPreview.propTypes = {
  pipeline: PropTypes.shape({
    kind: PropTypes.string.isRequired,
    nodes: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  /* graph: PropTypes.shape({
    nodes: PropTypes.arrayOf(PropTypes.object).isRequired,
    edges: PropTypes.arrayOf(PropTypes.object).isRequired,*
 //   jobId: PropTypes.string.isRequired,
  }).isRequired, */
};

/* const isSameGraph = (a, b) =>
  a.graph && b.graph ? a.graph.timestamp === b.graph.timestamp : true; */

export default React.memo(GraphPreview);
