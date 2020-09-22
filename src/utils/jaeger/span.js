import { createSelector } from 'reselect';
import fuzzy from 'fuzzy';

import { getProcessServiceName } from './process';

export const getSpanId = span => span.spanID;
export const getSpanName = span => span.operationName;
export const getSpanDuration = span => span.duration;
export const getSpanTimestamp = span => span.startTime;
export const getSpanProcessId = span => span.processID;
export const getSpanReferences = span => span.references || [];
export const getSpanReferenceByType = createSelector(
  createSelector(({ span }) => span, getSpanReferences),
  ({ type }) => type,
  (references, type) => references.find(ref => ref.refType === type)
);
export const getSpanParentId = createSelector(
  span => getSpanReferenceByType({ span, type: 'CHILD_OF' }),
  childOfRef => (childOfRef ? childOfRef.spanID : null)
);

export const getSpanProcess = span => {
  if (!span.process) {
    throw new Error(
      `
      you must hydrate the spans with the processes, perhaps
      using hydrateSpansWithProcesses(), before accessing a span's process
    `
    );
  }

  return span.process;
};

export const getSpanServiceName = createSelector(
  getSpanProcess,
  getProcessServiceName
);

export const filterSpansForTimestamps = createSelector(
  ({ spans }) => spans,
  ({ leftBound }) => leftBound,
  ({ rightBound }) => rightBound,
  (spans, leftBound, rightBound) =>
    spans.filter(
      span =>
        getSpanTimestamp(span) >= leftBound &&
        getSpanTimestamp(span) <= rightBound
    )
);

export const filterSpansForText = createSelector(
  ({ spans }) => spans,
  ({ text }) => text,
  (spans, text) =>
    fuzzy
      .filter(text, spans, {
        extract: span => `${getSpanServiceName(span)} ${getSpanName(span)}`,
      })
      .map(({ original }) => original)
);

const getTextFilterdSpansAsMap = createSelector(
  filterSpansForText,
  matchingSpans =>
    matchingSpans.reduce(
      (obj, span) => ({
        ...obj,
        [getSpanId(span)]: span,
      }),
      {}
    )
);

export const highlightSpansForTextFilter = createSelector(
  ({ spans }) => spans,
  getTextFilterdSpansAsMap,
  (spans, textFilteredSpansMap) =>
    spans.map(span => ({
      ...span,
      muted: !textFilteredSpansMap[getSpanId(span)],
    }))
);

// WEBPACK FOOTER //
// ./src/selectors/span.js
