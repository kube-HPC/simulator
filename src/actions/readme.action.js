import actions from 'const/application-actions';

const _getReadme = (type, name, actionType) => ({
  type: actions.REST_REQ,
  payload: {
    url: `readme/${type}/${name}`,
    actionType,
  },
});

const _postReadme = (type, name, actionType, data) => {
  const formData = new FormData();
  formData.append('README.md', new File([new Blob([data])], 'README.md'));

  return {
    type: actions.REST_REQ_POST_FORM,
    payload: {
      url: `readme/${type}/${name}`,
      actionType,
      formData,
    },
  };
};

export const getPipelineReadme = name => _getReadme('pipelines', name, actions.README_GET_PIPELINE);
export const postPipelineReadme = (name, readme) =>
  _postReadme('pipelines', name, actions.README_POST_PIPELINE, readme);
