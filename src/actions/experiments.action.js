import actions from 'const/application-actions';

export const triggerExperimentLoading = () => ({
  type: actions.EXPERIMENT_TRIGGER_LOADING,
});

export const addExperiment = ({ name, description }) => ({
  type: actions.REST_REQ_POST,
  payload: {
    url: 'experiment',
    body: { name, description },
    actionType: actions.EXPERIMENT_ADD,
  },
});

export const changeExperiment = experimentId => ({
  type: actions.EXPERIMENT_CHANGE,
  payload: experimentId,
});

export const deleteExperiment = name => ({
  type: actions.REST_REQ_DELETE,
  payload: {
    url: `experiment/${name}`,
    actionType: actions.EXPERIMENT_DELETE,
  },
});
