import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { Input, Radio, Select } from 'antd';
import {
  Form,
  EditableTagGroup,
  FlexBox,
  HelpSiteLink,
} from 'components/common';
import { useExperiments } from 'hooks/graphql';

import ControllerKeyValue from '../Nodes/inputKeyValueJson';
import useWizardContext from '../../useWizardContext';
import DrawerReadMeFile from '../../../../../components/Drawer/DrawerReadMeFile';
import GraphPreview from '../../../../Tables/Jobs/GridView/GraphPreview';

const { Option } = Select;

/** @param {{ style: import('react').CSSProperties }} props */
const Initial = ({ style }) => {
  const { isEdit, isRunPipeline, valuesState } = useWizardContext();

  const [isSelectStreaming, setIsSelectStreaming] = useState(
    valuesState.kind === 'stream'
  );
  const [nodeNames] = useState(
    valuesState?.nodes?.map(item => item?.nodeName) || []
  );

  // get list nodes
  const { experiments } = useExperiments();

  return (
    <div style={style}>
      <Form.Item
        label="Name"
        name={['name']}
        rules={[{ required: true, message: 'Pipeline name is required' }]}
        required
        hidden={isRunPipeline}>
        <Input disabled={isEdit} placeholder="Unique Identifier" />
      </Form.Item>
      {!isRunPipeline && (
        <FlexBox align="start">
          <FlexBox.Item span={18}>
            <Form.Item
              hidden={isRunPipeline}
              label="Description"
              name={['description']}>
              <Input
                placeholder="Pipeline Description"
                style={{ marginLeft: '34px' }}
              />
            </Form.Item>
          </FlexBox.Item>
          <FlexBox.Item>
            <DrawerReadMeFile
              name={valuesState.name}
              type="pipelines"
              disabled={!isEdit}
            />
          </FlexBox.Item>
        </FlexBox>
      )}

      <FlexBox align="start">
        <FlexBox.Item span={12}>
          <Form.Item
            label="Pipeline Kind"
            name={['kind']}
            rules={[{ required: true }]}
            initialValue="batch"
            labelCol={{ span: 10, offset: 0 }}>
            {isRunPipeline ? (
              valuesState?.kind
            ) : (
              <Radio.Group>
                <Radio.Button
                  value="batch"
                  onClick={() => setIsSelectStreaming(false)}>
                  Batch
                </Radio.Button>
                <Radio.Button
                  value="stream"
                  onClick={() => setIsSelectStreaming(true)}>
                  Streaming
                </Radio.Button>
              </Radio.Group>
            )}
          </Form.Item>
        </FlexBox.Item>
        <FlexBox.Item span={12}>
          {isSelectStreaming && (
            <HelpSiteLink
              link="/learn/streaming/"
              style={{ position: 'absolute', marginLeft: '-33px' }}
            />
          )}
        </FlexBox.Item>
      </FlexBox>
      {isRunPipeline && (
        <>
          <Form.Item label="Experiments" name={['experimentName']}>
            <Select style={{ width: '100%' }}>
              {experiments.map(experiment => (
                <Option key={experiment.name}>{experiment.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Debugged Nodes" name={['options', 'debugOverride']}>
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="Please select">
              {nodeNames &&
                nodeNames.map(nodeName => (
                  <Option key={nodeName}>{nodeName}</Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item label="Tags" name={['tags']}>
            <EditableTagGroup />
          </Form.Item>
        </>
      )}

      <Form.Item label="Flow Input" name={['flowInput']}>
        <ControllerKeyValue nameRef={['flowInput']} />
      </Form.Item>
      <div>
        <GraphPreview
          pipeline={valuesState}
          isBuildAllFlows={isSelectStreaming}
        />
      </div>
    </div>
  );
};

Initial.propTypes = {
  // eslint-disable-next-line
  style: PropTypes.object.isRequired,
};

export default Initial;
