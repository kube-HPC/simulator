// Mode Light

const LightTheme = COMMON_COLOR => {
  const COLOR = {
    blue: `#307fe6`,
    blueDark: `#0065E5`,
    blueLight: `#45a9ec`,
    blueExtraLight: `#a3d4f5`,
    cyan: `#98dbef`,
    darkGrey: `#807c7c`,
    green: `#63C13C`,
    greenLight: `#87d068`,
    greenDark: `#006618`,
    grey: `#ccc`,
    lightGrey: `#e8e8e8`,
    orange: `#ec8c16`,
    orangeLight: `#EAB675`,
    orangePale: `#FFC25A`,
    pink: `#e543b4`,
    pinkLight: `#FF5CA2`,
    purple: `#C657D0`,
    darkPurple: '#4b1650',
    red: `#e74c3c`,
    redPale: `#FF8974`,
    transparentBlack: `#00000073`,
    transparentWhite: `#ffffffdd`,
    transparentGrey: `#bfbfbf21`,
    turquoise: `#36DFB9`,
    white: `white`,
    whiteDark: `#e8e8e8`,
    yellow: `#eeda13`,
    yellowPale: '#f6ed88',
    darkCharcoal: `#333333`,
  };

  const GRAPH_PALETTE = { scheme: 'blues' };

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
    line: 'rgba(0, 0, 0, 0.07)',
    reactJsonView: { theme: 'rjv-default' },
    IconHoverStyle: { colorHover: 'black' },
    loadingScreen: {
      imageStyle: { fill: '#0F2744' },
      container: { background: '#e6e9f0 0%, #eef1f5 100%' },
      TitleMode: '#000000',
    },
    nodeSelectRadioButton: { bgButton: '#f4faff' },
    tabDrawerText: { color: '#333333' },
    tabDrawer: {
      background: '#ffffff',
      border: '#ffffff',
    },
    validContainer: { background: '#000000' },

    barColor: { color: COLOR.white, text: COLOR.darkGrey },
    nodeStatistics: { color: COLOR.white, text: COLOR.darkGrey },
    UserGuideTooltip: { TooltipBody: '#ffffff' },
    isTagFill: true,
    CapitalizedTag: { borderType: 'inherit' },
    ChonkyFileBrowser: { viewThemeDark: false },
    SidebarLeft: { colorTagNumber: COLOR.blue },
    TitleDataJob: { titleBottom: '#f0f0f0' },
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

export default LightTheme;
