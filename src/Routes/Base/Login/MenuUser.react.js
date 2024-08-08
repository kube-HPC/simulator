import React, { useCallback } from 'react';
import { FlexBox, Icons } from 'components/common';
import { useNavigate } from 'react-router-dom';
import { LogoutOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Typography } from 'antd';

const { Text } = Typography;
const MenuUser = () => {
  const navigate = useNavigate();

  const onLogoutClick = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  const TextLink = styled(Text)`
    cursor: pointer;
  `;

  return (
    <FlexBox.Auto align="left" direction="column" gutter={[10, 10]}>
      <FlexBox.Auto>
        <Icons.Hover type={<LogoutOutlined />} onClick={onLogoutClick} />

        <TextLink onClick={onLogoutClick}>Logout</TextLink>
      </FlexBox.Auto>
    </FlexBox.Auto>
  );
};
export default MenuUser;
