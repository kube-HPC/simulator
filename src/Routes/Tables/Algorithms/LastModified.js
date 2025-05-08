import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { selectors } from 'reducers';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Badge, Tag } from 'antd';
import Moment from 'react-moment';
import { getColorByName } from 'utils';

const LastModified = ({ modified, auditTrail }) => {
  const { keycloakEnable } = useSelector(selectors.connection);

  const userName = Array.isArray(auditTrail) ? auditTrail[0]?.user : undefined;
  const dateNode = (
    <Tag>
      <Moment format="DD/MM/YY HH:mm:ss">{+modified}</Moment>
    </Tag>
  );
  return keycloakEnable ? (
    <Badge
      style={{ fontSize: '8px' }}
      count={
        userName?.[0]?.toUpperCase() ?? (
          <UserOutlined style={{ color: 'hsl(0, 0.00%, 51.80%)' }} />
        )
      }
      size="small"
      color={getColorByName(userName)}
      title={userName}
      offset={[-7, 0]}>
      {dateNode}
    </Badge>
  ) : (
    dateNode
  );
};

LastModified.propTypes = {
  modified: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  auditTrail: PropTypes.array,
};

export default LastModified;
