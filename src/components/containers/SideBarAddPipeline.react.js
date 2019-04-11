import React, { useState } from 'react';
import Sidebar from 'react-sidebar';
import PropTypes from 'prop-types';

import AddPipelineSteps from 'components/dumb/AddPipelineSteps.react';
import FloatingAddButton from 'components/dumb/FloatingAddButton.react';

import JsonEditor from 'components/dumb/JsonEditor.react';

import addPipelineTemplate from 'config/addPipeline.template.json';
import { stringify } from 'utils';

import { Tabs, Card, Button, Upload, Icon, message, Row, Col } from 'antd';
import JsonView from 'components/dumb/JsonView.react';

export default function SideBarAddPipeline({ content }) {
  const [isVisible, setVisible] = useState(false);
  // const [sidebarRef, setSidebarRef] = useState(undefined);
  const [preview, setPreview] = useState(addPipelineTemplate);
  const [json, setJson] = useState(stringify(addPipelineTemplate));

  const triggerVisible = () => setVisible(!isVisible);

  // const handleClickOutside = event => {
  //   if (isVisible && sidebarRef) {
  //     if (!sidebarRef.sidebar !== event.target) {
  //       triggerVisible();
  //     }
  //   }
  // };

  // document.addEventListener('mousedown', handleClickOutside);

  const dragProps = {
    name: 'file',
    accept: '.json',
    customRequest: ({ file, onSuccess }) => {
      setTimeout(() => {
        //TODO: read file
        setPreview(file);
        onSuccess('OK');
      }, 0);
    },
    onChange(info) {
      const status = info.file.status;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    }
  };

  const Component = (
    <Tabs>
      <Tabs.TabPane tab="Wizard" key="1">
        <AddPipelineSteps {...content} style={{ width: '110vh', margin: '0 auto' }} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Upload" key="2">
        <Card bordered={false}>
          <Row type="flex">
            <Col span={12}>
              <Card
                style={{ width: '50vh', margin: '0 auto' }}
                actions={[
                  <Button type="primary" key="submit" onClick={content.onSubmit}>
                    Submit
                  </Button>
                ]}
              >
                <JsonView jsonObject={preview} />
              </Card>
            </Col>
            <Col span={12}>
              <Card bordered={false}>
                <Upload.Dragger {...dragProps} disabled={true}>
                  <p className="ant-upload-drag-icon">
                    <Icon type="inbox" />
                  </p>
                  <p className="ant-upload-text">Click or Drag JSON file.</p>
                  <p className="ant-upload-hint">Support .json files only</p>
                </Upload.Dragger>
              </Card>
            </Col>
          </Row>
        </Card>
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
      styles={{ sidebar: { background: 'white', width: '110vh' } }}
      open={isVisible}
      sidebar={Component}
      pullRight={true}
    >
      <FloatingAddButton onClick={triggerVisible} />
    </Sidebar>
  );
}

SideBarAddPipeline.propTypes = {
  style: PropTypes.object
};
