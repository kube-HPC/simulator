import { Icon, Input, AutoComplete } from 'antd';
import { connect } from 'react-redux';
import { updateFilter } from '../actions/autoCompleteFilter.action';
const Option = AutoComplete.Option;
const OptGroup = AutoComplete.OptGroup;

function renderTitle(title) {
  return (
    <span>
      {title}

    </span>
  );
}

const options = (data) => {
  const obj = data.map((group) => (
    <OptGroup key={group.title} label={renderTitle(group.title)}>
      {group.children.map((opt) => (
        <Option key={opt.title} value={opt.title}>
          {opt.title}
          <span
            style={{ color: 'rgb(52, 152, 219)' }}
            className="certain-search-item-count">
            ({opt.count})
          </span>
        </Option>
      ))}
    </OptGroup>
  ));

  return obj;
};
const TableAutoComplete = (props) => (
  <div style={{ width: 250 }}>
    <AutoComplete
      className="certain-category-search"
      dropdownClassName="certain-category-search-dropdown"
      dropdownMatchSelectWidth={false}
      dropdownStyle={{ width: 300 }}
      size="large"
      style={{ width: '600px', border: '0px' }}
      dataSource={options(props.dataSource)}
      placeholder="input here"
      onSelect={props.updateFilter}
      onChange={(val) => {
        props.updateFilter(val)
      }}
      optionLabelProp="value">
      <Input style={{ border: '0px' }}
        suffix={<Icon type="search" className="certain-category-icon" />} />
    </AutoComplete>
  </div>
);

// const dataSource = [
//     { key: 1, podName: 'John Brown', age: 32, address: 'New York No. 1 Lake Park', description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.' },
//     { key: 2, podName: 'Jim Green', age: 42, address: 'London No. 1 Lake Park', description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.' },
//     { key: 3, podName: 'Joe Black', age: 32, address: 'Sidney No. 1 Lake Park', description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.' },
//   ];

const tableDataToAutoCompleteData = (data) => {
  if (data[0] == null) {
    return [];
  }
  const table = Object.keys(data[0]).filter(obj => typeof (data[0][obj]) != 'object').map(o => ({ title: o, children: [] }))

  table.forEach((obj) => {
    let mapTypeToCountObj = data.map((o) => o[obj.title]).reduce((prev, item) => {
      if (item in prev) prev[item]++;
      else prev[item] = 1;
      return prev;
    }, {});
    obj.children = Object.keys(mapTypeToCountObj).map((key) => ({
      title: key,
      count: mapTypeToCountObj[key]
    }));
  });
  //vid 

  let lastvidArr = [];
  data.forEach(o => {
    if (o.additional.worker.lastVid != null) {
      lastvidArr.push({
        key: o.additional.worker.lastVid + o.serviceName,
        
        title: o.additional.worker.lastVid,
        count: 1
      })
    }
  })
  table.push({ title: 'lastVid', children: lastvidArr })

  return table;
};

const mapStateToProps = (state) => ({
  // columns: state.containerTable.columns,
  dataSource: tableDataToAutoCompleteData(state.containerTable.dataSource)
});

export default connect(mapStateToProps, { updateFilter })(TableAutoComplete);
