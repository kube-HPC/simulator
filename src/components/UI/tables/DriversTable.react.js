import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Card } from 'antd';
import React, { useEffect } from 'react';

import { init } from 'actions/driverTable.action';
import driversTableColumns from 'components/UI/tables/columns/DriversTableColumns.react';
import JsonView from 'components/dumb/JsonView.react';
import InfinityTable from 'components/UI/Layout/InfinityTable.react';

function DriversTable({ init, ...props }) {
  useEffect(() => {
    init();
  }, []);

  const { dataSource } = props;
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
  init: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  dataSource: state.driverTable.dataSource
});

export default connect(
  mapStateToProps,
  { init }
)(DriversTable);
