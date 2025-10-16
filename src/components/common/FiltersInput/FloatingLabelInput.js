import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import styled from 'styled-components';
import 'antd/dist/reset.css';
import debounce from 'lodash.debounce';

const Container = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
`;

const Label = styled.label`
  position: absolute;
  left: 12px;
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
  position: relative;
  background: white;
  border-radius: 50px;
  padding-left: 15px;
`;

const FloatingLabelInput = ({
  label,
  value,
  onChange,
  debounceDelay = 500,
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  const debouncedSubmit = useMemo(
    () => debounce(onChange, debounceDelay),
    [debounceDelay, onChange]
  );

  return (
    <Container>
      <Label $focused={focused} $hasValue={!!value}>
        {label}
      </Label>
      <StyledInput
        {...props}
        placeholder={focused ? '' : label}
        value={value}
        onChange={e => debouncedSubmit(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </Container>
  );
};

FloatingLabelInput.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
  debounceDelay: PropTypes.number,
};

export default FloatingLabelInput;
