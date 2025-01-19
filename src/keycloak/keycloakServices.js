/* eslint-disable import/no-unresolved */
import Keycloak from 'keycloak-js';

const KeycloakConfig = {
  clientId: 'simulator-ui-app',
  realm: 'Hkube',
  url: 'https://cicd.hkube.org/hkube/keycloak/auth',
  // resource: 'simulator-ui-app',
  enableCors: true,
  allowedOrigins: '*',
  clientUId: '23c95f69-17a2-4b9d-9001-39a5cb8f05fb',
  checkLoginIframe: true,
  checkLoginIframeInterval: 30,
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
