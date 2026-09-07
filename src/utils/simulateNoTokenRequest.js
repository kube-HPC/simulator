/**
 * TODO(sim-delete): DELETE THIS ENTIRE FILE. Part of the "request without token" experiment.
 * TEMP(sim): reproduction of the "request without a token -> kicked to login" problem.
 *
 * Fires a request to the algorithms list endpoint (`store/algorithms`) through the
 * real axios `client`, but WITHOUT attaching a Keycloak token (`skipAuth: true`).
 *
 * The server answers `401`, the `client` response interceptor tries to refresh the
 * token, and when the refresh fails the user is thrown to login (`doLogout` / `doLogin`).
 *
 * Trigger from the browser console:
 *    window.__simulateNoToken()                 // let the natural refresh flow run
 *    window.__simulateNoToken({ failRefresh: true })  // force the refresh to fail (deterministic kick to login)
 *
 * This whole file (and the `skipAuth` hook in client.js) is temporary and meant to be removed.
 */
import client from '../client';
import KeycloakServices from '../keycloak/keycloakServices';

export const simulateNoTokenAlgorithmsRequest = async ({
  failRefresh = false,
} = {}) => {
  // eslint-disable-next-line no-console
  console.warn(
    '[SIM] Firing GET store/algorithms WITHOUT a token (skipAuth: true)...'
  );

  let restoreRefresh;
  if (failRefresh) {
    // Simulate an expired / missing session: force the token refresh to fail,
    // so the 401 handler in client.js reaches doLogout() -> kicked to login.
    const originalUpdateToken = KeycloakServices.updateToken;
    KeycloakServices.updateToken = () => {
      // eslint-disable-next-line no-console
      console.warn('[SIM] Forced token refresh failure');
      return Promise.reject(new Error('SIM: forced token refresh failure'));
    };
    restoreRefresh = () => {
      KeycloakServices.updateToken = originalUpdateToken;
    };
  }

  try {
    const res = await client.get('store/algorithms', { skipAuth: true });
    // eslint-disable-next-line no-console
    console.log('[SIM] Request unexpectedly succeeded:', res?.data);
    return res?.data;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(
      '[SIM] Request failed as expected. status =',
      err?.response?.status,
      '| message =',
      err?.message
    );
    return null;
  } finally {
    restoreRefresh?.();
  }
};

if (typeof window !== 'undefined') {
  window.__simulateNoToken = simulateNoTokenAlgorithmsRequest;
}

export default simulateNoTokenAlgorithmsRequest;
