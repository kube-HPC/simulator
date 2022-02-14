import React, { forwardRef } from 'react';
import { TypeFilter } from 'const';
import { toUpperCaseFirstLetter } from 'utils';
import { MenuOutlined } from '@ant-design/icons';
import { Select, Tag } from 'antd';
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from 'react-sortable-hoc';
import JobTime from '../JobTime';

export const SortableItem = sortableElement(props => <tr {...props} />);
export const SortableContainer = sortableContainer(props => (
  <tbody {...props} />
));

export const DragHandle = sortableHandle(() => (
  <MenuOutlined style={{ color: '#999' }} />
));

export const StartTime = (startTime, { results }) => (
  <JobTime startTime={startTime} results={results} />
);

export const SelectFilterOptions = forwardRef((props, ref) => (
  // eslint-disable-next-line
  <Select ref={ref} onChange={e => props.onSelect(e)} defaultValue="Select">
    {Object.entries(TypeFilter).map(([key, value]) => (
      <Select.Option key={key} value={key}>
        {toUpperCaseFirstLetter(value === TypeFilter.JOBID ? 'Select' : value)}
      </Select.Option>
    ))}
  </Select>
));

export const TypeTableColumns = {
  JOBID: [
    {
      title: 'Sort',
      dataIndex: 'sort',
      width: 30,
      className: 'drag-visible',
      render: () => <DragHandle />,
    },
    {
      title: 'jobID',
      dataIndex: 'jobId',
      className: 'drag-visible',
    },
    {
      title: 'Start Time',
      dataIndex: 'entranceTime',
      key: `Start timestamp`,
      width: `10%`,
      render: StartTime,
    },
    {
      title: 'Name',
      dataIndex: 'pipelineName',
    },
  ],
  PIPELINE: [
    {
      title: 'Sort',
      dataIndex: 'sort',
      width: 30,
      className: 'drag-visible',
      render: () => <DragHandle />,
    },
    {
      title: 'Pipeline Name',
      dataIndex: 'name',
      render: name => <b>{name}</b>,
    },
    {
      title: 'jobs Count',
      dataIndex: 'count',
    },
  ],
  TAG: [
    {
      title: 'Sort',
      dataIndex: 'sort',
      width: 30,
      className: 'drag-visible',
      render: () => <DragHandle />,
    },
    {
      title: 'Tag Name',
      dataIndex: 'name',
      render: name => {
        if (name) {
          const arrayTags = name.toString().split(',');

          return arrayTags.length > 0
            ? arrayTags.map(tagName => <Tag color="purple">{tagName}</Tag>)
            : 'No tag';
        }

        return 'No tag.';
      },
    },
    {
      title: 'jobs Count',
      dataIndex: 'count',
    },
  ],
};
