import styled from 'styled-components';
import { Card as AntDCard } from 'antd';

export const Card = styled(AntDCard)`
  flex: 1;
`;

export const Metrics = styled.div`
  display: flex;
  overflow: hidden;
  align-items: center;
`;

export const MetricContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1em;
  border-left: 5px solid transparent;
  padding-left: 1ch;
  &:first-of-type {
    margin-top: 0;
  }
`;

export const Header = styled.h2`
  text-transform: capitalize;
  margin-bottom: 1em;
  border-bottom: 1px solid #ddd;
`;

export const MetricHeader = styled.h4`
  margin: 0;
`;

export const MetricValue = styled.span``;
