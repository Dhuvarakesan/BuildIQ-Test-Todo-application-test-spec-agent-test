function AppShell() {
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
            Todo experience
          </h2>
        </div>

        <section
          aria-labelledby="create-region-title"
          className="surface-card p-5"
          id="create-todo"
        >
          <h3 id="create-region-title" className="text-lg font-semibold">
            Create a todo
          </h3>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            A title field and optional description will appear here in the next feature.
          </p>
        </section>

        <section
          aria-labelledby="todo-list-region-title"
          className="surface-card p-5"
          id="todo-list"
        >
          <h3 id="todo-list-region-title" className="text-lg font-semibold">
            Todo list
          </h3>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            Saved todos will appear here on this device with their current status.
          </p>
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
