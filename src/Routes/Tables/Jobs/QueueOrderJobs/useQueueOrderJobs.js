import client from 'client';
import { TypeFilter, TypeTable } from 'const';

export const numberJobsPerPage = 9;
const addToObjectKeyIndexId = (arrayObjects, typeElement) => {
  const arrayRes = [];
  arrayObjects.map((ele, index) =>
    arrayRes.push({ ...ele, key: index, id: index, index, typeElement })
  );
  return arrayRes;
};

// Queue Managed API
const getManaged = async (
  firstJobId,
  lastJobId,
  pipelineName,
  tag,
  pageSize,
  lastJobs
) => {
  const data = {
    ...(firstJobId && { firstJobId }),
    ...(lastJobId && { lastJobId }),
    ...(pipelineName && { pipelineName }),
    ...(tag && { tag }),
    ...(pageSize && { pageSize }),
    ...(lastJobs && { lastJobs }),
  };

  let res = null;
  try {
    res = await client.get(`/queue/managed`, {
      params: { ...data },
    });

    res.data.returnList = addToObjectKeyIndexId(
      res.data.returnList,
      TypeTable.QUEUE
    );

    return res.data;
  } catch (error) {
    console.error(error);
  }

  return [];
};

const getManagedByTag = async () => {
  try {
    const res = await client.get(`/queue/managed/aggregation/tag`);
    return addToObjectKeyIndexId(res.data, TypeTable.QUEUE);
  } catch (error) {
    console.error(error);
  }

  return [];
};

const getManagedByPipeline = async () => {
  try {
    const res = await client.get(`/queue/managed/aggregation/pipeline`);
    return addToObjectKeyIndexId(res.data, TypeTable.QUEUE);
  } catch (error) {
    console.error(error);
  }

  return [];
};

// Prefer Managed API
const getPreferred = async (
  firstJobId,
  lastJobId,
  pipelineName,
  tag,
  pageSize,
  lastJobs
) => {
  const data = {
    ...(firstJobId && { firstJobId }),
    ...(lastJobId && { lastJobId }),
    ...(pipelineName && { pipelineName }),
    ...(tag && { tag }),
    ...(pageSize && { pageSize }),
    ...(lastJobs && { lastJobs }),
  };

  try {
    let res = null;

    res = await client.get(`/queue/preferred`, {
      params: { ...data },
    });

    res.data.returnList = addToObjectKeyIndexId(
      res.data.returnList,
      TypeTable.PREFERRED
    );

    return res.data;
  } catch (error) {
    console.error(error);
  }

  return [];
};

const getPreferredByTag = async () => {
  try {
    const res = await client.get(`/queue/preferred/aggregation/tag`);
    return addToObjectKeyIndexId(res.data, TypeTable.PREFERRED);
  } catch (error) {
    console.error(error);
  }

  return [];
};

const getPreferredByPipeline = async () => {
  try {
    const res = await client.get(`/queue/preferred/aggregation/pipeline`);
    return addToObjectKeyIndexId(res.data, TypeTable.PREFERRED);
  } catch (error) {
    console.error(error);
  }

  return [];
};

const addPreferred = async (jobs, position, jobId) => {
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

  try {
    await client.post(`/queue/preferred`, { ...data });
  } catch (error) {
    console.error(error);
  }
};

const deletePreferred = async jobs => {
  const data = { jobs };
  try {
    await client.post(`/queue/preferred/deletes`, data);
  } catch (error) {
    console.error(error);
  }
};

const movePreferred = async (jobsToMove, position, jobId) => {
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
};

// get data filter by pipeline or tag or only by job id

const getStatusManage = async (
  typeFilter,
  pageFromJobId = '',
  intention,
  pageSize = numberJobsPerPage
) => {
  const type = typeFilter.toString().toLowerCase();
  let res = [];
  try {
    if (type === TypeFilter.PIPELINE) {
      res = await getManagedByPipeline();
    } else if (type === TypeFilter.TAG) {
      res = await getManagedByTag();
    } else if (intention === 'next') {
      res = await getManaged(pageFromJobId, '', null, null, pageSize);
    } else if (intention === 'end') {
      res = await getManaged(null, null, null, null, pageSize, true);
    } else if (intention === 'previous' || intention === 'begin') {
      res = await getManaged('', pageFromJobId, null, null, pageSize);
    } else {
      res = await getManaged(null, null, null, null, pageSize);
    }

    return res;
  } catch (e) {
    console.error(res);
  }

  return [];
};

const getStatusPreferred = async (
  typeFilter,
  pageFromJobId = '',
  intention,
  pageSize = numberJobsPerPage
) => {
  const type = typeFilter.toLowerCase();
  let res = [];

  try {
    if (type === TypeFilter.PIPELINE) {
      res = await getPreferredByPipeline();
    } else if (type === TypeFilter.TAG) {
      res = await getPreferredByTag();
    } else if (intention === 'next') {
      res = await getPreferred(pageFromJobId, '', null, null, pageSize);
    } else if (intention === 'end') {
      res = await getPreferred(null, null, null, null, pageSize, true);
    } else if (intention === 'previous' || intention === 'begin') {
      res = await getPreferred('', pageFromJobId, null, null, pageSize);
    } else {
      // goto last jobs Preferred
      res = await getPreferred(null, null, null, null, pageSize);
    }

    return res;
  } catch (e) {
    console.error(res);
  }

  return [];
};

const getJobsIdsScopePreferred = async (
  filterPreferredVal,
  dataSourcePreferred,
  currentIndex
) => {
  const jobsIdsScope = [];

  if (filterPreferredVal === TypeFilter.JOBID.toUpperCase()) {
    jobsIdsScope.push(
      dataSourcePreferred.find(x => x.index === currentIndex).jobId
    );
  } else {
    // get name aggregation delete from preferred

    const { name, count, lastJob } = dataSourcePreferred.find(
      x => x.index === currentIndex
    );

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

  return jobsIdsScope;
};

const getJobIdPosition = async (
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

export const orderApi = {
  getJobsIdsScopePreferred,
  getJobIdPosition,
  getStatusPreferred,
  getStatusManage,
  movePreferred,
  deletePreferred,
  addPreferred,
  getPreferredByPipeline,
  getPreferredByTag,
  getPreferred,
  getManagedByPipeline,
  getManagedByTag,
  getManaged,
  numberJobsPerPage,
};
