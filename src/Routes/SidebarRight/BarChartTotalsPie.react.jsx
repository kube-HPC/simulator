import React from 'react';
import PropTypes from 'prop-types';
import { ResponsivePie } from '@nivo/pie';
import prettyBytes from 'pretty-bytes';
import { Theme } from 'styles/colors';

const BarChartTotalsPie = ({ pieData, defs, fill }) => (
  <ResponsivePie
    data={pieData}
    margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
    innerRadius={0.75}
    padAngle={0.7}
    cornerRadius={0}
    valueFormat={prettyBytes}
    borderWidth={0}
    enableRadialLabels={false}
    enableSlicesLabels={false}
    animate
    motionStiffness={90}
    motionDamping={15}
    colors={Theme.GRAPH_PALETTE}
    defs={defs}
    fill={fill}
    legends={[]}
    enableArcLabels={false}
  />
);

BarChartTotalsPie.propTypes = {
  pieData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
  defs: PropTypes.arrayOf(PropTypes.object),
  fill: PropTypes.arrayOf(PropTypes.object),
};

BarChartTotalsPie.defaultProps = {
  defs: undefined,
  fill: undefined,
};

export default BarChartTotalsPie;
