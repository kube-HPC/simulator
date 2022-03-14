import React from 'react';
import PropTypes from 'prop-types';
import {
  TableAllInOneTypeColumns,
  SelectFilterOptions,
} from './OrderComponents';
import { TableAllInOne, FilterTable } from './OrderStyles';

const scrollElement = '.TableAllInOne div.ant-table-body';
class TableOrderConsolidated extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };

    this.handleScroll = this.handleScroll.bind(this);
    this.onSelectFilter = this.onSelectFilter.bind(this);
  }

  componentDidMount() {
    const { dataSourceAllJobs } = this.props;

    const tableContent = document.querySelector(scrollElement);
    tableContent.addEventListener('scroll', this.handleScroll);

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

  componentWillUnmount() {
    const tableContent = document.querySelector(scrollElement);
    tableContent.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll(event) {
    const { handlePageSize } = this.props;

    const maxScroll = event.target.scrollHeight - event.target.clientHeight;
    const currentScroll = event.target.scrollTop;
    if (currentScroll === maxScroll) {
      this.setState({ isLoading: true });
      handlePageSize();
    }
  }

  onSelectFilter(selectValue) {
    const { filterTableAllInOne } = this.props;

    filterTableAllInOne(selectValue);
    this.setState({ isLoading: true });
  }

  render() {
    const { dataSourceAllJobs, filterTableAllInOneVal } = this.props;
    const { isLoading } = this.state;

    return (
      <>
        <FilterTable>
          GroupBy :{' '}
          <SelectFilterOptions
            onSelect={this.onSelectFilter}
            filterVal={filterTableAllInOneVal}
          />
        </FilterTable>

        <TableAllInOne
          className="TableAllInOne"
          pagination={false}
          dataSource={dataSourceAllJobs}
          columns={TableAllInOneTypeColumns[filterTableAllInOneVal]}
          rowKey={record => `${record.key}_${record.typeElement}`}
          scroll={{ y: '80vh' }}
          loading={isLoading}
        />
      </>
    );
  }
}

TableOrderConsolidated.propTypes = {
  dataSourceAllJobs: PropTypes.arrayOf(PropTypes.object).isRequired,
  handlePageSize: PropTypes.func.isRequired,
  filterTableAllInOne: PropTypes.func.isRequired,
  filterTableAllInOneVal: PropTypes.string.isRequired,
};

export default TableOrderConsolidated;
