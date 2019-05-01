import { connect } from 'react-redux';
import { openModal } from '../../actions/modal.action';
import { init } from '../../actions/workerTable.action';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withState } from 'recompose';
import { ResponsiveBar } from '@nivo/bar';
import { Empty } from 'antd';

const metricToLabel = {
  cpu: 'CPU',
  mem: 'Memory'
};

class NodeStatistics extends Component {
  adaptedData(statistics, metric) {
    const statisticsForMetric =
      statistics && statistics.find(statistic => statistic.metric === metric);
    const data =
      statisticsForMetric &&
      statisticsForMetric.asMutable().results.map(res => {
        const algorithms = {};
        res &&
          res.algorithmsData &&
          res.algorithmsData
            .asMutable()
            .forEach(algorithm => (algorithms[algorithm.name] = algorithm.size));
        return {
          nodes: res.name,
          ...algorithms
        };
      });
    return {
      data: data || [],
      legend: statisticsForMetric && statisticsForMetric.legend
    };
  }
  render() {
    const { data, legend } = this.adaptedData(this.props.dataSource, this.props.metric);
    return data === [] || legend === undefined ? (
      <Empty style={{ marginTop: '20px' }} />
    ) : (
      <div
        style={{
          fontSize: '20px',
          width: '80%',
          height: '80%',
          left: '10%',
          position: 'relative',
          top: '10%'
        }}
      >
        <div>{metricToLabel[this.props.metric]}</div>
        <ResponsiveBar
          data={data}
          keys={legend}
          indexBy="nodes"
          theme={{
            axis: {
              ticks: {
                line: {
                  stroke: 'green'
                },
                text: {
                  //fill: "#91d5ff",
                  fontSize: '12px',
                  marginRight: '10px'
                }
              },
              legend: {
                text: {
                  fontSize: '18px'
                }
              }
            }
          }}
          margin={{
            top: 0,
            right: 124,
            bottom: 50,
            left: 60
          }}
          padding={0.1}
          borderWidth={1}
          layout="horizontal"
          colors="blues"
          colorBy="id"
          defs={[
            {
              id: 'dots',
              type: 'patternDots',
              background: 'inherit',
              color: '#fff',
              size: 2,
              padding: 3,
              stagger: true
            },
            {
              id: 'lines',
              type: 'patternLines',
              background: 'inherit',
              color: '#fff',
              rotation: -45,
              lineWidth: 1,
              spacing: 10
            }
          ]}
          fill={[
            {
              match: {
                id: 'free'
              },
              id: 'dots'
            },
            {
              match: {
                id: 'reserved'
              },
              id: 'lines'
            }
          ]}
          borderColor="inherit:darker(1.6)"
          axisTop={{
            tickSize: 0,
            tickPadding: 4,
            tickRotation: 0,
            legend: '',
            legendOffset: 100
          }}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'size',
            legendPosition: 'middle',
            legendOffset: 32
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 50,
            legend: 'nodes',
            legendPosition: 'middle',
            legendOffset: -50
          }}
          enableGridY={false}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor="inherit:darker(1.6)"
          animate={true}
          motionStiffness={165}
          motionDamping={27}
          legends={[
            {
              dataFrom: 'keys',
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 120,
              translateY: -28,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: 'left-to-right',
              itemOpacity: 0.85,
              symbolSize: 20,
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemOpacity: 1
                  }
                }
              ]
            }
          ]}
        />
      </div>
    );
  }
}

// const workerTable = (state) => state.workerTable.dataSource;
// const stats = (state) => state.workerTable.stats;

// const tableDataSelector = createSelector(
//   [workerTable],
//   (dataSource) => dataSource
// );

NodeStatistics.propTypes = {
  dataSource: PropTypes.object.isRequired,
  metric: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  dataSource: state.nodeStatistics.dataSource
  //stats: stats(state),
});

export default connect(
  mapStateToProps,
  { openModal, init }
)(
  withState('isVisible', 'onPopoverClickVisible', {
    visible: false,
    podName: ''
  })(NodeStatistics)
);
