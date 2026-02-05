const servicesStatusMock = [
  {
    serviceName: 'auth-service',
    status: 'OK', // OK | DEGRADED | DOWN
    uptime: 99.98,
    latencyMsP95: 120,
    errorRate: 0.2,
    requestsPerSecond: 85,
    services: [
      {
        subServiceName: 'login-api',
        status: 'OK',
        latencyMsP95: 95,
        errorRate: 0.1,
        rps: 40,
        lastCheck: '2026-02-05T08:42:10Z',
      },
      {
        subServiceName: 'token-refresh',
        status: 'DEGRADED',
        latencyMsP95: 280,
        errorRate: 2.8,
        rps: 12,
        lastCheck: '2026-02-05T08:42:10Z',
      },
    ],
  },
  {
    serviceName: 'payments-service',
    status: 'DEGRADED',
    uptime: 99.2,
    latencyMsP95: 420,
    errorRate: 3.5,
    requestsPerSecond: 22,
    services: [
      {
        subServiceName: 'credit-card-processor',
        status: 'OK',
        latencyMsP95: 180,
        errorRate: 0.6,
        rps: 18,
        lastCheck: '2026-02-05T08:42:10Z',
      },
      {
        subServiceName: 'invoice-generator',
        status: 'DOWN',
        latencyMsP95: null,
        errorRate: 100,
        rps: 0,
        lastCheck: '2026-02-05T08:41:02Z',
      },
    ],
  },
  {
    serviceName: 'notifications-service',
    status: 'DOWN',
    uptime: 97.6,
    latencyMsP95: null,
    errorRate: 100,
    requestsPerSecond: 0,
    services: [
      {
        subServiceName: 'email-sender',
        status: 'OK',
        latencyMsP95: 210,
        errorRate: 0.4,
        rps: 55,
        lastCheck: '2026-02-05T08:42:10Z',
      },
      {
        subServiceName: 'sms-gateway',
        status: 'DOWN',
        latencyMsP95: null,
        errorRate: 100,
        rps: 0,
        lastCheck: '2026-02-05T08:40:31Z',
      },
    ],
  },
];

export default servicesStatusMock;
