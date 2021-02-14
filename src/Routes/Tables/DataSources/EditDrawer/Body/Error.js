import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Empty as AntdEmpty, Button } from 'antd';
import { ReactComponent as ErrorLogo } from 'assets/errorLogo.svg';
import { useActions } from 'hooks';
import styled from 'styled-components';
import { COLOR } from 'styles/colors';

const IdLabel = styled.em`
  font-weight: bolder;
  font-style: normal;
`;

const Empty = styled(AntdEmpty)`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ErrorPage = ({ dataSourceId, collectionStatus }) => {
  const { retryFetchDataSource, retryFetchDataSources } = useActions();
  const handleRetry = useCallback(() => {
    if (collectionStatus === 'SUCCESS') {
      retryFetchDataSource(dataSourceId);
    }
    retryFetchDataSources();
  }, [
    retryFetchDataSource,
    retryFetchDataSources,
    dataSourceId,
    collectionStatus,
  ]);
  return (
    <Empty
      image={<ErrorLogo style={{ stroke: COLOR.red }} />}
      description={
        collectionStatus === 'SUCCESS' ? (
          <span>
            Could not fetch dataSource <IdLabel>{dataSourceId}</IdLabel>
          </span>
        ) : (
          <span>Could not fetch dataSources collection</span>
        )
      }>
      <Button type="primary" onClick={handleRetry}>
        click here to retry
      </Button>
    </Empty>
  );
};

ErrorPage.propTypes = {
  dataSourceId: PropTypes.string.isRequired,
  collectionStatus: PropTypes.oneOf(['IDLE', 'PENDING', 'FAIL', 'NOT_FOUND'])
    .isRequired,
};
export default ErrorPage;
