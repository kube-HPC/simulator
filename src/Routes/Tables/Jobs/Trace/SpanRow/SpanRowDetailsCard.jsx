import React from 'react';
import PropTypes from 'prop-types';
import { ApiOutlined } from '@ant-design/icons';
import {
  DetailsCard,
  CardHeader,
  CardTitle,
  CardMetadata,
  MetadataLabel,
  MetadataTag,
  CardContent,
  Section,
  SectionTitle,
  TagGrid,
  TagKey,
  TagValue,
  CardFooter,
  SpanIdLabel,
  SpanIdValue,
} from './styles';
import { formatDuration, formatTime } from '../traceUtils';

const SpanRowDetailsCard = ({
  isExpanded,
  span,
  process,
  color,
  isDark,
  serviceName,
  traceStartTime,
}) => {
  if (!isExpanded) {
    return null;
  }

  return (
    <DetailsCard size="small" $color={color} $isDark={isDark}>
      <CardHeader $isDark={isDark}>
        <CardTitle level={5} $isDark={isDark}>
          {span.operationName}
        </CardTitle>
        <CardMetadata $isDark={isDark}>
          <span>
            <MetadataLabel $isDark={isDark}>Service:</MetadataLabel>{' '}
            <MetadataTag color="blue" $isDark={isDark}>
              {serviceName}
            </MetadataTag>
          </span>
          <span>
            <MetadataLabel $isDark={isDark}>Duration:</MetadataLabel>{' '}
            <MetadataTag color="orange" $isDark={isDark}>
              {formatDuration(span.duration)}
            </MetadataTag>
          </span>
          <span>
            <MetadataLabel $isDark={isDark}>Start:</MetadataLabel>{' '}
            <MetadataTag color="cyan" $isDark={isDark}>
              {formatTime(span.startTime, traceStartTime)}
            </MetadataTag>
          </span>
        </CardMetadata>
      </CardHeader>

      <CardContent>
        {span.tags && span.tags.length > 0 && (
          <Section>
            <SectionTitle $isDark={isDark}>
              <ApiOutlined />
              Tags
            </SectionTitle>
            <TagGrid>
              {span.tags.map(tag => (
                <React.Fragment key={tag.key}>
                  <TagKey $isDark={isDark}>{tag.key}:</TagKey>
                  <TagValue color="geekblue" $isDark={isDark}>
                    {String(tag.value)}
                  </TagValue>
                </React.Fragment>
              ))}
            </TagGrid>
          </Section>
        )}

        {process && (
          <Section>
            <SectionTitle $isDark={isDark}>
              <ApiOutlined />
              Process
            </SectionTitle>
            <TagGrid>
              {process.tags?.map(tag => (
                <React.Fragment key={tag.key}>
                  <TagKey $isDark={isDark}>{tag.key}:</TagKey>
                  <TagValue color="geekblue" $isDark={isDark}>
                    {String(tag.value)}
                  </TagValue>
                </React.Fragment>
              ))}
            </TagGrid>
          </Section>
        )}
      </CardContent>

      <CardFooter $isDark={isDark}>
        <SpanIdLabel $isDark={isDark}>Span ID:</SpanIdLabel>
        <SpanIdValue $isDark={isDark}>{span.spanID}</SpanIdValue>
      </CardFooter>
    </DetailsCard>
  );
};

SpanRowDetailsCard.propTypes = {
  isExpanded: PropTypes.bool.isRequired,
  span: PropTypes.shape({
    spanID: PropTypes.string.isRequired,
    operationName: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    startTime: PropTypes.number.isRequired,
    tags: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        value: PropTypes.any.isRequired,
      })
    ),
  }).isRequired,
  process: PropTypes.shape({
    tags: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        value: PropTypes.any.isRequired,
      })
    ),
  }),
  color: PropTypes.string.isRequired,
  isDark: PropTypes.bool.isRequired,
  serviceName: PropTypes.string.isRequired,
  traceStartTime: PropTypes.number.isRequired,
};

SpanRowDetailsCard.defaultProps = {
  process: null,
};

export default SpanRowDetailsCard;
