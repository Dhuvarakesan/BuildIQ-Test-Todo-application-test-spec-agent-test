import { useId, useState, type FormEvent } from 'react';

import type { CreateTodoInput, Todo } from '../types/todo';

type CreateTodoHandler = (input: CreateTodoInput) => Todo | null;

export type TodoFormProps = {
  onCreateTodo: CreateTodoHandler;
  todoCount?: number;
};

function TodoForm({ onCreateTodo, todoCount = 0 }: TodoFormProps) {
  const titleInputId = useId();
  const titleHintId = useId();
  const titleErrorId = useId();
  const descriptionInputId = useId();
  const descriptionHintId = useId();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [titleError, setTitleError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const titleDescriptionIds = titleError
    ? `${titleHintId} ${titleErrorId}`
    : titleHintId;
  const todoCountLabel = todoCount === 1
    ? '1 todo in your list.'
    : `${todoCount} todos in your list.`;

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setSuccessMessage(null);

    if (titleError && value.trim() !== '') {
      setTitleError(null);
    }
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    setSuccessMessage(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (trimmedTitle === '') {
      setTitleError('Enter a task title before creating a todo.');
      setSuccessMessage(null);
      return;
    }

    const createdTodo = onCreateTodo({
      title: trimmedTitle,
      ...(trimmedDescription ? { description: trimmedDescription } : {}),
    });

    if (!createdTodo) {
      setTitleError('Enter a task title before creating a todo.');
      setSuccessMessage(null);
      return;
    }

    setTitle('');
    setDescription('');
    setTitleError(null);
    setSuccessMessage('Todo created.');
  };

  return (
    <form className="mt-5 space-y-5" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold" htmlFor={titleInputId}>
          Task title <span className="text-rose-700" aria-hidden="true">*</span>
        </label>
        <input
          aria-describedby={titleDescriptionIds}
          aria-invalid={Boolean(titleError)}
          aria-required="true"
          autoComplete="off"
          className="px-3 py-2 text-base aria-[invalid=true]:border-rose-500"
          id={titleInputId}
          name="title"
          onChange={(event) => handleTitleChange(event.target.value)}
          placeholder="Pick up groceries"
          type="text"
          value={title}
        />
        <p className="text-sm leading-5 text-neutral-600" id={titleHintId}>
          Required. Add a short title for the task.
        </p>
        {titleError ? (
          <p
            className="text-sm font-medium leading-5 text-rose-700"
            id={titleErrorId}
            role="alert"
          >
            {titleError}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold" htmlFor={descriptionInputId}>
          Description <span className="text-neutral-500">(optional)</span>
        </label>
        <textarea
          aria-describedby={descriptionHintId}
          className="min-h-28 resize-y px-3 py-2 text-base"
          id={descriptionInputId}
          name="description"
          onChange={(event) => handleDescriptionChange(event.target.value)}
          placeholder="Add details, notes, or context"
          value={description}
        />
        <p className="text-sm leading-5 text-neutral-600" id={descriptionHintId}>
          Optional. Include any extra details you want to remember.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-5 text-neutral-600">
          {todoCountLabel}
        </p>
        <button
          className="rounded-lg bg-accent-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-800"
          type="submit"
        >
          Create todo
        </button>
      </div>

      {successMessage ? (
        <p
          className="status-success rounded-lg border p-3 text-sm font-medium leading-5"
          role="status"
        >
          {successMessage}
        </p>
      ) : null}
    </form>
  );
}

export default TodoForm;
