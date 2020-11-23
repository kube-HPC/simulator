import { Button } from 'antd';
import { BottomContent, Card, JsonEditor } from 'components/common';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { notification } from 'utils';

const DrawerEditor = ({ value: initial, submitText, onSubmit }) => {
  const [value, setValue] = useState(initial);

  useEffect(() => {
    setValue(initial);
  }, [initial]);

  const editorRef = useRef();

  const onClear = useCallback(() => setValue(''), [setValue]);
  const onDefault = useCallback(() => setValue(initial), [initial, setValue]);

  const onSubmitClick = useCallback(() => {
    try {
      onSubmit(editorRef.current.getValue());
    } catch ({ message: description }) {
      notification({ message: 'Error in Submitted Json', description });
    }
  }, [onSubmit, editorRef]);

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
  onSubmit: PropTypes.func.isRequired,
  submitText: PropTypes.string,
};

DrawerEditor.defaultProps = {
  submitText: 'Submit',
  value: '',
};

export default DrawerEditor;
