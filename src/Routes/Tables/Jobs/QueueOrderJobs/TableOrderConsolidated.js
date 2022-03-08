import React from 'react';
import PropTypes from 'prop-types';
import { TypeTableColumns } from './OrderComponents';
import { TableAllInOne } from './OrderStyles';

class TableOrderConsolidated extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }

  componentDidMount() {
    const { handlePageSize, dataSourceAllJobs } = this.props;

    const tableContent = document.querySelector(
      '.TableAllInOne div.ant-table-body'
    );
    tableContent.addEventListener('scroll', event => {
      const maxScroll = event.target.scrollHeight - event.target.clientHeight;
      const currentScroll = event.target.scrollTop;
      if (currentScroll === maxScroll) {
        this.setState({ isLoading: true });
        handlePageSize();
      }
    });

    if (dataSourceAllJobs.length > 0) {
      this.setState({ isLoading: false });
    }
  }

  componentDidUpdate() {
    const { isLoading } = this.state;
    if (isLoading) {
      setTimeout(() => this.setState({ isLoading: false }), 1500);
    }
  }

  render() {
    const { dataSourceAllJobs } = this.props;
    const { isLoading } = this.state;

    return (
      <TableAllInOne
        className="TableAllInOne"
        pagination={false}
        dataSource={dataSourceAllJobs}
        columns={TypeTableColumns.ALLJOBID}
        rowKey={record => `${record.key}_${record.typeElement}`}
        scroll={{ y: '80vh' }}
        loading={isLoading}
      />
    );
  }
}

TableOrderConsolidated.propTypes = {
  dataSourceAllJobs: PropTypes.arrayOf(PropTypes.object).isRequired,
  handlePageSize: PropTypes.func.isRequired,
};

export default TableOrderConsolidated;
