import React from 'react';
import PropTypes from 'prop-types';
import Card from 'components/common/Card.react';

const isPureObject = obj => !Array.isArray(obj) && typeof obj === 'object' && obj !== null;

const recursionStep = value =>
  isPureObject(value) ? (
    objToTable(value)
  ) : Array.isArray(value) ? (
    value.map(recursionStep)
  ) : (
    <td>{value}</td>
  );

function objToTable(obj) {
  return (
    <tbody>
      {Object.entries(obj).map(([key, value]) => (
        <tr key={key}>
          <th>{key}</th>
          <tr>{recursionStep(value)}</tr>
        </tr>
      ))}
    </tbody>
  );
}

const JsonTable = ({ jsonObject }) => (
  <Card>
    <table>{objToTable(jsonObject)}</table>
  </Card>
);

JsonTable.propTypes = {
  jsonObject: PropTypes.object,
};

export default JsonTable;
