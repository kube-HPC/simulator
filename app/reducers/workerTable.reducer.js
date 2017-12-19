import { handleActions } from 'redux-actions';
import dateformat from 'dateformat';
import Immutable from 'seamless-immutable';
import actions from '../constants/actions';

// const dataSource = [
//   { key: 1, podName: 'John Brown', age: 32, address: 'New York No. 1 Lake Park', description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.' },
//   { key: 2, podName: 'Jim Green', age: 42, address: 'London No. 1 Lake Park', description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.' },
//   { key: 3, podName: 'Joe Black', age: 32, address: 'Sidney No. 1 Lake Park', description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.' },
// ];
const dataSource = [{
  workerId: '5fe1c255-c226-4e5d-9258-9becfefb3e64',
  data: {
    jobData: {
      input: [[{ results: { output: 42 } }, { results: { output: 42 } }]],
      node: 'yellow',
      jobID: 'myFlow2:89e87956-28b8-42fe-85d4-627554c8fa08'
    },
    state: 'ready'
  }
}];


const tmp = { dataSource };
// columns


const inititalState = Immutable.from(tmp);

export default handleActions({
  [actions.UPDATE_ROW_DATA_TABLE](state, { type, payload, meta, error }) {
    const data = payload || [];
    return state.merge({ dataSource: data.workers });
  }

}, inititalState);
