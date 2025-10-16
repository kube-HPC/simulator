import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Input, Button, Tooltip } from 'antd';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import { systemColors } from './traceConstants';

const SearchContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 100;
`;

const StyledInput = styled(Input)`
  width: 250px;
  border-radius: 6px;
  border: 2px solid ${systemColors.blue};
  background-color: ${systemColors.background};
  color: ${systemColors.text};
`;

const StyledSearchIcon = styled(SearchOutlined)`
  color: ${systemColors.blue};
`;

const StyledButton = styled(Button)`
  border-radius: 4px;
`;

const SearchBox = ({ searchTerm, onSearchChange }) => {
  const clearSearch = () => {
    onSearchChange('');
  };

  return (
    <SearchContainer>
      <StyledInput
        placeholder="Search spans..."
        value={searchTerm}
        onChange={e => onSearchChange(e.target.value)}
        prefix={<StyledSearchIcon />}
        size="middle"
      />
      {searchTerm && (
        <Tooltip title="Clear search">
          <StyledButton
            type="primary"
            danger
            size="small"
            icon={<CloseOutlined />}
            onClick={clearSearch}
          />
        </Tooltip>
      )}
    </SearchContainer>
  );
};

SearchBox.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};

export default React.memo(SearchBox);
