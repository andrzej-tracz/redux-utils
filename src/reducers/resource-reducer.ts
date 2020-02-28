import { AnyAction } from 'redux';
import produce from 'immer';
import { createResourceActionTypes } from '../actions/resource-actions';
import { Action } from '../actions/action';

export interface ResourceState<T> {
  items: {
    [key: string]: T;
    [key: number]: T;
  };
  order: number[];
  isFetching: boolean;
  isSubmitting: boolean;
  didCreate: boolean;
  didUpdate: boolean;
  pendingItemId: number | string | null;
}

export function createResourceReducer<T>(prefix: string) {
  if (!prefix) {
    throw new Error('Action prefix is required to create resource reducer');
  }

  const initialState: ResourceState<T> = {
    items: {},
    order: [],
    isFetching: false,
    isSubmitting: false,
    didCreate: false,
    didUpdate: false,
    pendingItemId: null,
  };

  const types = createResourceActionTypes(prefix);

  const reducer = function resourceReducer(
    state = initialState,
    { type, payload }: Action | AnyAction,
  ) {
    if (!type) {
      return state;
    }

    switch (type) {
      // Fetch
      case types.FETCH.REQUEST: {
        return produce(state, (draft) => {
          draft.isFetching = true;
        });
      }

      case types.FETCH.SUCCESS: {
        return produce(state, (draft) => {
          const { order } = payload;
          draft.order = order || ([] as number[]);

          Object.keys(payload.items).forEach((key) => {
            draft.items[key] = {
              ...state.items[key],
              ...payload.items[key],
            };
          });
        });
      }

      case types.FETCH.FULFILL: {
        return {
          ...state,
          isFetching: false,
        };
      }

      // Create
      case types.CREATE.REQUEST: {
        return {
          ...state,
          isSubmitting: true,
          didCreate: false,
        };
      }

      case types.CREATE.SUCCESS: {
        return {
          ...state,
          didCreate: true,
          items: {
            ...state.items,
            [payload.id]: payload,
          },
          order: [...state.order, payload.id],
        };
      }

      case types.CREATE.FAILURE: {
        return {
          ...state,
        };
      }

      case types.CREATE.FULFILL: {
        return {
          ...state,
          didCreate: false,
          isSubmitting: false,
        };
      }

      // Read
      case types.READ.REQUEST: {
        return produce(state, (draft) => {
          draft.pendingItemId = payload.id;
        });
      }

      case types.READ.SUCCESS: {
        return produce(state, (draft) => {
          draft.items[payload.id] = payload;
        });
      }

      case types.READ.FULFILL: {
        return produce(state, (draft) => {
          draft.pendingItemId = null;
        });
      }

      // Update
      case types.UPDATE.REQUEST: {
        const { id } = payload;

        return {
          ...state,
          didUpdate: false,
          isSubmitting: true,
          pendingItemId: id,
        };
      }

      case types.UPDATE.SUCCESS: {
        const { id } = payload;

        return produce(state, (draft) => {
          draft.didUpdate = true;
          draft.items[id] = Object.assign(draft.items[id], payload);
        });
      }

      case types.UPDATE.FULFILL: {
        return {
          ...state,
          isSubmitting: false,
          didUpdate: false,
          pendingItemId: null,
        };
      }

      case types.PATCH_UPDATE.TRIGGER:
      case types.PATCH_UPDATE.SUCCESS: {
        const { id, ...attributes } = payload;

        return produce(state, (draft) => {
          if (draft.items[id]) {
            draft.items[id] = {
              ...draft.items[id],
              ...attributes,
            };
          }
        });
      }

      // Delete
      case types.DELETE.REQUEST: {
        const { id } = payload;

        return produce(state, (draft) => {
          if (state.items[id]) {
            delete draft.items[id];
          }

          draft.order = draft.order.filter((itemId) => itemId !== id);
        });
      }

      default:
        return state;
    }
  };

  return {
    reducer,
    types,
    initialState,
  };
}
