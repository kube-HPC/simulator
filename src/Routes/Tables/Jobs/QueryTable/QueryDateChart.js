import React from 'react';
import { Theme } from 'styles/colors';
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
    // option chart
    options: {
      timezone: '',
      grid: {
        show: false,
      },
      chart: {
        type: 'bar',
        background: 'none',
        height: 170,
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
            props.onZoom(xaxis);
          },

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
        },

        animations: {
          enabled: true,
          easing: 'easein',
          speed: 100,
          animateGradually: {
            enabled: true,
            delay: 150,
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350,
          },
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
      yaxis: {
        show: false,
      },
      xaxis: {
        type: 'datetime',
        labels: {
          datetimeUTC: false,
        },
        categories:
          _histogram && _histogram.sections && _histogram.sections.length > 0
            ? _histogram?.sections?.map(s => new Date(s).toISOString())
            : [],
        // ? _histogram?.sections?.map(s => moment(s).utc(moment(s).format('Z')).format()): [],
        //  categories: _histogram && _histogram.sections && _histogram.sections.length > 0 ? _histogram?.sections?.map(s => new Date(s).toLocaleString()) : [],
      },
      legend: {
        position: 'right',
        offsetY: 40,
      },
      fill: {
        opacity: 1,
        colors: [Theme.Styles.jobsGraph.backgroundBarColor],
      },

      stroke: {
        show: true,
        curve: 'smooth',
        lineCap: 'butt',
        colors: [Theme.Styles.jobsGraph.borderBarColor],
        width: 1,
        dashArray: 0,
      },

      theme: {
        mode: Theme.Styles.jobsGraph.mode,
      },
    },

    // bottom label chart
    series: [
      {
        name: 'Hits',
        data: _histogram?.values || [],
      },
    ],
  };
  return (
    <div id="chart">
      <ReactApexChart
        options={data.options}
        series={data.series}
        type="bar"
        height="170"
      />
    </div>
  );
};
QueryDateChart.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  dataSource: PropTypes.arrayOf(PropTypes.object),
  onZoom: PropTypes.func.isRequired,
};
QueryDateChart.defaultProps = {
  dataSource: () => {},
};

export default React.memo(QueryDateChart);
