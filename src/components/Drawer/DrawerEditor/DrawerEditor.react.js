import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { Drawer } from '..';
import { Card, JsonEditor } from 'components/common';
import { notification } from 'utils';

const DrawerEditor = ({
  value: initial,
  title,
  opener = () => {},
  submitText = 'Submit',
  onSubmit,
  ...props
}) => {
  const [value, setValue] = useState(initial);

  useEffect(() => {
    setValue(initial);
  }, [initial, setValue]);

  const onClear = () => setValue('');
  const onDefault = () => setValue(initial);

  const onSubmitClick = () => {
    try {
      onSubmit(value);
    } catch ({ message: description }) {
      notification({ message: 'Error in Submitted Json', description });
    }
  };

  const bottomContent = {
    body: (
      <Button type="primary" onClick={onSubmitClick}>
        {submitText}
      </Button>
    ),
    extra: [
      <Button key="clear" type="danger" onClick={onClear}>
        Clear
      </Button>,
      <Button key="default" type="dashed" onClick={onDefault}>
        Default
      </Button>,
    ],
  };

  return (
    <Drawer
      title={title}
      opener={opener}
      onSubmit={onSubmitClick}
      bottomContent={bottomContent}
      {...props}>
      <Card>
        <JsonEditor value={value} onChange={setValue} />
      </Card>
    </Drawer>
  );
};

DrawerEditor.propTypes = {
  value: PropTypes.string,
  title: PropTypes.element,
  visible: PropTypes.bool,
  opener: PropTypes.func,
  submitText: PropTypes.string,
  onSubmit: PropTypes.func,
};

export default DrawerEditor;
