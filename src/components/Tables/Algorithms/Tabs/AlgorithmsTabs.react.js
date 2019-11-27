import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Typography, Icon } from 'antd';

import ReactMarkdown from 'react-markdown';
import { Tabs, JsonView, Card, FlexBox } from 'components/common';
import AlgorithmBuildsTable from '../AlgorithmBuildsTable.react';
import { VersionsTable } from '../Versions';

const FlexBoxMinHeight = styled(FlexBox)`
  min-height: 30vh;
`;

const IDs = {
  VERSIONS: 'Versions',
  JSON: 'JSON',
  DESCRIPTION: 'Description',
  BUILDS: 'Builds',
  BUILDS_HISTORY: 'Builds History',
};

const EmptyMarkdown = () => (
  <FlexBoxMinHeight justify="center">
    <FlexBox.Item>
      <Typography>
        <Typography.Title level={3}>Your Readme is Empty</Typography.Title>
        <Typography.Paragraph>
          <Icon type="info-circle" /> Use <Typography.Text code>Update Algorithm</Typography.Text>{' '}
          action
        </Typography.Paragraph>
      </Typography>
    </FlexBox.Item>
  </FlexBoxMinHeight>
);

const AlgorithmsTabs = ({ record: { builds, ...algorithm }, readme }) => (
  <Card isMargin>
    <Tabs>
      {/* Need to add implementation */}
      <Tabs.TabPane tab={IDs.VERSIONS} key={IDs.VERSIONS}>
        <Card>
          <VersionsTable algorithmName={algorithm.name} currentVersion={algorithm.algorithmImage} />
        </Card>
      </Tabs.TabPane>
      <Tabs.TabPane tab={IDs.DESCRIPTION} key={IDs.DESCRIPTION}>
        <Card>{readme ? <ReactMarkdown source={readme} /> : <EmptyMarkdown />}</Card>
      </Tabs.TabPane>
      <Tabs.TabPane tab={IDs.BUILDS} key={IDs.BUILDS}>
        <Card>
          <AlgorithmBuildsTable builds={builds} />
        </Card>
      </Tabs.TabPane>
      <Tabs.TabPane tab={IDs.JSON} key={IDs.JSON}>
        <JsonView jsonObject={algorithm} />
      </Tabs.TabPane>
    </Tabs>
  </Card>
);

AlgorithmsTabs.propTypes = {
  record: PropTypes.object.isRequired,
  readme: PropTypes.string,
};

export default AlgorithmsTabs;
