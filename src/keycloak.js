// src/keycloak.js
/* import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'https://dev.hkube.org/hkube/keycloak',
  realm: 'master',
  clientId: 'api-server',
  resource: 'master',
  enableCors: true,
  client_secret: '5mAAqUXMsFWAGCnhvhrGPVVYuZLWy7Am',
});
// clientUId 
export default keycloak; */

import Keycloak from 'keycloak-js';

const KeycloakConfig = {
  clientId: 'api-server', // config.general('keycloak,authClientId', ','),
  realm: 'browser', // config.general('keycloak,authRealm', ','),
  url: 'https://cicd.hkube.org/hkube/keycloak/auth', // config.general('keycloak,authUrl', ','),
  resource: 'browser', // config.general('keycloak,authResource', ','),
  // enableCors: false, // config.general('keycloak,authEnableCORS', ','),
  //  clientUId: '5mAAqUXMsFWAGCnhvhrGPVVYuZLWy7Am', // config.general('keycloak,authClientUID', ',')
  //  client_secret: '5mAAqUXMsFWAGCnhvhrGPVVYuZLWy7Am',
};

const _kc = new Keycloak(KeycloakConfig);

/**
 * Initializes Keycloak instance and calls the provided callback function if successfully authenticated.
 *
 * @param onAuthenticatedCallback
 */
const initKeycloak = (appToRender, renderError, username, password) => {
  _kc
    .init({
      onLoad: 'login-required',
      username,
      password,
    })
    .then(authenticated => {
      if (!authenticated) {
        // eslint-disable-next-line no-console
        console.log('user is not authenticated..!');
      }

      appToRender();
    })
    .catch(authenticatedError => {
      console.error(authenticatedError);

      // return renderError(authenticatedError);
    });
};

const doLogin = _kc.login;
const doLogout = _kc.logout;

const getToken = () => _kc.token;

const isLoggedIn = () => !!_kc.token;

const updateToken = async (minSecValidity, successCallback) =>
  _kc.updateToken(minSecValidity).then(successCallback).catch(doLogin);

const getUsername = () => _kc.tokenParsed?.preferred_username;

const hasRole = roles => roles.some(role => _kc.hasRealmRole(role));

const isTokenExpired = minSecValidity => _kc.isTokenExpired(minSecValidity);

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
};

export default KeycloakServices;
