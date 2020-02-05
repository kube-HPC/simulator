import { actionType } from 'const';

export const startBoard = ({ pipelineName, nodeName }) => ({
  type: actionType.REST_REQ_POST,
  payload: {
    url: 'boards/tensors',
    body: { pipelineName, nodeName },
    actionType: actionType.TENSORFLOW_START,
  },
});
