import React from 'react';
import PropTypes from 'prop-types';
import { Descriptions } from 'components/common';

// Helpers
const isPureObject = obj => !Array.isArray(obj) && typeof obj === 'object' && obj !== null;
const getTotalColumns = ({ obj, vertical }) => (vertical ? Object.keys(obj).length : 1);

// Recursion Step
const RenderItemByValueType = ({ obj, vertical }) =>
  isPureObject(obj) ? (
    <Descriptions column={getTotalColumns({ obj: obj, vertical })} vertical={vertical}>
      {objToItem({ obj: obj })}
    </Descriptions>
  ) : Array.isArray(obj) ? (
    obj.map(RenderItemByValueType)
  ) : (
    String(obj)
  );

RenderItemByValueType.propTypes = {
  obj: PropTypes.object,
  vertical: PropTypes.bool,
};

// Item
function objToItem({ obj, vertical }) {
  return Object.entries(obj).map(([key, value]) => (
    <Descriptions.Item key={key} label={key}>
      {RenderItemByValueType({ obj: value, vertical })}
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
