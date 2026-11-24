import { useState } from 'react';

import {
  TODO_NOT_COMPLETE_STATUS,
  type CreateTodoInput,
  type Todo,
} from '../types/todo';

export type CreateTodoResult = Todo | null;

export type UseTodosResult = {
  todos: Todo[];
  createTodo: (input: CreateTodoInput) => CreateTodoResult;
};

function createTodoId() {
  return crypto.randomUUID();
}

export function useTodos(): UseTodosResult {
  const [todos, setTodos] = useState<Todo[]>([]);

  const createTodo = (input: CreateTodoInput) => {
    const title = input.title.trim();

    if (title === '') {
      return null;
    }

    const description = input.description?.trim();
    const todo: Todo = {
      id: createTodoId(),
      title,
      completed: false,
      status: TODO_NOT_COMPLETE_STATUS,
      createdAt: new Date().toISOString(),
      ...(description ? { description } : {}),
    };

    setTodos((currentTodos) => [...currentTodos, todo]);

    return todo;
  };

  return {
    todos,
    createTodo,
  };
}
