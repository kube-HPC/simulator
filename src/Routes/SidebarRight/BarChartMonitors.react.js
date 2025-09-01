import { ResponsiveBar } from '@nivo/bar';

import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Theme } from 'styles/colors';
import { useMetric } from 'hooks/graphql';
import { Header } from './MemoryAndStorage/styles';
import settingBars from './MemoryAndStorage/settingBars';

const Container = styled.div`
  display: flex;
  margin-top: 50px;

  height: 80vh;

  svg + div {
    color: #000000;
  }
`;

const ResponsiveBarStyle = styled(ResponsiveBar)`
  width: 85%;
`;

const typeName = {
  cpu: 'CPU',
  mem: 'Memory',
};

const sumTotalByProperty = (dataArray, sameProp) =>
  dataArray.reduce(
    (acc, { data: { id, data } }) =>
      id === sameProp ? acc + (data[sameProp] || 0) : acc,
    0
  );

// eslint-disable-next-line react/prop-types
const Tooltip = ({ dataTip }) => {
  // eslint-disable-next-line react/prop-types
  const { text, x, y, color } = dataTip;
  // eslint-disable-next-line react/prop-types

  return (
    <div
      // eslint-disable-next-line react/prop-types

      style={{
        zIndex: 10,
        pointerEvents: 'none',
        background: '#ffffff',
        position: 'absolute',
        top: y,
        left: x < window.innerWidth / 2 ? x - 280 : null,
        right: x > window.innerWidth / 2 ? window.innerWidth - x + 20 : null,
        fontSize: '18px',
        padding: '5px',
        border: 1,
        borderColor: 'black',
        borderStyle: 'solid',
        display: 'flex',
        borderRadius: '10px',
      }}>
      <div
        style={{
          width: '20px',
          height: '20px',
          background: color,
          borderRadius: '20%',
          margin: '5px',
        }}
      />
      {text}
    </div>
  );
};

const getColorMatchId = (dataFill, matchId, color) => {
  const foundItem = dataFill?.find(
    item => item.match && item.match.id === matchId
  );
  return foundItem ? `url(#${foundItem.id}.bg.${color})` : color;
};

