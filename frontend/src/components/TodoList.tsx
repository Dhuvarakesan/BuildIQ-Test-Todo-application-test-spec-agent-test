import { useState } from 'react';

import TodoEditForm from './TodoEditForm';
import TodoStatusBadge from './TodoStatusBadge';
import type { UseTodosResult } from '../hooks/useTodos';
import type { Todo } from '../types/todo';

export type TodoListProps = {
  todos: Todo[];
  onUpdateTodo: UseTodosResult['updateTodo'];
};

function getTodoCountLabel(todoCount: number) {
  return todoCount === 1 ? '1 todo' : `${todoCount} todos`;
}

function TodoList({ todos, onUpdateTodo }: TodoListProps) {
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const todoCountLabel = getTodoCountLabel(todos.length);

  return (
    <section aria-labelledby="saved-todos-title" className="surface-card p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-accent-700">Saved todos</p>
          <h3 id="saved-todos-title" className="mt-1 text-lg font-semibold">
            Current list
          </h3>
        </div>
        <span className="rounded-full border border-accent-200 bg-accent-50 px-3 py-1 text-sm font-medium text-accent-800">
          {todoCountLabel}
        </span>
      </div>

      {todos.length > 0 ? (
        <ol className="mt-5 w-full min-w-0 divide-y divide-accent-100 border-y border-accent-100">
          {todos.map((todo) => (
            <li className="min-w-0 py-4" key={todo.id}>
              {editingTodoId === todo.id ? (
                <TodoEditForm
                  todo={todo}
                  onCancel={() => setEditingTodoId(null)}
                  onSave={(input) => {
                    const updateResult = onUpdateTodo(input);

                    if (updateResult.ok) {
                      setEditingTodoId(null);
                    }
                  }}
                />
              ) : (
                <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1 space-y-2">
                    <p className="break-words text-base font-semibold">
                      {todo.title}
                    </p>
                    {todo.description ? (
                      <p className="break-words text-sm leading-6 text-neutral-600">
                        {todo.description}
                      </p>
                    ) : null}
                    <p className="text-xs font-medium text-accent-700">
                      Stored on this device
                    </p>
                  </div>
                  <div className="flex max-w-full shrink-0 flex-wrap items-center gap-3 sm:justify-end">
                    <TodoStatusBadge status={todo.completed} />
                    <button
                      className="button-secondary"
                      onClick={() => setEditingTodoId(todo.id)}
                      type="button"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-5 rounded-lg border border-dashed border-accent-200 bg-accent-50 px-4 py-6 text-sm leading-6 text-accent-900">
          No todos yet. Create a todo to see it appear here with a Not Complete
          status badge.
        </p>
      )}
    </section>
  );
}

export default TodoList;
