import { Tag, Typography, Button } from 'antd';
import { Descriptions } from 'components/common';
import PropTypes from 'prop-types';
import React, { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { prop } from 'styled-tools';
import DownloadLink from 'components/DownloadLink';

const { Text } = Typography;
const EMPTY = '—';

const isObject = obj =>
  !Array.isArray(obj) && typeof obj === 'object' && obj !== null;

const getColumns = ({ obj, vertical }) =>
  vertical ? Object.keys(obj).length : 1;

const isEmptyObject = obj => Object.entries(obj).length === 0;

const Margin = styled(Descriptions)`
  margin-top: ${prop('hasMargin', 'none')};
`;

const ItemByValueType = ({
  obj,
  vertical,
  hasMargin,
  name,
  jobId,
  parentId,
}) => {
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
  if (obj === null) return EMPTY;
  return String(obj);
};

ItemByValueType.propTypes = {
  // eslint-disable-next-line
  obj: PropTypes.any,
  vertical: PropTypes.bool.isRequired,
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  hasMargin: PropTypes.bool,
  jobId: PropTypes.string,
};

ItemByValueType.defaultProps = {
  obj: null,
  jobId: null,
  hasMargin: false,
};

const JsonTable = ({ obj, vertical, jobId, ...props }) => {
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

JsonTable.defaultProps = {
  vertical: false,
  jobId: null,
};

export default JsonTable;
