import React from 'react';
import { selectors } from 'reducers';
import { useSelector } from 'react-redux';
import KeycloakServices from 'keycloak/keycloakServices';
import { MenuOutlined } from '@ant-design/icons';
import { Popover } from 'antd';
import { USER_GUIDE } from 'const';
import { FlexBox, Icons } from 'components/common';
import styled from 'styled-components';
import UserAvatar from '../../../components/UserAvatar';
import SettingsUser from './Settings/SettingsUser';
import Settings from './Settings/Settings.react';
import InactiveModeTag from './InactiveMode';
import ExperimentPicker from './ExperimentPicker.react';

const Container = styled(FlexBox.Auto)`
  position: relative;
`;

const HelpBar = () => {
  const { keycloakEnable } = useSelector(selectors.connection);
  return (
    <Container className={USER_GUIDE.HEADER.SOCIALS}>
      <InactiveModeTag />

      <ExperimentPicker />
      {keycloakEnable && (
        <Popover
          content={<SettingsUser />}
          placement="bottomRight"
          trigger="click">
          <UserAvatar username={KeycloakServices.getUsername()} size={30} />
        </Popover>
      )}
      <Popover content={<Settings />} placement="bottomRight" trigger="click">
        <Icons.Hover type={<MenuOutlined title="Settings" />} />
      </Popover>
    </Container>
  );
};

export default HelpBar;
