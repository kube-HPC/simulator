import React from 'react';
import PropTypes from 'prop-types';
import { Descriptions } from 'antd';
import styled from 'styled-components';

const DescriptionOverflow = styled(Descriptions)`
  .ant-descriptions-view {
    overflow: auto;
  }
`;

const isPureObject = obj => !Array.isArray(obj) && typeof obj === 'object' && obj !== null;

const recursionStep = value =>
  isPureObject(value) ? (
    <Descriptions column={Object.values(value).length} bordered colon={false} layout="vertical">
      {objToTable(value)}
    </Descriptions>
  ) : Array.isArray(value) ? (
    value.map(recursionStep)
  ) : (
    value
  );

function objToTable(obj) {
  return Object.entries(obj).map(([key, value]) => (
    <Descriptions.Item key={key} label={key}>
      {recursionStep(value)}
    </Descriptions.Item>
  ));
}

const JsonTable = ({ jsonObject }) => (
  <DescriptionOverflow column={1} bordered size="small" colon={false} layout="vertical">
    {objToTable(jsonObject)}
  </DescriptionOverflow>
);

JsonTable.propTypes = {
  jsonObject: PropTypes.object,
};

export default JsonTable;
