import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { selectors } from 'reducers';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Badge, Tag } from 'antd';
import dayjs from 'dayjs';
import { getColorByName } from 'utils';

const LastModified = ({ modified, auditTrail }) => {
  const { keycloakEnable } = useSelector(selectors.connection);

  const userName = Array.isArray(auditTrail) ? auditTrail[0]?.user : undefined;
  const dateNode = <Tag>{dayjs(+modified).format('DD/MM/YY HH:mm:ss')}</Tag>;
  return keycloakEnable ? (
    <Badge
      style={{ fontSize: '8px' }}
      count={
        userName?.[0]?.toUpperCase() ?? (
          <UserOutlined
            style={{
              color: 'white',
              background: 'hsl(0, 0.00%, 51.80%)',
              fontSize: '9px',
              borderRadius: '50px',
              display: 'block',
              padding: '2px',
            }}
          />
        )
      }
      size="small"
      color={userName && getColorByName(userName)}
      title={userName && userName}
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
