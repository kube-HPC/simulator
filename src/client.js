import axios from 'axios';
import KeycloakServices from 'keycloak/keycloakServices';

const client = axios.create();

client.interceptors.request.use(
  config => {
    const token = KeycloakServices.getToken();
    if (token) {
      return {
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        },
      };
    }
    return config;
  },
  error => Promise.reject(error)
);

export default client;