const BarChartMonitors = ({ metric }) => {
  const { data, legend } = useMetric(metric);

  const {
    themePreferencesBar,
    designBar,
    fillBar,
    axisLeftBar,
    legendsBar,
    axisBottomBar,
  } = settingBars();

  // const whiteColor = Theme.Styles.nodeStatistics.color;
  // const textColor = Theme.Styles.nodeStatistics.text;

  const [highlightedBars, setHighlightedBars] = useState([]);
  const [tooltipData, setTooltipData] = useState(null);
  // const dataBars = useRef([]);

  const handleLegendMouseEnter = legendItem => {
    // const idToHighlight = legendItem;
    // const barsToHighlight = data.filter(bar => bar.id === idToHighlight);
    setHighlightedBars(legendItem);
  };

  const handleLegendMouseLeave = () => {
    setHighlightedBars('');
  };

  const legendsItemsSave = [];
  let legendIndex = 0;
  return (
    <>
      <Header>{typeName[metric]}</Header>
      <Container>
        <ResponsiveBarStyle
          data={data}
          keys={legend}
          indexBy="nodes"
          theme={themePreferencesBar}
          margin={{
            right: 100,
            bottom: 400,
            left: 150,
          }}
          padding={0.1}
          borderWidth={1}
          layout="horizontal"
          colors={Theme.GRAPH_PALETTE}
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
          //  labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          // label={d => `${d.id}: ${d.value}`}
          // Other chart configurations

          layers={[
            'grid',
            'axes',
            // 'bars',
            //  'totals',
            'markers',
            // 'legends',
            // 'annotations',

            // eslint-disable-next-line react/no-unstable-nested-components
            ({ bars, ...rest }) => {
              const barsView = bars.filter(x => x.data.value !== null);
              return (
                <>
                  <text
                    key={`textNode${barsView.index}`}
                    transform={`translate(${rest.width - 200},${
                      rest.height / 2
                    }) rotate(-90)`}
                    style={{ fontSize: '17px' }}>
                    Nodes
                  </text>
                  <g key={`gNode${barsView.index}`}>
                    {barsView &&
                      barsView.map(
                        bar =>
                          bar.data.value && (
                            <g transform={`translate(${bar.x},${bar.y})`}>
                              <rect
                                key={bar.key}
                                width={bar.width - 2}
                                height={bar.height}
                                fill={getColorMatchId(
                                  fillBar,
                                  bar.data.id,
                                  bar.color
                                )}
                                strokeWidth={
                                  highlightedBars === bar.data.id ? 3 : null
                                }
                                rx="2"
                                stroke={
                                  highlightedBars === bar.data.id
                                    ? '#8d8d8d'
                                    : bar.color
                                }
                                onMouseOver={e => {
                                  setTooltipData({
                                    text: `${bar.data.id} - ${bar.data.indexValue} : ${bar.data.value}`,
                                    x: e.clientX,
                                    y: e.clientY,
                                    color: bar.color,
                                  }); // Set the tooltip text
                                }}
                                onMouseOut={() => {
                                  setTooltipData(null); // Clear the tooltip text
                                }}
                              />

                              <text
                                x={bar.width / 2}
                                y={bar.height / 2}
                                textAnchor="middle"
                                dominantBaseline="central"
                                style={{ fontSize: '13px' }}
                                onMouseOver={e => {
                                  setTooltipData({
                                    text: `${bar.data.id} - ${bar.data.indexValue} : ${bar.data.value}`,
                                    x: e.clientX,
                                    y: e.clientY,
                                  }); // Set the tooltip text
                                }}
                                onMouseOut={() => {
                                  setTooltipData(null); // Clear the tooltip text
                                }}>
                                {bar.data.value}
                              </text>
                            </g>
                          )
                      )}
                  </g>
                  <g
                    key={`geNode${barsView.index}`}
                    transform={`translate(-70,${rest.innerHeight + 60})`}>
                    {barsView &&
                      barsView.map(
                        bar =>
                          bar.data.value &&
                          !legendsItemsSave.includes(bar.data.id) &&
                          legendsItemsSave.push(bar.data.id) && (
                            <g
                              transform={`translate(${(legendIndex % 5) * 270}, ${Math.floor(legendIndex / 5) * 50})`}
                              key={legendIndex++}
                              onMouseEnter={e => {
                                handleLegendMouseEnter(bar.data.id);

                                setTooltipData({
                                  text: `${bar.data.id}: ${parseFloat(
                                    sumTotalByProperty(barsView, bar.data.id)
                                  ).toFixed(2)}`,
                                  x: e.clientX,
                                  y: e.clientY,
                                  color: bar.color,
                                }); // Set the tooltip text
                              }}
                              onMouseLeave={() => {
                                handleLegendMouseLeave();
                                setTooltipData(null); // Clear the tooltip text
                              }}>
                              <rect
                                x="0"
                                y="5"
                                rx="5"
                                fill={getColorMatchId(
                                  fillBar,
                                  bar.data.id,
                                  bar.color
                                )}
                                strokeWidth={
                                  highlightedBars === bar.data.id ? 1 : 0
                                }
                                stroke="green"
                                width="30"
                                height="30"
                                // style="pointer-events: none;"
                              />
                              <text
                                textAnchor="start"
                                x="35"
                                y="22"
                                style={{ fontSize: '11px' }}>
                                {bar.data.id}
                              </text>
                            </g>
                          )
                      )}
                  </g>
                </>
              );
            },
          ]}
        />

        {tooltipData && <Tooltip dataTip={tooltipData} />}
      </Container>
    </>
  );
};

BarChartMonitors.propTypes = {
  metric: PropTypes.string.isRequired,
};

export default BarChartMonitors;
