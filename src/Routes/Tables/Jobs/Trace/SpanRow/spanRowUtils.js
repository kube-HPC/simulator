export const getTagValue = (tags, keys) => {
  if (!Array.isArray(tags)) {
    return '';
  }

  const tag = tags.find(item => keys.includes(item.key));
  return tag?.value ? String(tag.value) : '';
};

export const matchesSpanSearch = ({
  searchTerm,
  operationName,
  serviceName,
  tags,
}) => {
  if (!searchTerm) {
    return true;
  }

  const normalizedSearch = searchTerm.toLowerCase();
  return (
    operationName.toLowerCase().includes(normalizedSearch) ||
    serviceName.toLowerCase().includes(normalizedSearch) ||
    tags?.some(
      tag =>
        tag.key.toLowerCase().includes(normalizedSearch) ||
        String(tag.value).toLowerCase().includes(normalizedSearch)
    )
  );
};

export const getSpanActionState = ({
  spanTaskId,
  spanTags,
  processTags,
  depth,
  isKibanaConfigured,
}) => {
  const taskId =
    spanTaskId || getTagValue(spanTags, ['taskId', 'task_id', 'taskID']);
  const podName =
    getTagValue(spanTags, ['podName', 'pod_name', 'pod', 'hostname']) ||
    getTagValue(processTags, ['podName', 'pod_name', 'pod', 'hostname']);
  const nodeKind =
    getTagValue(spanTags, ['nodeKind', 'node_kind', 'kind']) || 'algorithm';
  const canOpenLogs = Boolean(taskId && podName);
  const canOpenKibana = Boolean(taskId && isKibanaConfigured);

  return {
    taskId,
    podName,
    nodeKind,
    canOpenLogs,
    canOpenKibana,
    shouldShowDisabledIcons: depth === 0,
  };
};
