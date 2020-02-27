import http from '../http';
import { Todo } from "./types";

const TODO_BASE_URL = 'api/todo';

export async function fetch() {
  return http.get(TODO_BASE_URL)
}

export function create({name}: Pick<Todo, 'name'>) {
  return http.post(TODO_BASE_URL, {name});
}

export function read(id: Todo['id']) {
  return http.get(`${TODO_BASE_URL}/${id}`);
}

export function update(id: Todo['id'], data: Pick<Todo, 'name'>) {
  return http.put(`${TODO_BASE_URL}/${id}`, data);
}

export function remove(id: Todo['id']) {
  return http.delete(`${TODO_BASE_URL}/${id}`);
}
