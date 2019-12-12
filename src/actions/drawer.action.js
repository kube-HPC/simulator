import { actionType } from 'const';

export const toggle = () => ({
  type: actionType.DRAWER_TOGGLE,
});

export const open = content => ({
  type: actionType.DRAWER_OPEN,
  content,
});
