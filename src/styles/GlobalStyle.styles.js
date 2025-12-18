import { createGlobalStyle } from 'styled-components';
import { COLOR_LAYOUT, COLOR } from 'styles/colors';

const GlobalStyle = createGlobalStyle`
body{
  margin:0;
}
* {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
.cursor-pointer{
  cursor: pointer;
}

.ant-tooltip-inner {
  background-color: white;
  color: black;
}

.ant-layout-content{
  overflow-x:${({ location: { pathname, search } = {} } = {}) =>
    ['/algorithms', '/pipelines'].includes(pathname) ||
    (['/jobs'].includes(pathname) && !search.indexOf('view=grid') > 0)
      ? 'none'
      : 'hidden'};
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

.ant-table-wrapper .ant-table{
  scrollbar-color:unset;

  ::-webkit-scrollbar-track {
    background-color: transparent;
  }

  ::-webkit-scrollbar {
    width: 5px;
    height: 10px;
  }

  ::-webkit-scrollbar-thumb {
    border: 1px solid ${COLOR.grey};
    background-color: ${COLOR_LAYOUT.border};
    border-radius: 10px;
  }
  
}

::-webkit-scrollbar-track {
  border: none;
  background-color: none;
}
::-webkit-scrollbar {
  width: 5px;
  height: 10px;
}

::-webkit-scrollbar-thumb {
  border: 1px solid ${COLOR.grey};
  background-color: ${COLOR_LAYOUT.border};
  border-radius: 10px;
}



.ant-select-item-option-content:empty:before{
  content: '[empty]';
}

.row-dragging {
  background: #fafafa;
  border: 1px solid #ccc;
}

.row-dragging td {
  padding: 16px;
}

.row-dragging .drag-visible {
  visibility: visible;
}
.ant-tag{
    border-radius:4px;
  }

.JaegerTrace .TimelineCollapser
{
  display:none;
}

.mark 
{
  background-color:yellow;
}

.active-row {
  background-color:#f5faff;
}


.hidden-addon-before{
  .ant-input-group-addon:first-child{
    display:none;
  }
}
.expanded-row-disable,
.expanded-row-disable .ant-table-cell-row-hover,
.expanded-row-disable .ant-table-column-sort {
  background:#aaa !important;
}
.icon-left .anticon{
  font-size: 20px !important;
  
}


/* ag-grid-theme-hk.css */
.ag-theme-alpine {
  /* borders */
 .ag-root-wrapper {
    border: none;
  }

  --ag-border-color: #e0e0e0;
  --ag-borders: solid 1px;
  --ag-border-radius: 6px;

  /* Header */
  --ag-header-background-color: #ffffff;
  --ag-header-foreground-color: #ffffff;
  --ag-header-height: 55px;
  --ag-header-column-separator-display: block;

  /* lines */
  --ag-row-height: 56px;
  --ag-row-hover-color: #f5f7fa;
  --ag-selected-row-background-color: #e6f4ff;

  /* cells */
  --ag-cell-horizontal-padding: 12px;
  --ag-font-size: 13px;
  --ag-font-family: 'Inter', 'Roboto', sans-serif;

  /* Grid background */
  --ag-background-color: #ffffff;
  --ag-odd-row-background-color: #ffffff;
}

.ag-theme-alpine {
  --ag-input-focus-border-color: #1677ff;
  --ag-range-selection-border-color: #1677ff;
  --ag-checkbox-checked-color: #1677ff;
}

`;

export default GlobalStyle;
