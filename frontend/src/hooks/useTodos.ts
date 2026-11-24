import { useState } from 'react';

import { loadTodos, saveTodos } from '../storage/todoStorage';
import {
  DEFAULT_TODO_COMPLETION,
  type CreateTodoInput,
  type Todo,
} from '../types/todo';

export type CreateTodoResult = Todo | null;

export type UseTodosResult = {
  todos: Todo[];
  createTodo: (input: CreateTodoInput) => CreateTodoResult;
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

    const saveResult = saveTodos(nextTodos);

    setTodoState({
      todos: nextTodos,
      storageError: saveResult.ok ? todoState.storageError : saveResult.message,
    });

    return todo;
  };

  return {
    todos: todoState.todos,
    createTodo,
    storageError: todoState.storageError,
    storageUnavailable: todoState.storageError !== null,
  };
}
