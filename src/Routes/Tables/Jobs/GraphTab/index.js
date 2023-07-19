import React, {
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { Empty, Button } from 'antd';
import styled from 'styled-components';
import { Fallback, FallbackComponent } from 'components/common';
import { useNodeInfo } from 'hooks';
import { ReactComponent as IconGraphUpToDown } from 'images/dir-graph-up.svg';
import { ReactComponent as IconGraphLeftToRight } from 'images/dir-graph-left.svg';
import { LOCAL_STORAGE_KEYS } from 'const';
import { generateStyles, formatEdge, formatNode } from '../graphUtils';
import Details from './Details';

const GRAPH_DIRECTION = {
  LeftToRight: 'LR',
  UpToDown: 'UD',
};
const Card = styled.div`
  padding-top: 2px;
  overflow: auto;
  flex: 1;
  height: 95vh;
  -webkit-box-shadow: -7px -8px 2px -4px ${props => props.theme.Styles.line};
  box-shadow: -7px -8px 2px -4px ${props => props.theme.Styles.line};
`;

const Graph = lazy(() => import(`react-graph-vis`));

const GraphContainer = styled.div`
  /*flex: 1;*/
  /*height:40vh;
  min-height: 40vh;
  max-height: 80vh;*/

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

const ButtonStyle = styled(Button)`
  position: absolute;
  z-index: 9999;
  left: 47%;
  top: 10px;
`;

const FlexContainer = styled.div`
  display: flex;
`;

const GraphTab = ({ graph, pipeline }) => {
  const [nodePos, setNodePos] = useState(null);

  const graphRef = useRef(null);

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
        .map(formatNode(normalizedPipeline, pipeline.kind, nodePos)),
      edges: []
        .concat(graph.edges)
        .filter(item => item)
        .map(formatEdge),
    }),
    [graph, normalizedPipeline, pipeline, nodePos]
  );
  const isValidGraph = adaptedGraph.nodes.length !== 0;
  const { node, events } = useNodeInfo({ graph, pipeline }); // events

  // const { graphDirection: direction } = useSettings();
  const [graphDirection, setGraphDirection] = useState(
    window.localStorage.getItem(
      LOCAL_STORAGE_KEYS.LOCAL_STORAGE_KEY_GRAPH_DIRECTION
    ) || GRAPH_DIRECTION.LeftToRight
  );
  const [isHierarchical, setIsHierarchical] = useState(true);

  const [showGraph, toggleForceUpdate] = useReducer(p => !p, true);

  const graphOptions = useMemo(
    () => ({
      ...generateStyles({ direction: graphDirection, isHierarchical }),
      height: '100px',
    }),
    [graphDirection, isHierarchical]
  );

  const isDisabledBtnRunDebug = useMemo(() => {
    let res = false;
    const nodesNames = pipeline.nodes.map(item => item.nodeName);

    if (
      pipeline?.kind === 'stream' ||
      (node &&
        node !== {} &&
        (node?.kind !== 'algorithm' || !nodesNames.includes(node?.nodeName)))
    ) {
      res = true;
    }

    return res;
  }, [node, pipeline?.kind, pipeline.nodes]);

  const handleSelectDirection = useCallback(() => {
    setIsHierarchical(true);
    const directionSelect =
      graphDirection !== GRAPH_DIRECTION.LeftToRight
        ? GRAPH_DIRECTION.LeftToRight
        : GRAPH_DIRECTION.UpToDown;
    setGraphDirection(directionSelect);
    window.localStorage.setItem(
      LOCAL_STORAGE_KEYS.LOCAL_STORAGE_KEY_GRAPH_DIRECTION,
      directionSelect
    );
  }, [graphDirection]);

  const handleIsLockDrag = useCallback(() => {
    if (isHierarchical) {
      const network = graphRef?.current?.Network;
      // const scale = network.getScale();
      //  const viewPosition = network.getViewPosition();

      setNodePos({ nodesPostions: network?.getPositions() });
      setIsHierarchical(false);
    }
  }, [isHierarchical]);

  useEffect(() => {
    toggleForceUpdate();
    setTimeout(() => {
      toggleForceUpdate();
    }, 500);
  }, [graphDirection, isHierarchical]);

  useEffect(() => {
    setTimeout(() => {
      graphRef?.current?.Network?.setSelection({
        nodes: [graph?.nodes[0]?.nodeName || ''],
      });
    }, 500);
  }, []);

  return (
    <FlexContainer>
      <GraphContainer
        style={{
          pointerEvents: `all`,
          maxWidth: `100%`,
          flex: '1',
        }}>
        <ButtonStyle
          onClick={handleSelectDirection}
          icon={
            graphDirection !== GRAPH_DIRECTION.LeftToRight ? (
              <IconGraphUpToDown />
            ) : (
              <IconGraphLeftToRight />
            )
          }
        />

        {isValidGraph ? (
          showGraph ? (
            <Fallback>
              <Graph
                graph={adaptedGraph}
                options={graphOptions}
                events={events}
                ref={graphRef}
                getNetwork={network => {
                  network.on('beforeDrawing', () => {
                    handleIsLockDrag();
                  });
                }}
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
          <Details
            node={node}
            jobId={graph.jobId}
            isDisabledBtnRunDebug={isDisabledBtnRunDebug}
          />
        </Card>
      )}
    </FlexContainer>
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
