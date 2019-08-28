import { useSelector } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveBar } from '@nivo/bar';
import styled from 'styled-components';
import { COLOR } from 'styles/colors';

const Container = styled.div`
  font-size: 20px;
  height: 70vh;
`;

const adaptedData = (statistics, metric) => {
  const statisticsForMetric =
    statistics && statistics.find(statistic => statistic.metric === metric);
  const data =
    statisticsForMetric &&
    statisticsForMetric.results.map(res => {
      const algorithms = {};
      res &&
        res.algorithmsData &&
        res.algorithmsData.forEach(algorithm => (algorithms[algorithm.name] = algorithm.size));
      return {
        nodes: res.name,
        ...algorithms
      };
    });
  return {
    data: data || [],
    legend: statisticsForMetric && statisticsForMetric.legend
  };
};

// ! https://nivo.rocks/bar/ customization
function NodeStatistics({ metric }) {
  const dataSource = useSelector(state => state.nodeStatistics.dataSource);
  const { data, legend } = adaptedData(dataSource, metric);

  return (
    <Container>
      <ResponsiveBar
        data={data}
        keys={legend}
        indexBy="nodes"
        theme={{
          axis: {
            ticks: {
              line: {
                stroke: COLOR.darkGrey
              },
              text: {
                fontSize: 16,
                marginRight: '10px'
              }
            },
            legend: {
              text: {
                fontSize: 16
              }
            }
          }
        }}
        margin={{
          right: 120,
          bottom: 120,
          left: 120
        }}
        padding={0.1}
        borderWidth={1}
        layout="horizontal"
        colors={{ scheme: 'blues' }}
        colorBy="id"
        defs={[
          {
            id: 'dots',
            type: 'patternDots',
            background: 'inherit',
            color: COLOR.white,
            size: 4,
            padding: 3,
            stagger: true
          },
          {
            id: 'lines',
            type: 'patternLines',
            background: 'inherit',
            color: COLOR.white,
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
        borderColor={COLOR.grey}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Size',
          legendPosition: 'middle',
          legendOffset: 50
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 50,
          legend: 'Nodes',
          legendPosition: 'middle',
          legendOffset: -90
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
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
            itemHeight: 40,
            itemDirection: 'left-to-right',
            itemOpacity: 0.85,
            symbolSize: 30,
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
    </Container>
  );
}

NodeStatistics.propTypes = {
  metric: PropTypes.string.isRequired
};

export default NodeStatistics;
