import actions from '../constants/actions';

export const openModal = (modalType, data, commands, sshInitData) => {
  commands.raw = commands.raw || null;
  const path = commands.path ? `cd ${commands.path}` : '';
  const execution = commands.execution ? `./${commands.execution}` : '';
  const args = commands.args ? `${commands.args}` : '';

  const command = commands.raw ? commands.raw : `${path};${execution} ${args}`;
  return {
    type: actions.OPEN_MODAL,
    payload: { modalType, data, visible: true, command, sshInitData }
  };
};


export const closeModal = () => ({
  type: actions.CLOSE_MODAL,
  payload: { modalType: null, visible: false, data: null, command: null, sshInitData: null }
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
