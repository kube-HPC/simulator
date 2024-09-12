import { COLOR } from 'styles/colors';

const FixedScale = (from, to) => (to[1] - to[0]) / (from[1] - from[0]);

const CappedScale = (from, to) => {
  const scale = FixedScale(from, to);
  return value => {
    const capped = Math.min(from[1], Math.max(from[0], value)) - from[0];
    return to[0] + to[1] - (capped * scale + to[0]);
  };
};

const fromScale = [0, 100];
const toScale = [1, 6];
const scaleThroughput = CappedScale(fromScale, toScale);

/* const _formatTitle = metrics =>
  Object.entries(metrics)
    .map(([k, v]) => `${k}:${v}`)
    .join('\n'); */

const _formatToolTip = (metrics, fromNode, toNode) => `
 <pre style="padding:20px">
    <b>${fromNode}</b>
    Messages produce rate: ${metrics.reqRate} per sec.
    Messages in queue: ${metrics.queueSize}.
    Time messages spent in queue: ${metrics.queueTimeMs} ms.
    Avg number of messages in queue: ${metrics.avgQueueSize}.
    Handle acknowledge revieved after:${metrics.roundTripTimeMs} ms.
    Total sent: ${metrics.totalRequests}.
    Total handle acknowledged: ${metrics.totalResponses}.
    Dropped messages: ${metrics.totalDropped}.
    <hr>
    <b>${toNode}</b>
    Message process rate: ${metrics.resRate}.
    Number of instances: ${metrics.currentSize}.
    Needed instances: ${metrics.requiered}.
    Process rate: ${metrics.resRate} Messages per second.
    Message process time: ${metrics.processingTimeMs} ms.
  </pre>
`;
const htmlTitle = html => {
  const container = document.createElement('div');
  container.innerHTML = html;
  return container;
};
export const formatEdge = edge => {
  const { value, ...rest } = edge;
  const [group] = value?.types ?? [];
  const { metrics } = value || {};
  const _edge = {
    id: edge.from
      ? `${edge.from}->${edge.to}`
      : `${edge.source}->${edge.source}`,
    dashes: group === 'waitAny' || group === 'AlgorithmExecution',
  };
  let styles = {};
  if (metrics) {
    const { throughput } = metrics;
    const title = htmlTitle(_formatToolTip(metrics, edge.from, edge.to));
    const label = `${throughput}%`; // for debugging...
    const width = scaleThroughput(throughput) / 1.5;
    const edgeColor =
      throughput > 0 && throughput < 50
        ? COLOR.redPale
        : throughput > 50 && throughput < 80
          ? COLOR.blueLight
          : COLOR.greenLight;
    const color = { color: edgeColor };
    styles = { title, label, width, color };
  }
  return { ...rest, ..._edge, ...styles, group };
};
