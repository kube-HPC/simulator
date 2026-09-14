import axios from 'axios';
import KeycloakServices from 'keycloak/keycloakServices';
import { events } from 'utils';
import { forceRefetchAll } from 'graphql/usePolling';

const client = axios.create();

client.interceptors.request.use(
  config => {
    // TODO(sim-delete): remove this skipAuth block. Part of the "request without token" experiment.
    // TEMP(sim): allow firing a request without a token to reproduce the
    // "no token -> kicked to login" problem. Remove together with the simulation utility.
    if (config.skipAuth) {
      return config;
    }
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
  response => {
    // run forceRefetchAll after a successful POST/PUT/DELETE request
    const method = response.config.method?.toUpperCase();
    if (['POST', 'PUT', 'DELETE'].includes(method || '')) {
      setTimeout(() => forceRefetchAll(method), 0);
    }

    return response;
  },
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 403) {
      // eslint-disable-next-line no-console
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
        events.emit(
          'global_alert_msg',
          'The request failed due to authorization problems. Please try again or re-login.',
          'error'
        );
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default client;
