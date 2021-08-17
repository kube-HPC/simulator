import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CopyOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Button, Tooltip, Popover, Input } from 'antd';
import { copyToClipboard } from 'utils';

const H2 = styled.h2`
  text-transform: capitalize;
`;
const H3 = styled.h3`
  text-transform: capitalize;
`;
const H4 = styled.h4`
  text-transform: capitalize;
`;
const Group = styled.section`
  margin-bottom: 1em;
`;
const PopoverContainer = styled.div`
  min-width: 50ch;
`;
const FieldContainer = styled.div`
  display: flex;
`;

const Field = ({ title, value }) => (
  <>
    <H4>{title}</H4>
    <FieldContainer>
      <Input readOnly value={value} />
      <Tooltip title={`copy ${title}`} placement="left">
        <Button
          style={{ marginLeft: '0.5ch' }}
          onClick={() => copyToClipboard(value)}
          icon={<CopyOutlined />}
          type="dashed"
        />
      </Tooltip>
    </FieldContainer>
  </>
);
Field.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

const RemoteDetails = ({ storage, git }) => (
  <Popover
    placement="bottomLeft"
    content={
      <PopoverContainer>
        <H2>remote details</H2>
        <Group>
          <H3>git</H3>
          {git.kind !== 'internal' ? (
            <Field title="repository url" value={git.repositoryUrl} />
          ) : (
            <H4> internal</H4>
          )}
        </Group>
        <Group>
          <H3>storage</H3>
          {storage.kind !== 'internal' ? (
            <>
              <Field title="endpoint" value={storage.endpoint} />
              <Field title="bucket name" value={storage.bucketName} />
            </>
          ) : (
            <H4>internal</H4>
          )}
        </Group>
      </PopoverContainer>
    }>
    <Button icon={<InfoCircleOutlined />} style={{ marginLeft: 'auto' }} />
  </Popover>
);

RemoteDetails.propTypes = {
  git: PropTypes.shape({
    kind: PropTypes.string.isRequired,
    repositoryUrl: PropTypes.string.isRequired,
  }),
  storage: PropTypes.shape({
    kind: PropTypes.string.isRequired,
    endpoint: PropTypes.string.isRequired,
    bucketName: PropTypes.string.isRequired,
  }),
};

RemoteDetails.defaultProps = {
  git: null,
  storage: null,
};

export default RemoteDetails;
