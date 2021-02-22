import { generateStyles } from '../graphUtils';

export default ({ direction }) => ({
  ...generateStyles({ direction }),
  height: `200px`,
  autoResize: false,
  configure: {
    enabled: false,
  },
  interaction: {
    dragNodes: false,
    dragView: false,
    multiselect: false,
    navigationButtons: false,
    selectable: false,
    hoverConnectedEdges: false,
    hover: false,
  },
  physics: {
    enabled: false,
  },
  clickToUse: true,
});
