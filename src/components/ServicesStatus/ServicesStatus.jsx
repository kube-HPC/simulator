import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Typography } from 'antd';
import styled from 'styled-components';

import StatusLamp from './StatusLamp';
import ServiceRow from './ServiceRow';
import ServicesVisibilityControl from './ServicesVisibilityControl';

// import servicesStatusMock from './mockData2';

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

const WrapperServicesStatus = styled.div`
  overflow: hidden;
  display: flex;
  justify-content: flex-end;
  width: ${props => `${props.$widthPercent}px`};
  min-width: 0;
  height: 36px;
`;

const Container = styled.div`
  position: relative;
  display: inline-flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 8px;
  min-width: 0;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.12);
`;

const ControlsRow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
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
  width: ${props => (props.$isOpen ? 'auto' : 'max-content')};
  position: ${props => (props.$isOpen ? 'static' : 'absolute')};
  left: calc(100% + 12px);
  top: 0;
  display: flex;
  flex-direction: row;
  flex: ${props => (props.$isOpen ? 1 : 'unset')};
  min-width: ${props => (props.$isOpen ? 0 : 'unset')};
  overflow: ${props => (props.$isOpen ? 'hidden' : 'visible')};

  align-items: flex-start;
  gap: 8px;
  opacity: ${props => (props.$isOpen ? 1 : 0)};
  transform: ${props => (props.$isOpen ? 'translateX(0)' : 'translateX(-8px)')};
  pointer-events: ${props => (props.$isOpen ? 'auto' : 'none')};
  transition:
    opacity 180ms ease,
    transform 180ms ease;
  transform-origin: left top;
`;

const ServicesStatus = ({
  services = {}, // servicesStatusMock,
  label = 'Service metrics',
  widthPercent = 100,
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
    <WrapperServicesStatus $widthPercent={widthPercent}>
      <Container>
        <ServicesVisibilityControl services={normalizedServices}>
          {({ visibleServices, control }) => (
            <>
              <ControlsRow>
                <HeaderRow
                  role="button"
                  tabIndex={0}
                  onClick={handleToggle}
                  onKeyDown={event => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      handleToggle();
                    }
                  }}>
                  <StatusLamp status={overallHealthStatus} />
                  <Typography.Text strong style={{ whiteSpace: 'nowrap' }}>
                    <Tooltip
                      title={`click to ${isOpen ? 'collapse' : 'expand'}`}
                      placement="top">
                      {label}
                    </Tooltip>
                  </Typography.Text>
                </HeaderRow>

                {control}
              </ControlsRow>

              <ServicesList $isOpen={isOpen}>
                {visibleServices.map(service => (
                  <ServiceRow key={service.serviceName} service={service} />
                ))}
              </ServicesList>
            </>
          )}
        </ServicesVisibilityControl>
      </Container>
    </WrapperServicesStatus>
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
  widthPercent: PropTypes.number,
};

export default ServicesStatus;
