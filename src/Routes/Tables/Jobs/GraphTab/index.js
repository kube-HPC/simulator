import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { Empty, Slider } from 'antd';
import { useDebounceCallback } from '@react-hook/debounce';
import { Fallback, FallbackComponent } from 'components/common';
import { useNodeInfo } from 'hooks';
import { ReactComponent as IconGraphUpToDown } from 'images/dir-graph-up.svg';
import { ReactComponent as IconGraphLeftToRight } from 'images/dir-graph-left.svg';
import { LOCAL_STORAGE_KEYS } from 'const';
import Graph from 'react-graph-vis';
import {
  Card,
  GraphContainer,
  EmptyHeight,
  ButtonStyle,
  FlexContainer,
} from './styles';
import { generateStyles, formatEdge, formatNode } from '../graphUtils';
import Details from './Details';

const GRAPH_DIRECTION = {
  LeftToRight: 'LR',
  UpToDown: 'UD',
};

const calculatePercentage = (value, minValue, maxValue) => {
  if (value < minValue) {
    return 0; // Handle values less than the minimum
  }
  if (value > maxValue) {
    return 100; // Handle values greater than the maximum
  }
  return Math.round(((value - minValue) / (maxValue - minValue)) * 100);
};

const GraphTab = ({ graph, pipeline }) => {
  // const [nodePos, setNodePos] = useState(null);
  // const [zoomPos, setZoomPos] = useState(null);

  const [nodeSpacingInit] = useState(graph?.nodes.length > 10 ? 50 : 150);

  const [selectNode, setSelectNode] = useState([
    graph?.nodes[0]?.nodeName || '',
  ]);

  const isHierarchical = useRef(true);
  const isPhysics = useRef(false);
  const nodePos = useRef(null);
  const zoomPos = useRef(null);
  const zoomSavePos = useRef(null);

  const isSlider = useRef(false);
  const nodeSpacing = useRef(
    nodeSpacingInit
    //  parseInt(
    //    window.localStorage.getItem(
    //      LOCAL_STORAGE_KEYS.LOCAL_STORAGE_KEY_GRAPH_SLIDER
    //    ),
    //    10
    //   ) || 150
  );
  // const nodeSpacingY = useRef(window.localStorage.getItem(LOCAL_STORAGE_KEYS.LOCAL_STORAGE_KEY_GRAPH_SLIDER)||300);
  const graphRef = useRef(null);
  const [showGraph] = useReducer(p => !p, true);
  const { node, events } = useNodeInfo({ graph, pipeline }); // events

  const normalizedPipeline = useMemo(
    () =>
      pipeline.nodes.reduce(
        (acc, item) => ({ ...acc, [item.nodeName]: item }),
        {}
      ),
    [pipeline]
  );

  const adaptedGraph = useCallback(() => {
    const res = {
      nodes: []
        .concat(graph.nodes)
        .filter(item => item)
        .map(formatNode(normalizedPipeline, pipeline.kind, nodePos.current)),
      edges: []
        .concat(graph.edges)
        .filter(item => item)
        .map(formatEdge),
    };

    return res;
  }, [graph.edges, graph.nodes, normalizedPipeline, pipeline.kind]);

  const isValidGraph = adaptedGraph().nodes.length !== 0;

  // const { graphDirection: direction } = useSettings();
  const [graphDirection, setGraphDirection] = useState(
    window.localStorage.getItem(
      LOCAL_STORAGE_KEYS.LOCAL_STORAGE_KEY_GRAPH_DIRECTION
    ) || GRAPH_DIRECTION.LeftToRight
  );

  const graphOptions = useCallback(
    () => ({
      ...generateStyles({
        direction: graphDirection,
        isHierarchical: isHierarchical.current,
        nodeSpacing: (nodeSpacing.current / 3) * 2,
      }),
      height: '100px',
    }),
    [graphDirection]
  );

  const isDisabledBtnRunDebug = useMemo(() => {
    let res = false;
    const nodesNames = pipeline.nodes.map(item => item.nodeName);

    if (
      pipeline?.kind === 'stream' ||
      (node &&
        Object.keys(node).length === 0 &&
        (node?.kind !== 'algorithm' || !nodesNames.includes(node?.nodeName)))
    ) {
      res = true;
    }

    return res;
  }, [node, pipeline?.kind, pipeline.nodes]);

  const handleSelectDirection = useCallback(() => {
    const directionSelect =
      graphDirection !== GRAPH_DIRECTION.LeftToRight
        ? GRAPH_DIRECTION.LeftToRight
        : GRAPH_DIRECTION.UpToDown;

    window.localStorage.setItem(
      LOCAL_STORAGE_KEYS.LOCAL_STORAGE_KEY_GRAPH_DIRECTION,
      directionSelect
    );

    nodePos.current = null;
    zoomPos.current = null;
    setSelectNode([graph?.nodes[0]?.nodeName || '']);
    isHierarchical.current = true;
    isPhysics.current = false;

    setGraphDirection(directionSelect);
  }, [graph?.nodes, graphDirection]);

  const handleIsLockDrag = () => {
    const network = graphRef?.current?.Network;
    const scale = network.getScale();
    const viewPosition = network.getViewPosition();
    nodePos.current = { nodesPostions: network?.getPositions() };
    zoomPos.current = { scale, position: viewPosition };
  };

  const graphCalculations = useCallback(() => {
    const network = graphRef?.current?.Network || null;

    if (network) {
      const adaptedGraphData = adaptedGraph();
      const graphOptionsData = graphOptions();
      if (isHierarchical.current) {
        network.setOptions(graphOptionsData);
        network.setData(adaptedGraphData);

        handleIsLockDrag();

        if (
          adaptedGraphData?.nodes.length > 10 &&
          adaptedGraphData?.nodes[0]?.x === null
        ) {
          isHierarchical.current = false;
        }
      } else {
        if (!isPhysics.current) {
          network.setOptions(graphOptionsData);
          isPhysics.current = true;
        }

        network.setData(adaptedGraphData);

        if (zoomPos.current != null) {
          if (isSlider.current) {
            // const a = nodeSpacing.current / nodeSpacingInit;
            const scaleSave = 0.5; // * zoomSavePos?.current?.scale;

            zoomPos.current.scale = scaleSave;
            isSlider.current = false;
          } else {
            zoomSavePos.current = zoomPos.current;
          }

          network.moveTo(zoomPos.current);
        }
      }

      network.setSelection({
        nodes: [selectNode || ''],
      });
    }
  }, [adaptedGraph, graphOptions, nodeSpacingInit, selectNode]);

  const onChangeSlider = useCallback(
    sliderSelect => {
      if (Number.isNaN(sliderSelect)) {
        return;
      }

      window.localStorage.setItem(
        LOCAL_STORAGE_KEYS.LOCAL_STORAGE_KEY_GRAPH_SLIDER,
        sliderSelect
      );
      isSlider.current = true;
      nodePos.current = null;
      zoomPos.current = null;

      isHierarchical.current = true;
      isPhysics.current = false;

      nodeSpacing.current = sliderSelect;

      graphCalculations();
      setTimeout(() => {
        graphCalculations();
      }, 1);
    },
    [graphCalculations]
  );
  const onChangeSliderDebounce = useDebounceCallback(
    onChangeSlider,
    500,
    false
  );

  useEffect(() => {
    graphCalculations();
    setTimeout(() => {
      graphCalculations();
    }, 1);
  }, [graph.timestamp, graphCalculations]);

  return (
    <FlexContainer>
      <GraphContainer
        style={{
          pointerEvents: `all`,
          maxWidth: `100%`,
          flex: '1',
        }}>
        <Slider
          tipFormatter={value =>
            `Space between nodes:  ${calculatePercentage(value, 50, 600)}%`
          }
          onChange={onChangeSliderDebounce}
          defaultValue={nodeSpacing.current}
          min={50}
          max={600}
          style={{
            width: '300px',
            position: 'absolute',
            zIndex: '9999',

            top: '8px',
          }}
        />
        {
          // <Slider onChange={onChangeSliderDebounceY} defaultValue={nodeSpacingY.current} min={100} max={600} style={{width:"300px",position: "absolute",  zIndex: "9999",  left: "25%",  top: "20px"}} />
        }

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
                graph={{ nodes: [], edges: [] }}
                options={{}}
                events={events}
                ref={graphRef}
                getNetwork={network => {
                  network.on('dragEnd', () => {
                    handleIsLockDrag();
                  });
                  network.on('zoom', () => {
                    const scale = network.getScale();
                    const viewPosition = network.getViewPosition();

                    zoomPos.current = { scale, position: viewPosition };
                    // setZoomPos({ scale, position: viewPosition });
                  });
                  network.on('selectNode', () => {
                    const nodeSelected = network.getSelectedNodes();

                    setSelectNode(nodeSelected);
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
    timestamp: PropTypes.string.isRequired,
  }).isRequired,
};

const isSameGraph = (a, b) =>
  a.graph && b.graph ? a.graph.timestamp === b.graph.timestamp : true;

export default React.memo(GraphTab, isSameGraph);
