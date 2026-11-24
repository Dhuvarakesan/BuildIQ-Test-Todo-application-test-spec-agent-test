import { useState } from 'react';

import { loadTodos, saveTodos } from '../storage/todoStorage';
import {
  DEFAULT_TODO_COMPLETION,
  type CreateTodoInput,
  type Todo,
  type UpdateTodoInput,
} from '../types/todo';

export type CreateTodoResult = Todo | null;

export type UpdateTodoResult =
  | {
      ok: true;
      todo: Todo;
    }
  | {
      ok: false;
      reason: 'empty-title' | 'not-found';
      message: string;
    };

export type UseTodosResult = {
  todos: Todo[];
  createTodo: (input: CreateTodoInput) => CreateTodoResult;
  updateTodo: (input: UpdateTodoInput) => UpdateTodoResult;
  storageError: string | null;
  storageUnavailable: boolean;
};

type TodoState = {
  todos: Todo[];
  storageError: string | null;
};

function createTodoId() {
  return crypto.randomUUID();
}

export function useTodos(): UseTodosResult {
  const [todoState, setTodoState] = useState<TodoState>(() => {
    const loadResult = loadTodos();

    return {
      todos: loadResult.todos,
      storageError: loadResult.ok ? null : loadResult.message,
    };
  });

  const commitTodos = (nextTodos: Todo[]) => {
    const saveResult = saveTodos(nextTodos);

    setTodoState({
      todos: nextTodos,
      storageError: saveResult.ok ? null : saveResult.message,
    });
  };

  const createTodo = (input: CreateTodoInput) => {
    const title = input.title.trim();

    if (title === '') {
      return null;
    }

    const description = input.description?.trim();
    const todo: Todo = {
      id: createTodoId(),
      title,
      completed: DEFAULT_TODO_COMPLETION,
      createdAt: new Date().toISOString(),
      ...(description ? { description } : {}),
    };

    const nextTodos = [...todoState.todos, todo];

    commitTodos(nextTodos);

    return todo;
  };

  const updateTodo = (input: UpdateTodoInput): UpdateTodoResult => {
    const title = input.title.trim();

    if (title === '') {
      return {
        ok: false,
        reason: 'empty-title',
        message: 'Todo title is required.',
      };
    }

    const existingTodo = todoState.todos.find((todo) => todo.id === input.id);

    if (!existingTodo) {
      return {
        ok: false,
        reason: 'not-found',
        message: 'Todo was not found.',
      };
    }

    const description = input.description?.trim();
    const updatedTodo: Todo = {
      ...existingTodo,
      title,
      completed: input.status,
      ...(description ? { description } : { description: undefined }),
    };
    const nextTodos = todoState.todos.map((todo) => (
      todo.id === input.id ? updatedTodo : todo
    ));

    commitTodos(nextTodos);

    return {
      ok: true,
      todo: updatedTodo,
    };
  };

  return {
    todos: todoState.todos,
    createTodo,
    updateTodo,
    storageError: todoState.storageError,
    storageUnavailable: todoState.storageError !== null,
  };
}
