import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Card } from 'antd';
import React from 'react';

import { init } from 'actions/driverTable.action';
import driversTableColumns from 'components/UI/tables/Drivers/DriversTableColumns.react';
import JsonView from 'components/containers/json/JsonView.react';
import InfinityTable from 'components/UI/Layout/InfinityTable.react';

function DriversTable({ init, dataSource, ...props }) {
  return (
    <InfinityTable
      columns={driversTableColumns(props)}
      dataSource={dataSource.asMutable()}
      expandedRowRender={record => (
        <Card title="Full details">
          <JsonView jsonObject={record} />
        </Card>
      )}
    />
  );
}

DriversTable.propTypes = {
  init: PropTypes.func.isRequired,
  dataSource: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  dataSource: state.driverTable.dataSource
});

export default connect(
  mapStateToProps,
  { init }
)(DriversTable);
