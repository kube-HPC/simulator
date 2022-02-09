import client from 'client';

const ApiBaseURL = process.env.REACT_APP_API_SERVER_BACKEND_PATH;
console.log(
  'apiServerBackensd ddss>> ',
  process.env.REACT_APP_API_SERVER_BACKEND_PATH
);
const numberJobsPerPage = 10;
const addToObjectKeyIndexId = arrayObjects => {
  const arrayResQueue = [];
  arrayObjects.map((ele, index) =>
    arrayResQueue.push({ ...ele, key: index, id: index, index })
  );
  return arrayResQueue;
};

// Queue Managed API
export const getManaged = async (
  firstJobId,
  lastJobId,
  pipeLineName,
  tag,
  pageSize
) => {
  const data = {
    ...(firstJobId && { firstJobId }),
    ...(lastJobId && { lastJobId }),
    ...(pipeLineName && { pipeLineName }),
    ...(tag && { tag }),
    ...(pageSize && { pageSize }),
  };

  let res = null;
  try {
    res = await client.get(`${ApiBaseURL}queue/managed`, {
      params: { ...data },
    });
    // const { returnList,hasNext,hasPrev } = res.data;
    res.data.returnList = addToObjectKeyIndexId(res.data.returnList);
    return res.data;
  } catch (e) {
    console.error(res);
  }

  return [];
};

export const getManagedByTag = async () => {
  let res = null;
  try {
    res = await client.get(`${ApiBaseURL}/queue/managed/aggregation/tag`);
    return addToObjectKeyIndexId(res.data);
  } catch (e) {
    console.error(res.response.data.error.message);
  }

  return [];
};

export const getManagedByPipeline = async () => {
  let res = null;
  try {
    res = await client.get(`${ApiBaseURL}/queue/managed/aggregation/pipeline`);
    return addToObjectKeyIndexId(res.data);
  } catch (e) {
    console.error(res.response.data.error.message);
  }

  return [];
};

// Prefer Managed API
export const getPreferred = async (
  firstJobId,
  lastJobId,
  pipeLineName,
  tag,
  pageSize
) => {
  const data = {
    ...(firstJobId && { firstJobId }),
    ...(lastJobId && { lastJobId }),
    ...(pipeLineName && { pipeLineName }),
    ...(tag && { tag }),
    ...(pageSize && { pageSize }),
  };

  let res = null;
  try {
    res = await client.get(`${ApiBaseURL}queue/preferred`, {
      params: { ...data },
    });

    res.data.returnList = addToObjectKeyIndexId(res.data.returnList);
    return res.data;
  } catch (e) {
    console.error(res);
  }

  return [];
};

export const getPreferredByTag = async () => {
  let res = null;
  try {
    res = await client.get(`${ApiBaseURL}/queue/preferred/aggregation/tag`);
    return addToObjectKeyIndexId(res.data);
  } catch (e) {
    console.error(res);
  }

  return [];
};

export const getPreferredByPipeline = async () => {
  let res = null;
  try {
    res = await client.get(
      `${ApiBaseURL}/queue/preferred/aggregation/pipeline`
    );
    return addToObjectKeyIndexId(res.data);
  } catch (e) {
    console.error(res);
  }

  return [];
};

export const addPreferred = async (jobs, position, jobId) => {
  // jobs      - list jobs id is need to add
  // jobId     - id of job to insert before or after (by value position value)
  // position   - can be [ first, last, before, after ]

  const data = {
    jobs,
    position,
  };

  if (jobId) {
    data.query = {
      // "tag": "string",
      jobId,
      // "pipeline": "string"
    };
  }

  let res = null;
  try {
    res = await client.post(`${ApiBaseURL}/queue/preferred`, { ...data });
  } catch (e) {
    console.error(res);
  }

  return res;
};

export const deletePreferred = async jobs => {
  const data = { jobs };

  let res = null;
  try {
    res = await client.post(`${ApiBaseURL}/queue/preferred/deletes`, data);
  } catch (e) {
    console.error(res);
  }

  return res;
};

