import React from 'react';

import USER_GUIDE from 'constants/user-guide';
import { Typography, Select, Icon, Tag, Divider } from 'antd';
import { COLOR_LAYOUT } from 'constants/colors';

const { Title, Text, Paragraph } = Typography;

const steps = [
  {
    target: USER_GUIDE.WELCOME,
    title: (
      <>
        Welcome to HKube Dashboard!{' '}
        <span role="img" aria-label="Party">
          🥳
        </span>
      </>
    ),
    content: (
      <>
        <Paragraph>
          HKube is a cloud-native open source framework to run distributed
          pipeline of algorithms.
        </Paragraph>
        <Paragraph>
          We use the <Text strong>Dashboard</Text> for deploying and monitoring
          user algorithms and pipelines.
        </Paragraph>
        <Title level={4}>Pick a Tutorial</Title>
        <Select defaultValue="introduction" style={{ width: '100%' }}>
          <Select.OptGroup label="Beginner">
            <Select.Option value="introduction">Introduction</Select.Option>
            <Select.Option value="addPipeline">Add Pipeline</Select.Option>
            <Select.Option value="addAlgorithm">Add Algorithm</Select.Option>
          </Select.OptGroup>
          <Select.OptGroup label="Intermediate">
            <Select.Option value="complexPipeline">
              Add Complex Pipeline
            </Select.Option>
          </Select.OptGroup>
        </Select>
      </>
    ),
    locale: { skip: 'Skip' },
    placement: 'center'
  },
  {
    target: USER_GUIDE.SIDEBAR_LEFT,
    title: (
      <>
        Tables Menu{' '}
        <span role="img" aria-label="Party">
          🗂
        </span>
      </>
    ),
    content: (
      <Paragraph>
        Switch between <Text strong>tables</Text> like{' '}
        <Text code>Pipelines</Text>,<Text code>Algorithms</Text> and
        <Text code>Jobs</Text>.<br />
        We can notice{' '}
        <Tag style={{ color: COLOR_LAYOUT.colorPrimary }}>
          The Entries Count
        </Tag>
        for each table.
        <Divider />
        For example, there are currently{' '}
        <Tag style={{ color: COLOR_LAYOUT.colorPrimary }}>3</Tag>
        <Text strong>Jobs</Text> deployed.
      </Paragraph>
    ),
    placement: 'right-start',
    spotlightPadding: 0
  },
  {
    target: USER_GUIDE.TABLE,
    title: (
      <>
        Table Data{' '}
        <span role="img" aria-label="Party">
          🕵️‍
        </span>
      </>
    ),
    content: (
      <Paragraph>
        <Text strong>Monitor</Text> your deployed data.
        <br />
        Each table has its <Text strong>own properties</Text> and{' '}
        <Text strong>additional actions</Text>.
        <Divider />
        We will dive into each table in a moment! 🤗
      </Paragraph>
    ),
    placement: 'bottom'
  },
  {
    target: USER_GUIDE.SIDEBAR_TOP_RIGHT,
    title: (
      <>
        Operations Sidebar{' '}
        <span role="img" aria-label="Party">
          🖊
        </span>
      </>
    ),
    content: (
      <Paragraph>
        Use actions like <Text code>Add Pipeline</Text> and{' '}
        <Text code>Add Algorithm</Text> to <Text strong>deploy</Text> data.
      </Paragraph>
    ),
    placement: 'left'
  },
  {
    target: USER_GUIDE.SIDEBAR_BOTTOM_RIGHT,
    title: (
      <>
        Status Sidebar{' '}
        <span role="img" aria-label="Status">
          🌡
        </span>
      </>
    ),
    content: (
      <Paragraph>
        Monitor cluster stats
        <br /> by accessing <Text code>Errors Logs</Text> and{' '}
        <Text code>Cluster Stats</Text>
      </Paragraph>
    ),
    placement: 'top'
  },
  {
    target: USER_GUIDE.TABLE_JOB.MENU_SELECT,
    title: <>Jobs Table Tutorial</>,
    content: (
      <Paragraph>
        We currently viewing all <Text strong>deployed</Text> jobs
      </Paragraph>
    ),
    placement: 'right'
  },
  {
    target: USER_GUIDE.TABLE_JOB.ID_SELECT,
    title: <>Copy Important Entries</>,
    content: (
      <Paragraph>
        Click on the <Text code>Job ID</Text>, it will copy its ID! 🤩
      </Paragraph>
    ),
    spotlightClicks: true,
    placement: 'bottom'
  },
  {
    target: USER_GUIDE.TABLE_JOB.ACTIONS_SELECT,
    title: (
      <>
        Table Actions{' '}
        <span role="img" aria-label="inspect">
          🧐
        </span>
      </>
    ),
    content: (
      <Paragraph>
        We have <Text strong>additional actions</Text> like{' '}
        <Text code>Re-Run</Text>, <Text code>Cancel</Text>,{' '}
        <Text code>Stop/Continue</Text> and <Text code>Download Results</Text>{' '}
        for each entry!
      </Paragraph>
    ),
    placement: 'right'
  },
  {
    target: USER_GUIDE.TABLE_JOB.ROW_SELECT,
    title: <>Table Row Selected</>,
    content: (
      <Paragraph>
        By clicking on{' '}
        <Text code>
          <Icon type="right" />
        </Text>{' '}
        we expended the row.
        <br />
        We can inspect additional data like <Text code>Graph</Text>,{' '}
        <Text code>Trace</Text>, <Text code>JSON</Text> 🤘.
      </Paragraph>
    ),
    placement: 'top'
  }
];

const userGuideSteps = steps.map(step => ({
  ...step,
  target: `.${step.target}`
}));

export default userGuideSteps;
