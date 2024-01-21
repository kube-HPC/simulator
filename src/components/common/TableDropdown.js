import React, { useState } from 'react';
import { Table, Button, Menu, Dropdown } from 'antd';
import PropTypes from 'prop-types';

const TableDropdown = ({ data, columns }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const menu = (
    <Menu>
      <Table
        dataSource={data}
        columns={columns}
        pagination={false}
        onRow={record => ({
          onClick: () => {
            setSelectedItem(record);
          },
        })}
      />
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <Button>{selectedItem ? selectedItem.name : 'Select an item'}</Button>
    </Dropdown>
  );
};

TableDropdown.defaultProps = {
  data: {},
  columns: {},
};
TableDropdown.propTypes = {
  columns: PropTypes.objectOf(PropTypes.string),
  data: PropTypes.objectOf(PropTypes.string),
};

export default TableDropdown;
