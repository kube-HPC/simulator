import React from 'react';
import { Empty, Card, Col, Row } from 'antd';
import { ResponsivePie } from '@nivo/pie';
import GaugeChart from 'react-gauge-chart';
import { useDiskSpace } from 'hooks';
import prettyBytes from 'pretty-bytes';
import styled from 'styled-components';

import { COLOR_DISK_SPACE } from 'styles/colors';

const Container = styled.div`
  font-size: 20px;
  height: 70vh;
`;

const adaptedData = ({ free, used, freeH, usedH }) => {
  const data = [
    {
      id: 'free',
      label: `free ${freeH}`,
      value: free,
      color: COLOR_DISK_SPACE.FREE,
    },
    {
      id: 'used',
      label: `used ${usedH}`,
      value: used,
      color: COLOR_DISK_SPACE.USED,
    },
  ];

  return data;
};

const DiskSpace = () => {
  const { diskSpace } = useDiskSpace();

  if (!diskSpace.size) {
    return <Empty description="No disk space" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }
  const { size, free } = diskSpace;
  const used = size - free;
  const ratio = free / size;
  const usedP = parseFloat((1 - ratio).toFixed(2));
  const freeP = parseFloat(ratio.toFixed(2)) * 100;
  const sizeH = prettyBytes(size);
  const freeH = prettyBytes(free);
  const usedH = prettyBytes(used);
  const data = adaptedData({ free, used, freeH, usedH, usedP, freeP });

  return (
    <Container>
      <div>
        <Row gutter={20}>
          <Col span={5}>
            <Card title="Total Capacity">
              <h2>{sizeH}</h2>
            </Card>
          </Col>
          <Col span={5}>
            <Card title="Free">
              <h2>{freeH} ({freeP}%)</h2>
            </Card>
          </Col>
          <Col span={5}>
            <Card title="Used">
              <h2>{usedH} ({usedP * 100}%)</h2>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <GaugeChart id="gauge-chart-disk-space"
                nrOfLevels={3}
                arcsLength={[0.3, 0.5, 0.2]}
                colors={['#5BE12C', '#F5CD19', '#EA4228']}
                textColor={COLOR_DISK_SPACE.LABELS}
                percent={usedP}
                arcPadding={0.02}
              />
            </Card>
          </Col>
        </Row>
      </div>

      <ResponsivePie
        data={data}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        borderWidth={1}
        borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
        radialLabelsSkipAngle={10}
        radialLabelsTextXOffset={6}
        radialLabelsTextColor={COLOR_DISK_SPACE.LABELS}
        radialLabelsLinkOffset={0}
        radialLabelsLinkDiagonalLength={16}
        radialLabelsLinkHorizontalLength={24}
        radialLabelsLinkStrokeWidth={1}
        radialLabelsLinkColor={{ from: 'color' }}
        slicesLabelsSkipAngle={10}
        slicesLabelsTextColor={COLOR_DISK_SPACE.LABELS}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
        defs={[
          {
            id: 'free',
            type: 'linearGradient',
            colors: [
              { offset: 100, color: COLOR_DISK_SPACE.FREE },
            ],
          },
          {
            id: 'used',
            type: 'linearGradient',
            colors: [
              { offset: 100, color: COLOR_DISK_SPACE.USED },
            ],
          },
        ]}
        fill={[
          {
            match: {
              id: 'free',
            },
            id: 'free',
          },
          {
            match: {
              id: 'used',
            },
            id: 'used',
          },
        ]}
        legends={[
          {
            anchor: 'bottom',
            direction: 'row',
            translateY: 56,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: COLOR_DISK_SPACE.LABELS,
            symbolSize: 18,
            symbolShape: 'circle',
            effects: [
              {
                on: 'hover',
                style: {
                  itemTextColor: COLOR_DISK_SPACE.LABELS,
                },
              },
            ],
          },
        ]}
      />
    </Container>
  );
};

export default DiskSpace;
