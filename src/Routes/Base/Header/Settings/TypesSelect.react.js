import { pipelineTypes } from '@hkube/consts';
import { Select as AntSelect, Typography } from 'antd';
import { FlexBox } from 'components/common';
import { useFilters } from 'hooks';
import React from 'react';
import styled from 'styled-components';
import { toUpperCaseFirstLetter } from 'utils';

const { Option } = AntSelect;

const Select = styled(AntSelect)`
  width: 650px;
`;

const types = Object.values(pipelineTypes);

const TypesSelect = () => {
  const { value, set: onChange } = useFilters();

  return (
    <FlexBox.Auto>
      <Typography.Text strong>Filter By Type</Typography.Text>
      <Select
        value={value}
        onChange={onChange}
        mode="multiple"
        allowClear
        placeholder="Filter By Pipeline Types">
        {types.map(type => (
          <Option key={type}>{toUpperCaseFirstLetter(type)}</Option>
        ))}
      </Select>
    </FlexBox.Auto>
  );
};

export default TypesSelect;
