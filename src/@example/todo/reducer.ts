import { createResourceReducer } from "../..";
import { TODO_PREFIX } from "./contants";

const { reducer, initialState, types } = createResourceReducer(TODO_PREFIX);

const todoReducer = (state = initialState, action: any) => {
  switch (action.type) {
    // override / tweak some actions if needed
    case types.FETCH.SUCCESS: {
      const nextState = reducer(state, action);
      // customize some actions if necessary
      return {
        ...nextState
      };
    }
    default:
      return reducer(state, action);
  }
};

export default todoReducer;
