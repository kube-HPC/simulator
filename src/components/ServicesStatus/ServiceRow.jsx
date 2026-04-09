import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Popover, Typography } from 'antd';
import styled from 'styled-components';

import StatusLamp from './StatusLamp';
import SubServicesPopover from './SubServicesPopover';

const Row = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 6px 8px;
  border-radius: 6px;
  cursor: default;
  user-select: none;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
`;

const ServiceRow = ({ service }) => {
  const isOk = useMemo(() => {
    const subServices = service.services || [];
    return Boolean(service.status) && subServices.every(item => item.status);
  }, [service]);

  return (
    <Popover
      content={<SubServicesPopover subServices={service.services} />}
      placement="bottom"
      trigger="hover">
      <Row>
        <StatusLamp isOk={isOk} />
        <Typography.Text>{service.serviceName}</Typography.Text>
      </Row>
    </Popover>
  );
};

ServiceRow.propTypes = {
  service: PropTypes.shape({
    serviceName: PropTypes.string.isRequired,
    status: PropTypes.bool.isRequired,
    services: PropTypes.arrayOf(
      PropTypes.shape({
        subServiceName: PropTypes.string.isRequired,
        status: PropTypes.bool.isRequired,
        number: PropTypes.number.isRequired,
      })
    ),
  }).isRequired,
};

export default ServiceRow;
