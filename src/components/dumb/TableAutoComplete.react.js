import React from 'react';
import { Icon, Input, AutoComplete } from 'antd';
import { connect } from 'react-redux';
import { updateFilter } from 'actions/autoCompleteFilter.action';
import styled from 'styled-components';

const InputTransparent = styled(AutoComplete)`
  background: transparent;
  width: 600px;
`;

const Option = AutoComplete.Option;
const OptGroup = AutoComplete.OptGroup;

const options = data => {
  const obj = data.map(group => (
    <OptGroup key={group.title} label={<span>{group.title}</span>}>
      {group.children.map(opt => (
        <Option key={opt.title} value={opt.title}>
          {opt.title}
          <span
            style={{ color: 'rgb(52, 152, 219)' }}
            className="certain-search-item-count"
          >
            ({opt.count})
          </span>
        </Option>
      ))}
    </OptGroup>
  ));

  return obj;
};

const TableAutoComplete = props => (
  <InputTransparent
    dropdownMatchSelectWidth={false}
    dropdownStyle={{ width: 300 }}
    dataSource={options(props.dataSource)}
    onSelect={props.updateFilter}
    onChange={props.updateFilter}
    optionLabelProp="value"
    placeholder="Search in current table"
  >
    <Input suffix={<Icon type="search" />} />
  </InputTransparent>
);

const tableDataToAutoCompleteData = data => {
  if (data[0] == null) {
    return [];
  }
  const table = Object.keys(data[0])
    .filter(obj => typeof data[0][obj] !== 'object')
    .map(o => ({ title: o, children: [] }));

  table.forEach(obj => {
    const mapTypeToCountObj = data
      .map(o => o[obj.title])
      .reduce((prev, item) => {
        if (item in prev) prev[item]++;
        else prev[item] = 1;
        return prev;
      }, {});
    obj.children = Object.keys(mapTypeToCountObj).map(key => ({
      title: key,
      count: mapTypeToCountObj[key]
    }));
  });

  const lastvidArr = [];
  table.push({ title: 'lastVid', children: lastvidArr });

  return table;
};

const mapStateToProps = state => ({
  dataSource: tableDataToAutoCompleteData(state.containerTable.dataSource)
});

export default connect(
  mapStateToProps,
  { updateFilter }
)(TableAutoComplete);
