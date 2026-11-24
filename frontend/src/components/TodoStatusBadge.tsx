import { getTodoDisplayStatus, type TodoCompletion } from '../types/todo';

export type TodoStatusBadgeProps = {
  status: TodoCompletion;
};

const statusClassNames = {
  not_complete: 'status-badge-not-complete',
  in_progress: 'status-badge-in-progress',
  complete: 'status-badge-complete',
} as const satisfies Record<TodoCompletion, string>;

function TodoStatusBadge({ status }: TodoStatusBadgeProps) {
  const displayStatus = getTodoDisplayStatus(status);

  return (
    <span className={`status-badge ${statusClassNames[status]}`}>
      {displayStatus}
    </span>
  );
}

export default TodoStatusBadge;
