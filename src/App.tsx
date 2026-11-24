function App() {
  return (
    <main className="min-h-screen bg-neutral-100 text-neutral-950">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="text-sm font-medium text-emerald-700">Local-first</p>
            <h1 className="text-2xl font-semibold">Simple Todo</h1>
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800">
            Private
          </span>
        </div>
      </header>

      <section className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-6 sm:px-6">
        <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Create a todo</h2>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            A title field and optional description will appear here in the next feature.
          </p>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Your todos</h2>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            New todos will stay on this device and show a Not Complete status.
          </p>
        </div>

        <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          Todo data is designed to remain in this browser. This app does not use a
          backend service, user accounts, or remote synchronization.
        </p>
      </section>
    </main>
  );
}

export default App;
