import { Button, Icon } from 'antd';
import { Card, JsonEditor, MdEditor, Tabs } from 'components/common';
import { ReactComponent as CodeIcon } from 'images/code-icon.svg';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { notification } from 'utils';
import { stringify } from 'utils/string';
import { Drawer } from '.';

const TABS = { INFO: 'Information', DESC: 'Description' };

const noop = () => {};

const errorNotification = message =>
  notification({
    message: 'Error in Submitted Json',
    description: message,
    type: notification.TYPES.ERROR,
  });

function DrawerEditorMD({ record, onSubmit = noop, submitText = 'Submit', ...props }) {
  const defaultValue = stringify(record);

  const [readme, setReadme] = useState('');
  const [value, setValue] = useState(defaultValue);
  const [activeKey, setActiveKey] = useState(TABS.INFO);

  const onClearClick = () => setValue('');
  const onDefaultClick = () => setValue(defaultValue);

  const onSubmitClick = () => {
    try {
      onSubmit({
        value: JSON.parse(value),
        readme: readme,
      });
    } catch ({ message }) {
      errorNotification(message);
    }
  };

  const bottomExtra =
    activeKey === TABS.INFO
      ? [
        <Button key="clear" type="danger" onClick={onClearClick}>
            Clear
        </Button>,
        <Button key="clear" type="dashed" onClick={onDefaultClick}>
            Default
        </Button>,
      ]
      : [];

  const bottomContent = {
    body: (
      <Button type="primary" onClick={onSubmitClick}>
        {submitText}
      </Button>
    ),
    extra: bottomExtra,
  };

  return (
    <Drawer {...props} onSubmit={onSubmitClick} bottomContent={bottomContent}>
      <Tabs activeKey={activeKey} onChange={setActiveKey}>
        <Tabs.TabPane
          tab={
            <span>
              <Icon component={CodeIcon} />
              {TABS.INFO}
            </span>
          }
          key={TABS.INFO}>
          <Card>
            <JsonEditor value={value} onChange={setValue} />
          </Card>
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <span>
              <Icon type="file-markdown" />
              {TABS.DESC}
            </span>
          }
          key={TABS.DESC}>
          <MdEditor value={readme} onChange={setReadme} />
        </Tabs.TabPane>
      </Tabs>
    </Drawer>
  );
}

DrawerEditorMD.propTypes = {
  submitText: PropTypes.string,
  readmeDefault: PropTypes.string,
  onSubmit: PropTypes.func,
  record: PropTypes.object,
};

export default DrawerEditorMD;
