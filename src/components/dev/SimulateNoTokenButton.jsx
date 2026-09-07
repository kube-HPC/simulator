import React from 'react';
import { Button } from 'antd';
import { simulateNoTokenAlgorithmsRequest } from '../../utils/simulateNoTokenRequest';

// TODO(sim-delete): DELETE THIS ENTIRE FILE. Part of the "request without token" experiment.

/**
 * TEMP(sim): floating button to reproduce the "no token -> kicked to login" problem.
 * Remove together with utils/simulateNoTokenRequest.js and the `skipAuth` hook in client.js.
 */
const SimulateNoTokenButton = () => (
  <div
    style={{
      position: 'fixed',
      bottom: 16,
      right: 16,
      zIndex: 99999,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    }}>
    <Button
      danger
      type="primary"
      onClick={() => simulateNoTokenAlgorithmsRequest({ failRefresh: false })}>
      SIM: algorithms w/o token
    </Button>
    <Button
      danger
      onClick={() => simulateNoTokenAlgorithmsRequest({ failRefresh: true })}>
      SIM: force refresh fail
    </Button>
  </div>
);

export default SimulateNoTokenButton;
