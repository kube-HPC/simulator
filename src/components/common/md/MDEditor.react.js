import React, { useState, useEffect } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';

export default function MDEditor({ data, onChange, onToggleFullScreen }) {
  const [value, setValue] = useState(data);

  useEffect(() => {
    setValue(data);
  }, [data]);

  const handleValueChange = value => {
    setValue(value);
    onChange && onChange(value);
  };

  return (
    <SimpleMDE
      value={value}
      onChange={handleValueChange}
      options={{
        autofocus: true,
        spellChecker: false,
        onToggleFullScreen
      }}
    />
  );
}
