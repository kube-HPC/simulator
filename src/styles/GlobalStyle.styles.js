import React, { useEffect, Suspense } from 'react';
import { createGlobalStyle } from 'styled-components';
import { COLOR_LAYOUT, COLOR } from 'styles/colors';
import { useSiteDarkMode } from 'hooks';

// create in began styles
if (localStorage.getItem('theme') === 'dark') {
  import('antd/dist/antd.dark.css');
} else {
  import('antd/dist/antd.css');
}

// create in last styles to override styles
const GlobalStyleDark = React.lazy(() => import('./GlobalStyleDark.styles'));

const GlobalStyle = () => {
  const { isDarkMode, setTheme } = useSiteDarkMode();
  useEffect(() => setTheme(isDarkMode ? 'dark' : 'light'), []);

  const GlobalStyleHead = createGlobalStyle`
  * {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  .ant-tooltip-inner {
    background-color: white;
    color: black;
  }
  
  .ant-layout-content{
    overflow-x: hidden;
  }

  .ant-layout-sider-light .ant-layout-sider-trigger {
    border-right: 1px solid ${COLOR_LAYOUT.border};
  }

  .ant-table-fixed-header .ant-table-scroll .ant-table-header {
    overflow: hidden !important;
    margin-bottom: 0px !important;
  }

  .ant-table table {
    border-collapse: collapse;
  }

  ::-webkit-scrollbar-track {
    border: none;
    background-color: none;
  }
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-thumb {
    border: 0.5px solid ${COLOR.grey};
    background-color: ${COLOR_LAYOUT.border};
  }

  .ant-layout {
    background-color:  white;
  }

`;

  return (
    <>
      <GlobalStyleHead isDarkMode={isDarkMode} />

      {isDarkMode && (
        <Suspense fallback="">
          <GlobalStyleDark />
        </Suspense>
      )}
    </>
  );
};

export default GlobalStyle;
