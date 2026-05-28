import AT from 'const/application-actions';

export const fetchPreferences = () => ({
  type: AT.REST_REQ_GET,
  payload: {
    url: '/preferences',
    actionType: AT.PREFERENCES_FETCH,
  },
});

export const savePreferences = body => ({
  type: AT.REST_REQ_PUT,
  payload: {
    url: '/preferences',
    body,
    actionType: AT.PREFERENCES_SAVE,
  },
});

export const resetPreferences = () => ({
  type: AT.REST_REQ_DELETE,
  payload: {
    url: '/preferences',
    actionType: AT.PREFERENCES_RESET,
  },
});
