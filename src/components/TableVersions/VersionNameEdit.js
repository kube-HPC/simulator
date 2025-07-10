import React, { useState } from 'react';
import { Input, Tooltip, message } from 'antd';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import useActions from '../../hooks/useActions';

const HoverableText = styled(Tooltip)`
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;

  &:hover {
    border: 1px solid #d9d9d9;
  }
`;

const VersionNameEdit = ({ record, source }) => {
  const { updateAlgorithmVersionName, updatePipelineVersionName } =
    useActions();
  const { version, versionAlias } = record;
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(versionAlias);

  if (!record) return null;

  const updateVersionNameOnSuccess = () => {
    message.success(<>version name is update</>);
  };

  const handleSave = () => {
    setEditing(false);
    if (inputValue !== versionAlias) {
      if (source === 'algorithms')
        updateAlgorithmVersionName(
          version,
          inputValue,
          updateVersionNameOnSuccess
        );
      else
        updatePipelineVersionName(
          version,
          inputValue,
          updateVersionNameOnSuccess
        );
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
    <HoverableText
      title="Click to edit version name"
      onClick={() => setEditing(true)}>
      {inputValue || '(empty)'}
    </HoverableText>
  );
};

VersionNameEdit.propTypes = {
  record: PropTypes.object.isRequired,
  source: PropTypes.string.isRequired,
};

export default VersionNameEdit;
