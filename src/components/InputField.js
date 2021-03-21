import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Input, Icon } from 'antd';
import { DeleteButton } from 'Routes/SidebarRight/AddPipeline/Steps/FormUtils';
import styled from 'styled-components';

const Field = styled.div`
  display: flex;
  align-items: center;
`;

const InputField = ({
  hasRemove,
  onRemove,
  isValid,
  tooltip,
  id,
  onChange,
  value,
  placeholder,
}) => {
  const inputRef = useRef();
  useEffect(() => {
    inputRef?.current?.focus();
  }, []);
  return (
    <Field style={{ marginTop: '0.5em' }}>
      <Tooltip title={isValid ? '' : tooltip}>
        <Input
          style={{
            width: hasRemove ? '60ch' : '100%',
          }}
          ref={inputRef}
          id={id}
          onChange={onChange}
          defaultValue={value}
          value={value}
          placeholder={placeholder}
          addonAfter={
            <Icon
              style={{ color: !isValid && 'red', fontSize: '15px' }}
              type={isValid ? 'check' : 'warning'}
            />
          }
        />
      </Tooltip>
      {hasRemove && (
        <DeleteButton
          type="minus-circle"
          style={{ color: '#999' }}
          onClick={onRemove}
        />
      )}
    </Field>
  );
};

InputField.propTypes = {
  hasRemove: PropTypes.bool.isRequired,
  onRemove: PropTypes.func.isRequired,
  isValid: PropTypes.bool.isRequired,
  tooltip: PropTypes.string.isRequired,
  id: PropTypes.node.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
};

export default InputField;
