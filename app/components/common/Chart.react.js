import React from 'react';
import PropTypes from 'prop-types';
import * as charts from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
import './../../stylesheets/Chart.scss';

// specific setting by type
const settings = {
  Bar: { legend: { display: false } },
  Pie: { legend: { position: 'bottom' } }
};

// props -> data(obj), options(obj), title(str), handleClick(func) //
const Chart = ({ type, title, dataset, handleClick }) => {
  const options = settings[type];
  const CustomType = charts[type];
  return (
    <div className="ChartBox">
      <CustomType
        data={ dataset }
        options={options}
        onElementsClick={ (e) => {
          if (e.length !== 0)              {
            return handleClick(dataset.labels[e[0]._index]);
          }
        }
        }/>
      <h4 className="Chart-title">{ title }</h4>
    </div>
  );
};

Chart.propTypes = {
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  dataset: PropTypes.object.isRequired
};

export default Chart;
