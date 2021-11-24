import actions from 'const/application-actions';

export const deleteDevenv = name => ({
  type: actions.REST_REQ_DELETE,
  payload: {
    url: `devenv/${name}`,
    actionType: actions.DEVENV_DELETE,
  },
});

export const stopDevenv = name => ({
  type: actions.REST_REQ_GET,
  payload: {
    url: `devenv/stop/${name}`,
    actionType: actions.DEVENV_STOP,
  },
});

export const startDevenv = name => ({
  type: actions.REST_REQ_GET,
  payload: {
    url: `devenv/start/${name}`,
    actionType: actions.DEVENV_START,
  },
});

export const createDevenv = ({ name, type }) => ({
  type: actions.REST_REQ_POST,
  payload: {
    url: 'devenv',
    actionType: actions.DEVENV_CREATE,
    body: {
      name,
      type,
    },
  },
});
