import TodoForm from './TodoForm';
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

        <p className="status-warning rounded-lg border p-4 text-sm leading-6">
          Todos stay in this browser. Simple Todo does not use a backend service,
          account, sharing, or remote sync.
        </p>
      </main>
    </div>
  );
}

export default AppShell;
