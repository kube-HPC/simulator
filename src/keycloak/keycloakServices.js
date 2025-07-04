/* eslint-disable import/no-unresolved */
import Keycloak from 'keycloak-js';

const KeycloakConfig = {
  clientId: 'simulator-ui-app',
  realm: 'Hkube',

  url:
    process.env.REACT_APP_KEYCLOAK_URL ||
    `${window.location.origin}/hkube/keycloak/`,
  resource: 'simulator-ui-app',
  enableCors: true,
  clientUId: '7a177d05-5441-4ced-a236-ed51b8525da6',
};

const _kc = new Keycloak(KeycloakConfig);

const initKeycloak = (appToRender, renderError) => {
  _kc
    .init({
      onLoad: 'login-required',
    })
    .then(authenticated => {
      if (!authenticated) {
        console.log('user is not authenticated..!');
      }
      appToRender();
    })
    .catch(authenticatedError => {
      console.error(authenticatedError);
      return renderError(authenticatedError);
    });
};

const doLogin = _kc.login.bind(_kc);
const doLogout = _kc.logout.bind(_kc);

const getToken = () => _kc.token;

const isLoggedIn = () => !!_kc.token;

const updateToken = (minSecValidity, successCallback) =>
  _kc.updateToken(minSecValidity).then(successCallback).catch(doLogin);

const getUsername = () => _kc.tokenParsed?.preferred_username;

const hasRole = roles => roles.some(role => _kc.hasRealmRole(role));

const isTokenExpired = minSecValidity => _kc.isTokenExpired(minSecValidity);

const startTokenRefreshInterval = () => {
  const tokenRefreshInterval = setInterval(() => {
    console.log('setInterval isLoggedIn:', isLoggedIn);
    if (isLoggedIn) {
      updateToken(30, () => {
        console.log('Token refreshed successfully!');
      }).catch(() => {
        console.log(
          'Failed to refresh the token, user may need to log in again'
        );
      });
    } else {
      console.log('no keycloak in action');
    }
  }, 60000);

  // Cleanup on unmount
  return tokenRefreshInterval;
};

const getUserRoles = roleToCheck => {
  // action can be string "edit","view","delete","execute"

  const parsedToken = _kc.tokenParsed;
  if (!parsedToken) return false;

  const roles = parsedToken.resource_access?.['api-server']?.roles || [];

  return roles.includes(roleToCheck);
};

const KeycloakServices = {
  initKeycloak,
  doLogin,
  doLogout,
  isLoggedIn,
  getToken,
  updateToken,
  isTokenExpired,
  getUsername,
  hasRole,
  startTokenRefreshInterval,
  getUserRoles,
};

export default KeycloakServices;
