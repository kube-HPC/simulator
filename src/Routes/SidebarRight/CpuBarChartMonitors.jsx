import React from 'react';
import styled from 'styled-components';
import BarChartMonitors from './BarChartMonitors.react';



const ContainerCPU = styled.div`
 height: 100vh;


`;

const CpuBarChartMonitors = ({metric}) => (
 <ContainerCPU>
  <BarChartMonitors metric={metric} />
</ContainerCPU>

);

export default CpuBarChartMonitors;
