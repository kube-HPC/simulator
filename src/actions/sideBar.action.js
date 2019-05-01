import actions from '../constants/actions';

export const sideBarOpen = data => {
  return {
    type: actions.OPEN_SIDEBAR,
    payload: { data, visible: true }
  };
};

export const sideBarClose = () => ({
  type: actions.CLOSE_SIDEBAR,
  payload: { data: null, visible: false }
});
