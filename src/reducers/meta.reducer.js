import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import { experimentsSchema } from 'config';
import actions from 'const/application-actions';

const initial = Immutable.from({
  experimentName: experimentsSchema.default,
});

export const meta = handleActions(
  {
    // eslint-disable-next-line
    [actions.SOCKET_GET_DATA](currState, { payload: { meta } }) {
      return Immutable.merge(currState, { ...meta });
    },
  },
  initial
);
