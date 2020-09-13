import React from 'react';
import { Empty } from 'antd';
import { ResponsivePie } from '@nivo/pie';
import { useDiskSpace } from 'hooks';
import { Card } from 'components/common';
import styled from 'styled-components';

const Container = styled.div`
  font-size: 20px;
  height: 70vh;
`;

const adaptedData = dataSource => {
  const data = [
    {
      id: 'free',
      label: `free ${dataSource.freeH}`,
      value: dataSource.free,
      color: 'hsl(357, 70%, 50%)',
    },
    {
      id: 'used',
      label: `used ${dataSource.usedH}`,
      value: dataSource.used,
      color: 'hsl(357, 70%, 50%)',
    },
  ];

  return data;
};

const DiskSpace = () => {
  const { dataSource } = useDiskSpace();

  if (!dataSource.freeH) {
    return <Empty description="No disk space" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  const data = adaptedData(dataSource);

  if (dataSource.freeP < 20) {
    // we should set an alert.....
    // improve cards Total Capacity, Free Capacity
  }

  return (
    <Container>
      <Card isMargin title="Total Capacity">
        <p>{dataSource.sizeH}</p>
      </Card>
      <Card isMargin title="Free Capacity">
        <p>{dataSource.freeH}</p>
      </Card>
      <ResponsivePie
        data={data}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        colors={{ scheme: 'nivo' }}
        borderWidth={1}
        borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
        radialLabelsSkipAngle={10}
        radialLabelsTextXOffset={6}
        radialLabelsTextColor="#333333"
        radialLabelsLinkOffset={0}
        radialLabelsLinkDiagonalLength={16}
        radialLabelsLinkHorizontalLength={24}
        radialLabelsLinkStrokeWidth={1}
        radialLabelsLinkColor={{ from: 'color' }}
        slicesLabelsSkipAngle={10}
        slicesLabelsTextColor="#333333"
        animate={true}
        motionStiffness={90}
        motionDamping={15}
        legends={[
          {
            anchor: 'bottom',
            direction: 'row',
            translateY: 56,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: '#999',
            symbolSize: 18,
            symbolShape: 'circle',
            effects: [
              {
                on: 'hover',
                style: {
                  itemTextColor: '#000',
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
