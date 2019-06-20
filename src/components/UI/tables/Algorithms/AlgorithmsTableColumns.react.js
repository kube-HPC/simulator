import React from 'react';

import { Button, Modal, Row, Col, Tooltip } from 'antd';

import { sorter, stringify } from 'utils/string';
import Text from 'antd/lib/typography/Text';
import DrawerEditor from 'components/containers/drawer/DrawerEditor.react';

const deleteConfirmAction = (action, record) => {
  Modal.confirm({
    title: 'WARNING Deleting Algorithm',
    content: (
      <>
        Deleting algorithm will <Text strong>DELETE-ALL</Text> related pipelines
        and <Text strong>STOP-ALL</Text> executions.
      </>
    ),
    okText: 'Confirm',
    okType: 'danger',
    cancelText: 'Cancel',
    onOk() {
      action(record.name);
    },
    onCancel() {}
  });
};

const algorithmsTableColumns = ({ onSubmit, onDelete }) => [
  {
    title: 'Algorithm Name',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => sorter(a.name, b.name)
  },
  {
    title: 'Algorithm Image',
    dataIndex: 'algorithmImage',
    key: 'algorithmImage',
    onFilter: (value, record) => record.algorithmImage.includes(value),
    sorter: (a, b) => sorter(a.algorithmImage, b.algorithmImage)
  },
  {
    title: 'cpu',
    dataIndex: 'cpu',
    key: 'cpu'
  },
  {
    title: 'mem',
    dataIndex: 'mem',
    key: 'mem',
    width: '10%'
  },
  {
    title: 'minHotWorkers',
    dataIndex: 'minHotWorkers',
    key: 'minHotWorkers',
    sorter: (a, b) => sorter(a.workerImage, b.workerImage)
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
    render: (_, record) => (
      <Row type="flex" justify="start" gutter={10}>
        <Col>
          <DrawerEditor
            title={'Update Algorithm'}
            description={
              <>
                Edit algorithm properties and <Text code>Update</Text>{' '}
              </>
            }
            opener={onClick => (
              <Tooltip placement="top" title={'Update Algorithm'}>
                <Button shape="circle" icon="edit" onClick={onClick} />
              </Tooltip>
            )}
            submitText={'Update'}
            valueString={stringify(record)}
            onSubmit={onSubmit}
          />
        </Col>
        <Col>
          <Button
            type="danger"
            shape="circle"
            icon="delete"
            onClick={() => deleteConfirmAction(onDelete, record)}
          />
        </Col>
      </Row>
    )
  }
];

export default algorithmsTableColumns;
