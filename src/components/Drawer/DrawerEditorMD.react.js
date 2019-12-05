import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon, Button } from 'antd';
import { ReactComponent as CodeIcon } from 'images/code-icon.svg';
import { stringify } from 'utils/string';
import { Tabs, Card, MdEditor, JsonEditor } from 'components/common';
import { Drawer } from '.';
import { notification } from 'utils';

const tabs = { json: 'JSON', description: 'Description' };

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
  const [activeKey, setActiveKey] = useState(tabs.json);

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
    activeKey === tabs.json
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
              {tabs.json}
            </span>
          }
          key={tabs.json}>
          <Card>
            <JsonEditor value={value} onChange={setValue} />
          </Card>
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <span>
              <Icon type="file-markdown" />
              {tabs.description}
            </span>
          }
          key={tabs.description}>
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
