import actions from 'const/application-actions';

export const setExperimentLoading = ({ to }) => ({
  type: actions.SET_EXPERIMENT_LOADING,
  payload: to,
});

export const toggleExperimentLoading = ({ to }) => ({
  type: actions.TOGGLE_EXPERIMENT_LOADING,
  payload: to,
});

export const addExperiment = (name, description, onSuccess) => ({
  type: actions.REST_REQ_POST,
  payload: {
    url: 'experiment',
    body: { name, description },
    actionType: actions.EXPERIMENT_ADD,
  },
  meta: { onSuccess },
});

export const changeExperiment = experimentId => ({
  type: actions.EXPERIMENT_CHANGE,
  payload: experimentId,
});

export const deleteExperiment = (name, onSuccess) => ({
  type: actions.REST_REQ_DELETE,
  payload: {
    url: `experiment/${name}`,
    actionType: actions.EXPERIMENT_DELETE,
  },
  meta: { onSuccess },
});
