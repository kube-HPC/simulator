import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import { actionType } from 'const';

const initial = Immutable.from({
  isVisible: false,
  content: { title: null, body: null, footer: null },
});

export const drawer = handleActions(
  {
    [actionType.DRAWER_TOGGLE](state) {
      return state.merge({ isVisible: !state.isVisible });
    },
    [actionType.DRAWER_OPEN](state, { content }) {
      return state.merge({ isVisible: true, content });
    },
  },
  initial,
);
