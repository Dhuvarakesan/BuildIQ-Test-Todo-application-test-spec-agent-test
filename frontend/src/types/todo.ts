export const TODO_COMPLETION = {
  NOT_COMPLETE: 'not_complete',
  IN_PROGRESS: 'in_progress',
  COMPLETE: 'complete',
} as const;

export const TODO_COMPLETION_VALUES = [
  TODO_COMPLETION.NOT_COMPLETE,
  TODO_COMPLETION.IN_PROGRESS,
  TODO_COMPLETION.COMPLETE,
] as const;

export type TodoCompletion = (typeof TODO_COMPLETION_VALUES)[number];

export const DEFAULT_TODO_COMPLETION = TODO_COMPLETION.NOT_COMPLETE;

export const TODO_NOT_COMPLETE_STATUS = 'Not Complete' as const;
export const TODO_IN_PROGRESS_STATUS = 'In Progress' as const;
export const TODO_COMPLETE_STATUS = 'Complete' as const;

export const TODO_STATUS_LABELS = {
  [TODO_COMPLETION.NOT_COMPLETE]: TODO_NOT_COMPLETE_STATUS,
  [TODO_COMPLETION.IN_PROGRESS]: TODO_IN_PROGRESS_STATUS,
  [TODO_COMPLETION.COMPLETE]: TODO_COMPLETE_STATUS,
} as const satisfies Record<TodoCompletion, string>;

export type TodoDisplayStatus =
  (typeof TODO_STATUS_LABELS)[keyof typeof TODO_STATUS_LABELS];

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

export function isTodoCompletion(value: unknown): value is TodoCompletion {
  return (
    typeof value === 'string'
    && TODO_COMPLETION_VALUES.some((status) => status === value)
  );
}

export function getTodoDisplayStatus(
  completed: TodoCompletion,
): TodoDisplayStatus {
  return TODO_STATUS_LABELS[completed];
}
