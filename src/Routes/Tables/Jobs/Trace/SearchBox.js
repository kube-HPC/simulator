import React from 'react';
import PropTypes from 'prop-types';
import { Input, Button, Tooltip } from 'antd';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import { systemColors } from './traceConstants';

const SearchBox = ({ searchTerm, onSearchChange }) => {
  const clearSearch = () => {
    onSearchChange('');
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '20px',
        right: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        zIndex: 100,
      }}>
      <Input
        placeholder="Search spans..."
        value={searchTerm}
        onChange={e => onSearchChange(e.target.value)}
        prefix={<SearchOutlined style={{ color: systemColors.blue }} />}
        style={{
          width: '250px',
          borderRadius: '6px',
          border: `2px solid ${systemColors.blue}`,
          backgroundColor: systemColors.background,
          color: systemColors.text,
        }}
        size="middle"
      />
      {searchTerm && (
        <Tooltip title="Clear search">
          <Button
            type="primary"
            danger
            size="small"
            icon={<CloseOutlined />}
            onClick={clearSearch}
            style={{ borderRadius: '4px' }}
          />
        </Tooltip>
      )}
    </div>
  );
};

SearchBox.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};

export default React.memo(SearchBox);
