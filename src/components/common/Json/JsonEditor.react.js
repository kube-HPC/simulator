import React, { useState, lazy } from 'react';
import PropTypes from 'prop-types';
import { Fallback } from '..';

const MonacoEditor = lazy(() => import('react-monaco-editor'));

const JsonEditor = ({ width, height, isControlled, ...props }) => {
  const [value, setValue] = useState(props.value);

  return (
    <Fallback>
      <MonacoEditor
        {...props}
        width={width}
        height={height}
        language="json"
        value={isControlled ? props.value : value}
        onChange={data => {
          !isControlled && setValue(data);
          props.onChange && props.onChange(data);
        }}
      />
    </Fallback>
  );
};

JsonEditor.defaultProps = {
  width: '800',
  height: '600',
  isControlled: false
};

JsonEditor.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  isControlled: PropTypes.bool,
  onChange: PropTypes.func,
  value: PropTypes.string.isRequired,
  ...MonacoEditor.propTypes
};

export default JsonEditor;
