import React from 'react';

import { Button, Modal, Row, Col, Tooltip } from 'antd';

import { sorter } from 'utils/string';
import Text from 'antd/lib/typography/Text';
import CopyEllipsis from 'components/common/CopyEllipsis.react';
import DrawerEditorMD from 'components/common/drawer/DrawerEditorMD.react';

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

const algorithmsTableColumns = ({
  onSubmit,
  onDelete,
  fetchReadme,
  readmeDefault
}) => [
  {
    title: 'Algorithm Name',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => sorter(a.name, b.name),
    render: (_, record) => <CopyEllipsis text={record.name} />
  },
  {
    title: 'Algorithm Image',
    dataIndex: 'algorithmImage',
    key: 'algorithmImage',
    onFilter: (value, record) => record.algorithmImage.includes(value),
    sorter: (a, b) => sorter(a.algorithmImage, b.algorithmImage),
    render: (_, record) => (
      <CopyEllipsis text={record.algorithmImage} length={30} />
    )
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
          <DrawerEditorMD
            title={'Update Algorithm'}
            description={
              <>
                Edit algorithm properties and <Text code>Update</Text>{' '}
              </>
            }
            opener={setVisible => (
              <Tooltip placement="top" title={'Update Algorithm'}>
                <Button
                  shape="circle"
                  icon="edit"
                  onClick={() => {
                    fetchReadme(record);
                    setVisible(prev => !prev);
                  }}
                />
              </Tooltip>
            )}
            readmeDefault={
              readmeDefault &&
              readmeDefault[record.name] &&
              readmeDefault[record.name].readme &&
              readmeDefault[record.name].readme.readme
            }
            record={record}
            onSubmit={onSubmit}
            submitText={'Update'}
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
