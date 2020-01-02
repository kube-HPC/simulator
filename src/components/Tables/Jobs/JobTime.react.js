import { Tag, Typography } from 'antd';
import { FlexBox } from 'components/common';
import HumanizeDuration from 'humanize-duration';
import PropTypes from 'prop-types';
import React from 'react';
import Moment from 'react-moment';

const { Text } = Typography;

const JobTime = ({ results, startTime }) => (
  <FlexBox.Auto justify="start">
    <Tag>
      <Moment format="DD/MM/YY HH:mm:ss">{startTime}</Moment>
      {` `}
      <Text strong>
        {HumanizeDuration(results ? results.timeTook * 1000 : Date.now() - startTime, {
          maxDecimalPoints: 2,
        })}
      </Text>
    </Tag>
  </FlexBox.Auto>
);

JobTime.propTypes = {
  startTime: PropTypes.number,
  results: PropTypes.object,
};

export default JobTime;
