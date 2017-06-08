import actions from '../constants/actions';
import topics from '../constants/topics';

export const init = () => ({
  type: actions.SOCKET_INIT,
  payload: {
    topic: topics.SEND_SERVER_TO_TERMINAL,
    actionType: actions.SOCKET_RECIVING_TERMINAL_FROM_SERVER
  }
});

export const emit = ({ data }) => ({
  type: actions.SEND_TERMINAL_INPUT,
  payload: { topic: topics.SEND_TERMINAL_TO_SERVER, data }
});

export const terminalDisconnect = () => ({
  type: actions.SEND_TERMINAL_INPUT,
  payload: { topic: topics.CLOSE_TERMINAL, data: '' }
});
export const terminalConnect = (sshInit) => {
  const sshInitData = sshInit ? sshInit : {type:'bash'}
  // {
  //   sshuser: 'matyz',
  //   sshport: 22,
  //   sshhost: 'localhost',
  //   sshauth: 'password'
    
  // }
  return {
    type: actions.SEND_TERMINAL_INPUT,
    payload: {
      topic: topics.OPEN_TERMINAL, data: sshInitData
    } 
  }
}
export const clearClientTerminal = () => ({
  type: actions.CLEAR_CLIENT_TERMINAL,
  payload: { data: '' }
});
export const openTerminalClient = () => ({
  type: actions.OPEN_TERMINAL_CLIENT,
  payload: { data: '', isClose: false }
});
export const closeTerminalClient = () => ({
  type: actions.CLOSE_TERMINAL_CLIENT,
  payload: { data: '', isClose: true }
});
