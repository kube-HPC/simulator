import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Tabs, Button, Typography, Icon } from 'antd';
import ReactMarkdown from 'react-markdown';

import JsonView from 'components/common/json/JsonView.react';
import defaultMarkdown from 'config/template/readme.template.md';
import DrawerContainer from 'components/common/drawer/DrawerContainer.react';
import MDEditor from 'components/common/md/MDEditor.react';

const CenterText = styled.div`
  min-height: 30vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CenterMD = styled(ReactMarkdown)`
  margin: 1%;
`;

function AlgorithmTabSwitcher({ algorithmDetails, readme, onSubmit }) {
  const [readmeValue, setReadmeValue] = useState('');
  const [defaultValue, setDefaultValue] = useState('');

  const [activeKey, setActiveKey] = useState('JSON');

  useEffect(() => {
    fetch(defaultMarkdown)
      .then(res => res.text())
      .then(text => setDefaultValue(text));
  }, []);

  return (
    <Tabs
      activeKey={activeKey}
      onChange={setActiveKey}
      tabBarExtraContent={
        activeKey === 'Description' && (
          <DrawerContainer
            title={'Algorithm Description'}
            description={
              <>
                Edit description and{' '}
                <Typography.Text code>Submit</Typography.Text> it.
              </>
            }
            opener={onVisible => (
              <Button
                icon="file-markdown"
                onClick={() => onVisible(prev => !prev)}
              >
                Edit Description
              </Button>
            )}
            onSubmit={() => onSubmit(algorithmDetails.name, readmeValue)}
            extra={[
              <Button
                type="danger"
                key="clear"
                onClick={() => setReadmeValue(' ')}
              >
                Clear
              </Button>
            ]}
          >
            <MDEditor
              data={readmeValue || defaultValue}
              onChange={setReadmeValue}
            />
          </DrawerContainer>
        )
      }
    >
      <Tabs.TabPane tab="JSON" key="JSON">
        <JsonView jsonObject={algorithmDetails} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Description" key="Description">
        {readme ? (
          <CenterMD source={readme || defaultValue} />
        ) : (
          <CenterText>
            <Typography>
              <Typography.Title level={3}>
                Your Readme is empty
              </Typography.Title>
              <Typography.Paragraph>
                <Icon type="info-circle" /> Use{' '}
                <Typography.Text code>Edit Description</Typography.Text>
              </Typography.Paragraph>
            </Typography>
          </CenterText>
        )}
      </Tabs.TabPane>
    </Tabs>
  );
}

AlgorithmTabSwitcher.propTypes = {
  algorithmDetails: PropTypes.object,
  readme: PropTypes.string
};

export default AlgorithmTabSwitcher;
