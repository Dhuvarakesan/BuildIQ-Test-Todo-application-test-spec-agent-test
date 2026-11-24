export const TODO_NOT_COMPLETE_STATUS = 'Not Complete' as const;

export type TodoDisplayStatus = typeof TODO_NOT_COMPLETE_STATUS;

export type CreateTodoInput = {
  title: string;
  description?: string;
};

export type Todo = {
  id: string;
  title: string;
  description?: string;
  completed: false;
  status: TodoDisplayStatus;
  createdAt: string;
};
