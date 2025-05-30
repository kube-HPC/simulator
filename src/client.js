import axios from 'axios';
import KeycloakServices from 'keycloak/keycloakServices';
import { events } from 'utils';

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

client.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // 403 Forbidden
    if (error.response?.status === 403) {
      console.log('403 Forbidden');
      events.emit(
        'global_alert_msg',
        'You are not authorized to perform this action.'
      );
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await KeycloakServices.updateToken(30, () => {
          const newToken = KeycloakServices.getToken();
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        });

        return client(originalRequest);
      } catch (refreshError) {
        console.error('Failed to refresh token', refreshError);
        KeycloakServices.doLogout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default client;
