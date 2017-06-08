import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import actions from '../constants/actions';


// --------only for testing ------ //
let tmp=[];

for (let j=1; j<4; j++){
  let inner_tmp = {layer: `layer-${j}`, charts: []};
  for (let i=1; i<=10; i++){
    let a = (Math.random() * i).toString(10);
    let b = (Math.random() * i).toString(10);
    let c = (Math.random() * i).toString(10);
    let d = (Math.random() * i).toString(10);
    inner_tmp.charts = inner_tmp.charts.concat({ type: 'Pie', title: `hello-${j}-${i}`, labels: ['a', 'b', 'c', 'e'], data: [a, b, c, d] });
  }
  tmp = tmp.concat(inner_tmp);
}
// --------only for testing ------ //

const inititalState = tmp; // replace with a real object later

export default handleActions({
  [actions.ADD_LAYER](state, {type, payload, meta, error}){
    return state.concat({layer: payload.layer, charts: payload.charts});
  },

  [actions.REMOVE_LAYER](state, {type, payload, meta, error}){
    // add correction in case of removing the current collection
    return state.filter(collection => collection.layer !== payload.layerToRemove);
  },

  [actions.SET_CHARTS](state, {type, payload, meta, error}){
    return state.map(item =>
      (item.layer === payload.layer) ? Object.assign({}, payload) : item
    );
  }

}, inititalState);
