import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { AutoComplete, Input } from 'antd';
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
    (props.focused || props.hasValue) &&
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
  options,
  isExactMatch = false,
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  const debouncedSubmit = useMemo(
    () => debounce(Submit, debounceDelay),
    [Submit, debounceDelay]
  );

  return (
    <Container>
      <Label focused={focused} hasValue={!!value}>
        {label}
      </Label>
      <AutoComplete
        options={options}
        style={{ width }}
        value={value}
        onSearch={val => {
          const exactMatch =
            isExactMatch && options.find(opt => opt.value === val);
          if (exactMatch || val === '') {
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
        />
      </AutoComplete>
    </Container>
  );
};

AutoCompleteFloatingLabelInput.propTypes = {
  label: PropTypes.string.isRequired,
  Submit: PropTypes.func.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
  debounceDelay: PropTypes.number,
  suffix: PropTypes.node,
  options: PropTypes.node,
  width: PropTypes.string,
  isExactMatch: PropTypes.bool,
};

export default AutoCompleteFloatingLabelInput;
