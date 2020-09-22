import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveBar } from '@nivo/bar';
import { COLOR } from 'styles/colors';

// https://nivo.rocks/bar/ customization
const Bars = ({ data, legend, colorScheme = 'blues' }) => (
  <ResponsiveBar
    data={data}
    keys={legend}
    indexBy="nodes"
    theme={{
      axis: {
        ticks: {
          line: {
            stroke: COLOR.darkGrey,
          },
          text: {
            fontSize: 16,
            marginRight: '10px',
          },
        },
        legend: {
          text: {
            fontSize: 16,
          },
        },
      },
    }}
    margin={{
      right: 0,
      bottom: 120,
      left: 140,
      top: 70,
    }}
    padding={0.1}
    borderWidth={1}
    layout="horizontal"
    colors={{ scheme: colorScheme }}
    colorBy="id"
    defs={[
      {
        id: 'dots',
        type: 'patternDots',
        background: 'inherit',
        color: COLOR.white,
        size: 4,
        padding: 3,
        stagger: true,
      },
      {
        id: 'lines',
        type: 'patternLines',
        background: 'inherit',
        color: COLOR.white,
        rotation: -45,
        lineWidth: 1,
        spacing: 10,
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
    borderColor={COLOR.grey}
    axisBottom={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'Size',
      legendPosition: 'middle',
      legendOffset: 50,
    }}
    axisLeft={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 50,
      legendPosition: 'middle',
      legendOffset: -90,
    }}
    labelSkipWidth={12}
    labelSkipHeight={12}
    animate={true}
    motionStiffness={165}
    motionDamping={27}
    legends={[
      {
        dataFrom: 'keys',
        anchor: 'bottom',
        direction: 'row',
        justify: false,
        translateX: 0,
        translateY: 100,
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
              itemOpacity: 1,
            },
          },
        ],
      },
    ]}
  />
);

Bars.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  legend: PropTypes.arrayOf(PropTypes.string),
  colorScheme: PropTypes.string,
};

export default Bars;
