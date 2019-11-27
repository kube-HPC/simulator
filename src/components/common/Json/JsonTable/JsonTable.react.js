import React from 'react';
import PropTypes from 'prop-types';
import { Descriptions } from 'components/common';

const HORIZONTAL = Descriptions.LAYOUT.HORIZONTAL;

// Helpers
const isPureObject = obj => !Array.isArray(obj) && typeof obj === 'object' && obj !== null;
const getTotalColumns = ({ obj, layout }) => (layout === HORIZONTAL ? 1 : Object.keys(obj).length);

// Recursion Step
const RenderItemByValueType = ({ obj, layout }) =>
  isPureObject(obj) ? (
    <Descriptions column={getTotalColumns({ obj: obj, layout })}>
      {objToItem({ obj: obj })}
    </Descriptions>
  ) : Array.isArray(obj) ? (
    obj.map(RenderItemByValueType)
  ) : (
    String(obj)
  );

RenderItemByValueType.propTypes = {
  obj: PropTypes.object,
  layout: PropTypes.string,
};

// Item
function objToItem({ obj, layout }) {
  return Object.entries(obj).map(([key, value]) => (
    <Descriptions.Item key={key} label={key}>
      {RenderItemByValueType({ obj: value, layout })}
    </Descriptions.Item>
  ));
}

// Entry
const JsonTable = ({ obj, layout = HORIZONTAL }) => (
  <Descriptions column={getTotalColumns({ obj, layout })} layout={layout}>
    {objToItem({ obj, layout })}
  </Descriptions>
);

JsonTable.LAYOUT = Descriptions.LAYOUT;

JsonTable.propTypes = {
  obj: PropTypes.object,
  layout: PropTypes.string,
};

export default JsonTable;
