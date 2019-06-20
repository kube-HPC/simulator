import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import groupby from 'lodash/groupBy';
import { createSelector } from 'reselect';
import React from 'react';
import { cancelBuild, rerunBuild } from 'actions/builds.action';

import {
  buildsTableColumns,
  nestedBuildTableColumns
} from 'components/UI/tables/AlgorithmBuilds/AlgorithmBuildsTableColumns.react';

import InfinityTable from 'components/UI/Layout/InfinityTable.react';
import JsonView from 'components/containers/json/JsonView.react';

function AlgorithmBuildsTable(props) {
  const { dataSource } = props;

  const expandedRowRender = record => {
    const algorithms = props.dataSource.filter(
      d => d.algorithmName === record.algorithmName
    );

    return (
      <InfinityTable
        rowKey={record => record.buildId}
        columns={nestedBuildTableColumns(props)}
        dataSource={algorithms}
        expandedRowRender={record => <JsonView jsonObject={record} />}
      />
    );
  };

  const grouped = groupby(dataSource, 'algorithmName');
  const builds = Object.entries(grouped).map(([k, v]) => ({
    algorithmName: k,
    statuses: groupby(v, 'status')
  }));

  return (
    <InfinityTable
      rowKey={record => record.algorithmName}
      columns={buildsTableColumns(props)}
      dataSource={builds}
      expandedRowRender={expandedRowRender}
    />
  );
}

const tableDataSelector = createSelector(
  state => state.algorithmBuildsTable.dataSource,
  state => state.autoCompleteFilter.filter,
  algorithmBuildsTable => algorithmBuildsTable
);

AlgorithmBuildsTable.propTypes = {
  dataSource: PropTypes.array.isRequired,
  cancelBuild: PropTypes.func.isRequired,
  rerunBuild: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  dataSource: tableDataSelector(state)
});

export default connect(
  mapStateToProps,
  { cancelBuild, rerunBuild }
)(AlgorithmBuildsTable);
