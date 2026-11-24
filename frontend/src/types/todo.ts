export const TODO_NOT_COMPLETE_STATUS = 'Not Complete' as const;

const TODO_STATUS_LABELS = {
  false: TODO_NOT_COMPLETE_STATUS,
} as const;

export type TodoDisplayStatus = typeof TODO_NOT_COMPLETE_STATUS;
export type TodoCompletion = false;

export type CreateTodoInput = {
  title: string;
  description?: string;
};

export type Todo = {
  id: string;
  title: string;
  description?: string;
  completed: TodoCompletion;
  createdAt: string;
};

export type TodoStoragePayload = {
  version: 1;
  todos: Todo[];
};

export type TodoStorageFailureReason =
  | 'storage-unavailable'
  | 'read-failed'
  | 'write-failed'
  | 'parse-failed'
  | 'invalid-payload';

export type TodoLoadResult =
  | {
      ok: true;
      todos: Todo[];
    }
  | {
      ok: false;
      todos: Todo[];
      reason: TodoStorageFailureReason;
      message: string;
    };

export type TodoSaveResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      reason: TodoStorageFailureReason;
      message: string;
    };

export function getTodoDisplayStatus(
  completed: TodoCompletion,
): TodoDisplayStatus {
  const statusKey = String(completed) as keyof typeof TODO_STATUS_LABELS;

  return TODO_STATUS_LABELS[statusKey];
}
