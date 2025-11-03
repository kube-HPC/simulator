import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { AutoComplete, Input, Tag } from 'antd';
import styled from 'styled-components';
import debounce from 'lodash.debounce';

const Container = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
`;

const Label = styled.label`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  transition: all 0.2s ease-in-out;
  color: #aaa;
  pointer-events: none;
  background: white;
  padding: 0 4px;
  z-index: 100;
  ${props =>
    (props.$focused || props.$hasValue) &&
    `
    top: 1px;
    font-size: 12px;
    color: #1677ff;
  `}
`;

const StyledInput = styled(Input)`
  padding-left: 17px;

  position: relative;
  background: white;
  border-radius: 50px;
  .ant-select-selector {
    border-radius: 50px !important;
    padding-left: 15px !important;
    height: 32px !important;
    display: flex;
    align-items: center;
  }
`;

const AutoCompleteFloatingLabelInput = ({
  label,
  Submit,
  value,
  onChange,
  debounceDelay = 1000,
  suffix,
  width,
  options = [],
  isExactMatch = false,
  listIgnoreExactMatch = [], // eslint-disable-line no-unused-vars
  title,
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  const debouncedSubmit = useMemo(
    () => debounce(Submit, debounceDelay),
    [Submit, debounceDelay]
  );

  // Custom tag renderer to override the title attribute
  const tagRender = tagProps => {
    const { label: tagLabel, closable, onClose } = tagProps;
    return (
      <Tag
        title={title || label}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}>
        {tagLabel}
      </Tag>
    );
  };

  return (
    <Container title={title}>
      <Label $focused={focused} $hasValue={!!value}>
        {label}
      </Label>
      <AutoComplete
        options={options}
        style={{ width }}
        value={value}
        tagRender={tagRender}
        defaultActiveFirstOption={false}
        onSearch={val => {
          const exactMatch =
            isExactMatch && options.find(opt => opt.value === val);

          // Submit if exact match OR not requiring exact match OR empty
          if (exactMatch || !isExactMatch || val === '') {
            debouncedSubmit(val);
          }
        }}
        onSelect={val => {
          Submit(val);
          onChange?.(val);
        }}
        onClear={() => {
          Submit('');
          onChange?.('');
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={val => onChange?.(val)}
        filterOption={(inputValue, option) =>
          option.value.toUpperCase().includes(inputValue.toUpperCase())
        }>
        <StyledInput
          {...props}
          suffix={suffix}
          style={{ borderRadius: '50px' }}
          title={title}
        />
      </AutoComplete>
    </Container>
  );
};

AutoCompleteFloatingLabelInput.propTypes = {
  label: PropTypes.string.isRequired,
  Submit: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  debounceDelay: PropTypes.number,
  suffix: PropTypes.node,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.node,
    })
  ),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isExactMatch: PropTypes.bool,
  listIgnoreExactMatch: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string,
};

export default AutoCompleteFloatingLabelInput;
