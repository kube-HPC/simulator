import { Button } from 'antd';
import { BottomContent, Card, JsonEditor } from 'components/common';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { notification } from 'utils';

const NOOP = () => {};

const DrawerEditor = ({ value: initial, submitText = 'Submit', onSubmit = NOOP }) => {
  const [value, setValue] = useState(initial);

  useEffect(() => {
    setValue(initial);
  }, [initial]);

  const editorRef = useRef();

  const onClear = useCallback(() => setValue(''), []);
  const onDefault = useCallback(() => setValue(initial), [initial]);

  const onSubmitClick = useCallback(() => {
    try {
      onSubmit(editorRef.current.getValue());
    } catch ({ message: description }) {
      notification({ message: 'Error in Submitted Json', description });
    }
  }, [onSubmit]);

  return (
    <>
      <Card>
        <JsonEditor innerRef={editorRef} value={value} />
      </Card>
      <BottomContent.Divider />
      <BottomContent
        extra={[
          <Button key="clear" type="danger" onClick={onClear}>
            Clear
          </Button>,
          <Button key="default" type="dashed" onClick={onDefault}>
            Default
          </Button>,
        ]}>
        <Button type="primary" onClick={onSubmitClick}>
          {submitText}
        </Button>
      </BottomContent>
    </>
  );
};

DrawerEditor.propTypes = {
  value: PropTypes.string,
  submitText: PropTypes.string,
  onSubmit: PropTypes.func,
};

export default DrawerEditor;
