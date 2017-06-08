import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import actions from '../constants/actions';
import topics  from '../constants/topics';




const initState = {
 
  data: null,
  isClose:true
  // columns
};


const inititalState = Immutable.from(initState);

export default handleActions({
  [actions.SOCKET_RECIVING_TERMINAL_FROM_SERVER](state, {type, payload, meta, error}) {
    return Immutable({data:payload.data,isClose:state.isClose});
  },
[actions.OPEN_TERMINAL_CLIENT](state, {type, payload, meta, error}) {
    return Immutable(payload);
    
  },
  [actions.CLOSE_TERMINAL_CLIENT](state, {type, payload, meta, error}) {
    return Immutable(payload);
    
  },
  [actions.CLEAR_CLIENT_TERMINAL](state, {type, payload, meta, error}) {
    return Immutable(payload);
  }
}, inititalState);

