import { takeEvery, put, take, call } from 'redux-saga/effects';
import RestUtils from './restUtils';
import RestRequest from './restRequest';
import AT from 'const/application-actions';

let url = null;

const isUrlDefined = () => url !== null && url !== undefined;

const restUtils = new RestUtils();

const restActions = [
  AT.REST_REQ,
  AT.REST_REQ_POST,
  AT.REST_REQ_POST_FORM,
  AT.REST_REQ_PUT,
  AT.REST_REQ_DELETE,
  AT.JOBS_DOWNLOAD_REQ
];

function* handleRequest(action) {
  if (isUrlDefined()) {
    const request = new RestRequest(
      url,
      action,
      restUtils.generateSuccessObj,
      restUtils.generateRejectObj
    );
    const pendingObj = restUtils.generatePendingObj(action);
    yield put(pendingObj);
    yield take(pendingObj.type);
    const responseObj = yield call(request.execute);
    yield put(responseObj);
  }
}

function* handleSocketGetConfigSuccess({ payload }) {
  const { config } = payload;
  url = yield call(restUtils.setPath, config);
}

export default function* restSaga() {
  yield takeEvery(restActions, handleRequest);
  yield takeEvery(`${AT.SOCKET_GET_CONFIG}_SUCCESS`, handleSocketGetConfigSuccess);
}
