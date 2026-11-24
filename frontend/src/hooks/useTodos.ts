import { useState } from 'react';

import { loadTodos, saveTodos } from '../storage/todoStorage';
import type { CreateTodoInput, Todo } from '../types/todo';

export type CreateTodoResult = Todo | null;

export type UseTodosResult = {
  todos: Todo[];
  createTodo: (input: CreateTodoInput) => CreateTodoResult;
};

function createTodoId() {
  return crypto.randomUUID();
}

export function useTodos(): UseTodosResult {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const loadResult = loadTodos();

    return loadResult.todos;
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
      completed: false,
      createdAt: new Date().toISOString(),
      ...(description ? { description } : {}),
    };

    const nextTodos = [...todos, todo];

    setTodos(nextTodos);
    saveTodos(nextTodos);

    return todo;
  };

  return {
    todos,
    createTodo,
  };
}
