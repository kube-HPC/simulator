// src/keycloak.js
import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'https://dev.hkube.org/hkube/keycloak',
  realm: 'master',
  clientId: 'api-server',
  resource: 'master',
  enableCors: true,
  client_secret: '5mAAqUXMsFWAGCnhvhrGPVVYuZLWy7Am',
});
// clientUId
export default keycloak;