export const movePreferred = async (jobsToMove, position, jobId) => {
  // jobsToMove      - list jobs id is need to move
  // jobId           - id of job to insert before or after (by value position value)
  // position        - can be [ first, last, before, after ]

  let res = null;
  try {
    res = await deletePreferred(jobsToMove);
    res = await addPreferred(jobsToMove, position, jobId);
  } catch (e) {
    console.error(res);
  }

  return res;
};

// get data filter by pipeline or tag or only by job id

const TypeFilter = {
  JOBID: 'jobId',
  PIPELINE: 'pipeline',
  TAG: 'tag',
};

export const getStatusManage = async (
  typeFilter,
  pageFromJobId = '',
  intention
) => {
  const type = typeFilter.toString().toLowerCase();
  let res = [];
  if (type === TypeFilter.PIPELINE) {
    res = await getManagedByPipeline();
  } else if (type === TypeFilter.TAG) {
    res = await getManagedByTag();
  } else if (intention === 'next') {
    res = await getManaged(pageFromJobId, '', null, null, numberJobsPerPage);
  } else {
    res = await getManaged('', pageFromJobId, null, null, numberJobsPerPage);
  }

  return res;
};

export const getStatusPreferred = async (
  typeFilter,
  pageFromJobId = '',
  intention
) => {
  const type = typeFilter.toLowerCase();
  let res = [];
  if (type === TypeFilter.PIPELINE) {
    res = await getPreferredByPipeline();
  } else if (type === TypeFilter.TAG) {
    res = await getPreferredByTag();
  } else if (intention === 'next') {
    res = await getPreferred(pageFromJobId, '', null, null, numberJobsPerPage);
  } else {
    res = await getPreferred('', pageFromJobId, null, null, numberJobsPerPage);
  }

  return res;
};

export const getJobsIdsScopePreferred = async (
  filterPreferredVal,
  dataSourcePreferred,
  currentIndex
) => {
  const jobsIdsScope = [];

  if (filterPreferredVal === TypeFilter.JOBID.toUpperCase()) {
    console.log(currentIndex);
    console.log(dataSourcePreferred.find(x => x.index === currentIndex).jobId);
    jobsIdsScope.push(
      dataSourcePreferred.find(x => x.index === currentIndex).jobId
    );
  } else {
    // get name aggregation delete from preferred

    const { name, count, lastJob } = dataSourcePreferred.find(
      x => x.index === currentIndex
    );
    console.log(dataSourcePreferred);

    const res = await getPreferred(null, lastJob, null, null, count);
    const resultAllJobs = res.returnList;

    // get all jobsId need to delete from preferred
    if (filterPreferredVal === TypeFilter.PIPELINE.toUpperCase()) {
      // over all list to get all jobsId of aggregation
      for (let i = 0; i < resultAllJobs.length; i++) {
        if (resultAllJobs[i].pipelineName === name) {
          jobsIdsScope.push(resultAllJobs[i].jobId);
        } else {
          // if the search is over next aggregation then break loop
          break;
        }
      }
    }

    // TAG
    // get all jobsId need to delete from TAG aggregation
    if (filterPreferredVal === TypeFilter.TAG.toUpperCase()) {
      // over all list to get all jobsId of aggregation TAG
      for (let i = 0; i < resultAllJobs.length; i++) {
        if (resultAllJobs[i].tags.toString() === name) {
          jobsIdsScope.push(resultAllJobs[i].jobId);
        } else {
          // if the search is over next aggregation then break loop
          break;
        }
      }
    }
  }
  console.log(jobsIdsScope);
  return jobsIdsScope;
};

export const getJobIdPosition = async (
  dataSourcePreferred,
  filterPreferredVal,
  rowOverIndex,
  position
) => {
  const jobsIdsScope = await getJobsIdsScopePreferred(
    filterPreferredVal,
    dataSourcePreferred,
    rowOverIndex
  );
  return position && jobsIdsScope.length > 1
    ? jobsIdsScope[jobsIdsScope.length - 1]
    : jobsIdsScope[0];
};
