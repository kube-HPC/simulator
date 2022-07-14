import { Tag, Tooltip } from 'antd';
import { instanceFiltersVar } from 'cache';
import { useReactiveVar } from '@apollo/client';
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
// import { Route, useHistory, useLocation } from 'react-router-dom';

const TagsFiltersViews = ({ filterName }) => {
  const instanceFilters = useReactiveVar(instanceFiltersVar);
  // const history = useHistory();
  // const urlParams = useLocation();
  const propFilters = instanceFilters[filterName];

  const closeFilter = key => {
    const resetKey = { ...instanceFiltersVar() };

    resetKey[filterName][key] = null;

    instanceFiltersVar(resetKey);

    //   history.push({
    ///      pathname: urlParams.pathname,
    //      search: ``,
    //  });
  };

  return (
    propFilters &&
    Object.entries(propFilters).map(([key, value]) => {
      if (key !== 'limit') {
        if (key === 'datesRange') {
          return (
            value.from &&
            value.to && (
              <Tooltip title={key}>
                <Tag
                  key={key}
                  closable
                  onClose={() => {
                    closeFilter(key);
                  }}>
                  {moment(value.from)} - {moment(value.to)}
                </Tag>
              </Tooltip>
            )
          );
        }
        return (
          value && (
            <Tooltip title={key}>
              <Tag
                key={key}
                closable
                onClose={() => {
                  closeFilter(key);
                }}>
                {value}
              </Tag>
            </Tooltip>
          )
        );
      }

      return '';
    })
  );
};
TagsFiltersViews.propTypes = {
  filterName: PropTypes.string.isRequired,
};

export default TagsFiltersViews;
