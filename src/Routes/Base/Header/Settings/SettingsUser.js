import React from 'react';
import KeycloakServices from 'keycloak/keycloakServices';
import { FlexBox, Icons } from 'components/common';
import { LogoutOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Typography, Avatar } from 'antd';
import { COLOR } from 'styles';

const { Text } = Typography;
const SettingsUser = () => {
  const logout = () => KeycloakServices.doLogout();

  const TextLink = styled(Text)`
    cursor: pointer;
  `;

  return (
    <FlexBox.Auto align="left" direction="column" gutter={[10, 10]}>
      <FlexBox.Auto>
        <Avatar
          style={{
            backgroundColor: COLOR.greenLight,
            verticalAlign: 'middle',
            textTransform: 'uppercase',
          }}>
          {KeycloakServices.getUsername() &&
            KeycloakServices.getUsername().toString()[0]}
        </Avatar>
        <TextLink>{KeycloakServices.getUsername()}</TextLink>
      </FlexBox.Auto>

      <FlexBox.Auto>
        <Icons.Hover
          type={<LogoutOutlined title="logout" />}
          onClick={logout}
        />
        <TextLink onClick={logout}>logout</TextLink>
      </FlexBox.Auto>
    </FlexBox.Auto>
  );
};
export default SettingsUser;
