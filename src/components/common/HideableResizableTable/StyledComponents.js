import styled from 'styled-components';

export const ThHandle = styled.div`
  position: absolute;
  right: -4px;
  top: 0;
  bottom: 0;
  width: 8px;
  cursor: col-resize;
  background: transparent;
  z-index: 10;
`;

export const GhostLine = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #1890ff;
  pointer-events: none;
  z-index: 999;
  display: none;
`;

export const TitleContainer = styled.div`
  position: absolute;
  z-index: 1000;
  right: 10px;
  display: flex;
  gap: 12px;
  padding: 5px;
`;

export const TitleButton = styled.div`
  padding: 4px;
  font-size: 9px;
  background: #e7e7e7;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
`;
