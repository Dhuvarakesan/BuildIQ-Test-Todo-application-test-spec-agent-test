import TodoForm from './TodoForm';
import TodoStatusBadge from './TodoStatusBadge';
import { useTodos } from '../hooks/useTodos';
import { TODO_NOT_COMPLETE_STATUS } from '../types/todo';

function AppShell() {
  const { todos, createTodo } = useTodos();
  const todoCount = todos.length;
  const todoCountLabel = todoCount === 1
    ? '1 todo in your current list'
    : `${todoCount} todos in your current list`;

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="border-b border-neutral-200 bg-surface">
        <div
          className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-4 py-4 sm:px-6"
        >
          <div>
            <p className="text-sm font-medium text-accent-700">Local-first</p>
            <h1 className="text-2xl font-semibold">Simple Todo</h1>
          </div>
          <span className="rounded-lg bg-accent-50 px-3 py-1 text-sm font-medium text-accent-800">
            Private
          </span>
        </div>
      </header>

      <main
        aria-labelledby="todo-experience-title"
        className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-6 sm:px-6"
      >
        <div className="space-y-2">
          <p className="text-sm font-medium text-accent-700">
            Single-screen workspace
          </p>
          <h2 id="todo-experience-title" className="text-xl font-semibold">
            Create your next todo
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-neutral-600">
            Give each todo a required title and add an optional description when
            you need extra context.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <section
            aria-labelledby="create-region-title"
            className="surface-card p-5"
            id="create-todo"
          >
            <div className="space-y-2">
              <h3 id="create-region-title" className="text-lg font-semibold">
                New todo
              </h3>
              <p className="text-sm leading-6 text-neutral-600">
                Title is required. Description is optional, and every new todo
                starts as {TODO_NOT_COMPLETE_STATUS}.
              </p>
            </div>
            <TodoForm onCreateTodo={createTodo} todoCount={todoCount} />
          </section>

          <aside
            aria-label="Current todo list context"
            className="surface-card p-5"
          >
            <p className="text-sm font-medium text-accent-700">
              Current list
            </p>
            <p className="mt-1 text-2xl font-semibold">{todoCount}</p>
            <p className="mt-2 text-sm leading-6 text-neutral-600">
              {todoCountLabel}. Newly created todos appear as{' '}
              {TODO_NOT_COMPLETE_STATUS} in the current list.
            </p>
          </aside>
        </div>

        <section aria-labelledby="saved-todos-title" className="surface-card p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium text-accent-700">
                Saved todos
              </p>
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
              No todos yet. Created todos will appear here with a Not Complete
              status badge.
            </p>
          )}
        </section>

        <p className="status-warning rounded-lg border p-4 text-sm leading-6">
          Todos stay in this browser. Simple Todo does not use a backend service,
          account, sharing, or remote sync.
        </p>
      </main>
    </div>
  );
}

export default AppShell;
