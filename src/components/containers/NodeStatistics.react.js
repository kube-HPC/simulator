import { connect } from 'react-redux';
import { Table, Tabs, Card, Tag, Button } from 'antd';
import ReactJson from 'react-json-view';
import { openModal } from '../../actions/modal.action';
import { init } from '../../actions/workerTable.action';
import { createSelector } from 'reselect';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withState } from 'recompose';
import { ResponsiveBar } from "@nivo/bar";
import './NodeStatistics.scss'
const stubData = [
  {
    "nodes": "AD",
    "hot dog": 10,
    "burger": 20,
    "sandwich": 64,
    "kebab": 79,
    "fries": 37,
    "donut": 29,
  },
  {
    "nodes": "AE",
    "hot dog": 131,
    "burger": 64,
    "sandwich": 60,
    "kebab": 99,
    "fries": 87,
    "donut": 131,
  },
  {
    "country": "AF",
    "hot dog": 76,
    "hot dogColor": "hsl(150, 70%, 50%)",
    "burger": 19,
    "burgerColor": "hsl(173, 70%, 50%)",
    "sandwich": 8,
    "sandwichColor": "hsl(228, 70%, 50%)",
    "kebab": 1,
    "kebabColor": "hsl(101, 70%, 50%)",
    "fries": 72,
    "friesColor": "hsl(255, 70%, 50%)",
    "donut": 55,
    "donutColor": "hsl(148, 70%, 50%)"
  },
  {
    "country": "AG",
    "hot dog": 181,
    "hot dogColor": "hsl(135, 70%, 50%)",
    "burger": 151,
    "burgerColor": "hsl(313, 70%, 50%)",
    "sandwich": 54,
    "sandwichColor": "hsl(297, 70%, 50%)",
    "kebab": 194,
    "kebabColor": "hsl(71, 70%, 50%)",
    "fries": 21,
    "friesColor": "hsl(250, 70%, 50%)",
    "donut": 44,
    "donutColor": "hsl(17, 70%, 50%)"
  },
  {
    "country": "AI",
    "hot dog": 106,
    "hot dogColor": "hsl(350, 70%, 50%)",
    "burger": 74,
    "burgerColor": "hsl(334, 70%, 50%)",
    "sandwich": 184,
    "sandwichColor": "hsl(159, 70%, 50%)",
    "kebab": 198,
    "kebabColor": "hsl(258, 70%, 50%)",
    "fries": 146,
    "friesColor": "hsl(275, 70%, 50%)",
    "donut": 103,
    "donutColor": "hsl(12, 70%, 50%)"
  },
  {
    "country": "AL",
    "hot dog": 0,
    "hot dogColor": "hsl(3, 70%, 50%)",
    "burger": 72,
    "burgerColor": "hsl(223, 70%, 50%)",
    "sandwich": 45,
    "sandwichColor": "hsl(350, 70%, 50%)",
    "kebab": 43,
    "kebabColor": "hsl(72, 70%, 50%)",
    "fries": 8,
    "friesColor": "hsl(116, 70%, 50%)",
    "donut": 62,
    "donutColor": "hsl(349, 70%, 50%)"
  },
  {
    "country": "AM",
    "hot dog": 104,
    "hot dogColor": "hsl(22, 70%, 50%)",
    "burger": 21,
    "burgerColor": "hsl(252, 70%, 50%)",
    "sandwich": 142,
    "sandwichColor": "hsl(217, 70%, 50%)",
    "kebab": 198,
    "kebabColor": "hsl(37, 70%, 50%)",
    "fries": 98,
    "friesColor": "hsl(316, 70%, 50%)",
    "donut": 147,
    "donutColor": "hsl(302, 70%, 50%)"
  }
]
const legend = [
  "hot dog",
  "burger",
  "sandwich",
  "kebab",
  "fries",
  "donut"
]
class NodeStatistics extends Component {


  render() {
    return (
      <ResponsiveBar
        data={this.props.dataSource.data}
        keys={this.props.dataSource.legend}
        indexBy="nodes"
        margin={{
          "top": 0,
          "right": 124,
          "bottom": 50,
          "left": 60
        }}
        padding={0.1}
        borderWidth={1}
        layout="horizontal"
        colors="blue_green"
        colorBy="id"
        defs={[
          {
            "id": "dots",
            "type": "patternDots",
            "background": "#99d89d",
            "color": "#fff",
            "size": 2,
            "padding": 3,
            "stagger": true
          },
          {
            "id": "lines",
            "type": "patternLines",
            "background": "inherit",
            "color": "#fff",
            "rotation": -45,
            "lineWidth": 1,
            "spacing": 10
          }
        ]}
        fill={[
          {
            "match": {
              "id": "free"
            },
            "id": "dots"
          },
          {
            "match": {
              "id": "reserved"
            },
            "id": "lines"
          }
        ]}
        borderColor="inherit:darker(1.6)"
        axisTop={{
          "tickSize": 0,
          "tickPadding": 4,
          "tickRotation": 0,
          "legend": "",
          "legendOffset": 100
        }}
        axisRight={null}
        axisBottom={{
          "tickSize": 5,
          "tickPadding": 5,
          "tickRotation": 0,
          "legend": "size",
          "legendPosition": "middle",
          "legendOffset": 32
        }}
        axisLeft={{
          "tickSize": 5,
          "tickPadding": 5,
          "tickRotation": 0,
          "legend": "nodes",
          "legendPosition": "middle",
          "legendOffset": -40
        }}
        enableGridY={false}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor="inherit:darker(1.6)"
        animate={true}
        motionStiffness={165}
        motionDamping={27}
        legends={[
          {
            "dataFrom": "keys",
            "anchor": "bottom-right",
            "direction": "column",
            "justify": false,
            "translateX": 120,
            "translateY": -28,
            "itemsSpacing": 2,
            "itemWidth": 100,
            "itemHeight": 20,
            "itemDirection": "left-to-right",
            "itemOpacity": 0.85,
            "symbolSize": 20,
            "effects": [
              {
                "on": "hover",
                "style": {
                  "itemOpacity": 1
                }
              }
            ]
          }
        ]}
      />
    )
  }

}

// const workerTable = (state) => state.workerTable.dataSource;
// const stats = (state) => state.workerTable.stats;

// const tableDataSelector = createSelector(
//   [workerTable],
//   (dataSource) => dataSource
// );



NodeStatistics.propTypes = {
  init: PropTypes.func.isRequired,
  dataSource: PropTypes.array.isRequired,
};
const adaptedData = (statistics) => {
  const cpu = statistics && statistics[0] && statistics[0].asMutable().results.map(res => {
    const algorithms = {};
    res && res.algorithmsData && res.algorithmsData.asMutable().forEach(algorithm => algorithms[algorithm.name] = algorithm.size)
    return {
      nodes: res.name,
      ...algorithms
    }
  })
  return {
    data: cpu,
    legend: statistics &&statistics[0]&& statistics[0].legend
  }
}

const mapStateToProps = (state) => ({
  dataSource: adaptedData(state.nodeStatistics.dataSource),
  //stats: stats(state),
});

export default connect(mapStateToProps, { openModal, init })(
  withState('isVisible', 'onPopoverClickVisible', { visible: false, podName: '' })(NodeStatistics)
);
