import React from 'react';

import USER_GUIDE from 'constants/user-guide';
import { Typography, Icon, Tag, Divider } from 'antd';
import { COLOR_LAYOUT } from 'styles/colors';

const { Text, Paragraph } = Typography;

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
          <Text strong>HKube</Text> is a cloud-native open source framework
          which run distributed pipeline of algorithms.
        </Paragraph>
        <Paragraph>
          The <Text strong>Dashboard</Text> supports every functionality{' '}
          <Text strong>HKube</Text> has to offer.
        </Paragraph>

        {/* {// TODO: Add tutorial picker} */}
        {/* <Title level={4}>Pick a Tutorial</Title> */}
        {/* <Select defaultValue="introduction" style={{ width: '100%' }}>
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
        </Select> */}
      </>
    ),
    locale: { skip: 'Skip' },
    placement: 'center'
  },
  {
    target: USER_GUIDE.HEADER.AUTO_COMPLETE,
    title: <>Table Auto Complete</>,
    content: (
      <Paragraph>
        The <Text strong>search-bar</Text> allows you to filter current table's
        data.
      </Paragraph>
    ),
    placement: 'bottom'
  },
  {
    target: USER_GUIDE.HEADER.SOCIALS,
    title: <>External Sources</>,
    content: (
      <Paragraph>
        Visit <Text strong>HKube's</Text> <Text code>Website</Text> and{' '}
        <Text code>Github</Text> repository.
        <br />
        You can run the tutorial any time by pressing{' '}
        <Icon type="question-circle" />
      </Paragraph>
    ),
    placement: 'bottom'
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
        The tables allow you to operate HKube.
        <br />
        Each table has its unique actions, like re-running{' '}
        <Text code>Jobs</Text>, starting a <Text code>Pipeline</Text> and
        updating <Text code>Algorithm</Text> resources. <br />
        <Divider />
        Notice the{' '}
        <Tag style={{ color: COLOR_LAYOUT.colorPrimary }}>
          The Entries Count
        </Tag>
        for each table.
        <br />
        <Text underline>For example</Text>, there are currently{' '}
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
      <>
        <Paragraph>
          <Text strong>Monitor</Text> your deployed data.
          <br />
          Each table has its <Text strong>own properties</Text> and{' '}
          <Text strong>additional actions</Text>.<br />
        </Paragraph>
        <Paragraph>
          <Text underline>For example</Text>, we can see the jobs{' '}
          <Text code>Status</Text>, <Text code>Live Progress</Text>, job{' '}
          <Text code>Re-Run</Text> and <Text code>Download</Text> its results.
          <Divider />
          We will dive into each table in a moment! 🤗
        </Paragraph>
      </>
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
        The <Text code>Operations</Text> allows you to add data to{' '}
        <Text strong>HKube</Text>.
        <Divider />
        <Text underline>For example</Text>, you can add a{' '}
        <Text code>Pipeline</Text> an <Text code>Algorithm</Text> and even{' '}
        <Text code>Debug</Text> your <Text strong>algorithm</Text> directly in
        your own <Text strong>IDE</Text>.
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
        Monitor <Text strong>HKube's</Text> stats.
        <Divider />
        <Text underline>For example</Text>, <Text code>Error logs</Text>
        <Text code>CPU</Text> and <Text code>Memory</Text>
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
        Click on the <Text code>Job ID</Text>, it will copy it! 🤩
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
        Use <Text strong>additional actions</Text> like <Text code>Re-Run</Text>
        , <Text code>Cancel</Text>, <Text code>Stop/Continue</Text> and{' '}
        <Text code>Download Results</Text> for each entry!
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
        you can expend the row.
        <br />
        Inspect additional data like <Text code>Graph</Text>,{' '}
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
