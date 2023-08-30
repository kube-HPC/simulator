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

const GraphTab = ({ graph, pipeline }) => {
  const [nodePos, setNodePos] = useState(null);
  const [zoomPos, setZoomPos] = useState(null);
  const [selectNode, setSelectNode] = useState([
    graph?.nodes[0]?.nodeName || '',
  ]);

  const isHierarchical = useRef(true);
  const isPhysics = useRef(false);
  const nodeSpacing = useRef(
    parseInt(
      window.localStorage.getItem(
        LOCAL_STORAGE_KEYS.LOCAL_STORAGE_KEY_GRAPH_SLIDER
      ),
      10
    ) || 150
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

  const adaptedGraph = {
    nodes: []
      .concat(graph.nodes)
      .filter(item => item)
      .map(formatNode(normalizedPipeline, pipeline.kind, nodePos)),
    edges: []
      .concat(graph.edges)
      .filter(item => item)
      .map(formatEdge),
  };

  const isValidGraph = adaptedGraph.nodes.length !== 0;

  // const { graphDirection: direction } = useSettings();
  const [graphDirection, setGraphDirection] = useState(
    window.localStorage.getItem(
      LOCAL_STORAGE_KEYS.LOCAL_STORAGE_KEY_GRAPH_DIRECTION
    ) || GRAPH_DIRECTION.LeftToRight
  );

  const graphOptions = {
    ...generateStyles({
      direction: graphDirection,
      isHierarchical: isHierarchical.current,
      nodeSpacing: nodeSpacing.current,
    }), // ,nodeSpacingY:nodeSpacingY.current
    height: '100px',
  };

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
    const directionSelect =
      graphDirection !== GRAPH_DIRECTION.LeftToRight
        ? GRAPH_DIRECTION.LeftToRight
        : GRAPH_DIRECTION.UpToDown;

    window.localStorage.setItem(
      LOCAL_STORAGE_KEYS.LOCAL_STORAGE_KEY_GRAPH_DIRECTION,
      directionSelect
    );

    setNodePos(null);
    setZoomPos(null);
    setSelectNode([graph?.nodes[0]?.nodeName || '']);
    isHierarchical.current = true;
    isPhysics.current = false;

    setGraphDirection(directionSelect);
  }, [graphDirection]);

  const handleIsLockDrag = () => {
    const network = graphRef?.current?.Network;
    const scale = network.getScale();
    const viewPosition = network.getViewPosition();

    setNodePos({ nodesPostions: network?.getPositions() });
    setZoomPos({ scale, position: viewPosition });
  };

  useEffect(() => {
    const network = graphRef?.current?.Network || null;

    if (network) {
      if (isHierarchical.current) {
        network.setOptions(graphOptions);
        network.setData(adaptedGraph);
        // setNodePos({ nodesPostions: network?.getPositions() });
        handleIsLockDrag();
        isHierarchical.current = false;
      } else {
        if (!isPhysics.current) {
          network.setOptions(graphOptions);
          isPhysics.current = true;
        }

        network.setData(adaptedGraph);

        if (zoomPos != null) {
          network.moveTo(zoomPos);
        }

        network.setSelection({
          nodes: [selectNode || ''],
        });
      }
    }
  }, [
    graph.timestamp,
    graphDirection,
    nodeSpacing.current,
    //   isHierarchical.current,
  ]); // ,nodeSpacingY.current

  /* const onChangeSliderY = useCallback((sliderSelect) => {
  if (isNaN(sliderSelect)) {
    return;
  }

  window.localStorage.setItem(
    LOCAL_STORAGE_KEYS.LOCAL_STORAGE_KEY_GRAPH_SLIDER,
    sliderSelect
  );

  setNodePos(null)
  setZoomPos(null)
  setSelectNode([graph?.nodes[0]?.nodeName || ''])
  isHierarchical.current=true;
  isPhysics.current=false;


  nodeSpacingY.current = sliderSelect;

*/
  //-------------------------------------------------------------
  /*
const network = graphRef?.current?.Network || null;
 network.setOptions({
  physics: {
    enabled: false,
  },
  layout: {
    hierarchical: {
      enabled: true,
    // nodeSpacing: sliderSelect,
     levelSeparation:sliderSelect,
    }
  }
 });
  nodeSpacing.current = sliderSelect;

  // const scale = network.getScale();
  // const viewPosition = network.getViewPosition();
  isHierarchical.current=true;
  isPhysics.current=false;
  // setNodePos({ nodesPostions: network?.getPositions() });
  // setZoomPos({scale: scale, position: viewPosition})

  // handleIsLockDrag();
  
//-----------------------------------------
}, []); */

  const onChangeSlider = useCallback(sliderSelect => {
    if (Number.isNaN(sliderSelect)) {
      return;
    }

    window.localStorage.setItem(
      LOCAL_STORAGE_KEYS.LOCAL_STORAGE_KEY_GRAPH_SLIDER,
      sliderSelect
    );

    setNodePos(null);
    setZoomPos(null);

    setSelectNode([graph?.nodes[0]?.nodeName || '']);
    isHierarchical.current = true;
    isPhysics.current = false;

    nodeSpacing.current = sliderSelect;

    setTimeout(() => {
      if (sliderSelect > 200) {
        const network = graphRef?.current?.Network || null;
        const viewPosition = network.getViewPosition();
        setZoomPos({ scale: sliderSelect / 2000, position: viewPosition });
        network.moveTo({ scale: sliderSelect / 2000, position: viewPosition });
      }
    }, 100);
    //-------------------------------------------------------------
    /*
const network = graphRef?.current?.Network || null;
 network.setOptions({
  physics: {
    enabled: false,
  },
  layout: {
    hierarchical: {
      enabled: true,
    // nodeSpacing: sliderSelect,
     levelSeparation:sliderSelect,
    }
  }
 });
  nodeSpacing.current = sliderSelect;

  // const scale = network.getScale();
  // const viewPosition = network.getViewPosition();
  isHierarchical.current=true;
  isPhysics.current=false;
  // setNodePos({ nodesPostions: network?.getPositions() });
  // setZoomPos({scale: scale, position: viewPosition})

  // handleIsLockDrag();
  */
    //-----------------------------------------
  }, []);
  const onChangeSliderDebounce = useDebounceCallback(
    onChangeSlider,
    500,
    false
  );

  // const onChangeSliderDebounceY = useDebounceCallback(onChangeSliderY,500, false);

  return (
    <FlexContainer>
      <GraphContainer
        style={{
          pointerEvents: `all`,
          maxWidth: `100%`,
          flex: '1',
        }}>
        <Slider
          tipFormatter={value => `Space between nodes: ${value}`}
          onChange={onChangeSliderDebounce}
          defaultValue={nodeSpacing.current}
          min={100}
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

                    setZoomPos({ scale, position: viewPosition });
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
