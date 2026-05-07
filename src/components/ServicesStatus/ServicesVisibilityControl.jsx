import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { SettingOutlined } from '@ant-design/icons';
import { Button, Checkbox, Dropdown } from 'antd';
import styled from 'styled-components';
import StatusLamp from './StatusLamp';

const VISIBILITY_STORAGE_KEY = 'servicesMatrixVisibility';
const DEFAULT_VISIBLE_SERVICES = [
  'api-server',
  'task-executor',
  'algorithm-operator',
  'redis',
];
const isStatusOk = status => status === true || status === 'OK';

const isDefaultVisibleService = serviceName =>
  DEFAULT_VISIBLE_SERVICES.includes(serviceName);

const hasOwn = (obj, key) =>
  Object.prototype.hasOwnProperty.call(obj || {}, key);

const readVisibilityState = () => {
  try {
    const rawValue = window.localStorage.getItem(VISIBILITY_STORAGE_KEY);
    if (!rawValue) return {};
    const parsedValue = JSON.parse(rawValue);
    return parsedValue && typeof parsedValue === 'object' ? parsedValue : {};
  } catch (error) {
    return {};
  }
};

const writeVisibilityState = value => {
  try {
    window.localStorage.setItem(VISIBILITY_STORAGE_KEY, JSON.stringify(value));
  } catch (error) {
    // Ignore localStorage errors.
  }
};

const SettingsButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  border-radius: 6px;
  color: rgba(0, 0, 0, 0.65);
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
    color: rgba(0, 0, 0, 0.88);
  }
`;

const ServiceOptionLabel = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

const ServiceOptionName = styled.span`
  white-space: nowrap;
`;

const StatusMarker = styled(StatusLamp)`
  margin-right: 0;
`;

const ServicesVisibilityControl = ({ services, children }) => {
  const [visibilityState, setVisibilityState] = useState(readVisibilityState);

  const servicesVisibility = useMemo(() => {
    const nextVisibility = {};

    services.forEach(service => {
      const { serviceName } = service;
      if (!serviceName || hasOwn(nextVisibility, serviceName)) return;

      if (hasOwn(visibilityState, serviceName)) {
        nextVisibility[serviceName] = Boolean(visibilityState[serviceName]);
        return;
      }

      nextVisibility[serviceName] = isDefaultVisibleService(serviceName);
    });

    return nextVisibility;
  }, [services, visibilityState]);

  const visibleServices = useMemo(
    () => services.filter(service => servicesVisibility[service.serviceName]),
    [services, servicesVisibility]
  );

  const servicesStatus = useMemo(
    () =>
      services.reduce((acc, service) => {
        const { serviceName, status } = service;
        if (!serviceName || hasOwn(acc, serviceName)) return acc;

        if (status === undefined || status === null) {
          acc[serviceName] = 'unknown';
          return acc;
        }

        acc[serviceName] = isStatusOk(status) ? 'up' : 'down';
        return acc;
      }, {}),
    [services]
  );

  const menuItems = useMemo(
    () => [
      ...Object.keys(servicesVisibility).map(serviceName => ({
        key: serviceName,
        label: (
          <Checkbox
            onClick={event => event.stopPropagation()}
            checked={Boolean(servicesVisibility[serviceName])}
            onChange={() => {
              const nextState = {
                ...visibilityState,
                [serviceName]: !servicesVisibility[serviceName],
              };

              setVisibilityState(nextState);
              writeVisibilityState(nextState);
            }}>
            <ServiceOptionLabel>
              <StatusMarker
                isOk={
                  servicesStatus[serviceName] === 'unknown'
                    ? null
                    : servicesStatus[serviceName] === 'up'
                }
                size={8}
              />
              <ServiceOptionName>{serviceName}</ServiceOptionName>
            </ServiceOptionLabel>
          </Checkbox>
        ),
      })),
      {
        key: 'reset',
        label: (
          <Button
            type="link"
            onClick={event => {
              event.stopPropagation();

              const resetState = Object.keys(servicesVisibility).reduce(
                (acc, serviceName) => ({
                  ...acc,
                  [serviceName]: isDefaultVisibleService(serviceName),
                }),
                {}
              );

              setVisibilityState(resetState);
              writeVisibilityState(resetState);
            }}
            block>
            Reset Services
          </Button>
        ),
      },
    ],
    [servicesStatus, servicesVisibility, visibilityState]
  );

  const control = (
    <Dropdown menu={{ items: menuItems }} trigger={['click']}>
      <SettingsButton
        type="button"
        aria-label="Select visible services"
        onClick={event => event.stopPropagation()}>
        <SettingOutlined />
      </SettingsButton>
    </Dropdown>
  );

  return children({ visibleServices, control });
};

ServicesVisibilityControl.propTypes = {
  services: PropTypes.arrayOf(
    PropTypes.shape({
      serviceName: PropTypes.string,
      status: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    })
  ),
  children: PropTypes.func.isRequired,
};

ServicesVisibilityControl.defaultProps = {
  services: [],
};

export default ServicesVisibilityControl;
