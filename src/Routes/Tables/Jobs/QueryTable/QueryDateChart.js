import React from 'react';
import ReactApexChart from 'react-apexcharts';
// import _ from 'lodash';
import histogram from 'utils/histogram';
import PropTypes from 'prop-types';

const QueryDateChart = props => {
  const { dataSource } = props;

  const dataForHistogram = dataSource?.map(d => ({
    id: d.key,
    time: d.results?.startTime,
  }));
  const _histogram = histogram(
    dataForHistogram.map(d => d.time),
    8
  );

  //  _.groupBy(dataSource, 'results.timestamp');

  // const calledFromZoomOut = false;
  const data = {
    series: [
      {
        name: 'Hits',
        data: _histogram?.values,
        //  data: [13, 23, 20, 8, 13, 27, 41, 67, 22, 43],
      },
      // {
      //   name: 'PRODUCT B',
      //   data: [13, 23, 20, 8, 13, 27, 41, 67, 22, 43],
      // },
      // {
      //   name: 'PRODUCT C',
      //   data: [11, 17, 15, 15, 21, 14, 41, 67, 22, 43],
      // },
      // {
      //   name: 'PRODUCT D',
      //   data: [21, 7, 25, 13, 22, 8, 41, 67, 22, 43],
      // },
    ],
    options: {
      chart: {
        type: 'bar',
        height: 250,
        stacked: true,
        toolbar: {
          show: true,
        },

        zoom: {
          enabled: true,
        },
        events: {
          zoomed(chartContext, { xaxis, yaxis }) {
            // eslint-disable-next-line no-console
            console.log(chartContext, { xaxis, yaxis });
            props.onZoom(xaxis);
          },
          click(event, chartContext, config) {
            // eslint-disable-next-line no-console
            console.log(event, chartContext, config);
          },
          dataPointSelection: (event, chartContext, config) => {
            //  console.log(chartContext, config);
            //  console.log(_histogram);
            props.onZoom({
              min:
                _histogram.sections[config.dataPointIndex] -
                _histogram.binWidth,
              max:
                _histogram.sections[config.dataPointIndex] +
                _histogram.binWidth,
            });
          },
          // updated: function (chartContext, config) {
          //   console.log(chartContext, config);
          //   chartContext.ctx.toolbar.handleZoomOut()
          //   calledFromZoomOut = true;
          // }
        },
      },
      responsive: [
        {
          breakpoint: 100,
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
          borderRadius: 2,
          columnWidth: '70%',
          barHeight: '70%',
          // distributed: true,
        },
      },
      xaxis: {
        type: 'datetime',
        categories:
          _histogram && _histogram.sections && _histogram.sections.length > 0
            ? _histogram?.sections?.map(s => new Date(s).toLocaleString())
            : [],
      },
      legend: {
        position: 'right',
        offsetY: 40,
      },
      fill: {
        //  type: 'pattern',
        opacity: 1,
        colors: ['#4682b4'],
        //  pattern: ''
      },
    },
  };
  return (
    <div id="chart">
      <ReactApexChart
        options={data.options}
        series={data.series}
        type="bar"
        height="250"
      />
    </div>
  );
};

QueryDateChart.propTypes = {
  onZoom: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  dataSource: PropTypes.object.isRequired,
};
QueryDateChart.defaultProps = {
  onZoom: () => {},
};
export default React.memo(QueryDateChart);
