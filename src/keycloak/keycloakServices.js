/* eslint-disable import/no-unresolved */
import Keycloak from 'keycloak-js';

const KeycloakConfig = {
  clientId: 'simulator-ui-app',
  realm: 'Hkube',
  'ssl-required': 'external',
  url: 'https://cicd.hkube.org/hkube/keycloak',
  resource: 'simulator-ui-app',
  enableCors: true,
  allowedOrigins: '*',
  'public-client': true,
  'confidential-port': 0,
  clientUId: '7a177d05-5441-4ced-a236-ed51b8525da6',
  checkLoginIframe: true,
  checkLoginIframeInterval: 30,
};

/*
  "realm": "Hkube",
  "auth-server-url": "https://cicd.hkube.org/hkube/keycloak",
  "ssl-required": "external",
  "resource": "simulator-ui-app",
  "public-client": true,
  "confidential-port": 0
  */

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
