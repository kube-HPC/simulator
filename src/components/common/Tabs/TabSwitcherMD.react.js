import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Typography, Icon, Tabs } from 'antd';
import ReactMarkdown from 'react-markdown';
import { JsonView } from '..';

const CenterText = styled.div`
  min-height: 30vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CenterMD = styled(ReactMarkdown)`
  margin: 1%;
`;

function TabSwitcherMD({ jsonObject, readme }) {
  return (
    <Tabs>
      <Tabs.TabPane tab="JSON" key="JSON">
        <JsonView jsonObject={jsonObject} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Description" key="Description">
        {readme ? (
          <CenterMD source={readme} />
        ) : (
          <CenterText>
            <Typography>
              <Typography.Title level={3}>Your Readme is empty</Typography.Title>
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

TabSwitcherMD.propTypes = {
  jsonObject: PropTypes.object.isRequired,
  readme: PropTypes.string
};

export default TabSwitcherMD;
