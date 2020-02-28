import { createType, createAction } from './action';

export function createResourceType(prefix: string) {
  return {
    TRIGGER: createType(`${prefix}/TRIGGER`),
    REQUEST: createType(`${prefix}/REQUEST`),
    SUCCESS: createType(`${prefix}/SUCCESS`),
    FAILURE: createType(`${prefix}/FAILURE`),
    FULFILL: createType(`${prefix}/FULFILL`),
  };
}

export function createResourceActionTypes(prefix: string) {
  return {
    FETCH: createResourceType(`${prefix}/FETCH`),
    CREATE: createResourceType(`${prefix}/CREATE`),
    READ: createResourceType(`${prefix}/READ`),
    UPDATE: createResourceType(`${prefix}/UPDATE`),
    PATCH_UPDATE: createResourceType(`${prefix}/PATCH_UPDATE`),
    DELETE: createResourceType(`${prefix}/DELETE`),
    RESTORE: createResourceType(`${prefix}/RESTORE`),
  };
}

export function createResourceAction<P = any, M = any>(prefix: string) {
  return {
    ...createResourceType(prefix),
    trigger: createAction<P, M>(`${prefix}/TRIGGER`),
    request: createAction<P, M>(`${prefix}/REQUEST`),
    success: createAction<P, M>(`${prefix}/SUCCESS`),
    failure: createAction<P, M>(`${prefix}/FAILURE`),
    fulfill: createAction<P, M>(`${prefix}/FULFILL`),
  };
}

export type ResourceRoutine = ReturnType<typeof createResourceAction> | any;

export function createResourceActions(prefix: string) {
  return {
    ...createResourceActionTypes(prefix),
    fetch: createResourceAction(`${prefix}/FETCH`),
    create: createResourceAction(`${prefix}/CREATE`),
    read: createResourceAction(`${prefix}/READ`),
    update: createResourceAction(`${prefix}/UPDATE`),
    patchUpdate: createResourceAction(`${prefix}/PATCH_UPDATE`),
    delete: createResourceAction(`${prefix}/DELETE`),
    restore: createResourceAction(`${prefix}/RESTORE`),
  };
}
