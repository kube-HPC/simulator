import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { ResponsiveBar } from '@nivo/bar';
import { COLOR, GRAPH_PALETTE_DARK } from 'styles/colors';
import { useSiteDarkMode } from 'hooks';

const Container = styled.div`
  font-size: 20px;
  height: 50vh;
  svg + div {
    color: #000000;
  }
`;

// https://nivo.rocks/bar/ customization
const Bars = ({ data, legend, colorScheme = 'blues' }) => {
  const { isDarkMode } = useSiteDarkMode();

  const whiteColor = isDarkMode ? COLOR.whiteDark : COLOR.white;
  const textColor = isDarkMode ? COLOR.whiteDark : COLOR.darkGrey;

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
                stroke: textColor,
              },
              text: {
                fontSize: 16,
                marginRight: '10px',
                fill: textColor,
              },
            },
            legend: {
              text: {
                fontSize: 16,
                fill: textColor,
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
        colors={isDarkMode ? GRAPH_PALETTE_DARK : { scheme: colorScheme }}
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
          format: v =>
            v.length > 15 ? (
              <tspan>
                {`${v.substring(0, 15)}...`}
                <title>{v}</title>
              </tspan>
            ) : (
              v
            ),
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
        animate
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
            itemOpacity: 1,
            symbolSize: 20,
            itemTextColor: textColor,
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

Bars.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  // TODO: detail the props
  /* eslint-disable  */
  legend: PropTypes.arrayOf(PropTypes.string),
  colorScheme: PropTypes.string,
  /* eslint-enable  */
};

export default Bars;
