import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Divider, Popover, Typography } from 'antd';
import styled from 'styled-components';

import StatusLamp from './StatusLamp';
import SubServicesPopover from './SubServicesPopover';

const isStatusOk = status => status === true || status === 'OK';
const SERVICE_ROW_MAX_WIDTH = 180;

const Row = styled.div`
  display: inline-flex;
  align-items: center;

  padding-top: 6px;
  padding-bottom: 6px;
  padding-left: 0px;
  padding-right: 0px;

  border-radius: 6px;
  cursor: default;
  user-select: none;
  max-width: ${SERVICE_ROW_MAX_WIDTH}px;
  min-width: 0;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
`;

const ServiceName = styled(Typography.Text)`
  display: block;
  min-width: 0;
`;

const ServiceRow = ({ service }) => {
  const subServices = useMemo(() => service.services || [], [service.services]);

  const isOk = useMemo(
    () =>
      isStatusOk(service.status) &&
      subServices.every(item => isStatusOk(item.status)),
    [service.status, subServices]
  );

  const content = (
    <Row style={{ justifyContent: 'space-between' }}>
      <StatusLamp isOk={isOk} />
      <ServiceName ellipsis style={{ maxWidth: SERVICE_ROW_MAX_WIDTH - 34 }}>
        {service.serviceName}
      </ServiceName>
      <Divider
        orientation="vertical"
        size="large"
        vertical
        style={{
          marginLeft: '10px',
          marginRight: '4px',
        }}
      />
    </Row>
  );

  return (
    <Popover
      content={
        <SubServicesPopover
          serviceName={service.serviceName}
          subServices={subServices}
          serviceStatus={service.status}
        />
      }
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
