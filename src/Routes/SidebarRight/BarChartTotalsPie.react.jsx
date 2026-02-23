import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { ResponsivePie } from '@nivo/pie';
import { Theme } from 'styles/colors';

const BarChartTotalsPie = ({ pieData, defs, fill }) => {
  const normalizedData = useMemo(() => {
    const allowedIds = new Set(['free', 'reserved', 'other']);
    const result = [];
    let otherValue = 0;
    let usedValue = 0;

    pieData.forEach(item => {
      const id = String(item.id);
      if (allowedIds.has(id)) {
        if (id === 'other') {
          otherValue += item.value;
        } else {
          result.push(item);
        }
      } else {
        usedValue += item.value;
      }
    });

    if (otherValue > 0) {
      result.push({ id: 'other', label: 'other', value: otherValue });
    }
    if (usedValue > 0) {
      result.push({ id: 'used', label: 'used', value: usedValue });
    }
    return result;
  }, [pieData]);

  return (
    <ResponsivePie
      data={normalizedData}
      margin={{ top: 30, right: 5, bottom: 30, left: 5 }}
      innerRadius={0.55}
      padAngle={3}
      cornerRadius={6}
      valueFormat={value =>
        new Intl.NumberFormat('en-US', {
          maximumFractionDigits: 2,
        }).format(value)
      }
      borderWidth={0.2}
      enableRadialLabels={false}
      enableSlicesLabels={false}
      animate
      motionStiffness={90}
      motionDamping={15}
      colors={Theme.GRAPH_PALETTE}
      defs={defs}
      fill={fill}
      legends={[]}
      enableArcLabels
      activeOuterRadiusOffset={8}
    />
  );
};

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
