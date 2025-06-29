import React, { useState } from 'react';
import { Input } from 'antd';
import useActions from '../../hooks/useActions';

const VersionNameEdit = record => {
  const { updateVersionName } = useActions();
  const { version, versionName } = record;
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(versionName);

  const handleSave = () => {
    setEditing(false);
    if (inputValue !== versionName) {
      // onChange?.(key, inputValue);
      console.log(version, inputValue);
      updateVersionName(version, inputValue);
    }
  };

  return editing ? (
    <Input
      value={inputValue}
      onChange={e => setInputValue(e.target.value)}
      onBlur={handleSave}
      onPressEnter={handleSave}
      size="small"
      autoFocus
    />
  ) : (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div onClick={() => setEditing(true)} style={{ cursor: 'pointer' }}>
      {versionName}
    </div>
  );
};

export default VersionNameEdit;
