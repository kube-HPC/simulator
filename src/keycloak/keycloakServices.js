/* eslint-disable import/no-unresolved */
import Keycloak from 'keycloak-js';

// eslint-disable-next-line no-unused-vars
const KeycloakConfig = {
  clientId: 'simulator-ui-app',
  realm: 'Hkube',
  // 'ssl-required': 'external',
  url: 'https://cicd.hkube.org/hkube/keycloak/',
  resource: 'simulator-ui-app',
  enableCors: true,
  //  allowedOrigins: '*',
  // 'public-client': true,
  //  'confidential-port': 0,
  clientUId: '7a177d05-5441-4ced-a236-ed51b8525da6',
  // checkLoginIframe: true,
  // checkLoginIframeInterval: 30,
};

// eslint-disable-next-line no-unused-vars
const KeycloakConfig2 = {
  clientId: 'simulator-ui-app-local',
  realm: 'Hkube',
  // 'auth-server-url': 'https://cicd.hkube.org/hkube/keycloak',
  url: 'https://cicd.hkube.org/hkube/keycloak',
  // 'ssl-required': 'external',
  // resource: 'simulator-ui-app-local',
  // 'public-client': true,
  // 'confidential-port': 0,
  clientUId: '4e1e803b-8e46-4418-a87d-6e8846a01edc',
};

// eslint-disable-next-line no-unused-vars
const KeycloakConfig3 = {
  clientId: 'simulator-ui-app-local-v2',
  realm: 'Hkube',
  // 'auth-server-url': 'https://cicd.hkube.org/hkube/keycloak',
  url: 'https://cicd.hkube.org/hkube/keycloak',
  // 'ssl-required': 'external',
  // resource: 'simulator-ui-app-local',
  // 'public-client': true,
  // 'confidential-port': 0,
  clientUId: 'fd61384f-1eb2-401d-a6b7-15310b791622',
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
  console.log(_kc);
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
