import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import groupby from 'lodash/groupBy';
import { createSelector } from 'reselect';
import React, { useEffect } from 'react';
import {
  init,
  cancelBuild,
  rerunBuild
} from 'actions/algorithmBuildsTable.action';

import {
  buildsTableColumns,
  nestedBuildTableColumns
} from 'components/UI/tables/columns/AlgorithmBuildsTableColumns.react';

import InfinityTable from '../Layout/InfinityTable.react';
import JsonView from 'components/dumb/JsonView.react';

function AlgorithmBuildsTable({ init, ...props }) {
  useEffect(() => {
    init();
  }, []);

  const { dataSource } = props;

  const expandedRowRender = record => {
    const data = [];
    const dataSource = props.dataSource.filter(
      d => d.algorithmName === record.algorithmName
    );

    dataSource.forEach(d => {
      data.push(d);
    });

    return (
      <InfinityTable
        columns={nestedBuildTableColumns(props)}
        dataSource={data}
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
  init: PropTypes.func.isRequired,
  cancelBuild: PropTypes.func.isRequired,
  rerunBuild: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  dataSource: tableDataSelector(state)
});

export default connect(
  mapStateToProps,
  { init, cancelBuild, rerunBuild }
)(AlgorithmBuildsTable);
