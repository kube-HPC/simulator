import { ResponsiveBar } from '@nivo/bar';

import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Theme } from 'styles/colors';
import { useMetric } from 'hooks/graphql';
import { Header } from './MemoryAndStorage/styles';
import settingBars from './MemoryAndStorage/settingBars';
import BarChartTotalsPie from './BarChartTotalsPie.react';
import { Form } from 'components/common';
const { Collapsible } = Form;

const Container = styled.div`

  margin-top: 50px;

  height: ${({ $height }) => ($height ? `${($height)+300}px` : '70vh')};

`;
const PieContainer = styled.div`
  width: 100%;
  height: 300px;

`;

const ResponsiveBarStyle = styled(ResponsiveBar)`
  width: 85%;

`;

const typeName = {
  cpu: 'CPU',
  mem: 'Memory',
  gpu: 'GPU',
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

const buildBarsViewFromRows = (rows, keys) =>
  rows
    .flatMap(row => keys.map(id => ({ data: { id, data: row } })))
    .filter(item => item.data.data?.[item.data.id] !== null);

const buildPieDataFromTotals = (rows, keys, palette) => {
  const barsView = buildBarsViewFromRows(rows, keys);
  return keys
    .map((id, index) => ({
      id,
      label: id,
      value: sumTotalByProperty(barsView, id),
    }))
    .filter(item => item.value > 0);
};

const BarChartLayer = React.memo(
  ({
    bars,
    rest,
    highlightedBars,
    fillBar,
    setTooltipData,
    handleLegendMouseEnter,
    handleLegendMouseLeave,
  }) => {
    const barsView = useMemo(
      () => bars.filter(x => x.data.value !== null && x.data.value !== undefined),
      [bars]
    );

    const legendItems = useMemo(() => {
      const seen = new Map();
      barsView.forEach(bar => {
        if (bar.data.value && !seen.has(bar.data.id)) {
          seen.set(bar.data.id, bar);
        }
      });
      return Array.from(seen.values());
    }, [barsView]);

    return (
      <>
        <text
          key={`textNode${barsView.index}`}
          transform={`translate(${rest.width - 200},${rest.height / 2}) rotate(-90)`}
          style={{ fontSize: '17px' }}>
          Nodes
        </text>
        <g key={`gNode${barsView.index}`}>
          {barsView.map(
            bar =>
              bar.data.value && (
                <g transform={`translate(${bar.x},${bar.y})`} key={bar.key}>
                  <rect
                    width={bar.width - 2}
                    height={bar.height}
                    fill={getColorMatchId(fillBar, bar.data.id, bar.color)}
                    strokeWidth={highlightedBars === bar.data.id ? 3 : null}
                    rx="2"
                    stroke={
                      highlightedBars === bar.data.id ? '#8d8d8d' : bar.color
                    }
                    onMouseOver={e => {
                      setTooltipData({
                        text: `${bar.data.id} - ${bar.data.indexValue} : ${bar.data.value}`,
                        x: e.clientX,
                        y: e.clientY,
                        color: bar.color,
                      });
                    }}
                    onMouseOut={() => {
                      setTooltipData(null);
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
                      });
                    }}
                    onMouseOut={() => {
                      setTooltipData(null);
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
          {legendItems.map((bar, index) => (
            <g
              transform={`translate(${(index % 5) * 270}, ${Math.floor(index / 5) * 50})`}
              key={bar.data.id}
              onMouseEnter={e => {
                handleLegendMouseEnter(bar.data.id);
                setTooltipData({
                  text: `${bar.data.id}: ${parseFloat(
                    sumTotalByProperty(barsView, bar.data.id)
                  ).toFixed(2)}`,
                  x: e.clientX,
                  y: e.clientY,
                  color: bar.color,
                });
              }}
              onMouseLeave={() => {
                setTooltipData(null);
                handleLegendMouseLeave();
 
              }}
              onMouseOut={() => {
                setTooltipData(null);
                handleLegendMouseLeave();
              }}
              >
              <rect
                x="0"
                y="5"
                rx="5"
                fill={getColorMatchId(fillBar, bar.data.id, bar.color)}
                strokeWidth={highlightedBars === bar.data.id ? 1 : 0}
                stroke="green"
                width="30"
                height="30"
              />
              <text textAnchor="start" x="35" y="22" style={{ fontSize: '12px' }}>
                {bar.data.id} :{' '}
                <tspan fill="blue" fontWeight="bold">
                  {parseFloat(
                    sumTotalByProperty(barsView, bar.data.id)
                  ).toFixed(2)}
                </tspan>
              </text>
            </g>
          ))}
        </g>
      </>
    );
  }
);

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

  const pieData = useMemo(
    () => buildPieDataFromTotals(data, legend, Theme.GRAPH_PALETTE),
    [data, legend]
  );
  const rowPieData = useMemo(() => (pieData.length / 5) * 50 + 70, [pieData]);

  const handleLegendMouseEnter = useCallback(legendItem => {
    // const idToHighlight = legendItem;
    // const barsToHighlight = data.filter(bar => bar.id === idToHighlight);
    setHighlightedBars(legendItem);
  }, []);

  const handleLegendMouseLeave = useCallback(() => {
    setHighlightedBars('');
    setTooltipData(null);
  }, []);

  return (
    <>
      <Header  onMouseEnter={() => setTooltipData(null)} >{typeName[metric]}</Header>
      <Container $height={rowPieData} 
      onMouseLeave={() => setTooltipData(null)} 
      onMouseOut={handleLegendMouseLeave} 
      onPointerLeave={handleLegendMouseLeave}
      onPointerOut={handleLegendMouseLeave}
    
      >
        <ResponsiveBarStyle
          data={data}
          keys={legend}
          indexBy="nodes"
          theme={themePreferencesBar}
          margin={{
            right: 100,
            bottom: rowPieData,
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

            ({ bars, ...rest }) => (
              <BarChartLayer
                bars={bars}
                rest={rest}
                highlightedBars={highlightedBars}
                fillBar={fillBar}
                setTooltipData={setTooltipData}
                handleLegendMouseEnter={handleLegendMouseEnter}
                handleLegendMouseLeave={handleLegendMouseLeave}
              />
            ),
          ]}
        />
       
       
       
       
       {tooltipData && <Tooltip dataTip={tooltipData} />}




     </Container>
    <Collapsible title="Total Resource Pie Chart" onMouseEnter={() => setTooltipData(null)} >
      <PieContainer>
         <BarChartTotalsPie pieData={pieData} defs={designBar} fill={fillBar} />
      </PieContainer>
    </Collapsible>
     
    </>
  );
};

BarChartMonitors.propTypes = {
  metric: PropTypes.string.isRequired,
  ContainerResponsivePieComponent: PropTypes.elementType,
};


export default React.memo(BarChartMonitors);
