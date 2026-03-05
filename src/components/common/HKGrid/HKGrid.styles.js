import styled from 'styled-components';

export const ActionChip = styled.div`
  padding: 4px;
  font-size: 10px;
  background: ${props => props.theme.Styles.HKGrid.ActionChip || '#e7e7e7'};
  border-radius: 6px;
  cursor: pointer;
`;

export const ColumnsControlWrapper = styled.div`
  width: 65px;
  position: absolute;
  right: 30px;
  z-index: 100;
  margin-top: 4px;
`;

export const LoadingOverlay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: ${props =>
    props.theme.Styles.HKGrid.LoadingOverlay || 'rgba(255, 255, 255, 0.8)'};
  z-index: 10;
`;

export const StyledGridWrapper = styled.div`
  height: 100%;
  width: 100%;
  position: relative;

  ${props =>
    props.$enableRowHoverActions &&
    `
    .ag-header-cell { background: none !important; }
    .ag-row {
      transition: all 0.3s ease;
      .${props.$actionClassName || 'ag-row-actions'} {
        transition: opacity 0.2s ease, width 0.2s ease;
        height: 32px;
        overflow: hidden;
        opacity: 0;
        width: 0;
      }
      &:hover {
        .${props.$actionClassName || 'ag-row-actions'} {
          transition: opacity 0.1s ease, width 0.1s ease;
          opacity: 1;
          width: fit-content;
        }
      }
    }
    .ag-row:hover { background-color: rgba(0,0,0,0.02); }
  `}

  .ag-root-wrapper {
    width: 100%;
    height: 100%;
  }
  .ag-header-cell-center .ag-header-cell-label {
    justify-content: center;
  }
  .ag-cell-value {
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: clip !important;
  }
`;
