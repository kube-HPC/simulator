import { Empty } from 'antd';
import styled from 'styled-components';

export const Card = styled.div`
  padding-top: 2px;
  overflow: auto;
  flex: 1;
  height: 95vh;
  -webkit-box-shadow: -7px -8px 2px -4px ${props => props.theme.Styles.line};
  box-shadow: -7px -8px 2px -4px ${props => props.theme.Styles.line};
`;

export const GraphContainer = styled.div`
  /*flex: 1;*/
  /*height:40vh;
  min-height: 40vh;
  max-height: 80vh;*/

  .vis-network {
    height: 90vh !important;
  }
  .vis-tooltip {
    position: absolute;
    visibility: hidden;
    padding: 5px;
    white-space: nowrap;
    font-family: verdana;
    font-size: 16px;
    color: #000;
    background-color: #f5f4ed;
    -moz-border-radius: 3px;
    -webkit-border-radius: 3px;
    border-radius: 3px;
    border: 1px solid #808074;
    box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.2);
    pointer-events: none;
    z-index: 5;
  }
`;

export const EmptyHeight = styled(Empty)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 136px;
`;

export const ButtonsPanel = styled.div`
  position: absolute;
  z-index: 9999;
  left: 47%;
  top: 10px;
  display: flex;
  flex-direction: column;
  height: 150px;
  justify-content: space-between;
`;

export const FlexContainer = styled.div`
  display: flex;
`;
