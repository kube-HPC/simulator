import actions from 'const/application-actions';

export const experimentChange = value => ({
  type: actions.EXPERIMENT_CHANGE,
  value,
});

export const triggerLoading = () => ({
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

export const deleteExperiment = name => ({
  type: actions.REST_REQ_DELETE,
  payload: {
    url: `experiment/${name}`,
    actionType: actions.EXPERIMENT_DELETE,
  },
});
