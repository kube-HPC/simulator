import React from 'react';
import PropTypes from 'prop-types';
import prettyBytes from 'pretty-bytes';
import styled from 'styled-components';
import { COLOR_STORAGE } from 'styles/colors';
import { ResponsivePie } from '@nivo/pie';
import { Form } from 'components/common';

import {
  Metrics,
  MetricHeader,
  MetricContainer,
  MetricValue,
  Header,
} from './styles';

const { Collapsible } = Form;

const PieContainer = styled.div`
  height: 12em;
  flex: 1;
  svg + div {
    color: #000000;
  }
  width: 70%;
`;

const BoxesContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin: 0 auto;
  width: 30%;
`;

const StorageStyle = styled.div`
  height: 30%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;

const adaptedData = ({ free, used }) => {
  const data = [
    {
      id: 'free',
      label: 'Free',
      value: free,
      color: COLOR_STORAGE.FREE,
    },
    {
      id: 'used',
      label: 'Used',
      value: used,
      color: COLOR_STORAGE.USED,
    },
  ];

  return data;
};

const Storage = ({ storage }) => {
  const free = parseInt(storage.free, 30);
  const size = parseInt(storage.size, 30);
  const used = size - free;
  const ratio = free / size;
  const usedP = parseFloat((1 - ratio).toFixed(2));
  const freeP = (ratio * 100).toFixed(2);
  const sizeH = prettyBytes(size);
  const freeH = prettyBytes(free);
  const usedH = prettyBytes(used);
  const data = adaptedData({ free, used, freeH, usedH });

  return (
     <Collapsible title="Storage">
    <StorageStyle>
      
      <Metrics>
        <PieContainer>
          <ResponsivePie
            data={data}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            innerRadius={0.75}
            padAngle={0.7}
            cornerRadius={0}
            valueFormat={prettyBytes}
            borderWidth={0}
            enableRadialLabels={false}
            enableSlicesLabels={false}
            animate
            motionStiffness={90}
            motionDamping={15}
            colors={[COLOR_STORAGE.FREE, COLOR_STORAGE.USED]}
            legends={[]}
            enableArcLabels={false}
          />
        </PieContainer>
        <BoxesContainer>
          <MetricContainer>
            <MetricHeader>Total Capacity</MetricHeader>
            <MetricValue>{sizeH}</MetricValue>
          </MetricContainer>

          <MetricContainer style={{ borderColor: COLOR_STORAGE.FREE }}>
            <MetricHeader>Free</MetricHeader>
            <MetricValue>
              {freeH} ({freeP}%)
            </MetricValue>
          </MetricContainer>

          <MetricContainer style={{ borderColor: COLOR_STORAGE.USED }}>
            <MetricHeader>Used</MetricHeader>
            <MetricValue>
              {usedH} ({(usedP * 100).toFixed(2)}%)
            </MetricValue>
          </MetricContainer>
        </BoxesContainer>
      </Metrics>
    </StorageStyle>
    </Collapsible>
  );
};
Storage.propTypes = {
  storage: PropTypes.shape({
    size: PropTypes.string.isRequired,
    free: PropTypes.string.isRequired,
  }).isRequired,
};
export default Storage;
