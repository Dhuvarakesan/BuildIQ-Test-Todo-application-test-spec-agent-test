import {
  isTodoCompletion,
  type Todo,
  type TodoLoadResult,
  type TodoSaveResult,
  type TodoStorageFailureReason,
  type TodoStoragePayload,
  type TodoStorageRecord,
} from '../types/todo';

export const TODO_STORAGE_KEY = 'simple-todo.todos';
export const TODO_STORAGE_VERSION = 1;

const STORAGE_FAILURE_MESSAGE =
  'Todo storage is temporarily unavailable. Changes are kept only for this session.';

type StorageResult =
  | {
      ok: true;
      storage: Storage;
    }
  | {
      ok: false;
      reason: TodoStorageFailureReason;
    };

function failureResult(reason: TodoStorageFailureReason): TodoLoadResult {
  return {
    ok: false,
    todos: [],
    reason,
    message: STORAGE_FAILURE_MESSAGE,
  };
}

function saveFailureResult(reason: TodoStorageFailureReason): TodoSaveResult {
  return {
    ok: false,
    reason,
    message: STORAGE_FAILURE_MESSAGE,
  };
}

function getStorage(): StorageResult {
  try {
    const storage = globalThis.localStorage;

    if (!storage) {
      return {
        ok: false,
        reason: 'storage-unavailable',
      };
    }

    return {
      ok: true,
      storage,
    };
  } catch {
    return {
      ok: false,
      reason: 'storage-unavailable',
    };
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isIsoDateString(value: unknown): value is string {
  if (typeof value !== 'string') {
    return false;
  }

  const parsedTime = Date.parse(value);

  return !Number.isNaN(parsedTime) && new Date(parsedTime).toISOString() === value;
}

function getStoredDescription(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() !== '' ? value : undefined;
}

function isTodoStorageRecord(value: unknown): value is TodoStorageRecord {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === 'string'
    && value.id.trim() !== ''
    && typeof value.title === 'string'
    && value.title.trim() !== ''
    && isTodoCompletion(value.status)
    && isIsoDateString(value.createdAt)
  );
}

function isTodoStoragePayload(value: unknown): value is TodoStoragePayload {
  if (!isRecord(value)) {
    return false;
  }

  return (
    value.version === TODO_STORAGE_VERSION
    && Array.isArray(value.todos)
    && value.todos.every(isTodoStorageRecord)
  );
}

function toTodo(todoRecord: TodoStorageRecord): Todo {
  const description = getStoredDescription(todoRecord.description);

  return {
    id: todoRecord.id,
    title: todoRecord.title,
    completed: todoRecord.status,
    createdAt: todoRecord.createdAt,
    ...(description ? { description } : {}),
  };
}

function toTodoStorageRecord(todo: Todo): TodoStorageRecord {
  return {
    id: todo.id,
    title: todo.title,
    description: todo.description ?? '',
    status: todo.completed,
    createdAt: todo.createdAt,
  };
}

export function loadTodos(): TodoLoadResult {
  const storageResult = getStorage();

  if (!storageResult.ok) {
    return failureResult(storageResult.reason);
  }

  let storedValue: string | null;

  try {
    storedValue = storageResult.storage.getItem(TODO_STORAGE_KEY);
  } catch {
    return failureResult('read-failed');
  }

  if (storedValue === null) {
    return {
      ok: true,
      todos: [],
    };
  }

  let parsedValue: unknown;

  try {
    parsedValue = JSON.parse(storedValue) as unknown;
  } catch {
    return failureResult('parse-failed');
  }

  if (!isTodoStoragePayload(parsedValue)) {
    return failureResult('invalid-payload');
  }

  return {
    ok: true,
    todos: parsedValue.todos.map(toTodo),
  };
}

export function saveTodos(todos: Todo[]): TodoSaveResult {
  const storageResult = getStorage();

  if (!storageResult.ok) {
    return saveFailureResult(storageResult.reason);
  }

  const payload: TodoStoragePayload = {
    version: TODO_STORAGE_VERSION,
    todos: todos.map(toTodoStorageRecord),
  };

  try {
    storageResult.storage.setItem(TODO_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    return saveFailureResult('write-failed');
  }

  return {
    ok: true,
  };
}
