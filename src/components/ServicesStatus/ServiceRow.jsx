import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Popover, Typography } from 'antd';
import styled from 'styled-components';

import StatusLamp from './StatusLamp';
import SubServicesPopover from './SubServicesPopover';

const isStatusOk = status => status === true || status === 'OK';

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
  const subServices = useMemo(() => service.services || [], [service.services]);
  const hasSubServices = subServices.length > 0;

  const isOk = useMemo(
    () =>
      isStatusOk(service.status) &&
      subServices.every(item => isStatusOk(item.status)),
    [service.status, subServices]
  );

  const content = (
    <Row>
      <StatusLamp isOk={isOk} />
      <Typography.Text>{service.serviceName}</Typography.Text>
    </Row>
  );

  if (!hasSubServices) {
    return content;
  }

  return (
    <Popover
      content={<SubServicesPopover subServices={subServices} />}
      placement="bottom"
      trigger="hover">
      {content}
    </Popover>
  );
};

ServiceRow.propTypes = {
  service: PropTypes.shape({
    serviceName: PropTypes.string.isRequired,
    status: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
    services: PropTypes.arrayOf(
      PropTypes.shape({
        subServiceName: PropTypes.string,
        status: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
          .isRequired,
        number: PropTypes.number,
      })
    ),
  }).isRequired,
};

export default ServiceRow;
