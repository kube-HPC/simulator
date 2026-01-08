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
    .join('\n');
*/
const _formatToolTip = (metrics, fromNode, toNode, isStateLessView) => `
 <pre style="padding-left:10px">
<table>
  <tr>
    <td><b>${fromNode}</b> (Src)</td>
    <td></td> 
  </tr>
  <tr>
    <td>Messages produce rate:</td>
    <td><b>${metrics.reqRate} per sec</b></td>
  </tr>
  <tr>
    <td>Messages in queue:</td>
    <td>${metrics.queueSize}</td>
  </tr>
    <tr>
    <td>Avg number of messages in queue:</td>
    <td>${metrics.avgQueueSize}</td>
  </tr>
  <tr>
    <td>Time messages spent in queue:</td>
    <td>${metrics.queueTimeMs} ms</td>
  </tr>

  <tr>
    <td>Handle acknowledge received after:</td>
    <td>${metrics.roundTripTimeMs} ms</td>
  </tr>
  <tr>
    <td>Total sent:</td>
    <td>${metrics.totalRequests}</td>
  </tr>
  <tr>
    <td>Total handle acknowledged:</td>
    <td>${metrics.totalResponses}</td>
  </tr>
  <tr>
    <td>Dropped messages:</td>
    <td>${metrics.totalDropped}</td>
  </tr>
    <tr>
    <td colspan="2"><hr/></td>
     
  </tr>
  <tr>
    <td><b>${toNode}</b> (Dst)</td>
    <td></td> 
  </tr>
  <tr>
    <td>Message process rate:</td>
    <td><b>${metrics.resRate} per sec</b></td>
  </tr>

  <tr style="display:${isStateLessView};">
    <td>Number of instances:</td>
    <td>${metrics.currentSize}</td>
  </tr>
  <tr style="display:${isStateLessView};">
    <td>Needed instances:</td>
    <td>${metrics.required}</td>
  </tr>

  <tr>
    <td>Message process time:</td>
    <td>${metrics.processingTimeMs} ms</td>
  </tr>
</table></pre>
`;
const htmlTitle = html => {
  const container = document.createElement('div');
  container.innerHTML = html;
  return container;
};
export const formatEdge = (edge, pipeline) => {
  const { nodes } = pipeline;
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
    const isStateless =
      nodes.filter(x => x.nodeName === edge.to)[0].stateType === 'stateless';
    const title = htmlTitle(
      _formatToolTip(metrics, edge.from, edge.to, isStateless ? '' : 'none')
    );
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
