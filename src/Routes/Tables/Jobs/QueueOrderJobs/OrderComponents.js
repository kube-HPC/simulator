import React, { forwardRef } from 'react';
import { TypeFilter, TypeTable } from 'const';
import { toUpperCaseFirstLetter, getColorByName } from 'utils';
import {
  MenuOutlined,
  StarTwoTone,
  StarOutlined,
  PauseCircleOutlined,
} from '@ant-design/icons';
import { Select, Tag, Tooltip } from 'antd';
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from 'react-sortable-hoc';
import PropTypes from 'prop-types';
import { SelectGroupBy } from './OrderStyles';
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
export const TypeRow = type =>
  type === TypeTable.PREFERRED ? <StarTwoTone /> : <StarOutlined />;

export const Concurrency = isConcurrency =>
  isConcurrency ? (
    <Tooltip title="Concurrency">
      <PauseCircleOutlined />
    </Tooltip>
  ) : (
    ''
  );

export const SelectFilterOptions = forwardRef((props, ref) => (
  // eslint-disable-next-line
  <SelectGroupBy
    ref={ref}
    onChange={e => props.onSelect(e)}
    defaultValue={props.filterVal !== '' ? props.filterVal : TypeFilter.JOBID}>
    {Object.entries(TypeFilter).map(([key, value]) => (
      <Select.Option key={key} value={key}>
        {toUpperCaseFirstLetter(value)}
      </Select.Option>
    ))}
  </SelectGroupBy>
));

SelectFilterOptions.propTypes = {
  onSelect: PropTypes.func.isRequired,
  filterVal: PropTypes.string.isRequired,
};

export const TypeTableColumns = {
  JOBID: [
    {
      title: '',
      dataIndex: ['sort'],
      width: 30,
      className: 'drag-visible',
      render: () => <DragHandle />,
    },
    {
      title: 'jobID',
      dataIndex: ['jobId'],
      className: 'drag-visible',
    },
    {
      title: 'Start Time',
      dataIndex: ['entranceTime'],
      key: `Start timestamp`,

      render: StartTime,
    },
    {
      title: 'Name',
      dataIndex: ['pipelineName'],
    },
    {
      title: 'Tags',
      dataIndex: ['tags'],
      render: name => {
        if (name && name.length > 0) {
          const arrayTags = name.toString().split(',');

          return arrayTags.length > 0
            ? arrayTags.map(tagName => (
                <Tag color={getColorByName(tagName)}>{tagName}</Tag>
              ))
            : 'No tag';
        }

        return 'No tag.';
      },
    },
  ],
  PIPELINE: [
    {
      title: '',
      dataIndex: ['sort'],
      width: 30,
      className: 'drag-visible',
      render: () => <DragHandle />,
    },
    {
      title: 'Pipeline Name',
      dataIndex: ['name'],
      render: name => <b>{name}</b>,
    },
    {
      title: 'jobs Count',
      dataIndex: 'count',
    },
  ],
  TAG: [
    {
      title: '',
      dataIndex: ['sort'],
      width: 30,
      className: 'drag-visible',
      render: () => <DragHandle />,
    },
    {
      title: 'Tags',
      dataIndex: ['name'],
      render: name => {
        if (name) {
          const arrayTags = name.toString().split(',');

          return arrayTags.length > 0
            ? arrayTags.map(tagName => (
                <Tag color={getColorByName(tagName)}>{tagName}</Tag>
              ))
            : 'No tag';
        }

        return 'No tag.';
      },
    },
    {
      title: 'jobs Count',
      dataIndex: ['count'],
    },
  ],
};

export const TableAllInOneTypeColumns = {
  JOBID: [
    {
      title: '',
      dataIndex: ['typeElement'],
      width: '2%',
      render: TypeRow,
    },
    {
      title: 'jobID',
      dataIndex: ['jobId'],
    },
    {
      title: 'Start Time',
      dataIndex: ['entranceTime'],
      key: `Start timestamp`,

      render: StartTime,
    },
    {
      title: 'Name',
      dataIndex: ['pipelineName'],
    },
    {
      title: 'Tags',
      dataIndex: ['tags'],
      render: name => {
        if (name && name.length > 0) {
          const arrayTags = name.toString().split(',');

          return arrayTags.length > 0
            ? arrayTags.map(tagName => (
                <Tag color={getColorByName(tagName)}>{tagName}</Tag>
              ))
            : 'No tag';
        }

        return 'No tag.';
      },
    },
    {
      dataIndex: ['maxExceeded'],
      render: Concurrency,
    },
  ],

  PIPELINE: [
    {
      title: '',
      dataIndex: ['typeElement'],
      width: '2%',
      render: TypeRow,
    },

    {
      title: 'Pipeline Name',
      dataIndex: ['name'],
      render: name => <b>{name}</b>,
    },
    {
      title: 'jobs Count',
      dataIndex: 'count',
    },
  ],
  TAG: [
    {
      title: '',
      dataIndex: ['typeElement'],
      width: '2%',
      render: TypeRow,
    },
    {
      title: 'Tags',
      dataIndex: ['name'],
      render: name => {
        if (name) {
          const arrayTags = name.toString().split(',');

          return arrayTags.length > 0
            ? arrayTags.map(tagName => (
                <Tag color={getColorByName(tagName)}>{tagName}</Tag>
              ))
            : 'No tag';
        }

        return 'No tag.';
      },
    },
    {
      title: 'jobs Count',
      dataIndex: ['count'],
    },
  ],
};
