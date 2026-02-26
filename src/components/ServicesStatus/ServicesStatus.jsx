import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Typography } from 'antd';
import styled from 'styled-components';

import StatusLamp from './StatusLamp';
import ServiceRow from './ServiceRow';
import servicesStatusMock from './mockData';

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
  transform: ${props =>
    props.$isOpen ? 'translateX(0)' : 'translateX(8px)'};
  pointer-events: ${props => (props.$isOpen ? 'auto' : 'none')};
  transition: opacity 180ms ease, transform 180ms ease;
  transform-origin: right top;
`;

const ServicesStatus = ({ services = servicesStatusMock, label = 'Service metrics' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const isGlobalOk = useMemo(() => {
    return services.every(service => {
      const subServices = service.services || [];
      return service.status && subServices.every(item => item.status);
    });
  }, [services]);

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
        <StatusLamp isOk={isGlobalOk} />
        <Typography.Text strong>{label}</Typography.Text>
      </HeaderRow>

      <ServicesList $isOpen={isOpen}>
        {services.map(service => (
          <ServiceRow key={service.serviceName} service={service} />
        ))}
      </ServicesList>
    </Container>
  );
};

ServicesStatus.propTypes = {
  services: PropTypes.arrayOf(
    PropTypes.shape({
      serviceName: PropTypes.string.isRequired,
      status: PropTypes.bool.isRequired,
      services: PropTypes.arrayOf(
        PropTypes.shape({
          subServiceName: PropTypes.string.isRequired,
          status: PropTypes.bool.isRequired,
          number: PropTypes.number.isRequired,
        })
      ),
    })
  ),
  label: PropTypes.string,
};

export default ServicesStatus;
