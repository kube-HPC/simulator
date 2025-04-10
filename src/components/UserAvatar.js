import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Tooltip } from 'antd';

function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

const UserAvatar = ({ username, titleToolTip, size = 40 }) => {
  const firstLetter = username?.charAt(0).toUpperCase() || '?';
  const bgColor = username ? stringToColor(username) : '';

  return (
    <Tooltip title={titleToolTip}>
      <Avatar
        style={{
          backgroundColor: bgColor,
          verticalAlign: 'middle',
          fontSize: size / 2,
        }}
        size={size}>
        {firstLetter}
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
