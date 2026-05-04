import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Typography } from 'antd';
import styled from 'styled-components';

import StatusLamp from './StatusLamp';
import ServiceRow from './ServiceRow';

import servicesStatusMock from './mockData2';

const isStatusOk = status => status === true || status === 'OK';

const getServicesList = servicesPayload => {
  if (Array.isArray(servicesPayload)) return servicesPayload;
  if (Array.isArray(servicesPayload?.data?.healthMonitoring?.services)) {
    return servicesPayload.data.healthMonitoring.services;
  }
  if (Array.isArray(servicesPayload?.healthMonitoring?.services)) {
    return servicesPayload.healthMonitoring.services;
  }
  return [];
};

const getOverallHealthStatus = (servicesPayload, normalizedServices) => {
  const overallStatus =
    servicesPayload?.data?.healthMonitoring?.overallHealthStatus ??
    servicesPayload?.healthMonitoring?.overallHealthStatus;

  if (overallStatus !== undefined && overallStatus !== null) {
    return isStatusOk(overallStatus);
  }

  return normalizedServices.every(service => {
    const subServices = service.services || [];
    return (
      isStatusOk(service.status) &&
      subServices.every(item => isStatusOk(item.status))
    );
  });
};

const Container = styled.div`
  position: relative;
  display: inline-flex;
  flex-direction: row-reverse;
  gap: 8px;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.12);
`;

const HeaderRow = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 6px 8px;
  border-radius: 6px;
  cursor: pointer;
  user-select: none;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
`;

const ServicesList = styled.div`
  width: max-content;
  position: ${props => (props.$isOpen ? 'static' : 'absolute')};
  right: calc(100% + 12px);
  top: 0;
  display: flex;
  flex-direction: row;

  align-items: flex-start;
  gap: 8px;
  opacity: ${props => (props.$isOpen ? 1 : 0)};
  transform: ${props => (props.$isOpen ? 'translateX(0)' : 'translateX(8px)')};
  pointer-events: ${props => (props.$isOpen ? 'auto' : 'none')};
  transition:
    opacity 180ms ease,
    transform 180ms ease;
  transform-origin: right top;
`;

const ServicesStatus = ({
  services = servicesStatusMock,
  label = 'Service metrics',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const normalizedServices = useMemo(
    () => getServicesList(services),
    [services]
  );

  const overallHealthStatus = useMemo(
    () => getOverallHealthStatus(services, normalizedServices),
    [services, normalizedServices]
  );

  const handleToggle = () => setIsOpen(prev => !prev);

  return (
    <Container>
      <HeaderRow
        role="button"
        tabIndex={0}
        onClick={handleToggle}
        onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') handleToggle();
        }}>
        <StatusLamp isOk={overallHealthStatus} />
        <Typography.Text strong>{label}</Typography.Text>
      </HeaderRow>

      <ServicesList $isOpen={isOpen}>
        {normalizedServices.map(service => (
          <ServiceRow key={service.serviceName} service={service} />
        ))}
      </ServicesList>
    </Container>
  );
};

ServicesStatus.propTypes = {
  services: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        serviceName: PropTypes.string.isRequired,
        status: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
          .isRequired,
        services: PropTypes.arrayOf(
          PropTypes.shape({
            subServiceName: PropTypes.string,
            status: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
              .isRequired,
            number: PropTypes.number,
          })
        ),
      })
    ),
    PropTypes.shape({
      data: PropTypes.shape({
        healthMonitoring: PropTypes.shape({
          services: PropTypes.arrayOf(
            PropTypes.shape({
              serviceName: PropTypes.string.isRequired,
              status: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
                .isRequired,
            })
          ),
          overallHealthStatus: PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.string,
          ]),
        }),
      }),
    }),
  ]),
  label: PropTypes.string,
};

export default ServicesStatus;
