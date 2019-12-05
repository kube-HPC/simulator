import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';
import { useAlgorithmReadme } from 'hooks';
import { MarkdownViewer } from 'components/common';

const config = { message: 'Update Algorithm' };

const AlgorithmMarkdown = ({ algorithmName }) => {
  const { source } = useAlgorithmReadme(algorithmName);
  return (
    <Card>
      <MarkdownViewer source={source} config={config} />
    </Card>
  );
};

AlgorithmMarkdown.propTypes = {
  algorithmName: PropTypes.string.isRequired,
};

export default AlgorithmMarkdown;
