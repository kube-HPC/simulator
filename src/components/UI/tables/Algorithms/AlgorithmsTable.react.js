import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import React from 'react';
import { getAlgorithmReadme } from 'actions/readme.action';
import {
  init,
  applyAlgorithm,
  deleteAlgorithmFromStore
} from 'actions/algorithmTable.action';

import AlgorithmTabSwitcher from 'components/UI/tables/Algorithms/AlgorithmTabSwitcher.react';
import InfinityTable from 'components/UI/Layout/InfinityTable.react';
import algorithmsTableColumns from 'components/UI/tables/Algorithms/AlgorithmsTableColumns.react';
import { stringify } from 'utils/string';

function AlgorithmsTable(props) {
  const onSubmit = data => {
    const formData = new FormData();
    formData.append('payload', stringify(data));
    props.applyAlgorithm(formData);
  };

  const { dataSource, algorithmReadme } = props;

  return (
    <InfinityTable
      columns={algorithmsTableColumns({ ...props, onSubmit })}
      dataSource={dataSource.asMutable()}
      onExpand={(expanded, record) =>
        expanded && props.getAlgorithmReadme(record.key)
      }
      expandedRowRender={record => (
        <AlgorithmTabSwitcher
          algorithmDetails={record}
          readme={
            algorithmReadme &&
            algorithmReadme[record.key] &&
            algorithmReadme[record.key].readme
          }
        />
      )}
    />
  );
}

const algorithmTable = state => state.algorithmTable.dataSource;
const autoCompleteFilter = state => state.autoCompleteFilter.filter;

const tableDataSelector = createSelector(
  algorithmTable,
  autoCompleteFilter,
  algorithmTable => algorithmTable
);

AlgorithmsTable.propTypes = {
  dataSource: PropTypes.array.isRequired,
  getAlgorithmReadme: PropTypes.func.isRequired,
  applyAlgorithm: PropTypes.func.isRequired,
  deleteAlgorithmFromStore: PropTypes.func.isRequired,
  algorithmReadme: PropTypes.object
};

const mapStateToProps = state => ({
  dataSource: tableDataSelector(state),
  algorithmReadme: state.algorithmReadme
});

export default connect(
  mapStateToProps,
  {
    init,
    applyAlgorithm,
    deleteAlgorithmFromStore,
    getAlgorithmReadme
  }
)(AlgorithmsTable);
