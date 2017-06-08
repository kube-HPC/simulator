import { createSelector } from 'reselect';
import colors from '../constants/colors';


const getCurrentLayer = (layers, selectedLayer) =>
  layers.find(collection=> collection.layer === selectedLayer) || {charts:[]}


// take the data and the labels and pack them into the dataset structure
// the structure is required by the library
const chartProvider = ({type, data, labels, title}) =>
    Object.assign({}, {type}, {title},
    {
      dataset: {
        labels,
        datasets: [ {
          data,
          backgroundColor: [ colors.purple, colors.green, colors.blue ],
          hoverBackgroundColor: [colors.purleHighlight, colors.greenHighlight, colors.blueHighlight]
        } ]
      }
    })


export const getCharts = (layers, selectedLayer) =>
  getCurrentLayer(layers, selectedLayer).charts.map(chartProvider)

export const getLayers = layers =>
  layers.map(item => item.layer)
