/* eslint-disable no-unused-vars */
import { put, call } from 'redux-saga/effects';
import get from 'lodash/get';
import { Action } from '../actions/action';
import { ResourceRoutine } from '../actions/resource-actions';
import normalizeErrors from '../util/normalize-api-errors';

const defaultResponseMiddleware = (response: any, payload: any) => response;
const defaultErrorMiddleware = (errors: any, payload: any) => {
  const normalized = normalizeErrors(errors);

  if (normalized) {
    return normalized;
  }

  return errors;
};

interface ApiHandlerArgs {
  routine: ResourceRoutine;
  provider: any;
  responseMiddleware?: typeof defaultResponseMiddleware;
  errorMiddleware?: typeof defaultErrorMiddleware;
}

export const createApiHandler = ({
  routine,
  provider,
  responseMiddleware = defaultResponseMiddleware,
  errorMiddleware = defaultErrorMiddleware,
}: ApiHandlerArgs) => function* apiHandler(action: Action) {
  try {
    yield put(routine.request(action.payload, action.meta));
    const response = yield call(provider, action.payload);
    const filtered = yield call(responseMiddleware, response, action.payload);

    yield put(routine.success(filtered, action.payload));
  } catch (error) {
    const errors = get(error, 'response.data.errors', {});
    const filtered = yield call(errorMiddleware, errors, action.payload);

    yield put(
      routine.failure(filtered, {
        error,
        action,
        response: error.response,
      }),
    );
  } finally {
    yield put(routine.fulfill(action.payload, action.meta));
  }
};
