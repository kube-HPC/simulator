import { Tag } from 'antd';
import { instanceFiltersVar } from 'cache';
import { useReactiveVar } from '@apollo/client';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

// import { Route, useHistory, useLocation } from 'react-router-dom';
import { useHistory, useLocation } from 'react-router-dom';
import qs from 'qs';
import moment from 'moment';
// import { isNaN } from 'lodash';

const FORMAT_DATE_TIME = 'MM-DD-YYYY HH:mm';
const TagsFiltersViews = ({ sectionName }) => {
  const instanceFilters = useReactiveVar(instanceFiltersVar);

  const history = useHistory();
  const urlParams = useLocation();
  const propFilters = instanceFilters[sectionName];

  const closeFilter = key => {
    const resetKey = { ...instanceFilters };

    if (key === 'datesRange') {
      resetKey[sectionName][key].from = null;
      resetKey[sectionName][key].to = null;
    } else {
      resetKey[sectionName][key] = null;
    }

    instanceFiltersVar(resetKey);
  };

  /* const getDataUrl = useCallback(
      () => {

      const isFilterObjNotEmpty = !Object.values(instanceFilters[sectionName]).some(x => x != null);
    
      let section;
      if(isFilterObjNotEmpty)
      {
      
        const locationParsed = qs.parse(urlParams.search, { ignoreQueryPrefix: true,allowDots: true,skipNulls: true,
          decoder (str) {
           
            return isNaN(str) && Number.isInteger(+str)? parseInt(str,10):str ||"";
        }})
 
        section = {[sectionName]:locationParsed}
        instanceFiltersVar({...instanceFiltersVar(),...section});
      }

    },[sectionName]) */

  //  useEffect(()=>{
  //  getDataUrl()
  //  },[])

  useEffect(() => {
    //  console.log("initFilters befor history instanceFilters>>>",instanceFilters)
    const _qParams = qs.stringify(instanceFilters[sectionName], {
      ignoreQueryPrefix: true,
      allowDots: true,
      skipNulls: true,
    });

    history.push({
      pathname: urlParams.pathname,
      search: `?${_qParams}`,
    });

    //  console.log("initFilters push history _qParams>>>",_qParams)
  }, [history, instanceFilters, sectionName, urlParams.pathname]);

  return (
    propFilters &&
    Object.entries(propFilters).map(([key, value]) => {
      if (key !== 'limit') {
        if (key === 'datesRange' && value) {
          return (
            value?.from &&
            value?.to && (
              <Tag
                title={key}
                key={key}
                closable
                onClose={() => {
                  closeFilter(key);
                }}>
                {moment(value.from).format(FORMAT_DATE_TIME)} -{' '}
                {moment(value.to).format(FORMAT_DATE_TIME)}
              </Tag>
            )
          );
        }

        return (
          value && (
            <Tag
              title={key}
              key={key}
              closable
              onClose={() => {
                closeFilter(key);
              }}>
              {value}
            </Tag>
          )
        );
      }

      return null;
    })
  );
};
TagsFiltersViews.propTypes = {
  sectionName: PropTypes.string.isRequired,
};

export default TagsFiltersViews;
