import React from 'react';
import { Avatar, Popover, Tooltip } from 'antd';
import styled from 'styled-components';
import MenuUser from '../Login/MenuUser.react';

const CircleInitialWrapper = styled.div``;

const StyledAvatar = styled(Avatar)`
  background-color: #007bff;
  color: white;
  cursor: pointer;
`;
// eslint-disable-next-line react/prop-types
const IconUser = ({ name }) => {
  const getInitial = nameStr => {
    if (!nameStr) return '';
    return nameStr.toString().charAt(0).toUpperCase();
  };

  const initial = getInitial(name);

  return (
    <CircleInitialWrapper>
      <Popover content={<MenuUser />} placement="bottomRight" trigger="click">
        <Tooltip title={name}>
          <StyledAvatar>{initial}</StyledAvatar>{' '}
        </Tooltip>
      </Popover>
    </CircleInitialWrapper>
  );
};

export default IconUser;
