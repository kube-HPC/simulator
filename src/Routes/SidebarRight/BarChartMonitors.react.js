import { ResponsiveBar } from '@nivo/bar';

import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { Theme } from 'styles/colors';
import { useMetric } from 'hooks/graphql';
import { Header } from './MemoryAndStorage/styles';
import settingBars from './MemoryAndStorage/settingBars';

const Container = styled.div`
  display: flex;
  margin-top: 50px;

  height: 50vh;

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
const sumTotalByProperty = (arr, prop) =>
  arr.reduce((total, obj) => total + (obj[prop] || 0), 0);

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
  const foundItem = dataFill.find(
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
  const dataBars = useRef([]);

  const handleLegendMouseEnter = legendItem => {
    // const idToHighlight = legendItem;
    // const barsToHighlight = data.filter(bar => bar.id === idToHighlight);
    setHighlightedBars(legendItem);
  };

  const handleLegendMouseLeave = () => {
    setHighlightedBars('');
  };

  const legendsItemsSave = [];

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
            bottom: 120,
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
          // Other chart configurations

          layers={[
            'grid',
            // 'bars',
            'markers',
            'axes',

            ({ bars, xScale, yScale, fill, getLabel, ...rest }) => {
              dataBars.current = [fill, bars];

              return (
                <>
                  <text
                    transform={`translate(${rest.width + 30},${
                      rest.height / 2
                    }) rotate(-90)`}
                    style={{ fontSize: '17px' }}>
                    Nodes
                  </text>
                  <g>
                    {bars &&
                      bars.map(bar => (
                        <g transform={`translate(${bar.x},${bar.y})`}>
                          <rect
                            key={bar.key}
                            width={bar.width - 2}
                            height={bar.height}
                            fill={getColorMatchId(fill, bar.data.id, bar.color)}
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
                      ))}
                  </g>
                  <g transform={`translate(0,${rest.outerHeight - 60})`}>
                    {bars &&
                      bars.map(
                        bar =>
                          !legendsItemsSave.includes(bar.data.id) &&
                          legendsItemsSave.push(bar.data.id) && (
                            <g
                              transform={`translate(${
                                legendsItemsSave.length * 102
                              },0)`}
                              onMouseEnter={e => {
                                handleLegendMouseEnter(bar.data.id);

                                setTooltipData({
                                  text: `${bar.data.id}: ${parseFloat(
                                    sumTotalByProperty(rest.data, bar.data.id)
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
                                  fill,
                                  bar.data.id,
                                  bar.color
                                )}
                                strokeWidth={
                                  highlightedBars === bar.data.id ? 1 : 0
                                }
                                stroke="green"
                                width="30"
                                height="30"
                                Style="pointer-events: none;"
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
