import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  CheckOutlined,
  WarningOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';
import { Tooltip, Input } from 'antd';

import styled from 'styled-components';

const Field = styled.div`
  display: flex;
  align-items: center;
`;

const IconDelete = styled(MinusCircleOutlined)`
  color: #999;
  font-size: 1.5em;
  margin-left: 1ch;
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
  addonBefore,
}) => {
  const inputRef = useRef();
  useEffect(() => {
    inputRef?.current?.focus();
  }, []);
  return (
    <Field style={{ marginTop: '0.5em' }}>
      <Tooltip title={isValid ? '' : tooltip}>
        <Input
          ref={inputRef}
          id={id}
          onChange={onChange}
          defaultValue={value}
          value={value}
          placeholder={placeholder}
          allowClear
          addonAfter={
            isValid ? (
              <CheckOutlined style={{ fontSize: '15px' }} />
            ) : (
              <WarningOutlined style={{ color: 'red', fontSize: '15px' }} />
            )
          }
          addonBefore={addonBefore}
        />
      </Tooltip>
      {hasRemove && <IconDelete onClick={onRemove} />}
    </Field>
  );
};

InputField.propTypes = {
  hasRemove: PropTypes.bool.isRequired,
  onRemove: PropTypes.func.isRequired,
  isValid: PropTypes.bool,
  tooltip: PropTypes.string,
  id: PropTypes.node.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.string,
    PropTypes.node,
  ]).isRequired,
  placeholder: PropTypes.string,
  addonBefore: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
    .isRequired,
};

InputField.defaultProps = {
  placeholder: null,
  tooltip: null,
  isValid: true,
};

export default InputField;
