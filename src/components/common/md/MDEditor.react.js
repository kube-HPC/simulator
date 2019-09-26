import React, { useState, useEffect, lazy } from 'react';
import PropTypes from 'prop-types';
import 'easymde/dist/easymde.min.css';
import Fallback from '../Fallback.react';

const SimpleMDE = lazy(() => import('react-simplemde-editor'));

const MDEditor = ({ data, onChange }) => {
  const [value, setValue] = useState(data);

  useEffect(() => {
    setValue(data);
  }, [data]);

  const handleValueChange = value => {
    setValue(value);
    onChange(value);
  };

  return (
    <Fallback>
      <SimpleMDE
        value={value}
        onChange={handleValueChange}
        options={{
          autofocus: true,
          spellChecker: false
        }}
      />
    </Fallback>
  );
};

MDEditor.defaultProps = {
  data: '',
  onChange: () => {}
};

MDEditor.propTypes = {
  data: PropTypes.string.isRequired,
  onChange: PropTypes.func
};

export default MDEditor;
