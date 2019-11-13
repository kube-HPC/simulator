import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { notification, Icon, Button } from 'antd';
import { ReactComponent as CodeIcon } from 'images/code-icon.svg';
import { stringify } from 'utils/string';
import { Tabs, Card, MDEditor, JsonEditor } from 'components/common';
import { Drawer } from '.';

const tabs = { json: 'JSON', description: 'Description' };

const configNotificationOnOpen = description => ({
  message: 'Error in Submitted Json',
  description,
  icon: <Icon type="warning" style={{ color: 'red' }} />,
});

const noop = () => {};

function DrawerEditorMD({ record, onSubmit = noop, readmeDefault, submitText, ...props }) {
  const [readme, setReadme] = useState('');
  const [value, setValue] = useState(stringify(record));
  const [activeKey, setActiveKey] = useState(tabs.json);

  const onClearClick = () => setValue('');

  const onSubmitClick = () => {
    try {
      onSubmit({
        value: JSON.parse(value),
        readme: readme || readmeDefault,
      });
    } catch ({ message }) {
      notification.open(configNotificationOnOpen(message));
    }
  };

  const bottomExtra =
    activeKey === tabs.json
      ? [
        <Button key="clear" type="danger" onClick={onClearClick}>
            Clear
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
          <MDEditor data={readmeDefault} onChange={setReadme} />
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

DrawerEditorMD.defaultProps = {
  submitText: 'Submit',
};

export default DrawerEditorMD;
