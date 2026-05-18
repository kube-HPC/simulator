import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from 'antd';
import styled from 'styled-components';

import StatusLamp from './StatusLamp';

const isStatusOk = status => status === true || status === 'OK';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 220px;
  gap: 6px;
`;

const HeaderText = styled(Typography.Text)`
  display: block;
`;

const SubRow = styled.div`
  display: flex;
  align-items: center;
`;

const EmptyText = styled(Typography.Text)`
  color: rgba(0, 0, 0, 0.45);
`;

const SubServicesPopover = ({
  subServices = [],
  serviceName,
  serviceStatus,
}) => {
  if (!subServices.length) {
    return (
      <Wrapper>
        <HeaderText strong ellipsis>
          {serviceName}
        </HeaderText>
        {serviceStatus !== undefined ? (
          <SubRow>
            <StatusLamp isOk={isStatusOk(serviceStatus)} size={8} />
            <Typography.Text>
              Status: {isStatusOk(serviceStatus) ? 'up' : 'down'}
            </Typography.Text>
          </SubRow>
        ) : (
          <EmptyText>No sub services</EmptyText>
        )}
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <HeaderText strong ellipsis>
        {serviceName}
      </HeaderText>
      {subServices.map((item, index) => (
        <SubRow key={item.subServiceName || item.serviceName || index}>
          <StatusLamp isOk={isStatusOk(item.status)} size={8} />
          <Typography.Text>
            {String(item.status)},{' '}
            {item.subServiceName || item.serviceName || 'unknown'} :{' '}
            {item.number ?? '-'}
          </Typography.Text>
        </SubRow>
      ))}
    </Wrapper>
  );
};

SubServicesPopover.propTypes = {
  serviceName: PropTypes.string.isRequired,
  serviceStatus: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  subServices: PropTypes.arrayOf(
    PropTypes.shape({
      subServiceName: PropTypes.string,
      status: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
        .isRequired,
      number: PropTypes.number,
    })
  ),
};

export default SubServicesPopover;
