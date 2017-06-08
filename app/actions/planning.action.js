import actions from '../constants/actions';

export function setMode(to) {
  return {
    type: actions.SET_PROP,
    payload: { prop: 'mode', to }
  };
}

export function setDate(to) {
  return {
    type: actions.SET_PROP,
    payload: { prop: 'date', to }
  };
}

export function setDistrict(to) {
  return {
    type: actions.SET_PROP,
    payload: { prop: 'district', to }
  };
}
