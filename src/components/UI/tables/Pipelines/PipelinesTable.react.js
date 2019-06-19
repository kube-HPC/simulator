import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import {
  execStoredPipe,
  deleteStoredPipeline,
  updateStoredPipeline,
  cronStart,
  cronStop
} from 'actions/storedPipes.action';
import { addPipeline } from 'actions/addPipeline.action';
import { getPipelineReadme } from 'actions/readme.action';
import InfinityTable from 'components/UI/Layout/InfinityTable.react';
import pipelinesTableColumns from 'components/UI/tables/Pipelines/PipelinesTableColumns.react';
import PipelineTabSwitcher from 'components/UI/tables/Pipelines/PipelinesTabSwitcher.react';

function PipelinesTable(props) {
  const { storedPipelines, pipelineReadme, getPipelineReadme } = props;

  return (
    <InfinityTable
      rowKey={pipeline => pipeline.name}
      dataSource={storedPipelines}
      columns={pipelinesTableColumns(props)}
      onExpand={(expanded, record) => {
        if (expanded) getPipelineReadme(record.name);
      }}
      expandedRowRender={record => (
        <PipelineTabSwitcher
          pipelineDetails={record}
          readme={
            pipelineReadme &&
            pipelineReadme[record.name] &&
            pipelineReadme[record.name].readme
          }
        />
      )}
    />
  );
}

PipelinesTable.propTypes = {
  storedPipelines: PropTypes.array.isRequired,
  addPipe: PropTypes.func.isRequired,
  execStoredPipe: PropTypes.func.isRequired,
  deleteStoredPipeline: PropTypes.func.isRequired,
  updateStoredPipeline: PropTypes.func.isRequired,
  cronStart: PropTypes.func.isRequired,
  cronStop: PropTypes.func.isRequired,
  getPipelineReadme: PropTypes.func,
  pipelineReadme: PropTypes.object
};

const mapStateToProps = state => ({
  storedPipelines: state.storedPipeline.dataSource,
  pipelineReadme: state.pipelineReadme
});

export default connect(
  mapStateToProps,
  {
    addPipe: addPipeline,
    execStoredPipe,
    deleteStoredPipeline,
    updateStoredPipeline,
    cronStart,
    cronStop,
    getPipelineReadme
  }
)(PipelinesTable);
