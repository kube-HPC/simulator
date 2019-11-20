import React from 'react';
import PropTypes from 'prop-types';
import Card from 'components/common/Card.react';

const JsonTable = ({ jsonObject }) => (
  <Card bordered={false}>
    <table>
      <tbody>
        {Object.entries(jsonObject).map(([key, value], i) => (
          <tr key={i}>
            <td>{key}</td>
            <td>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </Card>
);

JsonTable.propTypes = {
  jsonObject: PropTypes.object,
};

export default JsonTable;
