import actions from '../constants/actions';

export const init = () => ({
    type: actions.REST_REQ,
    payload: {
        actionType: actions.GET_CONFIG,
        url: 'config'
    }
});
