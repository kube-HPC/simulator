import { Tag, Typography } from 'antd';
import { Descriptions } from 'components/common';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { prop } from 'styled-tools';

const { Text } = Typography;
const EMPTY = `Empty`;

// Helpers
const isPureObject = obj => !Array.isArray(obj) && typeof obj === 'object' && obj !== null;
const getTotalColumns = ({ obj, vertical }) => (vertical ? Object.keys(obj).length : 1);

const isEmptyObject = obj => Object.entries(obj).length === 0;

const Margin = styled(Descriptions)`
  margin-top: ${prop('isMargin', 'none')};
`;

// Recursion Step
const RenderItemByValueType = ({ obj, vertical, isMargin = false, key }) =>
  isPureObject(obj) ? (
    <Margin
      key={key}
      column={getTotalColumns({ obj: obj, vertical })}
      vertical={vertical}
      isMargin={isMargin}>
      {objToItem({ obj })}
    </Margin>
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
      {isEmptyObject(value) ? (
        <Tag>{EMPTY}</Tag>
      ) : (
        RenderItemByValueType({ obj: value, vertical, key })
      )}
    </Descriptions.Item>
  ));
}

// Entry
const JsonTable = ({ obj, vertical = false, ...props }) => (
  <Descriptions column={getTotalColumns({ obj, vertical })} vertical={vertical} {...props}>
    {objToItem({ obj, vertical })}
  </Descriptions>
);

JsonTable.propTypes = {
  obj: PropTypes.object,
  vertical: PropTypes.bool,
};

export default JsonTable;
