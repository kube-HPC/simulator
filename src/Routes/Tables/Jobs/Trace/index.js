import React from 'react';
import PropTypes from 'prop-types';
import { Result, Spin } from 'antd';
import styled from 'styled-components';
import ModernTraceViewer from './ModernTraceViewer';

const CenterDiv = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Trace = ({ data }) => {
  // Check if dark mode is active
  const isDarkMode =
    localStorage.getItem('hkubeTheme')?.toUpperCase() === 'DARK';

  return (
    <div className={isDarkMode ? 'trace-dark-mode' : 'trace-light-mode'}>
      {data === null ? (
        <Result status="warning" title="No trace has been found." />
      ) : data ? (
        <div>
          <ModernTraceViewer data={data} />
        </div>
      ) : (
        <CenterDiv>
          <Spin size="large" tip="Fetching Trace Data 🔎..." />
        </CenterDiv>
      )}
    </div>
  );
};

Trace.propTypes = {
  // TODO: detail the props
  // eslint-disable-next-line
  data: PropTypes.object,
};

export default React.memo(Trace);
