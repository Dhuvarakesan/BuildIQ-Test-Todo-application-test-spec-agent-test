import TodoStatusBadge from './TodoStatusBadge';
import type { Todo } from '../types/todo';

export type TodoListProps = {
  todos: Todo[];
};

function getTodoCountLabel(todoCount: number) {
  return todoCount === 1 ? '1 todo' : `${todoCount} todos`;
}

function TodoList({ todos }: TodoListProps) {
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
        <span className="rounded-full bg-accent-50 px-3 py-1 text-sm font-medium text-accent-800">
          {todoCountLabel}
        </span>
      </div>

      {todos.length > 0 ? (
        <ol className="mt-5 divide-y divide-neutral-200 border-y border-neutral-200">
          {todos.map((todo) => (
            <li className="py-4" key={todo.id}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 space-y-2">
                  <p className="break-words text-base font-semibold">
                    {todo.title}
                  </p>
                  {todo.description ? (
                    <p className="break-words text-sm leading-6 text-neutral-600">
                      {todo.description}
                    </p>
                  ) : null}
                  <p className="text-xs font-medium text-neutral-500">
                    Stored on this device
                  </p>
                </div>
                <TodoStatusBadge completed={todo.completed} />
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-5 rounded-lg border border-dashed border-neutral-300 bg-paper px-4 py-6 text-sm leading-6 text-neutral-600">
          No todos yet. Create a todo to see it appear here with a Not Complete
          status badge.
        </p>
      )}
    </section>
  );
}

export default TodoList;
