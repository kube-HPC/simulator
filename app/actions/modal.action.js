import actions from '../constants/actions';

export const openModal = (data, commands,sshInitData) => {
  commands.raw = commands.raw || null;
  let path = commands.path ? `cd ${commands.path}` : '';
  let execution = commands.execution ? `./${commands.execution}` : '';
  let args = commands.args ? `${commands.args}` : '';

  let command = commands.raw?commands.raw:`${path};${execution} ${args}`;
  return {
    type: actions.OPEN_MODAL,
    payload: { data, visible: true, command,sshInitData }
  };
}

export const closeModal = () => ({
  type: actions.CLOSE_MODAL,
  payload: { visible: false, data: null, command: null,sshInitData:null }
});

// WEBPACK FOOTER //
// ./actions/modal.action.js

// WEBPACK FOOTER //
// ./actions/modal.action.js

// WEBPACK FOOTER //
// ./actions/modal.action.js

// WEBPACK FOOTER //
// ./actions/modal.action.js

// WEBPACK FOOTER //
// ./actions/modal.action.js

// WEBPACK FOOTER //
// ./actions/modal.action.js
