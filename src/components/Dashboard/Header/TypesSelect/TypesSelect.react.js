import React from 'react';
import { Select as AntSelect } from 'antd';
import { pipelineTypes } from '@hkube/consts';
import styled from 'styled-components';
import { toUpperCaseFirstLetter } from 'utils';
import { useFilters } from 'hooks';

const { Option } = AntSelect;

const Select = styled(AntSelect)`
  width: 600px;
`;

const types = Object.values(pipelineTypes);

const TypesSelect = () => {
  const { value, set: onChange } = useFilters();

  return (
    <Select
      value={value}
      onChange={onChange}
      mode="multiple"
      placeholder="Filter By Pipeline Types">
      {types.map(type => (
        <Option key={type}>{toUpperCaseFirstLetter(type)}</Option>
      ))}
    </Select>
  );
};

export default TypesSelect;
