import {
    takeEvery,
} from 'redux-saga/effects';
import { createApiHandler } from "../../sagas/create-api-handler";
import { todoActions } from './actions';
import { fetch, read, create } from './api';
import { transform } from "../../util/transform-entities";
import { Todo } from "./types";

export const handleTodoFetch = createApiHandler({
    routine: todoActions.fetch,
    provider: fetch,
    responseMiddleware: (response) => ({ // assuming your response is array of TODOs
        items: transform(response),
        order: response.map((item: Todo) => item.id),
    })
});

export const handleTodoRead = createApiHandler({
    routine: todoActions.read,
    provider: read
});

export const handleTodoCreate = createApiHandler({
    routine: todoActions.create,
    provider: create
});

export default function*() {
    yield takeEvery(todoActions.fetch.TRIGGER, handleTodoFetch);
    yield takeEvery(todoActions.read.TRIGGER, handleTodoRead);
    yield takeEvery(todoActions.create.TRIGGER, handleTodoCreate);
}