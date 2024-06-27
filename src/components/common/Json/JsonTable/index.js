import { Tag, Typography, Button, notification } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CopyOutlined } from '@ant-design/icons';
import { Descriptions } from 'components/common';
import PropTypes from 'prop-types';
import React, { useState, useCallback, useMemo } from 'react';
import { COLOR_TASK_STATUS } from 'styles/colors';
import styled from 'styled-components';
import { prop } from 'styled-tools';
import DownloadLink from 'components/DownloadLink';

const { Text } = Typography;
const EMPTY = '—';

// drop the first slash if exists
const firstSlash = /^\//;

const isObject = obj =>
  !Array.isArray(obj) && typeof obj === 'object' && obj !== null;

const getColumns = ({ obj, vertical }) =>
  vertical ? Object.keys(obj).length : 1;

const isEmptyObject = obj => Object.entries(obj).length === 0;

const Margin = styled(Descriptions)`
  margin-top: ${prop('hasMargin', 'none')};
`;

const ItemByValueType = ({
  obj = null,
  vertical,
  hasMargin = false,
  name,
  jobId = null,
  parentId = null,
}) => {
  const [downloadHref, setDownloadHref] = useState(null);
  const handleDownload = useCallback(
    () => setDownloadHref(`api/v1/flowInput/${jobId}?download=true`),
    [jobId, setDownloadHref]
  );

  const columns = useMemo(() => getColumns({ obj, vertical }), [obj, vertical]);
  if (name === 'flowInput') {
    return (
      <>
        <Button onClick={handleDownload}>Download</Button>
        <DownloadLink href={downloadHref} />
      </>
    );
  }
  if (isObject(obj)) {
    return (
      <Margin column={columns} vertical={vertical} hasMargin={hasMargin}>
        {
          // cannot be re-used as a component!
          // ant requires direct children for description items!
          Object.entries(obj).map(([key, value]) => (
            <Descriptions.Item
              key={`ItemByValueType.Descriptions.Item:: description-${key} parentId:${parentId}`}
              label={<Text strong>{key}</Text>}>
              {isObject(value) && isEmptyObject(value) ? (
                <Tag>{EMPTY}</Tag>
              ) : (
                <ItemByValueType
                  obj={value}
                  vertical={vertical}
                  jobId={jobId}
                  name={key}
                  parentId={`${parentId}.${key}`}
                />
              )}
            </Descriptions.Item>
          ))
        }
      </Margin>
    );
  }
  if (Array.isArray(obj)) {
    return (
      <>
        {obj.map((value, ii) => (
          // eslint-disable-next-line
          <ItemByValueType
            obj={value}
            vertical={vertical}
            hasMargin={ii !== 0 || ii === obj.length - 1}
            parentId={`${parentId}.${ii}`}
            // eslint-disable-next-line
            key={`ItemByValueType:: name:${name} | parentId::${parentId} name:${name} idx:${ii}`}
            jobId={jobId}
          />
        ))}
      </>
    );
  }
  if (name === 'debugUrl') {
    return (
      <CopyToClipboard
        text={`ws://${window.location.host}/${obj.replace(firstSlash, '')}`}
        onCopy={() => notification.success({ message: 'Copied to clipboard' })}>
        <Tag color={COLOR_TASK_STATUS.active}>
          <CopyOutlined />{' '}
          {`ws://${window.location.host}/${obj.replace(firstSlash, '')}`}
        </Tag>
      </CopyToClipboard>
    );
  }
  if (obj === null) return EMPTY;
  return String(obj);
};

ItemByValueType.propTypes = {
  // eslint-disable-next-line
  obj: PropTypes.any,
  vertical: PropTypes.bool.isRequired,
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  hasMargin: PropTypes.bool,
  jobId: PropTypes.string,
  parentId: PropTypes.string,
};

const JsonTable = ({ obj, vertical = false, jobId = null, ...props }) => {
  const columns = useMemo(() => getColumns({ obj, vertical }), [obj, vertical]);
  return (
    <Descriptions column={columns} vertical={vertical} {...props}>
      {
        // cannot be re-used as a component!
        // ant requires direct children for description items!
        Object.entries(obj).map(([key, value]) => (
          <Descriptions.Item
            key={`JsonTable.Descriptions.Item:: description:${key} level: 1`}
            label={<Text strong>{key}</Text>}>
            {isObject(value) && isEmptyObject(value) ? (
              <Tag>{EMPTY}</Tag>
            ) : (
              <ItemByValueType
                obj={value}
                vertical={vertical}
                name={key}
                parentId="root"
                jobId={jobId}
              />
            )}
          </Descriptions.Item>
        ))
      }
    </Descriptions>
  );
};

JsonTable.propTypes = {
  // eslint-disable-next-line
  obj: PropTypes.object,
  vertical: PropTypes.bool,
  jobId: PropTypes.string,
};

export default JsonTable;
