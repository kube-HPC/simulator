import React, { useState } from 'react';
import { notification, Icon, Card, Tabs } from 'antd';

import { ReactComponent as CodeIcon } from 'images/code-icon.svg';

import JsonEditor from 'components/common/json/JsonEditor.react';
import DrawerContainer from 'components/common/drawer/DrawerContainer.react';
import MDEditor from 'components/common/md/MDEditor.react';
import { stringify } from 'utils/string';

const tabs = { json: 'JSON', description: 'Description' };

function DrawerEditorMD({
  children,
  record,
  onSubmit,
  readmeDefault,
  ...props
}) {
  const [readme, setReadme] = useState('');
  const [value, setValue] = useState(stringify(record));

  return (
    <DrawerContainer
      {...props}
      onSubmit={() => {
        try {
          onSubmit({
            value: JSON.parse(value),
            readme: readme || readmeDefault
          });
        } catch (e) {
          notification.config({
            placement: 'bottomRight'
          });
          notification.open({
            message: 'Error in Submitted Json',
            description: e.message,
            icon: <Icon type="warning" style={{ color: 'red' }} />
          });
        }
      }}
    >
      <Tabs>
        <Tabs.TabPane
          tab={
            <span>
              <Icon component={CodeIcon} />
              {tabs.json}
            </span>
          }
          key={tabs.json}
        >
          <Card size="small">
            <JsonEditor isControlled value={value} onChange={setValue} />
          </Card>
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <span>
              <Icon type="file-markdown" />
              {tabs.description}
            </span>
          }
          key={tabs.description}
        >
          <MDEditor data={readmeDefault} onChange={setReadme} />
        </Tabs.TabPane>
      </Tabs>
    </DrawerContainer>
  );
}

export default DrawerEditorMD;
