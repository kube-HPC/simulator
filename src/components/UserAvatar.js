import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Tooltip } from 'antd';
import { getColorByName } from 'utils';

const UserAvatar = ({ username, titleToolTip, size = 40 }) => {
  const firstLetter = username?.charAt(0) || '?';
  const bgColor = username ? getColorByName(username) : '';

  return (
    <Tooltip title={titleToolTip}>
      <Avatar
        style={{
          backgroundColor: bgColor,
          verticalAlign: 'middle',
          textTransform: 'uppercase',
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
