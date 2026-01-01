import React from 'react';
import { Button, Image, Typography } from 'antd';
import { useSelector } from 'react-redux';
import { selectors } from 'reducers';
import { GRAFANA_ICON } from '../Routes/Base/Header/Settings/grafana-icon';

const GrafanaLink = () => {
  const { grafanaUrl } = useSelector(selectors.connection);
  const openUrl = () => window.open(`${grafanaUrl}/d/uXoXQ8Z7k/`);
  return (
    <Button type="primary" onClick={openUrl}>
      <Image
        src={GRAFANA_ICON}
        style={{
          width: '22px',
          cursor: 'pointer',
        }}
      />{' '}
      <Typography.Text
        style={{
          color: '#ffffff',
          marginLeft: '5px',
        }}>
        {' '}
        Grafana Dashboard
      </Typography.Text>{' '}
    </Button>
  );
};
export default React.memo(GrafanaLink);
