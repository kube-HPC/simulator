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
import { Alert, Button, Spin } from 'antd';

import useWizardContext from 'Routes/SidebarRight/AddPipeline/useWizardContext';
import Graph from 'react-graph-vis';
import {
  AimOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { useLocalStorageGraphMode } from 'hooks';
import client from 'client';
import { generateStyles, formatEdge, formatNode } from '../graphUtils';

const GraphContainer = styled.div`
  height: 90%;
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

// eslint-disable-next-line no-promise-executor-return
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const GraphPreview = ({
  pipeline,
  keyIndex = undefined,
  isBuildAllFlows = false,
  isMinified = true,
  clickNode = () => {},
  reload = false,
}) => {
  const graphRef = useRef(null);
  const wizardContext = useWizardContext();

  const { exportLocationNodes, hasRecord } = useLocalStorageGraphMode();
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

  const [errorGraphs, setErrorGraphs] = useState([]);

  const [isLoadGraphs, setIsLoadGraphs] = useState(false);

  const handleZoomIn = useCallback(() => {
    const network = graphRef?.current?.Network;
    network?.moveTo({ scale: network.getScale() + 0.3 });
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
      nodes: graphPreview?.nodes
        .filter(Boolean)
        .map(formatNode(normalizedPipeline, pipeline?.kind)),
      edges: graphPreview?.edges.filter(Boolean).map(formatEdge),
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

  const [showGraph, toggleForceUpdate] = useReducer(p => !p, true);

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

  const updateGraphPreview = () => {
    toggleForceUpdate();
    setTimeout(() => {
      toggleForceUpdate();
    }, 1);
  };

  const joinFlowsToGraph = flowStrings => {
    const joinFlows = { nodes: [], edges: [] };

    flowStrings.forEach(flow => {
      if (!flow) return;

      flow.nodes.forEach(node => {
        if (!joinFlows.nodes.find(n => n.nodeName === node.nodeName)) {
          joinFlows.nodes.push(node);
        }
      });

      flow.edges.forEach(edge => {
        if (
          !joinFlows.edges.find(e => e.from === edge.from && e.to === edge.to)
        ) {
          joinFlows.edges.push(edge);
        }
      });
    });

    joinFlows.nodes = joinFlows.nodes.filter(node =>
      joinFlows.edges.some(
        edge => edge.from === node.nodeName || edge.to === node.nodeName
      )
    );

    return joinFlows;
  };

  const initPreviewGetData = useCallback(() => {
    if (isStreamingPipeline) {
      if (pipeline.streaming?.flows) {
        if (isBuildAllFlows) {
          const flows = pipeline.streaming?.flows;

          const requestsArrayFlows = Object.entries(flows);

          const fetchWithDelay = () => {
            const results = [];
            const errors = [];
            setIsLoadGraphs(true);
            return requestsArrayFlows
              .reduce(
                (promise, [key, flow]) =>
                  promise.then(() =>
                    client
                      .post(`/store/pipelines/graph`, {
                        pipeline,
                        keyFlow: key,
                        isBuildAllFlows: false,
                      })
                      .then(response => {
                        if (response?.data?.error?.message) {
                          errors.push({
                            key,
                            message: response.data.error.message,
                          });
                          setErrorGraphs(errors);
                        }
                        const res = ensureAllNodesInEdges(response.data);
                        results.push({ key, flow, res });
                        return sleep(300);
                      })
                      .catch(error => {
                        let msg = error.message || 'Unknown error';
                        if (error.response?.data?.error?.message) {
                          msg = error.response.data.error.message;
                        }
                        errors.push({ key, message: msg });
                        setErrorGraphs(errors);
                        console.error(error);
                        results.push({ key, flow, res: null });
                        return sleep(300);
                      })
                  ),
                Promise.resolve()
              )
              .then(() => ({ results, errors }));
          };

          fetchWithDelay()
            .then(({ results, errors }) => {
              setIsLoadGraphs(false);
              if (results.length === 0) {
                setErrorGraphs(errors);
                setGraphPreview({ nodes: [], edges: [] });
                return;
              }

              const graphAllFlows = joinFlowsToGraph(results.map(r => r.res));

              setErrorGraphs(errors);
              setGraphPreview(graphAllFlows);

              updateGraphPreview();
            })
            .catch(error => {
              let msg = error.message || 'Unknown error';
              if (error.response?.data?.error?.message) {
                msg = error.response.data.error.message;
              }
              setErrorGraphs([{ key: 'general', message: msg }]);
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
                setErrorGraphs([{ key: keyFlow, message: data.error.message }]);
              } else {
                setErrorGraphs([]);

                const GraphData = data;

                GraphData.nodes = GraphData.nodes.filter(node =>
                  GraphData.edges.some(
                    edge =>
                      edge.from === node.nodeName || edge.to === node.nodeName
                  )
                );
                setGraphPreview(GraphData);

                updateGraphPreview();
              }
            })
            .catch(error => {
              let msg = error.message || 'Unknown error';
              if (error.response?.data?.error?.message) {
                msg = error.response.data.error.message;
              }
              setErrorGraphs([{ key: keyFlow || 'unknown', message: msg }]);
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
            setErrorGraphs([{ key: 'general', message: data.error.message }]);
          } else {
            setErrorGraphs([]);
            setGraphPreview(data);

            updateGraphPreview();
          }
        })
        .catch(error => {
          let msg = error.message || 'Unknown error';
          if (error.response?.data?.error?.message) {
            msg = error.response.data.error.message;
          }
          setErrorGraphs([{ key: 'general', message: msg }]);
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

  useEffect(() => {
    updateGraphPreview();
  }, [reload]);

  if (graphPreview === undefined) {
    return <>Still loading...</>;
  }

  return (
    <>
      {isLoadGraphs && (
        <Spin
          indicator={<LoadingOutlined spin />}
          size="large"
          style={{ position: 'absolute', top: '25px', left: '40px' }}
        />
      )}
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
            ref={graphRef}
            getNetwork={network => {
              network.on('click', () => {
                clickNode(network.getSelectedNodes());
              });
            }}
          />
        )}

        {isDataNode &&
          errorGraphs.map(({ key, message }, idx) => (
            <Alert
              // eslint-disable-next-line react/no-array-index-key
              key={`${key}-${idx}`}
              message={`error in flow : "${key}": ${message}`}
              type="error"
              showIcon
              style={{
                marginBottom: '4px',
                position: 'absolute',
                top: 10 + idx * 50,
                // right: 10,
                // width: '300px',
                zIndex: 10000,
              }}
            />
          ))}
      </GraphContainer>
    </>
  );
};

GraphPreview.propTypes = {
  pipeline: PropTypes.shape({
    name: PropTypes.string.isRequired,
    kind: PropTypes.string.isRequired,
    nodes: PropTypes.arrayOf(PropTypes.object),
    streaming: PropTypes.object,
  }).isRequired,
  keyIndex: PropTypes.number,
  isBuildAllFlows: PropTypes.bool,
  isMinified: PropTypes.bool,
  clickNode: PropTypes.func,
  reload: PropTypes.bool,
};

export default GraphPreview;
