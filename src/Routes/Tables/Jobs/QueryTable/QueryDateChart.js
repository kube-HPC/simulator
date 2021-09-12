import React from 'react';
import ReactApexChart from 'react-apexcharts';
import _ from 'lodash';
import histogram from 'utils/histogram';

const QueryDateChart = props => {
  const { dataSource } = props;

  const dataForHistogram = dataSource?.map(d => ({
    id: d.key,
    time: d.results.startTime,
  }));
  const _histogram = histogram(
    dataForHistogram.map(d => d.time),
    10
  );

  _.groupBy(dataSource, 'results.timestamp');
  console.log(dataSource);
  const data = {
    series: [
      {
        name: 'PRODUCT A',
        data: [44, 55, 41, 67, 22, 43],
      },
      {
        name: 'PRODUCT B',
        data: [13, 23, 20, 8, 13, 27],
      },
      {
        name: 'PRODUCT C',
        data: [11, 17, 15, 15, 21, 14],
      },
      {
        name: 'PRODUCT D',
        data: [21, 7, 25, 13, 22, 8],
      },
    ],
    options: {
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 10,
        },
      },
      xaxis: {
        type: 'datetime',
        categories: [
          '01/01/2011 GMT',
          '01/02/2011 GMT',
          '01/03/2011 GMT',
          '01/04/2011 GMT',
          '01/05/2011 GMT',
          '01/06/2011 GMT',
        ],
      },
      legend: {
        position: 'right',
        offsetY: 40,
      },
      fill: {
        opacity: 1,
      },
    },
  };
  return (
    <div id="chart">
      <ReactApexChart
        options={data.options}
        series={data.series}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default QueryDateChart;
