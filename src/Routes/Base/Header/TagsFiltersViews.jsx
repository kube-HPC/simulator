import { Tag } from 'antd';
import { instanceFiltersVar, metaVar, isPinActiveJobVar } from 'cache';
import { useReactiveVar } from '@apollo/client';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

// import { Route, useNavigate , useLocation } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import qs from 'qs';

const TOOLTIP_MAPPINGS = {
  qAlgorithmName: 'Algorithm Name',
  qPipelineName: 'Pipeline Name',
  algorithmName: 'Algorithm Name',
  pipelineName: 'Pipeline Name',
  user: 'User',
};

const TagsFiltersViews = ({ sectionName }) => {
  const instanceFilters = useReactiveVar(instanceFiltersVar);
  const isPinActiveJobs = useReactiveVar(isPinActiveJobVar);
  const metaMode = useReactiveVar(metaVar);

  const navigate = useNavigate();
  const urlParams = useLocation();
  const propFilters = instanceFilters[sectionName];

  const closeFilter = key => {
    const current = instanceFiltersVar();
    const resetKey = {
      ...current,
      [sectionName]: {
        ...current[sectionName],
        datesRange: { ...current[sectionName].datesRange },
      },
    };

    if (key === 'datesRange.from') resetKey[sectionName].datesRange.from = null;
    else if (key === 'datesRange.to')
      resetKey[sectionName].datesRange.to = null;
    else resetKey[sectionName][key] = null;

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
    // write query string params
    const paramsToUrl = { ...instanceFilters[sectionName] };

    if (sectionName === 'jobs') {
      delete paramsToUrl.datesRange;
      isPinActiveJobs && delete paramsToUrl.pipelineStatus;
    }

    const _qParams = qs.stringify(paramsToUrl, {
      ignoreQueryPrefix: true,
      allowDots: true,
      skipNulls: true,
    });

    const { experimentName } = metaMode;

    const _qMoreParam = experimentName && `&experiment=${experimentName}`;

    navigate({
      pathname: urlParams.pathname,
      search: `?${_qParams}${_qMoreParam}`,
    });
  }, [instanceFilters, sectionName, urlParams.pathname]);

  const cancelPropFilter = ['datesRange', 'experimentName', 'limit'];

  if (isPinActiveJobs) {
    cancelPropFilter.push('pipelineStatus');
  }

  const allTags = [];
  propFilters &&
    Object.entries(propFilters).map(([key, value]) => {
      if (!cancelPropFilter.includes(key)) {
        /*  if (key === 'datesRange') {

                          if (value?.from) {allTags.push(   <Tag
                              title={`${key}from`}
                              key={`${key}from`}
                              closable
                              onClose={() => {
                                closeFilter(`${key}.from`);
                              }}>
                              {moment(value.from).utc().format(FORMAT_DATE_TIME)}
                      
                            </Tag>)}

                        

                          if(value?.to) {
                             allTags.push(  <Tag
                                title={`${key}to`}
                                key={`${key}to`}
                                closable
                                onClose={() => {
                                  closeFilter(`${key}.to`);
                                }}>
                                {moment(value.to).utc().format(FORMAT_DATE_TIME)}
                        
                              </Tag>)
  
                          }
                        }
                        else */
        if (value) {
          const displayTitle = TOOLTIP_MAPPINGS[key] || key;
          allTags.push(
            <Tag
              title={displayTitle}
              key={key}
              closable
              onClose={() => {
                closeFilter(key);
              }}>
              {value}
            </Tag>
          );
        }
      }

      return null;
    });
  return allTags;
};
TagsFiltersViews.propTypes = {
  sectionName: PropTypes.string.isRequired,
};

export default TagsFiltersViews;
