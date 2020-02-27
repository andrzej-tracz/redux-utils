import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import saga from "./sagas";
import {todoActions} from "./actions";
import {expectSaga} from 'redux-saga-test-plan';
import reducer from './reducer';

const todoMock = [
  {id: 1, name: 'Write code'},
  {id: 2, name: 'Do deploy'},
  {id: 3, name: 'Fix some bugs deploy'},
];

describe('Todo: Sagas', () => {
  test('handles fetch success', async () => {
    const mock = new MockAdapter(axios);
    mock.onGet('api/todo').reply(200, todoMock);

    await expectSaga(saga)
      .dispatch(todoActions.fetch.trigger())
      .withReducer(reducer)
      .hasFinalState({
        items: {
          '1': {id: 1, name: 'Write code'},
          '2': {id: 2, name: 'Do deploy'},
          '3': {id: 3, name: 'Fix some bugs deploy'}
        },
        order: [1, 2, 3],
        isFetching: false,
        isSubmitting: false,
        didCreate: false,
        didUpdate: false,
        pendingItemId: null,
      })
      .run();

    mock.reset();
  });

  test('handles fetch failure', async () => {
    const mock = new MockAdapter(axios);
    mock.onGet('api/todo').reply(500, {});

    await expectSaga(saga)
      .dispatch(todoActions.fetch.trigger())
      .withReducer(reducer)
      .hasFinalState({
        items: {},
        order: [],
        isFetching: false,
        isSubmitting: false,
        didCreate: false,
        didUpdate: false,
        pendingItemId: null
      })
      .run();

    mock.reset();
  });

  test('handles create success', async () => {
    const mock = new MockAdapter(axios);
    const payload = {name: 'New Todo Item!'};

    mock.onPost('api/todo', payload).reply(201, {
      id: 1001,
      ...payload
    });

    await expectSaga(saga)
      .dispatch(todoActions.create.trigger(payload))
      .withReducer(reducer)
      .hasFinalState({
        items: {
          '1001': {id: 1001, ...payload}
        },
        order: [1001],
        isFetching: false,
        isSubmitting: false,
        didCreate: false,
        didUpdate: false,
        pendingItemId: null
      })
      .run();

    mock.reset();
  });
});
