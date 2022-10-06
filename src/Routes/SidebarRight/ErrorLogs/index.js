import React, { useEffect, useState, useCallback, useMemo } from 'react';

import { useLocation, useHistory } from 'react-router-dom';
// import { useErrorLogs } from 'hooks';
import { useErrorLogs } from 'hooks/graphql';
import { Table } from 'components';
import { JsonSwitch, Card } from 'components/common';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import moment from 'moment';
import errorLogsTableColumns from './ErrorLogsTableColumns.react';
import ErrorLogQueryTable from './ErrorLogQueryTable';

const expandedRowRender = record => (
  <Card>
    <JsonSwitch obj={record} />
  </Card>
);

const extractId = ({ id }) => id;

const ErrorLogsTable = () => {
  const { dataSource, clearCounter } = useErrorLogs();
  const [errorLogsFilterList, setErrorLogsFilterList] = useState();
  const urlParams = useLocation();
  const { pathname, search } = urlParams;
  const queryFilter = useMemo(() => new URLSearchParams(search), [search]);
  const history = useHistory();

  const onSubmitFilter = useCallback(values => {
    if (values.qSearch != null && values.qSearch !== '') {
      queryFilter.set('qSearch', values.qSearch);
    } else {
      queryFilter.delete('qSearch');
    }

    if (values.qErrorLogTime != null && values.qErrorLogTime !== '') {
      queryFilter.set(
        'qErrorLogTime.from',
        values.qErrorLogTime[0]?.toISOString()
      );
      queryFilter.set(
        'qErrorLogTime.to',
        values.qErrorLogTime[1]?.toISOString()
      );
    } else {
      queryFilter.delete('qErrorLogTime.from');
      queryFilter.delete('qErrorLogTime.to');
    }

    history.push(`${pathname}?${queryFilter.toString()}`);

    if (values?.qSearch || values?.qErrorLogTime) {
      const filterErrorLogs = dataSource.filter(
        item =>
          (item.type.includes(values.qSearch) ||
            item.message.includes(values.qSearch)) &&
          (values.qErrorLogTime != null
            ? moment(+item.timestamp).isBetween(
                values?.qErrorLogTime[0],
                values?.qErrorLogTime[1]
              )
            : true)
      );

      setErrorLogsFilterList(filterErrorLogs);
    } else {
      setErrorLogsFilterList(dataSource);
    }
  });

  useEffect(() => {
    setErrorLogsFilterList(dataSource);
  }, [dataSource]);

  useEffect(() => {
    clearCounter();
  }, [clearCounter]);

  return (
    <>
      <ErrorLogQueryTable ErrorLogList={dataSource} onSubmit={onSubmitFilter} />
      <Table
        rowKey={extractId}
        columns={errorLogsTableColumns}
        dataSource={errorLogsFilterList}
        expandable={{
          expandedRowRender,
          // eslint-disable-next-line react/prop-types
          expandIcon: ({ expanded, onExpand, record }) =>
            expanded ? (
              <DownOutlined onClick={e => onExpand(record, e)} />
            ) : (
              <RightOutlined onClick={e => onExpand(record, e)} />
            ),
        }}
      />
    </>
  );
};

export default React.memo(ErrorLogsTable);
