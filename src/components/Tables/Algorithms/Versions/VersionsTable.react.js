import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'components';
import getVersionsColumns from './getVersionsColumns.react';
import { useSelector } from 'react-redux';
import { STATE_SOURCES } from 'const';
import { JsonSwitch, Card } from 'components/common';
import axios from 'axios';
import { notification } from 'utils';

const errorNotification = ({ message }) => notification({ message });

const fetchVersion = ({ url, algorithmName, callback }) =>
  axios
    .get(`${url}/versions/algorithms/${algorithmName}`)
    .then(({ data }) => {
      callback(data);
    })
    .catch(errorNotification);

const applyVersion = ({ url }) => ({ name, image }) =>
  axios.post(`${url}/versions/algorithms/apply`, { name, image }).catch(errorNotification);

const deleteVersion = ({ url }) => ({ name, algorithmImage }) =>
  axios
    .delete(`${url}/versions/algorithms/${name}/${encodeURIComponent(algorithmImage)}`)
    .catch(errorNotification);

const DEFAULT_INITIAL = [];

const VersionsTable = ({ algorithmName, currentVersion }) => {
  const [dataSource, setDataSource] = useState(DEFAULT_INITIAL);

  const socketURL = useSelector(state => state[STATE_SOURCES.SOCKET_URL]);
  const onApply = applyVersion({ url: socketURL });
  const onDelete = deleteVersion({ url: socketURL });
  const columns = getVersionsColumns({ currentVersion, onApply, onDelete });

  useEffect(() => {
    fetchVersion({ url: socketURL, algorithmName, callback: setDataSource });
  }, [algorithmName]);

  const expandedRowRender = record => (
    <Card isMargin>
      <JsonSwitch obj={record} />
    </Card>
  );

  return <Table expandedRowRender={expandedRowRender} dataSource={dataSource} columns={columns} />;
};

VersionsTable.propTypes = {
  algorithmName: PropTypes.string.isRequired,
  currentVersion: PropTypes.string.isRequired,
};

export default VersionsTable;
