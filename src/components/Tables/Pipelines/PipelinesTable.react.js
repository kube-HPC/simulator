import React, { useReducer, useState } from 'react';

import { usePipeline } from 'hooks';
import { Table } from 'components';

import getPipelineColumns from './getPipelineColumns.react';
import PipelineTabs from './Tabs/PipelineTabs.react';
import DrawerEditor from 'components/Drawer/DrawerEditor/DrawerEditor.react';
import { Typography } from 'antd';
import { stringify } from 'utils';

const { Text, Title, Paragraph } = Typography;

const titleExecution = (
  <>
    <Title level={2}>Execute Stored Pipeline</Title>
    <Paragraph>
      Start pipeline <Text code>execution</Text> when the name of the pipeline is known, all
      parameters in this action will be merged with the stored pipeline.
    </Paragraph>
  </>
);

const title = (
  <>
    <Title level={2}>Update Pipeline</Title>
    <Paragraph>
      Edit pipeline properties and description, <Typography.Text strong>submit</Typography.Text>{' '}
      changes with
      <Typography.Text code>Update</Typography.Text> button.
    </Paragraph>
  </>
);

const PipelinesTable = () => {
  const { dataSource, update, execute, ...actions } = usePipeline();
  const [isExecution, setIsExecution] = useState(true);
  const [visible, toggle] = useReducer(prev => !prev, false);
  const [pipeline, setPipeline] = useState(undefined);
  const [execPipeline, setExecPipeline] = useState(undefined);

  const expandedRowRender = record => <PipelineTabs record={record} />;

  return (
    <>
      <DrawerEditor
        visible={visible}
        title={isExecution ? titleExecution : title}
        value={stringify(isExecution ? execPipeline : pipeline)}
        onClose={toggle}
        onSubmit={isExecution ? execute : update}
        submitText={isExecution ? 'Run' : 'Submit'}
      />
      <Table
        rowKey={({ name }) => name}
        dataSource={dataSource}
        columns={getPipelineColumns({
          setPipeline,
          toggle,
          setExecPipeline,
          setIsExecution,
          update,
          ...actions,
        })}
        expandedRowRender={expandedRowRender}
      />
    </>
  );
};

export default React.memo(PipelinesTable);
