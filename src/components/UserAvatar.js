import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Tooltip } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { getColorByName } from 'utils';

const UserAvatar = ({ username, titleToolTip, size = 40 }) => {
  const isNullUser = username === null || username === undefined;
  const firstLetter = username?.charAt(0) || 'D';
  const bgColor = isNullUser
    ? 'hsl(0, 0.00%, 51.80%)'
    : username
      ? getColorByName(username)
      : '';

  return (
    <Tooltip title={!isNullUser && titleToolTip}>
      <Avatar
        style={{
          backgroundColor: bgColor,
          verticalAlign: 'middle',
          textTransform: 'uppercase',
          fontSize: size / 2,
        }}
        size={size}
        icon={isNullUser ? <UserOutlined /> : null}>
        {!isNullUser && firstLetter}
      </Avatar>
    </Tooltip>
  );
};

UserAvatar.propTypes = {
  username: PropTypes.string.isRequired,
  titleToolTip: PropTypes.string,
  size: PropTypes.number,
};

export default UserAvatar;
