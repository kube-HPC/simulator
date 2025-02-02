import React from 'react';
import { COLOR } from 'styles';
import KeycloakServices from 'keycloak/keycloakServices';
import { MenuOutlined } from '@ant-design/icons';
import { Popover, Avatar, Tooltip } from 'antd';
import { USER_GUIDE } from 'const';
import { FlexBox, Icons } from 'components/common';
import styled from 'styled-components';
import Settings from './Settings/Settings.react';
import InactiveModeTag from './InactiveMode';
import ExperimentPicker from './ExperimentPicker.react';

const Container = styled(FlexBox.Auto)`
  position: relative;
`;

const HelpBar = () => (
  <Container className={USER_GUIDE.HEADER.SOCIALS}>
    <InactiveModeTag />

    <ExperimentPicker />
    <Tooltip
      title={`You are logged in as the user ${KeycloakServices.getUsername()}.`}
      placement="top">
      <Avatar
        style={{
          backgroundColor: COLOR.greenLight,
          verticalAlign: 'middle',
          textTransform: 'uppercase',
        }}>
        {KeycloakServices.getUsername().toString()[0]}
      </Avatar>
    </Tooltip>
    <Popover content={<Settings />} placement="bottomRight" trigger="click">
      <Icons.Hover type={<MenuOutlined title="Settings" />} />
    </Popover>
  </Container>
);

export default HelpBar;
