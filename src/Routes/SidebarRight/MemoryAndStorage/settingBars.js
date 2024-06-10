import { Theme } from 'styles/colors';

const settingBars = () => {
  const whiteColor = Theme.Styles.barColor.color;
  const textColor = Theme.Styles.barColor.text;

  const themePreferencesBar = {
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
  };
  const designBar = [
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
  ];

  const fillBar = [
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
  ];

  const axisLeftBar = {
    /* format: v =>
      v.length > 15 ? (
        <tspan>
          {`${v.substring(0, 15)}...`}
          <title>{v}</title>
        </tspan>
      ) : (
        v
      ), */
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 20,
    // legend: 'Nodes',
    // legendPosition: 'middle',
    // legendOffset: -50,
    fontSize: 15,
    truncateTickAt: 12,
  };

  const legendsBar = [
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
  ];

  const axisBottomBar = {
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    legend: 'Size',
    legendPosition: 'middle',
    legendOffset: 50,
  };

  return {
    themePreferencesBar,
    designBar,
    fillBar,
    axisLeftBar,
    legendsBar,
    axisBottomBar,
  };
};

export default settingBars;
