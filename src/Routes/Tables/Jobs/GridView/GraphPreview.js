import React, {
  useState,
  useEffect,
  useMemo,
  useReducer,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Alert } from 'antd';
// import { Fallback, FallbackComponent } from 'components/common';
// import { useNodeInfo, useSettings } from 'hooks';
import { useSelector } from 'react-redux';
import { selectors } from 'reducers';
import useWizardContext from 'Routes/SidebarRight/AddPipeline/useWizardContext';
import Graph from 'react-graph-vis';
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

const GraphPreview = ({ pipeline, keyIndex, isBuildAllFlows, isMinified }) => {
  const wizardContext = useWizardContext();

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

  const { backendApiUrl } = useSelector(selectors.config);
  const [graphPreview, setGraphPreview] = useState({ nodes: [], edges: [] });
  const [errorGraph, setErrorGraph] = useState('');

  const normalizedPipeline = useMemo(
    () =>
      pipeline.nodes?.reduce(
        (acc, item) => ({ ...acc, [item.nodeName]: item }),
        {}
      ) || {},
    [pipeline]
  );

  const adaptedGraph = useMemo(
    () => ({
      nodes: []
        .concat(graphPreview?.nodes)
        .filter(item => item)
        .map(formatNode(normalizedPipeline, pipeline?.kind)),
      edges: []
        .concat(graphPreview?.edges)
        .filter(item => item)
        .map(formatEdge),
    }),
    [graphPreview, normalizedPipeline, pipeline?.kind]
  );

  // const { events } = useNodeInfo({ graph, pipeline });
  // const { graphDirection: direction } = useSettings();

  const [showGraph, toggleForceUpdate] = useReducer(p => !p, true); // toggleForceUpdate

  useEffect(() => {
    //  toggleForceUpdate();
    //   setTimeout(() => {
    //    toggleForceUpdate();
    //  }, 500);
  }, []);

  const graphOptions = useMemo(
    () => ({
      ...generateStyles({
        direction: 'LR',
        isMinified,
        isPreview: true,
        isHierarchical: true,
        nodeSpacing: 100,
      }),
      height: isMinified ? '100%' : '500px',
    }),
    [isMinified]
  );

  const joinFlowsToGraph = flowStrings => {
    const joinFlows = {
      nodes: [],
      edges: [],
    };

    flowStrings.forEach(flowString => {
      const flow = JSON.parse(flowString);

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
            fetch(`${backendApiUrl}/api/v1/store/pipelines/graph`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                pipeline,
                keyFlow: flow[0],
                isBuildAllFlows: false,
              }),
            })
              .then(response => {
                if (!response.ok) {
                  response.json().then(jtext => {
                    setErrorGraph(jtext.error.message);
                  });
                }
                return response.text();
              })
              .catch(error => {
                console.error(error);
                return null;
              })
          );

          Promise.all(requestsArrayFlows)

            .then(res => {
              const data = JSON.parse(res[0]);

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
          fetch(`${backendApiUrl}/api/v1/store/pipelines/graph`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pipeline, keyFlow, isBuildAllFlows }),
          })
            .then(res => res.json())
            .then(data => {
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
            });
        }
      }
      // batch
    } else {
      fetch(`${backendApiUrl}/api/v1/store/pipelines/graph`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pipeline }),
      })
        .then(res => res.json())
        .then(data => {
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
        });
    }
  }, [backendApiUrl, isBuildAllFlows, isStreamingPipeline, keyFlow, pipeline]);

  useEffect(() => {
    initPreviewGetData();
  }, [valuesState, stepIdx, isStreamingPipeline]);

  if (graphPreview === undefined) {
    return <>Still loading...</>;
  }

  const isDataNode =
    adaptedGraph.nodes.length > 0 && adaptedGraph.nodes[0].name !== '';

  return (
    <GraphContainer>
      {isDataNode && showGraph && (
        <Graph
          graph={adaptedGraph}
          options={graphOptions}
          //   events={events}
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
    kind: PropTypes.string.isRequired,
    nodes: PropTypes.arrayOf(PropTypes.object),
    streaming: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  keyIndex: PropTypes.number,
  isBuildAllFlows: PropTypes.bool,
  isMinified: PropTypes.bool,
  /* graph: PropTypes.shape({
    nodes: PropTypes.arrayOf(PropTypes.object).isRequired,
    edges: PropTypes.arrayOf(PropTypes.object).isRequired,*
 //   jobId: PropTypes.string.isRequired,
  }).isRequired, */
};
GraphPreview.defaultProps = {
  keyIndex: undefined,
  isBuildAllFlows: false,
  isMinified: true,
};

/* const isSameGraph = (a, b) =>
  a.graph && b.graph ? a.graph.timestamp === b.graph.timestamp : true; */

export default GraphPreview;
