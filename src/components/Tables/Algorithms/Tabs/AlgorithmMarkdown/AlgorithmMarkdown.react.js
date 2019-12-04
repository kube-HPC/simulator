import React from 'react';
import PropTypes from 'prop-types';
import MarkdownViewer from 'components/common/Markdown/MarkdownViewer/MarkdownViewer.react';
import { useAlgorithmReadme } from 'hooks';
import { Card } from 'antd';

const AlgorithmMarkdown = ({ algorithmName }) => {
  const { source } = useAlgorithmReadme(algorithmName);

  return (
    <Card>
      <MarkdownViewer source={source} />
    </Card>
  );
};

AlgorithmMarkdown.propTypes = {
  algorithmName: PropTypes.string.isRequired,
};

export default AlgorithmMarkdown;
