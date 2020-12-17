import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import { schema } from 'hooks/useExperiments';
import actions from 'const/application-actions';

const initial = Immutable.from({
  experimentName: schema.default,
});
// holds the experiment name *sent from the server*
// used to validate the right experiment is displayed
export const meta = handleActions(
  {
    [actions.SOCKET_GET_DATA](currState, { payload: { meta: nextMeta } }) {
      return Immutable.merge(currState, { ...nextMeta });
    },
  },
  initial
);
