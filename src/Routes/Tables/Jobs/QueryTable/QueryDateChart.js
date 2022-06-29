import React from 'react';
import ReactApexChart from 'react-apexcharts';
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
  // let calledFromZoomOut = false;

  const data = {
    series: [
      {
        name: 'Hits',
        data: _histogram?.values,
      },
    ],

    options: {
      stroke: {
        width: 0,
      },
      chart: {
        type: 'bar',
        height: 250,
        stacked: true,
        toolbar: {
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: false,
            reset: false,
            customIcons: [],
          },
        },

        zoom: {
          enabled: true,
        },
        events: {
          zoomed(chartContext, { xaxis }) {
            // yaxis
            // console.log(chartContext, { xaxis, yaxis });
            props.onZoom(xaxis);
          },
          // click(event, chartContext, config) {
          //  console.log(event, chartContext, config);
          // },
          dataPointSelection: (event, chartContext, config) => {
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
              offsetX: 10,
              offsetY: 0,
            },
          },
        },
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 7,
          columnWidth: '70%',
          barHeight: '70%',
          // distributed: true,
        },
      },
      xaxis: {
        type: 'datetime',
        categories:
          _histogram && _histogram.sections && _histogram.sections.length > 0
            ? _histogram?.sections?.map(s => new Date(s).toISOString())
            : [],
        //  categories: _histogram && _histogram.sections && _histogram.sections.length > 0 ? _histogram?.sections?.map(s => new Date(s).toLocaleString()) : [],
      },
      legend: {
        position: 'right',
        offsetY: 40,
      },
      fill: {
        //  type: 'pattern',
        opacity: 1,
        colors: ['#008FFB'],
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
  // eslint-disable-next-line react/forbid-prop-types
  dataSource: PropTypes.object,
  onZoom: PropTypes.func.isRequired,
};
QueryDateChart.defaultProps = {
  dataSource: () => {},
};

export default React.memo(QueryDateChart);
