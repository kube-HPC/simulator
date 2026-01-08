import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Input, Button, Tooltip } from 'antd';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import { getCurrentTheme, getSystemColors } from './traceConstants';

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
  border: 2px solid
    ${props => {
      const colors = getSystemColors(props.$isDark);
      return colors.blue;
    }};
  background-color: ${props => {
    const colors = getSystemColors(props.$isDark);
    return props.$isDark ? '#1e3a52' : colors.background;
  }};
  color: ${props => {
    const colors = getSystemColors(props.$isDark);
    return props.$isDark ? '#ffffff' : colors.text;
  }};
  box-shadow: ${props =>
    props.$isDark ? '0 2px 6px rgba(64, 169, 255, 0.15)' : 'none'};

  &:hover {
    border-color: ${props => {
      const colors = getSystemColors(props.$isDark);
      return colors.blueLight;
    }};
    box-shadow: ${props =>
      props.$isDark ? '0 2px 8px rgba(64, 169, 255, 0.25)' : 'none'};
  }

  &:focus,
  &.ant-input-affix-wrapper-focused {
    border-color: ${props => {
      const colors = getSystemColors(props.$isDark);
      return colors.blue;
    }};
    box-shadow: 0 0 0 2px
      ${props => {
        const colors = getSystemColors(props.$isDark);
        return colors.blue;
      }}33;
  }

  input {
    background-color: transparent !important;
    color: ${props => {
      const colors = getSystemColors(props.$isDark);
      return props.$isDark ? '#ffffff' : colors.text;
    }} !important;
  }

  input::placeholder {
    color: ${props => (props.$isDark ? '#8c8c8c' : '#999999')} !important;
  }

  .anticon {
    color: ${props => {
      const colors = getSystemColors(props.$isDark);
      return colors.blue;
    }};
  }
`;

const SearchBox = ({ searchTerm, onSearchChange }) => {
  const [isDark, setIsDark] = useState(getCurrentTheme() === 'DARK');

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(getCurrentTheme() === 'DARK');
    };

    const interval = setInterval(checkTheme, 500);
    window.addEventListener('storage', checkTheme);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', checkTheme);
    };
  }, []);

  const clearSearch = () => {
    onSearchChange('');
  };

  return (
    <SearchContainer>
      <StyledInput
        placeholder="Search spans..."
        value={searchTerm}
        onChange={e => onSearchChange(e.target.value)}
        prefix={<SearchOutlined />}
        size="middle"
        $isDark={isDark}
      />
      {searchTerm && (
        <Tooltip title="Clear search">
          <Button
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
