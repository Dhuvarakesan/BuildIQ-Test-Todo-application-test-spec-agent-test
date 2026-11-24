import { useId, useState, type FormEvent } from 'react';

import {
  TODO_COMPLETE_STATUS,
  TODO_COMPLETION,
  TODO_IN_PROGRESS_STATUS,
  TODO_NOT_COMPLETE_STATUS,
  type Todo,
  type TodoCompletion,
  type UpdateTodoInput,
} from '../types/todo';

type EditableTodoState = {
  todoId: string;
  title: string;
  description: string;
  status: TodoCompletion;
  titleError: string | null;
};

export type TodoEditFormProps = {
  todo: Todo;
  onSave: (input: UpdateTodoInput) => void;
  onCancel: () => void;
};

const statusOptions = [
  {
    label: TODO_COMPLETE_STATUS,
    value: TODO_COMPLETION.COMPLETE,
  },
  {
    label: TODO_NOT_COMPLETE_STATUS,
    value: TODO_COMPLETION.NOT_COMPLETE,
  },
  {
    label: TODO_IN_PROGRESS_STATUS,
    value: TODO_COMPLETION.IN_PROGRESS,
  },
] as const;

function getInitialTodoState(todo: Todo): EditableTodoState {
  return {
    todoId: todo.id,
    title: todo.title,
    description: todo.description ?? '',
    status: todo.completed,
    titleError: null,
  };
}

function TodoEditForm({ todo, onSave, onCancel }: TodoEditFormProps) {
  const titleInputId = useId();
  const titleHintId = useId();
  const titleErrorId = useId();
  const descriptionInputId = useId();
  const descriptionHintId = useId();
  const statusInputId = useId();
  const statusHintId = useId();
  const [editState, setEditState] = useState<EditableTodoState>(() => (
    getInitialTodoState(todo)
  ));

  const currentEditState = editState.todoId === todo.id
    ? editState
    : getInitialTodoState(todo);
  const titleDescriptionIds = currentEditState.titleError
    ? `${titleHintId} ${titleErrorId}`
    : titleHintId;

  const handleTitleChange = (value: string) => {
    setEditState((currentState) => {
      const nextState = currentState.todoId === todo.id
        ? currentState
        : getInitialTodoState(todo);

      return {
        ...nextState,
        title: value,
        titleError: value.trim() === '' ? nextState.titleError : null,
      };
    });
  };

  const handleDescriptionChange = (value: string) => {
    setEditState((currentState) => {
      const nextState = currentState.todoId === todo.id
        ? currentState
        : getInitialTodoState(todo);

      return {
        ...nextState,
        description: value,
      };
    });
  };

  const handleStatusChange = (value: TodoCompletion) => {
    setEditState((currentState) => {
      const nextState = currentState.todoId === todo.id
        ? currentState
        : getInitialTodoState(todo);

      return {
        ...nextState,
        status: value,
      };
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = currentEditState.title.trim();
    const trimmedDescription = currentEditState.description.trim();

    if (trimmedTitle === '') {
      setEditState({
        ...currentEditState,
        titleError: 'Enter a task title before saving changes.',
      });
      return;
    }

    onSave({
      id: todo.id,
      title: trimmedTitle,
      status: currentEditState.status,
      ...(trimmedDescription ? { description: trimmedDescription } : {}),
    });
  };

  return (
    <form className="todo-edit-form" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold" htmlFor={titleInputId}>
          Task title <span className="text-rose-700" aria-hidden="true">*</span>
        </label>
        <input
          aria-describedby={titleDescriptionIds}
          aria-invalid={Boolean(currentEditState.titleError)}
          aria-required="true"
          autoComplete="off"
          className="px-3 py-2 text-base aria-[invalid=true]:border-rose-500"
          id={titleInputId}
          name="title"
          onChange={(event) => handleTitleChange(event.target.value)}
          type="text"
          value={currentEditState.title}
        />
        <p className="text-sm leading-5 text-neutral-600" id={titleHintId}>
          Required. Keep the title short enough to scan in your list.
        </p>
        {currentEditState.titleError ? (
          <p
            className="text-sm font-medium leading-5 text-rose-700"
            id={titleErrorId}
            role="alert"
          >
            {currentEditState.titleError}
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
          value={currentEditState.description}
        />
        <p className="text-sm leading-5 text-neutral-600" id={descriptionHintId}>
          Optional. Edit or clear any extra details for this todo.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold" htmlFor={statusInputId}>
          Status
        </label>
        <select
          aria-describedby={statusHintId}
          className="px-3 py-2 text-base"
          id={statusInputId}
          name="status"
          onChange={(event) => {
            handleStatusChange(event.target.value as TodoCompletion);
          }}
          value={currentEditState.status}
        >
          {statusOptions.map((statusOption) => (
            <option key={statusOption.value} value={statusOption.value}>
              {statusOption.label}
            </option>
          ))}
        </select>
        <p className="text-sm leading-5 text-neutral-600" id={statusHintId}>
          Choose how this todo should appear in your list.
        </p>
      </div>

      <div className="todo-edit-actions">
        <button className="button-secondary" type="button" onClick={onCancel}>
          Cancel
        </button>
        <button className="button-primary" type="submit">
          Save
        </button>
      </div>
    </form>
  );
}

export default TodoEditForm;
