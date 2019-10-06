import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Typography, Icon } from 'antd';
import ReactMarkdown from 'react-markdown';
import { Tabs, JsonView, Card } from 'components/common';

const CenterText = styled.div`
  min-height: 30vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CenterMD = styled(ReactMarkdown)`
  margin: 1%;
`;

const AlgorithmsTabs = ({ record, source }) => {
  return (
    <Card>
      <Tabs>
        <Tabs.TabPane tab="JSON" key="JSON">
          <JsonView jsonObject={record} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Description" key="Description">
          {source ? (
            <CenterMD source={source} />
          ) : (
            <CenterText>
              <Typography>
                <Typography.Title level={3}>Your Readme is empty</Typography.Title>
                <Typography.Paragraph>
                  <Icon type="info-circle" /> Use
                  <Typography.Text code>Edit Description</Typography.Text>
                </Typography.Paragraph>
              </Typography>
            </CenterText>
          )}
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};

AlgorithmsTabs.propTypes = {
  record: PropTypes.object.isRequired,
  jsonObject: PropTypes.object.isRequired,
  source: PropTypes.string.isRequired
};

export default AlgorithmsTabs;
