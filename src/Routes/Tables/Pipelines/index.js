import React, { useCallback } from 'react';
import { Route, useHistory, useParams } from 'react-router-dom';
import { Table } from 'components';
import Drawer from 'components/Drawer';
import { DRAWER_SIZE } from 'const';
import { usePipeline } from 'hooks';
import useToggle from 'hooks/useToggle';
import getPipelineColumns from './getPipelineColumns.react';
import PipelineInfo from './PipelineInfo.react';

const rowKey = ({ name }) => name;

const PipelineDrawer = () => {
  const { pipelineId } = useParams();
  const { setOff, isOn } = useToggle(true);
  const { dataSource } = usePipeline();
  const record = dataSource.find(item => item.name === pipelineId);
  const history = useHistory();

  const goBack = useCallback(() => {
    history.replace('/pipelines');
  }, [history]);
  return (
    <Drawer
      isOpened={isOn}
      onDidClose={goBack}
      onClose={setOff}
      width={DRAWER_SIZE.ALGORITHM_INFO}
      title={record.name}>
      <PipelineInfo record={record} />
    </Drawer>
  );
};

const PipelinesTable = () => {
  const { dataSource, ...actions } = usePipeline();

  const history = useHistory();
  const onRow = record => ({
    onDoubleClick: () => history.replace(`/pipelines/${record.name}`),
  });

  return (
    <>
      <Table
        rowKey={rowKey}
        dataSource={dataSource}
        columns={getPipelineColumns(actions)}
        onRow={onRow}
        expandIcon={false}
      />
      <Route path="/pipelines/:pipelineId" component={PipelineDrawer} />
    </>
  );
};

export default React.memo(PipelinesTable);
