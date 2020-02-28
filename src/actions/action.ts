export type Action<P = any, M = any> = {
  type: string;
  payload: P;
  meta: M;
};

export function createType(type: string) {
  return `@APP/${type}`;
}

export function createAction<P, M = any>(type: string) {
  return (payload: P = {} as P, meta: M = {} as M): Action => ({
    type: createType(type),
    payload,
    meta,
  });
}
