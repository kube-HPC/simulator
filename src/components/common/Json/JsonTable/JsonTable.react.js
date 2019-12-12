import React from 'react';
import PropTypes from 'prop-types';
import { Descriptions } from 'components/common';
import styled from 'styled-components';
import { Typography } from 'antd';

const { Text } = Typography;

// Helpers
const isPureObject = obj => !Array.isArray(obj) && typeof obj === 'object' && obj !== null;
const getTotalColumns = ({ obj, vertical }) => (vertical ? Object.keys(obj).length : 1);

const Margin = styled(Descriptions)`
  margin-top: ${({ isMargin }) => (isMargin ? '8px' : 'none')};
`;

// Recursion Step
const RenderItemByValueType = ({ obj, vertical, isMargin = false, key }) =>
  isPureObject(obj) ? (
    <>
      <Margin
        key={key}
        column={getTotalColumns({ obj: obj, vertical })}
        vertical={vertical}
        isMargin={isMargin}>
        {objToItem({ obj: obj })}
      </Margin>
    </>
  ) : Array.isArray(obj) ? (
    <>
      {obj.map((value, i) =>
        RenderItemByValueType({
          obj: value,
          vertical,
          isMargin: i !== 0 || i === obj.length - 1,
          key: i,
        }),
      )}
    </>
  ) : (
    String(obj)
  );

RenderItemByValueType.propTypes = {
  obj: PropTypes.object,
  vertical: PropTypes.bool,
  isMargin: PropTypes.bool,
  key: PropTypes.oneOf([PropTypes.string, PropTypes.number]),
};

// Item
function objToItem({ obj, vertical }) {
  return Object.entries(obj).map(([key, value]) => (
    <Descriptions.Item key={key} label={<Text strong>{key}</Text>}>
      {RenderItemByValueType({ obj: value, vertical, key })}
    </Descriptions.Item>
  ));
}

// Entry
const JsonTable = ({ obj, vertical = false }) => (
  <Descriptions column={getTotalColumns({ obj, vertical })} vertical={vertical}>
    {objToItem({ obj, vertical })}
  </Descriptions>
);

JsonTable.propTypes = {
  obj: PropTypes.object,
  vertical: PropTypes.bool,
};

export default JsonTable;
