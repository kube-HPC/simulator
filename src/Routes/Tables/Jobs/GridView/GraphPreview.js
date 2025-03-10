import React, {
  useState,
  useEffect,
  useMemo,
  useReducer,
  useCallback,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Alert, Button } from 'antd';

import useWizardContext from 'Routes/SidebarRight/AddPipeline/useWizardContext';
import Graph from 'react-graph-vis';
import {
  AimOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons';
/* eslint-disable import/no-cycle */
import { useLocalStorageGraphMode } from 'hooks';
import client from 'client';
import { generateStyles, formatEdge, formatNode } from '../graphUtils';

const GraphContainer = styled.div`
  //  max-width: 40vw;
  height: 85%;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.02);
  padding: 10px;

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
export const ButtonsPanel = styled.div`
  position: absolute;
  z-index: 9999;
  right: 12px;
  top: 10px;
  display: flex;
  flex-direction: column;
  height: 105px;
  justify-content: space-between;
`;

const ensureAllNodesInEdges = data => {
  const { nodes, edges } = data;

  const connectedNodes = new Set();
  edges.forEach(edge => {
    connectedNodes.add(edge.from);
    connectedNodes.add(edge.to);
  });

  nodes.forEach(node => {
    if (!connectedNodes.has(node.nodeName)) {
      edges.push({ from: node.nodeName });
    }
  });

  return data;
};

const GraphPreview = ({
  pipeline,
  keyIndex = undefined,
  isBuildAllFlows = false,
  isMinified = true,
  clickNode = () => {},
}) => {
  const graphRef = useRef(null);
  const wizardContext = useWizardContext();

  const {
    //  saveLocationNodes,
    exportLocationNodes,
    hasRecord,
  } = useLocalStorageGraphMode();
  const hasRecordLocal = !hasRecord(pipeline.name);

  let valuesState = pipeline;
  let stepIdx = 0;
  let isStreamingPipeline = isBuildAllFlows;

  if (wizardContext) {
    valuesState = wizardContext.valuesState;
    stepIdx = wizardContext.stepIdx;
    isStreamingPipeline = wizardContext.isStreamingPipeline;
  }

  const keyFlow =
    keyIndex && pipeline?.streaming?.flows
      ? Object.keys(pipeline?.streaming?.flows)[keyIndex]
      : valuesState?.streaming?.defaultFlow
        ? valuesState?.streaming?.defaultFlow
        : null;

  const [graphPreview, setGraphPreview] = useState({ nodes: [], edges: [] });
  const [errorGraph, setErrorGraph] = useState('');

  const handleZoomIn = useCallback(() => {
    const network = graphRef?.current?.Network;
    network?.moveTo({
      scale: network.getScale() + 0.3,
    });
  }, []);
  const handleZoomOut = useCallback(() => {
    const network = graphRef?.current?.Network;
    network?.moveTo({ scale: network.getScale() - 0.3 });
  }, []);
  const handleZoomNodeSelected = useCallback(() => {
    const network = graphRef?.current?.Network;

    network?.focus(network.getSelectedNodes(), {
      scale: 2,
      locked: true,
      animation: {
        duration: 2000,
        easingFunction: 'easeOutQuint',
      },
    });
  }, []);

  const normalizedPipeline = useMemo(
    () =>
      pipeline.nodes?.reduce(
        (acc, item) => ({ ...acc, [item.nodeName]: item }),
        {}
      ) || {},
    [pipeline]
  );

  const adaptedGraph = useMemo(() => {
    const graphStructure = {
      nodes: []
        .concat(graphPreview?.nodes)
        .filter(item => item)
        .map(formatNode(normalizedPipeline, pipeline?.kind)),
      edges: []
        .concat(graphPreview?.edges)
        .filter(item => item)
        .map(formatEdge),
    };
    const localPosNodesGraph = exportLocationNodes(
      pipeline.name,
      graphStructure
    );
    if (localPosNodesGraph.nodes.length > 0) {
      return localPosNodesGraph;
    }

    return graphStructure;
  }, [
    exportLocationNodes,
    graphPreview?.edges,
    graphPreview?.nodes,
    normalizedPipeline,
    pipeline?.kind,
    pipeline.name,
  ]);

  // const { events } = useNodeInfo({ graph, pipeline });
  // const { graphDirection: direction } = useSettings();

  const [showGraph, toggleForceUpdate] = useReducer(p => !p, true); // toggleForceUpdate

  const graphOptions = useMemo(
    () => ({
      ...generateStyles({
        direction: 'LR',
        isMinified,
        isPreview: true,
        isHierarchical: hasRecordLocal,
        nodeSpacing: 350,
      }),
      height: isMinified ? '100%' : '500px',
    }),
    [hasRecordLocal, isMinified]
  );

  const joinFlowsToGraph = flowStrings => {
    const joinFlows = {
      nodes: [],
      edges: [],
    };

    flowStrings.forEach(flowString => {
      const flow = { ...flowString };

      // Add nodes
      flow.nodes.forEach(node => {
        if (!joinFlows.nodes.find(n => n.nodeName === node.nodeName)) {
          joinFlows.nodes.push(node);
        }
      });

      // Add edges
      flow.edges.forEach(edge => {
        if (
          !joinFlows.edges.find(e => e.from === edge.from && e.to === edge.to)
        ) {
          joinFlows.edges.push(edge);
        }
      });
    });

    // Filter out nodes not used in edges
    joinFlows.nodes = joinFlows.nodes.filter(node =>
      joinFlows.edges.some(
        edge => edge.from === node.nodeName || edge.to === node.nodeName
      )
    );

    return joinFlows;
  };

  const initPreviewGetData = useCallback(() => {
    if (isStreamingPipeline) {
      // streaming

      if (pipeline.streaming?.flows) {
        if (isBuildAllFlows) {
          const flows = pipeline.streaming?.flows;

          const requestsArrayFlows = Object.entries(flows).map(flow =>
            client
              .post(`/store/pipelines/graph`, {
                pipeline,
                keyFlow: flow[0],
                isBuildAllFlows: false,
              })
              .then(response => {
                if (response.data.error && response.data.error.message) {
                  setErrorGraph(response.data.error.message);
                }

                const dataAllNode = ensureAllNodesInEdges(response.data);

                return dataAllNode;
              })
              .catch(error => {
                console.error(error);
                return null;
              })
          );

          Promise.all(requestsArrayFlows)
            .then(res => {
              const data = res[0];

              if (data.error && data.error.message) {
                setErrorGraph(data.error.message);
              } else {
                const graphAllFlows = joinFlowsToGraph(res);

                setErrorGraph('');
                setGraphPreview(graphAllFlows);

                toggleForceUpdate();
                setTimeout(() => {
                  toggleForceUpdate();
                }, 1);
              }
            })
            .catch(error => {
              setErrorGraph(error.message);
              console.error('Error while sending requests:', error);
            });
        } else {
          client
            .post(`/store/pipelines/graph`, {
              pipeline,
              keyFlow,
              isBuildAllFlows,
            })
            .then(response => {
              const { data } = response;

              if (data.error && data.error.message) {
                setErrorGraph(data.error.message);
              } else {
                setErrorGraph('');

                // Filter out nodes not used in edges
                const GraphData = data;

                GraphData.nodes = GraphData.nodes.filter(node =>
                  GraphData.edges.some(
                    edge =>
                      edge.from === node.nodeName || edge.to === node.nodeName
                  )
                );
                setGraphPreview(GraphData);

                toggleForceUpdate();
                setTimeout(() => {
                  toggleForceUpdate();
                }, 1);
              }
            })
            .catch(error => {
              console.error('Error during axios operation:', error);
            });
        }
      }
    } else if (pipeline) {
      client
        .post(`/store/pipelines/graph`, { pipeline })
        .then(response => {
          const { data } = response;

          if (data.error && data.error.message) {
            setErrorGraph(data.error.message);
          } else {
            setErrorGraph('');
            setGraphPreview(data);

            toggleForceUpdate();
            setTimeout(() => {
              toggleForceUpdate();
            }, 1);
          }
        })
        .catch(error => {
          console.error('Error during axios operation:', error);
        });
    }
  }, [isBuildAllFlows, isStreamingPipeline, keyFlow, pipeline]);

  useEffect(() => {
    initPreviewGetData();
  }, [valuesState, stepIdx, isStreamingPipeline, initPreviewGetData]);

  const isDataNode =
    adaptedGraph.nodes.length > 0 && adaptedGraph.nodes[0].name !== '';

  useEffect(() => {
    const network = graphRef?.current?.Network || null;
    const gOption = graphOptions;
    if (network != null && isDataNode && gOption != null) {
      network.setOptions(gOption);
      network.setData(adaptedGraph);
    }
  }, [graphPreview]);

  if (graphPreview === undefined) {
    return <>Still loading...</>;
  }

  return (
    <GraphContainer>
      <ButtonsPanel>
        <Button onClick={handleZoomNodeSelected} icon={<AimOutlined />} />
        <Button onClick={handleZoomIn} icon={<ZoomInOutlined />} />
        <Button onClick={handleZoomOut} icon={<ZoomOutOutlined />} />
      </ButtonsPanel>

      {showGraph && (
        <Graph
          graph={adaptedGraph}
          options={graphOptions}
          //   events={events}
          ref={graphRef}
          getNetwork={network => {
            network.on('click', () => {
              clickNode(network.getSelectedNodes());
            });
          }}
        />
      )}

      {isDataNode && errorGraph && (
        <Alert
          style={{ position: 'absolute', top: '10px' }}
          message={errorGraph}
          type="error"
          showIcon
        />
      )}
    </GraphContainer>
  );
};

GraphPreview.propTypes = {
  pipeline: PropTypes.shape({
    name: PropTypes.string.isRequired,
    kind: PropTypes.string.isRequired,
    nodes: PropTypes.arrayOf(PropTypes.object),
    streaming: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  keyIndex: PropTypes.number,
  isBuildAllFlows: PropTypes.bool,
  isMinified: PropTypes.bool,
  clickNode: PropTypes.func,
  /* graph: PropTypes.shape({
    nodes: PropTypes.arrayOf(PropTypes.object).isRequired,
    edges: PropTypes.arrayOf(PropTypes.object).isRequired,*
 //   jobId: PropTypes.string.isRequired,
  }).isRequired, */
};

/* const isSameGraph = (a, b) =>
  a.graph && b.graph ? a.graph.timestamp === b.graph.timestamp : true; */

export default GraphPreview;
