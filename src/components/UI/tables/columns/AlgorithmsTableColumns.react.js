import React from 'react';

import { Button, Modal, Row, Col, Card } from 'antd';

import { sorter, stringify } from 'utils/string';
import JsonEditor from 'components/dumb/JsonEditor.react';
import DrawerContainer from 'components/dumb/DrawerContainer.react';
import Text from 'antd/lib/typography/Text';

const deleteConfirmAction = (action, record) => {
  Modal.confirm({
    title: 'WARNING Deleting Algorithm',
    content:
      'Deleting algorithm will DELETE-ALL related pipelines and STOP-ALL executions',
    okText: 'Confirm',
    okType: 'danger',
    cancelText: 'Cancel',
    onOk() {
      action(record.name);
    },
    onCancel() {}
  });
};

const algorithmsTableColumns = props => [
  {
    title: 'Algorithm Name',
    dataIndex: 'name',
    key: 'name',
    width: '20%',
    sorter: (a, b) => sorter(a.name, b.name)
  },
  {
    title: 'Algorithm Image',
    dataIndex: 'algorithmImage',
    key: 'algorithmImage',
    width: '20%',
    onFilter: (value, record) => record.algorithmImage.includes(value),
    sorter: (a, b) => sorter(a.algorithmImage, b.algorithmImage)
  },
  {
    title: 'cpu',
    dataIndex: 'cpu',
    key: 'cpu',
    width: '10%'
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
    width: '10%',
    sorter: (a, b) => sorter(a.workerImage, b.workerImage)
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
    render: (_, record) => (
      <Row type="flex" justify="start" gutter={10}>
        <Col>
          <DrawerContainer
            title={'Update Algorithm'}
            description={
              <>
                Edit algorithm properties and <Text code>Update</Text>{' '}
              </>
            }
            opener={onClick => (
              <Button shape="circle" icon="edit" onClick={onClick} />
            )}
            submitText={'Update'}
            onSubmit={props.onSubmit}
          >
            <Card size="small">
              <JsonEditor value={stringify(record)} />
            </Card>
          </DrawerContainer>
        </Col>
        <Col>
          <Button
            type="danger"
            shape="circle"
            icon="delete"
            onClick={() =>
              deleteConfirmAction(props.deleteAlgorithmFromStore, record)
            }
          />
        </Col>
      </Row>
    )
  }
];

export default algorithmsTableColumns;
