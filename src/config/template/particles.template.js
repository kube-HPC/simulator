import { COLOR } from 'styles';

export default {
  particles: {
    color: {
      value: COLOR.blueLight,
    },
    number: {
      value: 120,
    },
    size: {
      value: 4,
    },
    line_linked: {
      color: COLOR.blue,
    },
    shape: {
      type: ['circle', 'triangle', 'polygon', 'edge'],
    },
  },
  interactivity: {
    events: {
      onhover: {
        enable: true,
        mode: 'repulse',
      },
    },
  },
};
