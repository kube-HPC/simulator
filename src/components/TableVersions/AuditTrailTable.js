import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Table } from 'antd';

const { Text } = Typography;

const columns = [
  {
    title: 'User',
    dataIndex: 'user',
    key: 'user',
    render: user => <Text strong>{user}</Text>,
  },
  {
    title: 'Timestamp',
    dataIndex: 'timestamp',
    key: 'timestamp',
    render: ts => <Text code>{new Date(ts).toLocaleString()}</Text>,
  },
  {
    title: 'Version',
    dataIndex: 'version',
    key: 'version',
    render: version => version,
  },
];

const AuditTrailTable = ({ auditTrail }) => (
  <Table
    dataSource={auditTrail}
    columns={columns}
    rowKey={(record, index) => `${record.version}-${index}`}
    pagination={false}
  />
);

AuditTrailTable.propTypes = {
  auditTrail: PropTypes.object.isRequired,
};

export default AuditTrailTable;
