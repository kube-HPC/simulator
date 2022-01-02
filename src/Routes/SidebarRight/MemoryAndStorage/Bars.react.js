import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { ResponsiveBar } from '@nivo/bar';
import { Theme } from 'styles/colors';
import useBars from './useBars';

const Container = styled.div`
  font-size: 20px;
  height: 50vh;
  svg + div {
    color: #000000;
  }
`;

// https://nivo.rocks/bar/ customization
const Bars = ({ data, legend, colorScheme }) => {
  const {
    themePreferencesBar,
    designBar,
    fillBar,
    axisLeftBar,
    legendsBar,
    axisBottomBar,
  } = useBars();

  return (
    <Container>
      <ResponsiveBar
        data={data}
        keys={legend}
        indexBy="nodes"
        theme={themePreferencesBar}
        margin={{
          right: 0,
          bottom: 120,
          left: 140,
          top: 70,
        }}
        padding={0.1}
        borderWidth={1}
        layout="horizontal"
        colors={
          colorScheme !== '' ? Theme.GRAPH_PALETTE : { scheme: colorScheme }
        }
        colorBy="id"
        defs={designBar}
        fill={fillBar}
        borderColor={Theme.COLOR.grey}
        axisBottom={axisBottomBar}
        axisLeft={axisLeftBar}
        labelSkipWidth={12}
        labelSkipHeight={12}
        animate
        motionStiffness={165}
        motionDamping={27}
        legends={legendsBar}
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
