import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

import { connect } from 'react-redux';
import { withState } from 'recompose';
import { createSelector } from 'reselect';

import {
  downloadStorageResults,
  execRawPipeline,
  stopPipeline,
  init
} from 'actions/containerTable.action';
import { getJaegerData } from 'actions/jaegerGetData.action';
import { getKubernetesLogsData } from 'actions/kubernetesLog.action';
import { openModal } from 'actions/modal.action';

import InfinityTable from 'components/UI/Layout/InfinityTable.react';
import TabSwitcher from 'components/dumb/TabSwitcher.react';
import jobsTableColumns from 'components/UI/tables/columns/JobsTableColumns.react';

function JobsTable({ dataSource, ...props }) {
  useEffect(() => {
    props.init();
  }, []);

  const { stopPipeline, execRawPipeline, downloadStorageResults } = props;

  return (
    <InfinityTable
      columns={jobsTableColumns(
        stopPipeline,
        execRawPipeline,
        downloadStorageResults
      )}
      dataSource={dataSource}
      expandedRowRender={record => (
        <TabSwitcher
          record={{
            key: record.key,
            graph: record.graph,
            record: {
              pipeline: record.pipeline,
              status: record.status,
              results: record.results
            },
            jaeger: props.jaeger[record.key] || null
          }}
        />
      )}
      onExpand={(expanded, record) =>
        expanded && props.getJaegerData(record.key)
      }
    />
  );
}

const containerTable = state => state.containerTable.dataSource;

const autoCompleteFilter = state => state.autoCompleteFilter.filter;

const rowFilter = (raw, value) =>
  Object.values(raw.status).find(data =>
    data instanceof Object ? false : data.includes(value) ? true : false
  );

const tableDataSelector = createSelector(
  containerTable,
  autoCompleteFilter,
  (containerTable, autoCompleteFilter) =>
    containerTable &&
    containerTable.asMutable().filter(row => rowFilter(row, autoCompleteFilter))
);

JobsTable.propTypes = {
  execRawPipeline: PropTypes.func.isRequired,
  downloadStorageResults: PropTypes.func.isRequired,
  init: PropTypes.func.isRequired,
  getJaegerData: PropTypes.func.isRequired,
  dataSource: PropTypes.array.isRequired,
  stopPipeline: PropTypes.func.isRequired,
  jaeger: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  dataSource: tableDataSelector(state),
  jaeger: state.jaeger,
  kubernetesLogs: state.kubernetesLogs
});

export default connect(
  mapStateToProps,
  {
    openModal,
    init,
    stopPipeline,
    execRawPipeline,
    downloadStorageResults,
    getJaegerData,
    getKubernetesLogsData
  }
)(
  withState('isVisible', 'onPopoverClickVisible', {
    visible: false,
    podName: ''
  })(JobsTable)
);
