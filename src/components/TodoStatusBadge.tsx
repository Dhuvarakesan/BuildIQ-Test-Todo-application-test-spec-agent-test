import { getTodoDisplayStatus, type TodoCompletion } from '../types/todo';

export type TodoStatusBadgeProps = {
  completed: TodoCompletion;
};

function TodoStatusBadge({ completed }: TodoStatusBadgeProps) {
  return (
    <span
      className="inline-flex shrink-0 items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800"
    >
      {getTodoDisplayStatus(completed)}
    </span>
  );
}

export default TodoStatusBadge;
