import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ControlledEditor } from '@monaco-editor/react';
import { Card } from 'components/common';
import { tryParse } from 'utils';
import { useDebouncedCallback } from 'use-debounce';
import { COLOR } from 'styles';
import { AutoSizer } from 'react-virtualized';

const emptyEditorStates = ['""', null, 'null', ''];

/**
 * @param {object} props
 * @param {React.CSSProperties} props.style
 */
const JsonEditor = ({ onChange, value: _value, style }) => {
  const [value, setValue] = useState(JSON.stringify(_value, null, 2));
  useEffect(() => {
    if (
      emptyEditorStates.includes(value) &&
      !emptyEditorStates.includes(_value)
    )
      setValue(JSON.stringify(_value, null, 2));
  }, [value, setValue, _value]);
  const [hasFailed, setFail] = useState(false);
  const onApply = useCallback(() => {
    const onSuccess = ({ parsed }) => {
      setFail(false);
      onChange(parsed);
    };
    if (value) tryParse({ src: value, onSuccess, onFail: () => setFail(true) });
  }, [onChange, value]);

  const submitChange = useDebouncedCallback(onApply, 1000);

  const handleChange = useCallback(
    (_, nextValue) => {
      setValue(nextValue);
      submitChange();
    },
    [setValue, submitChange]
  );

  return (
    <Card
      bodyStyle={{ height: '100%' }}
      style={{ borderColor: hasFailed ? COLOR.red : undefined, ...style }}>
      <AutoSizer>
        {({ height, width }) => (
          <ControlledEditor
            height={height}
            width={width}
            onChange={handleChange}
            value={value}
            language="json"
          />
        )}
      </AutoSizer>
    </Card>
  );
};

JsonEditor.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string,
  // eslint-disable-next-line
  style: PropTypes.object,
};
JsonEditor.defaultProps = {
  value: '',
  style: {},
  onChange: () => {},
};

export default JsonEditor;
