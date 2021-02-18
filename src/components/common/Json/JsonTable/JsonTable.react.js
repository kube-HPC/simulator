import { Tag, Typography, Button } from 'antd';
import { Descriptions } from 'components/common';
import PropTypes from 'prop-types';
import React, { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { prop } from 'styled-tools';
import DownloadLink from 'components/DownloadLink';

const { Text } = Typography;
const EMPTY = `Empty`;

const isObject = obj =>
  !Array.isArray(obj) && typeof obj === 'object' && obj !== null;

const getColumns = ({ obj, vertical }) =>
  vertical ? Object.keys(obj).length : 1;

const isEmptyObject = obj => Object.entries(obj).length === 0;

const Margin = styled(Descriptions)`
  margin-top: ${prop('hasMargin', 'none')};
`;

const ItemByValueType = ({ obj, vertical, hasMargin, name, jobId, level }) => {
  const [downloadHref, setDownloadHref] = useState(null);
  const handleDownload = useCallback(
    () => setDownloadHref(`/flowInput/${jobId}?download=true`),
    [jobId, setDownloadHref]
  );

  const columns = useMemo(() => getColumns({ obj, vertical }), [obj, vertical]);

  if (isObject(obj)) {
    if (name === 'flowInput' && obj.truncated) {
      return (
        <>
          <Button onClick={handleDownload}>Download</Button>
          <DownloadLink href={downloadHref} />
        </>
      );
    }
    return (
      <Margin
        key={name}
        column={columns}
        vertical={vertical}
        hasMargin={hasMargin}>
        {
          // cannot be re-used as a component!
          // ant requires direct children for description items!
          Object.entries(obj).map(([key, value]) => (
            <Descriptions.Item
              key={`description-${key}`}
              label={<Text strong>{key}</Text>}>
              {isObject(value) && isEmptyObject(value) ? (
                <Tag>{EMPTY}</Tag>
              ) : (
                <ItemByValueType
                  obj={value}
                  vertical={vertical}
                  key={key}
                  jobId={jobId}
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
        {obj.map((value, i) => (
          // eslint-disable-next-line
          <ItemByValueType
            obj={value}
            vertical={vertical}
            level={level + 1}
            hasMargin={i !== 0 || i === obj.length - 1}
            // TODO:: replace the key with actual value
            // eslint-disable-next-line
            key={`ItemByValueType:: joId:${jobId} | name:${name} | level:${level}`}
          />
        ))}
      </>
    );
  }
  return String(obj);
};

ItemByValueType.propTypes = {
  // eslint-disable-next-line
  obj: PropTypes.object.isRequired,
  vertical: PropTypes.bool.isRequired,
  name: PropTypes.oneOf([PropTypes.string, PropTypes.number]).isRequired,
  hasMargin: PropTypes.bool,
  jobId: PropTypes.string.isRequired,
  level: PropTypes.number.isRequired,
};

ItemByValueType.defaultProps = {
  hasMargin: false,
};

const JsonTable = ({ obj, vertical, jobId, ...props }) => {
  const columns = useMemo(() => getColumns({ obj, vertical }), [obj, vertical]);
  if (!jobId) return null;
  return (
    <Descriptions column={columns} vertical={vertical} {...props}>
      {
        // cannot be re-used as a component!
        // ant requires direct children for description items!
        Object.entries(obj).map(([key, value]) => (
          <Descriptions.Item
            key={`description-${key}`}
            label={<Text strong>{key}</Text>}>
            {isObject(value) && isEmptyObject(value) ? (
              <Tag>{EMPTY}</Tag>
            ) : (
              <ItemByValueType
                level={1}
                obj={value}
                vertical={vertical}
                key={`ItemByValueType:: joId:${jobId} | name:${key} | level:1`}
                name={key}
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
  jobId: PropTypes.string.isRequired,
};

JsonTable.defaultProps = {
  vertical: false,
};

export default JsonTable;
