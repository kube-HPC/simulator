import React, { useState } from 'react';
import Sidebar from 'react-sidebar';
import PropTypes from 'prop-types';
import { Tabs, Card, Button } from 'antd';

import AddPipelineSteps from 'components/dumb/AddPipelineSteps.react';
import FloatingAddButton from 'components/dumb/FloatingAddButton.react';
import JsonEditor from 'components/dumb/JsonEditor.react';
import template from 'config/template/addPipeline.template';
import { stringify } from 'utils/string';

export default function SideBarAddPipeline({ content, ...props }) {
  const [isVisible, setVisible] = useState(false);
  const [sidebarRef, setSidebarRef] = useState(undefined);
  const [json, setJson] = useState(stringify(template));

  const triggerVisible = () => setVisible(!isVisible);

  const handleClickOutside = event =>
    isVisible &&
    sidebarRef &&
    sidebarRef.sidebar &&
    !sidebarRef.sidebar.contains(event.target) &&
    triggerVisible();

  document.addEventListener('mousedown', handleClickOutside);

  const Component = (
    <Tabs>
      <Tabs.TabPane tab="Wizard" key="1">
        <AddPipelineSteps {...content} style={{ width: '120vh' }} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Json Editor" key="3">
        <Card
          style={{ width: '50%', margin: '0 auto' }}
          actions={[
            <Button
              type="primary"
              key="submit"
              onClick={() => {
                content.onSubmit(JSON.parse(json));
              }}
            >
              Submit
            </Button>
          ]}
        >
          <JsonEditor value={json} onChange={setJson} />
        </Card>
      </Tabs.TabPane>
    </Tabs>
  );

  return (
    <Sidebar
      ref={setSidebarRef}
      styles={{ sidebar: { background: 'white', width: '120vh' } }}
      open={isVisible}
      sidebar={Component}
      pullRight={true}
    >
      {props.children}
      <FloatingAddButton onClick={triggerVisible} />
    </Sidebar>
  );
}

SideBarAddPipeline.propTypes = {
  style: PropTypes.object
};
