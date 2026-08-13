import AT from 'const/application-actions';
import { LOCAL_STORAGE_KEYS } from 'const';

const getLocalPrefs = () => {
  try {
    return (
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.PREFERENCES)) || {}
    );
  } catch {
    return {};
  }
};

export const fetchPreferences = () => (dispatch, getState) => {
  if (getState().connection.keycloakEnable !== true) {
    dispatch({
      type: `${AT.PREFERENCES_FETCH}_SUCCESS`,
      payload: getLocalPrefs(),
    });
    return;
  }
  dispatch({
    type: AT.REST_REQ_GET,
    payload: { url: '/preferences', actionType: AT.PREFERENCES_FETCH },
  });
};

export const savePreferences = body => (dispatch, getState) => {
  if (getState().connection.keycloakEnable !== true) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.PREFERENCES, JSON.stringify(body));
    dispatch({ type: `${AT.PREFERENCES_SAVE}_SUCCESS`, payload: body });
    return;
  }
  dispatch({
    type: AT.REST_REQ_PUT,
    payload: { url: '/preferences', body, actionType: AT.PREFERENCES_SAVE },
  });
};

export const resetPreferences = () => (dispatch, getState) => {
  if (getState().connection.keycloakEnable !== true) {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.PREFERENCES);
    dispatch({ type: `${AT.PREFERENCES_RESET}_SUCCESS`, payload: {} });
    return;
  }
  dispatch({
    type: AT.REST_REQ_DELETE,
    payload: { url: '/preferences', actionType: AT.PREFERENCES_RESET },
  });
};
