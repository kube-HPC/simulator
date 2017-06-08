import React from 'react';
import * as charts from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
import './../../stylesheets/Chart.scss';

// specific setting by type
const settings = {
  Bar: {legend:{ display:false } },
  Pie: {legend:{ position:'bottom' } }
};

// props -> data(obj), options(obj), title(str), handleClick(func) //
const Chart = ({type, title, dataset, handleClick}) => {
  const options = settings[type];
  let CustomType = charts[type];
  return(
    <div className="ChartBox">
      <CustomType
        data={ dataset }
        options={options}
        onElementsClick={ e => {
            if (e.length !== 0)
              return handleClick(dataset.labels[e[0]._index]);
          }
        } />
        <h4 className ='Chart-title'>{ title }</h4>
    </div>
  );
};

Chart.propTypes = {
    type: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    dataset: React.PropTypes.object.isRequired,
};

export default Chart;
