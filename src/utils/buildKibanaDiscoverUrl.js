const normalizeStartTime = startTime => {
  if (!startTime) {
    return new Date();
  }

  if (typeof startTime === 'number') {
    // Jaeger trace spans use microseconds; convert to milliseconds for Date.
    const ms =
      startTime > 1000000000000 ? Math.floor(startTime / 1000) : startTime;
    return new Date(ms);
  }

  return new Date(startTime);
};

const buildKibanaDiscoverUrl = ({
  kibanaUrl,
  ELASTICSEARCH_LOGS_INDEX,
  structuredPrefix,
  taskId,
  startTime,
  word = '',
}) => {
  if (!kibanaUrl || !taskId || !ELASTICSEARCH_LOGS_INDEX) {
    return '';
  }

  const date = normalizeStartTime(startTime);
  const time = Number.isNaN(date.getTime())
    ? new Date(Date.now() - 20000).toISOString()
    : new Date(date.getTime() - 20000).toISOString();

  let metaPath = 'meta.internal.taskId';
  if (structuredPrefix) {
    metaPath = `${structuredPrefix}.${metaPath}`;
  }

  return `${kibanaUrl}app/kibana#/discover?_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:'${time}',to:now))&_a=(columns:!(_source),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:'${ELASTICSEARCH_LOGS_INDEX}',key:${metaPath},negate:!f,params:(query:'${taskId}'),type:phrase),query:(match:(${metaPath}:(query:'${taskId}',type:phrase))))),index:'${ELASTICSEARCH_LOGS_INDEX}',interval:auto,query:(language:lucene${
    word ? `,query:${word}` : ''
  }),sort:!(!('@timestamp',desc)))`;
};

export default buildKibanaDiscoverUrl;
