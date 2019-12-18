import React from 'react';
import PropTypes from 'prop-types';

import Moment from 'react-moment';
import { Tag, Typography } from 'antd';
import HumanizeDuration from 'humanize-duration';

const { Text } = Typography;

const JobTime = ({ results, startTime }) => (
  <Tag>
    <Moment format="DD/MM/YY HH:mm:ss">{startTime}</Moment>{' '}
    <Text strong>
      {HumanizeDuration(results ? results.timeTook * 1000 : Date.now() - startTime, {
        maxDecimalPoints: 2,
      })}
    </Text>
  </Tag>
);

JobTime.propTypes = {
  startTime: PropTypes.number,
  results: PropTypes.object,
};

export default JobTime;
