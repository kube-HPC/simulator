// Mode Dark
const DarkTheme = COMMON_COLOR => {
  const COLOR = {
    blue: `#1557ac`,
    blueDark: `#0054c2`,
    blueLight: `#147cc2`,
    blueExtraLight: `#47a9eb`,
    cyan: `#57c4e5`,
    darkGrey: `#807c7c`,
    green: `#407d26`,
    greenLight: `#448529`,
    greenDark: `#006618`,
    grey: `#999999`,
    lightGrey: `#586a93`,
    orange: `#9c5b0d`,
    orangeLight: `#d1811f`,
    orangePale: `#ffa305`,
    pink: `#991571`,
    pinkLight: `#c20054`,
    purple: `#b436bf`,
    darkPurple: '#691f70',
    red: `#962013`,
    redPale: `#b31b00`,
    transparentBlack: `#ffffffdb`,
    transparentWhite: `#c9c9c9de`,
    transparentGrey: `#bfbfbf52`,
    turquoise: `#0fae8b`,
    white: `white`,
    whiteDark: `#e8e8e8`,
    yellow: `#b0a30c`,
    yellowPale: '#c7b80f',
    darkCharcoal: `#454545`,
  };

  const GRAPH_PALETTE = [
    '#1ac7c2',
    '#25e892',
    '#1ddfa3',
    '#6849ba',
    '#6054c8',
    '#1dbace',
    '#1ac7c2',
    '#1ad4b3',
    '#1ddfa3',
    '#30ef82',
  ];

  const COLOR_PIPELINE_TYPES = COMMON_COLOR.COLOR_PIPELINE_TYPES(COLOR);
  const COLOR_PRIORITY = COMMON_COLOR.COLOR_PRIORITY(COLOR);
  const COLOR_STORAGE = COMMON_COLOR.COLOR_STORAGE(COLOR);
  const COLOR_BOARDS = COMMON_COLOR.COLOR_BOARDS(COLOR);
  const COLOR_SERVICE = COMMON_COLOR.COLOR_SERVICE(COLOR);
  const COLOR_LAYOUT = COMMON_COLOR.COLOR_LAYOUT(COLOR);
  const COLOR_TASK_STATUS = COMMON_COLOR.COLOR_TASK_STATUS(COLOR);
  const COLOR_PIPELINE_STATUS = COMMON_COLOR.COLOR_PIPELINE_STATUS(COLOR);
  const { COLOR_EXPERIMENTS } = COMMON_COLOR;

  const Styles = {
    reactJsonView: { theme: 'paraiso' },
    IconHoverStyle: { colorHover: '#ffffff' },
    loadingScreen: {
      imageStyle: { fill: '#0F2744' },
      container: { background: '#1c325c 0%,#001b3e 100%' },
      TitleMode: '#ffffff',
    },
    nodeSelectRadioButton: { bgButton: '#bed3e5' },
    tabDrawerText: { color: '#ffffff' },
    tabDrawer: {
      background: '#182039',
      border: '#586a93',
    },
    validContainer: { background: '#0e1422' },
    barColor: { color: COLOR.whiteDark, text: COLOR.whiteDark },
    nodeStatistics: { color: COLOR.blueLight, text: COLOR.whiteDark },
    UserGuideTooltip: { TooltipBody: '#182039' },
    isTagFill: false,
    CapitalizedTag: { borderType: COLOR_PIPELINE_TYPES },
    ChonkyFileBrowser: { viewThemeDark: true },
  };

  return {
    COLOR,
    Styles,
    GRAPH_PALETTE,
    COLOR_PIPELINE_TYPES,
    COLOR_PRIORITY,
    COLOR_STORAGE,
    COLOR_BOARDS,
    COLOR_SERVICE,
    COLOR_LAYOUT,
    COLOR_TASK_STATUS,
    COLOR_PIPELINE_STATUS,
    COLOR_EXPERIMENTS,
  };
};

export default DarkTheme;
