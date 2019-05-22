import { connect } from 'react-redux';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import PipelineTabSwitcher from 'components/dumb/PipelineTabSwitcher.react';
import { init } from 'actions/storedPipes.action';
import { openModal } from 'actions/modal.action';
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
import pipelinesTableColumns from 'components/UI/tables/columns/PipelinesTableColumns.react';

function PipelinesTable({ init, ...props }) {
  const { storedPipelines, pipelineReadme, getPipelineReadme } = props;

  // Need to remove "nodes" key from each pipeline.
  const fixedDataSource = [];
  storedPipelines.forEach(p => {
    const pipe = JSON.parse(JSON.stringify(p));
    delete pipe.nodes;
    fixedDataSource.push(pipe);
  });

  return (
    <InfinityTable
      dataSource={storedPipelines.asMutable()}
      columns={pipelinesTableColumns({ ...props, fixedDataSource })}
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
  init: PropTypes.func.isRequired,
  storedPipelines: PropTypes.array.isRequired,
  getPipelineReadme: PropTypes.func,
  pipelineReadme: PropTypes.object
};

const mapStateToProps = state => ({
  algorithms: state.algorithmTable.dataSource,
  storedPipelines: state.storedPipeline.dataSource,
  dataStats: state.storedPipeline.dataStats,
  pipelineReadme: state.pipelineReadme
});

export default connect(
  mapStateToProps,
  {
    openModal,
    init,
    addPipe: addPipeline,
    execStoredPipe,
    deleteStoredPipeline,
    updateStoredPipeline,
    cronStop,
    cronStart,
    getPipelineReadme
  }
)(PipelinesTable);
