import React from 'react';
import PropTypes from 'prop-types';
import JaegerTrace from 'jaeger-react-trace-component';
import { Result, Spin } from 'antd';
import styled from 'styled-components';

const CenterDiv = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Trace = ({ data }) =>
  data === null ? (
    <Result status="warning" title="No trace has been found." />
  ) : data ? (
    <div className="JaegerTrace">
      <JaegerTrace trace={{ data }} />
    </div>
  ) : (
    <CenterDiv>
      <Spin size="large" tip="Fetching Trace Data 🔎..." />
    </CenterDiv>
  );

Trace.propTypes = {
  // TODO: detail the props
  // eslint-disable-next-line
  data: PropTypes.object,
};

export default React.memo(Trace);
