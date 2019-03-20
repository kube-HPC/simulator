import actions from '../constants/actions';

export const clearError = () => ({
  type: actions.ERROR,
  payload: {
    message: undefined
  }
});
