// Mode LightsOut - Navy Black
const LightsOutTheme = COMMON_COLOR => {
  const COLOR = {
    // Blues — cooler and deeper than dark theme
    blue: `#2a3a4a`,
    blueDark: `#1a2530`,
    blueLight: `#4a5a6a`,
    blueExtraLight: `#5a6a7a`,

    // Supporting colors — all desaturated vs dark theme
    cyan: `#2a3a4a`,
    darkGrey: `#4a5570`,
    green: `#2a4a30`,
    greenLight: `#2e4e34`,
    greenLight2: `#5a8a48`,
    greenDark: `#0a2a08`,
    grey: `#4a5260`,
    lightGrey: `#243040`,
    orange: `#4a2e08`,
    orangeLight: `#6a3e10`,
    orangePale: `#8a5200`,
    pink: `#4a0a38`,
    pinkLight: `#620028`,
    purple: `#4a1a58`,
    darkPurple: `#2e0e38`,
    red: `#4a0e0a`,
    redPale: `#5a0e00`,

    // Transparents
    transparentBlack: `#ffffffb0`,
    transparentWhite: `#6a6a6a80`,
    transparentGrey: `#3a3a3a30`,

    // Base
    turquoise: `#085a44`,
    white: `white`,
    whiteDark: `#7a8898`,
    yellow: `#4a3e08`,
    yellowPale: `#5a4a0a`,
    darkCharcoal: `#1e2535`,
  };

  const GRAPH_PALETTE = [
    '#0d5a78',
    '#0d6e50',
    '#0d6e5c',
    '#2a1a5a',
    '#22226a',
    '#0d5a6e',
    '#0d6060',
    '#0d6858',
    '#0d6e5c',
    '#127840',
  ];

  const COLOR_PIPELINE_TYPES = COMMON_COLOR.COLOR_PIPELINE_TYPES(COLOR);
  const COLOR_PRIORITY = COMMON_COLOR.COLOR_PRIORITY(COLOR);
  const COLOR_STORAGE = COMMON_COLOR.COLOR_STORAGE(COLOR);
  const COLOR_BOARDS = COMMON_COLOR.COLOR_BOARDS(COLOR);
  const COLOR_SERVICE = COMMON_COLOR.COLOR_SERVICE(COLOR);
  const COLOR_LAYOUT = COMMON_COLOR.COLOR_LAYOUT(COLOR);
  const COLOR_TASK_STATUS = COMMON_COLOR.COLOR_TASK_STATUS(COLOR);
  const COLOR_PIPELINE_STATUS = COMMON_COLOR.COLOR_PIPELINE_STATUS(COLOR);
  const NODE_KINDS_COLOR = COMMON_COLOR.NODE_KINDS_COLOR(COLOR);
  const { COLOR_EXPERIMENTS } = COMMON_COLOR;

  const Styles = {
    backgroundTheme: '#0a0f1a',
    line: 'rgba(255, 255, 255, 0.02)',
    reactJsonView: { theme: 'twilight' },
    IconHoverStyle: { colorHover: '#7a8898' },
    loadingScreen: {
      imageStyle: { fill: '#050810' },
      container: { background: '#0d1526 0%, #070b14 100%' },
      TitleMode: '#7a8898',
    },
    nodeSelectRadioButton: { bgButton: '#111c30' },
    tabDrawerText: { color: '#7a8898' },
    tabDrawer: {
      background: '#0a0f1a',
      border: '#243040',
    },
    validContainer: { background: '#050810' },
    barColor: { color: COLOR.whiteDark, text: '#b8c4d0' },
    nodeStatistics: { color: COLOR.blueLight, text: COLOR.whiteDark },
    UserGuideTooltip: { TooltipBody: '#0a0f1a' },
    isTagFill: true,
    CapitalizedTag: { borderType: COLOR_PIPELINE_TYPES },
    ChonkyFileBrowser: { viewThemeDark: true },
    SidebarLeft: { colorTagNumber: COLOR.grey },
    TitleDataJob: { titleBottom: '#0d1220' },
    filters: { backgroundColor: '#0d152a20', borderColor: '#020810' },
    jobsGraph: {
      mode: 'dark',
      backgroundBarColor: '#1a2a3a',
      borderBarColor: '#0f1e2e',
      backgroundBarNodesColor: '#0d1526',
      fontNodeColor: '#00000073',
    },
    HKGrid: {
      ActionChip: '#0d1220',
      LoadingOverlay: 'rgba(7, 11, 20, 0.85)',
    },
    VersionsTable: {
      currentRow: '#111e35',
    },
    iconColor: COLOR.whiteDark,
    queueTimeColor: '#c47800',
    tagLightness: 55,
    tagSaturation: 60,
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
    NODE_KINDS_COLOR,
    COLOR_EXPERIMENTS,
  };
};

export default LightsOutTheme;
