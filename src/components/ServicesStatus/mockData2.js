const servicesStatusMock = {
  data: {
    healthMonitoring: {
      services: [
        {
          status: true,
          serviceName: 'algorithm-operator',
        },
        {
          status: false,
          serviceName: 'api-server',
        },
        {
          status: true,
          serviceName: 'artifacts-registry',
        },
        {
          status: true,
          serviceName: 'datasources-service',
        },
        {
          status: true,
          serviceName: 'datasources-service',
        },
        {
          status: true,
          serviceName: 'datasources-service',
        },
        {
          status: null,
          serviceName: 'datasources-service',
        },
        {
          status: true,
          serviceName: 'datasources-service',
        },
      ],
      overallHealthStatus: true,
    },
  },
};

export default servicesStatusMock;
