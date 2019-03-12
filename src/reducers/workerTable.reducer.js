import { handleActions } from 'redux-actions';
import { get } from 'lodash';
import Immutable from 'seamless-immutable';
import actions from '../constants/actions';
const dataSource = [];
const tmp = { dataSource };
// columns

const inititalState = Immutable.from(tmp);

// const calaStats = (data) => {
//   const stats = Object.values(data.reduce((acc, cur) => {
//     if (!acc[cur.data.algorithmName]) {
//       acc[cur.data.algorithmName] = {
//         algorithmName: cur.data.algorithmName,
//       }
//     }
//     acc[cur.data.algorithmName].count = (acc[cur.data.algorithmName].count || 0) + 1;

//     acc[cur.data.algorithmName][cur.data.workerStatus] = (acc[cur.data.algorithmName][cur.data.workerStatus] || 0) + 1;
//     return acc;
//   }, {}));

//   return stats;
// };
export default handleActions(
  {
    [actions.UPDATE_ROW_DATA_TABLE](state, { type, payload, meta, error }) {
      const data = (payload.discovery && payload.discovery.worker) || [];
      const stats = get(payload, 'discovery.task-executor[0].data.actual', []);
      return state.merge({ dataSource: data, stats });
    }
  },
  inititalState
);
