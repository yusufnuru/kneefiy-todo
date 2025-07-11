"use client";
import { Todo } from "@/types/todo";
import TodoItem from "@/components/todo-item";

interface TodoListProps {
  todos: Todo[];
  userId: string;
  onToggleStatus: (todoId: string, currentStatus: boolean) => void;
  onDelete: (todoId: string) => void;
  onSetDueDate: (todoId: string, currentDueDate?: string) => void;
  onShare: (todoId: string) => void;
}

export default function TodoList({
  todos,
  userId,
  onToggleStatus,
  onDelete,
  onSetDueDate,
  onShare,
}: TodoListProps) {
  const completedTodos = todos.filter((todo) => todo.completed);
  const incompleteTodos = todos.filter((todo) => !todo.completed);

  if (todos.length === 0) {
    return <p>No todos found.</p>;
  }

  return (
    <div className="w-full">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="font-semibold mb-2 text-lg">
            Incomplete ({incompleteTodos.length})
          </h3>
          <ul>
            {incompleteTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                userId={userId}
                onToggleStatus={onToggleStatus}
                onDelete={onDelete}
                onSetDueDate={onSetDueDate}
                onShare={onShare}
              />
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2 text-lg">
            Completed ({completedTodos.length})
          </h3>
          <ul>
            {completedTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                userId={userId}
                onToggleStatus={onToggleStatus}
                onDelete={onDelete}
                onSetDueDate={onSetDueDate}
                onShare={onShare}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
