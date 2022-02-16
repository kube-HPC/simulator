import qs from 'querystring';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { message } from 'antd';
import styled from 'styled-components';
import { LogsViewer, Card } from 'components/common';
import client from 'client';
import useSettings from 'hooks/useSettings';

const CardOverflow = styled(Card)`
  max-height: 80vh;
  min-height: 20em;
`;

const DriverLogs = ({ driverId, podName }) => {
  const [logs, setLogs] = useState([]);
  const { logSource: source } = useSettings();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await client.get(
          `/logs?${qs.stringify({ podName, source, nodeKind: 'driver' })}`
        );
        const logsMap = res.data.map((value, key) => ({ key, ...value }));
        setLogs(logsMap);
      } catch (e) {
        message.error(e.message);
      }
    }
    fetchData();
  }, [podName, source]);

  return (
    <CardOverflow bodyStyle={{ height: '20em' }}>
      <LogsViewer dataSource={logs} id={driverId} />
    </CardOverflow>
  );
};

DriverLogs.propTypes = {
  driverId: PropTypes.string.isRequired,
  podName: PropTypes.string.isRequired,
};

export default React.memo(DriverLogs);
