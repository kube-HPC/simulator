import { connect } from 'react-redux';
import { Card } from 'antd';
import { createSelector } from 'reselect';
import React from 'react';
import PropTypes from 'prop-types';

import { addAlgorithm, deleteAlgorithm } from 'actions/debugTable.action';
import debugTableColumns from 'components/UI/tables/Debug/DebugTableColumns.react';
import InfinityTable from '../../Layout/InfinityTable.react';
import JsonView from 'components/containers/json/JsonView.react';

function DebugTable({ init, ...props }) {
  const { dataSource } = props;

  return (
    <InfinityTable
      columns={debugTableColumns(props)}
      dataSource={dataSource.asMutable()}
      expandedRowRender={record => (
        <Card title="Full details">
          <JsonView jsonObject={record} />
        </Card>
      )}
    />
  );
}

const debugTable = state => state.debugTable.dataSource;
const autoCompleteFilter = state => state.autoCompleteFilter.filter;

const tableDataSelector = createSelector(
  debugTable,
  autoCompleteFilter,
  debugTable => debugTable
);

DebugTable.propTypes = {
  init: PropTypes.func.isRequired,
  dataSource: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  dataSource: tableDataSelector(state)
});

export default connect(
  mapStateToProps,
  { addAlgorithm, deleteAlgorithm }
)(DebugTable);
