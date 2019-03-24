import actions from '../constants/actions';

const _getReadme = (type,name,actionType) => ({
  type: actions.REST_REQ,
  payload: {
    url: `/readme/${type}/${name}`,
    actionType
  }
});

const _postReadme = (type,name,actionType,readme) => ({
  type: actions.REST_REQ_POST,
  payload: {
    url: `readme/${type}/${name}`,
    actionType,
    body: { readme,name },
  }
});


export const  getPipelineReadme = (name)=> _getReadme('pipelines',name,actions.GET_PIPELINE_README)
export const  getAlgorithmReadme = (name)=> _getReadme('algorithms',name,actions.GET_ALGORITHM_README)
export const  postPipelineReadme = (name,readme)=> _postReadme('pipelines',name,actions.POST_PIPELINE_README,readme)
export const  postAlgorithmReadme = (name,readme)=> _postReadme('algorithms',name,actions.POST_ALGORITHM_README,readme)