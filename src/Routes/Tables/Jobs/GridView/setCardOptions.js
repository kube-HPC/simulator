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
    selectable: true,
    hoverConnectedEdges: false,
    hover: false,
  },
  physics: {
    enabled: false,
  },
  clickToUse: true,
});
