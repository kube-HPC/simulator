import React from 'react';
import { Icon, Input, AutoComplete } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { autoCompleteFilter } from 'actions/layout.action';
import styled from 'styled-components';
import { COLOR } from 'constants/colors';

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
            style={{ color:  COLOR.blueLight }}
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

  table.push({ title: 'lastVid', children: [] });

  return table;
};

function TableAutoComplete() {
  const dataSource = useSelector(state =>
    tableDataToAutoCompleteData(state.jobsTable.dataSource)
  );

  const dispatch = useDispatch();

  return (
    <InputTransparent
      dropdownMatchSelectWidth={true}
      dataSource={options(dataSource)}
      onSelect={e => dispatch(autoCompleteFilter(e))}
      onChange={e => dispatch(autoCompleteFilter(e))}
      optionLabelProp="value"
      placeholder="Search in current table"
    >
      <Input suffix={<Icon type="search" />} />
    </InputTransparent>
  );
}

export default TableAutoComplete;
