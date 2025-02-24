import { ResponsiveBar } from '@nivo/bar';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { Theme } from 'styles/colors';
import { useMetric } from 'hooks/graphql';
import { Header } from './MemoryAndStorage/styles';

const Container = styled.div`
  margin-top: 10px;
  height: 50vh;
  svg + div {
    color: #000000;
  }
`;

// Define the custom formatter component outside of NodeStatistics
const CustomAxisLeftTick = ({ value }) =>
  value?.length > 15 ? (
    <tspan>
      {`${value.substring(0, 15)}...`}
      <title>{value}</title>
    </tspan>
  ) : (
    value
  );

CustomAxisLeftTick.propTypes = {
  value: PropTypes.string.isRequired,
};

// NodeStatistics component
const NodeStatistics = ({ metric }) => {
  const { data, legend } = useMetric(metric);

  const whiteColor = Theme.Styles.nodeStatistics.color;
  const textColor = Theme.Styles.nodeStatistics.text;

  return (
    <Container>
      <Header>GPU</Header>
      <ResponsiveBar
        animate
        data={data}
        keys={legend}
        indexBy="nodes"
        theme={{
          axis: {
            ticks: {
              line: {
                stroke: textColor,
              },
              text: {
                fontSize: 13,
                marginRight: '10px',
                fill: textColor,
              },
            },
            legend: {
              text: {
                fontSize: 19,
                fill: whiteColor,
              },
            },
          },
        }}
        margin={{
          right: 120,
          bottom: 120,
          left: 120,
        }}
        padding={0.1}
        borderWidth={1}
        layout="horizontal"
        colors={Theme.GRAPH_PALETTE}
        colorBy="id"
        defs={[
          {
            id: 'dots',
            type: 'patternDots',
            background: 'inherit',
            color: whiteColor,
            size: 2,
            padding: 3,
            stagger: true,
          },
          {
            id: 'lines',
            type: 'patternLines',
            background: 'inherit',
            color: whiteColor,
            rotation: -45,
            lineWidth: 1,
            spacing: 25,
          },
        ]}
        fill={[
          {
            match: {
              id: 'free',
            },
            id: 'dots',
          },
          {
            match: {
              id: 'reserved',
            },
            id: 'lines',
          },
        ]}
        borderColor={Theme.COLOR.grey}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Size',
          legendPosition: 'middle',
          legendOffset: 50,
        }}
        axisLeft={{
          format: CustomAxisLeftTick, // Use the custom formatter component
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 20,
          legend: 'Nodes',
          legendPosition: 'middle',
          legendOffset: -50,
          fontSize: 10,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        motionStiffness={165}
        motionDamping={27}
        legends={[
          {
            itemTextColor: textColor,
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
            itemOpacity: 1,
            symbolSize: 30,
            effects: [
              {
                on: 'hover',
                style: {
                  itemOpacity: 0.85,
                },
              },
            ],
          },
        ]}
      />
    </Container>
  );
};

NodeStatistics.propTypes = {
  metric: PropTypes.string.isRequired,
};

export default NodeStatistics;
