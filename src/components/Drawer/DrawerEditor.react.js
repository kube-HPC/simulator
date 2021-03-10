import {
  BottomPanel,
  PanelButton,
  RightAlignedButton,
} from 'components/Drawer';
import { Card, JsonEditor } from 'components/common';
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
      <Card style={{ flex: 1 }}>
        <JsonEditor innerRef={editorRef} value={value} />
      </Card>
      <BottomPanel style={{ marginTop: '1em' }}>
        <PanelButton type="danger" onClick={onClear}>
          Clear
        </PanelButton>
        <PanelButton type="dashed" onClick={onDefault}>
          Default
        </PanelButton>
        <RightAlignedButton type="primary" onClick={onSubmitClick}>
          {submitText}
        </RightAlignedButton>
      </BottomPanel>
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
