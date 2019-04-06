import React, { useState } from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Col, Row, Tag, Menu } from 'antd';

import MenuIcon from 'components/dumb/MenuIcon.react';

const setMenuItem = (iconComponent, title, count) => (
  <Row type="flex" justify="start">
    <Col>{iconComponent} </Col>
    <Col span={12}>{title}</Col>
    <Col span={3} offset={3}>
      <Tag className="tag">{count}</Tag>
    </Col>
  </Row>
);

const setMenuItemTitle = (title, count) => (
  <div>
    {title} <Tag className="tag">{count}</Tag>
  </div>
);

storiesOf('Basics|SiderIcon', module)
  .add('Default', () => setMenuItem(<MenuIcon type="area-chart" />, 'Jobs', 0))
  .add('Menu Item', () => (
    <Menu mode="inline" defaultSelectedKeys={['1']}>
      <Menu.Item key="1" title={setMenuItemTitle('Jobs', 0)}>
        {setMenuItem(<MenuIcon type="area-chart" />, 'Jobs', 0)}
      </Menu.Item>
    </Menu>
  ));
