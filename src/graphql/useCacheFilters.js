import { useLocation } from 'react-router-dom';
import qs from 'qs';
import { isNaN } from 'lodash';

const useCacheFilters = () => {
  const urlParams = useLocation();
  const locationParsed = qs.parse(urlParams.search, {
    ignoreQueryPrefix: true,
    allowDots: true,
    skipNulls: true,
    decoder(str) {
      return isNaN(str) && Number.isInteger(+str)
        ? parseInt(str, 10)
        : str || '';
    },
  });

  const filtersInitCacheItems = {
    jobs: {
      limit: locationParsed?.limit || null,
      pipelineName: locationParsed?.pipelineName || null,
      algorithmName: locationParsed?.algorithmName || null,
      pipelineStatus: locationParsed?.pipelineStatus || null,
      user: locationParsed?.user || null,
      datesRange: {
        from:
          (locationParsed?.datesRange?.from &&
            decodeURIComponent(locationParsed.datesRange.from)) ||
          null,
        to:
          (locationParsed?.datesRange?.to &&
            decodeURIComponent(locationParsed.datesRange.to)) ||
          null,
      },
    },
    pipelines: {
      qPipelineName: locationParsed?.qPipelineName || null,
    },
    algorithms: {
      qAlgorithmName: locationParsed?.qAlgorithmName || null,
    },
  };

  return {
    filtersInitCacheItems,
  };
};

export default useCacheFilters;
