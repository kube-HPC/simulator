import PropTypes from 'prop-types';
import React from 'react';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { getJaegerData } from 'actions/jaegerGetData.action';

import InfinityTable from 'components/UI/Layout/InfinityTable.react';
import JobsTabSwitcher from 'components/UI/tables/Jobs/JobsTabSwitcher.react';
import jobsTableColumns from 'components/UI/tables/Jobs/JobsTableColumns.react';

function JobsTable({ init, dataSource, ...props }) {
  return (
    <InfinityTable
      columns={jobsTableColumns(props)}
      dataSource={dataSource}
      expandedRowRender={record => (
        <JobsTabSwitcher
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
      onExpand={(_, record) => props.getJaegerData(record.key)}
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
  getJaegerData: PropTypes.func.isRequired,
  dataSource: PropTypes.array.isRequired,
  jaeger: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  dataSource: tableDataSelector(state),
  jaeger: state.jaeger,
  kubernetesLogs: state.kubernetesLogs
});

export default connect(
  mapStateToProps,
  { getJaegerData }
)(JobsTable);
