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

export function getTodoDisplayStatus(
  completed: TodoCompletion,
): TodoDisplayStatus {
  const statusKey = String(completed) as keyof typeof TODO_STATUS_LABELS;

  return TODO_STATUS_LABELS[statusKey];
}
