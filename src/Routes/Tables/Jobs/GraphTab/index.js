import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Empty, Slider, Button, Switch, Popconfirm, Spin } from 'antd';
import { useDebounceCallback } from '@react-hook/debounce';
import { Fallback } from 'components/common';
import { useNodeInfo, useLocalStorageGraphMode } from 'hooks';
import {
  AimOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  DoubleRightOutlined,
} from '@ant-design/icons';

import { LOCAL_STORAGE_KEYS } from 'const';
import Graph from 'react-graph-vis';
import {
  Card,
  GraphContainer,
  EmptyHeight,
  FlexContainer,
  ButtonsPanel,
} from './styles';
import { generateStyles, formatEdge, formatNode } from '../graphUtils';
import Details from './Details';
import DropDownNodes from './NodeInputOutput/DropdownNodes';

const CenterImage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100px;
  height: 50%;
`;
const GRAPH_DIRECTION = {
  LeftToRight: 'LR',
  UpToDown: 'UD',
};

const FallbackComponent = () => (
  <CenterImage>
    <Spin size="large" />
  </CenterImage>
);

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
  const {
    deleteLocationNodes,
    saveLocationNodes,
    exportLocationNodes,
    hasRecord,
  } = useLocalStorageGraphMode();

  const [nodeSpacingInit] = useState(graph?.nodes?.length > 10 ? 130 : 150);

  const [selectNode, setSelectNode] = useState([
    graph?.nodes?.length > 0 ? graph?.nodes[0]?.nodeName : '',
  ]);

  const isHierarchical = useRef(true);
  const isPhysics = useRef(false);
  const nodePos = useRef(null);
  const zoomPos = useRef(null);
  const zoomSavePos = useRef(null);
  const isLockForAnimation = useRef(false);
  const [isSwitchSlider, setIsSwitchSlider] = useState(true);

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
  const { node, events, reloadNodeData, setReloadNodeData } = useNodeInfo({
    graph,
    pipeline,
  }); // events

  useEffect(() => {
    if (reloadNodeData) {
      setSelectNode([reloadNodeData]);
    }
  }, [reloadNodeData]);

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
        .map(edge => formatEdge(edge, pipeline)),
    };

    return res;
  }, [graph.edges, graph.nodes, normalizedPipeline, pipeline]);

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
  const handleZoomIn = useCallback(() => {
    const network = graphRef?.current?.Network;
    const newScale = network.getScale() + 0.3;
    network.moveTo({ scale: newScale });
    zoomPos.current.scale = newScale;
  }, []);
  const handleZoomOut = useCallback(() => {
    const network = graphRef?.current?.Network;
    const newScale = network.getScale() - 0.3;
    network.moveTo({ scale: newScale });
    zoomPos.current.scale = newScale;
  }, []);
  const handleZoomNodeSelected = useCallback(() => {
    isLockForAnimation.current = true;
    const network = graphRef?.current?.Network;
    network.focus(selectNode, {
      scale: 2,
      animation: {
        duration: 2000,
        easingFunction: 'easeOutQuint',
      },
    });

    network.once('animationFinished', () => {
      const scale = network.getScale();
      const viewPosition = network.getViewPosition();
      zoomPos.current = { scale, position: viewPosition };
      network.moveTo(zoomPos.current);
      isLockForAnimation.current = false;
    });
  }, [selectNode]);

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

    if (network && !isLockForAnimation.current) {
      const adaptedGraphData = adaptedGraph();
      const graphOptionsData = graphOptions();
      if (isHierarchical.current) {
        network.setOptions(graphOptionsData);
        network.setData(adaptedGraphData);

        handleIsLockDrag();

        /*   if (
          adaptedGraphData?.nodes.length > 10 &&
          adaptedGraphData?.nodes[0]?.x === null */
        // ) {
        isHierarchical.current = false;
        // }
      } else {
        if (!isPhysics.current) {
          network.setOptions(graphOptionsData);
          isPhysics.current = true;
        }

        // if have recode in local store the get recode by pipeline name
        if (hasRecord(pipeline.name)) {
          const localPosNodesGraph = exportLocationNodes(
            pipeline.name,
            adaptedGraphData
          );

          network.setData(localPosNodesGraph);
        } else {
          network.setData(adaptedGraphData);
        }

        if (zoomPos.current != null) {
          if (isSlider.current) {
            //  const a = nodeSpacing.current / nodeSpacingInit;
            // const scaleSave = a * zoomSavePos?.current?.scale;

            //   zoomPos.current.scale = scaleSave;
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
  }, [
    adaptedGraph,
    exportLocationNodes,
    graphOptions,
    hasRecord,
    pipeline.name,
    selectNode,
  ]);

  const onChangeSlider = useCallback(
    sliderSelect => {
      if (Number.isNaN(sliderSelect)) {
        return;
      }
      deleteLocationNodes(pipeline.name);
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
    [deleteLocationNodes, graphCalculations, pipeline.name]
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

  const onChangeSwitchSlider = val => {
    deleteLocationNodes(pipeline.name);
    setIsSwitchSlider(val);
  };

  useEffect(() => {
    if (hasRecord(pipeline.name)) {
      setIsSwitchSlider(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FlexContainer>
      <FlexContainer
        style={{
          position: 'absolute',
          zIndex: '1',
          alignItems: 'center',
          top: '8px',
        }}>
        <Slider
          disabled={!isSwitchSlider}
          tipFormatter={value =>
            `Space between nodes:  ${calculatePercentage(value, 70, 200)}%`
          }
          onChange={onChangeSliderDebounce}
          defaultValue={nodeSpacing.current}
          min={70}
          max={200}
          style={{
            width: '300px',
          }}
        />
        <Popconfirm
          overlayStyle={{
            width: '300px',
          }}
          title="Warning"
          description="If you change the distace between nodes, nodes layout will reset. 
          Do you wish to percede?"
          onConfirm={() => onChangeSwitchSlider(true)}
          okText="Yes"
          cancelText="No"
          disabled={isSwitchSlider}>
          <Switch checked={isSwitchSlider} size="small" />
        </Popconfirm>
      </FlexContainer>

      <GraphContainer
        style={{
          pointerEvents: `all`,
          maxWidth: `100%`,
          flex: '1',
        }}>
        <ButtonsPanel>
          <Button
            onClick={handleSelectDirection}
            icon={
              graphDirection !== GRAPH_DIRECTION.LeftToRight ? (
                <DoubleRightOutlined rotate={90} />
              ) : (
                <DoubleRightOutlined />
              )
            }
          />
          <Button onClick={handleZoomNodeSelected} icon={<AimOutlined />} />
          <Button onClick={handleZoomIn} icon={<ZoomInOutlined />} />
          <Button onClick={handleZoomOut} icon={<ZoomOutOutlined />} />
        </ButtonsPanel>
        {isValidGraph ? (
          showGraph ? (
            <Fallback>
              <Graph
                graph={{ nodes: [], edges: [] }}
                options={{}}
                events={events}
                ref={graphRef}
                getNetwork={network => {
                  network.on('dragEnd', e => {
                    if (e.nodes.length > 0) {
                      setIsSwitchSlider(false);
                    }

                    handleIsLockDrag();

                    setTimeout(() => {
                      // save graph in local store
                      const adaptedGraphData = adaptedGraph();

                      saveLocationNodes(
                        `${pipeline.experimentName}_${pipeline.name}_${pipeline.version}`,
                        adaptedGraphData
                      );
                    }, 1000);
                  });
                  network.on('zoom', () => {
                    const scale = network.getScale();
                    const viewPosition = network.getViewPosition();

                    zoomPos.current = { scale, position: viewPosition };
                    // setZoomPos({ scale, position: viewPosition });
                  });
                  network.on('selectNode', () => {
                    const nodeSelected = network.getSelectedNodes();
                    setSelectNode([nodeSelected]);
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
          <DropDownNodes
            nodes={graph.nodes}
            selectNode={selectNode}
            setSelectNode={setReloadNodeData}
          />
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
    name: PropTypes.string.isRequired,
    version: PropTypes.string.isRequired,
    experimentName: PropTypes.string.isRequired,
    kind: PropTypes.string.isRequired,
    nodes: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  graph: PropTypes.shape({
    nodes: PropTypes.arrayOf(PropTypes.object).isRequired,
    edges: PropTypes.arrayOf(PropTypes.object).isRequired,
    jobId: PropTypes.string.isRequired,
    timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
  }).isRequired,
};

const normalizeTimestamp = ts =>
  ts === undefined || ts === null ? ts : String(ts);

const isSameGraph = (a, b) =>
  a.graph && b.graph
    ? normalizeTimestamp(a.graph.timestamp) ===
      normalizeTimestamp(b.graph.timestamp)
    : true;

export default React.memo(GraphTab, isSameGraph);
