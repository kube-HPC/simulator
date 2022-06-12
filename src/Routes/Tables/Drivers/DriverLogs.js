import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import { LogsViewer, Card } from 'components/common';
import useSettings from 'hooks/useSettings';
import useLogs from 'hooks/graphql/useLogs';

const CardOverflow = styled(Card)`
  padding-bottom: 20px;
`;

const DriverLogs = ({ driverId, podName }) => {
  const [logsItems, setLogsItems] = useState([]);
  const { logSource: source } = useSettings();

  const { logs } = useLogs({ podName, source, nodeKind: 'driver' });

  useEffect(() => {
    setLogsItems(logs.map((value, key) => ({ key, ...value } || [])));
  }, [logs, podName, source]);

  return (
    logsItems?.length > 0 && (
      <CardOverflow bodyStyle={{ height: '20em' }}>
        <LogsViewer dataSource={logsItems} id={driverId} />
      </CardOverflow>
    )
  );
};

DriverLogs.propTypes = {
  driverId: PropTypes.string.isRequired,
  podName: PropTypes.string.isRequired,
};

export default React.memo(DriverLogs);
