'use client';
import { Todo } from "@/types/todo";
import { formatDueDate, getDueDateClasses, isOverdue, isDueSoon } from "@/lib/todoUtils";
import Link from "next/link";

interface TodoItemProps {
    todo: Todo;
    userId: string;
    onToggleStatus: (todoId: string, currentStatus: boolean) => void;
    onDelete: (todoId: string) => void;
    onSetDueDate: (todoId: string, currentDueDate?: string) => void;
    onShare: (todoId: string) => void;
}

export default function TodoItem({
                                     todo,
                                     userId,
                                     onToggleStatus,
                                     onDelete,
                                     onSetDueDate,
                                     onShare
                                 }: TodoItemProps) {
    const isOwner = todo.user_id === userId;

    return (
        <li className={`p-3 border rounded-lg mb-2 ${
            todo.completed ? 'bg-green-50 border-green-200' : 'border-gray-200'
        }`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                    <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => onToggleStatus(todo.id, todo.completed)}
                        className="w-4 h-4 text-blue-600 rounded"
                    />
                    <div className="flex-1">
                        <Link
                            href={`/todo/${todo.id}`}
                            className={`hover:text-blue-600 cursor-pointer ${
                                todo.completed ? 'line-through text-gray-500' : ''
                            }`}
                        >
                            {todo.content}
                        </Link>
                        {todo.description && (
                            <p className="text-sm text-gray-600 mt-1">{todo.description}</p>
                        )}
                        {todo.due_date && (
                            <div className={`text-xs mt-1 ${getDueDateClasses(todo.due_date)}`}>
                                Due: {formatDueDate(todo.due_date)}
                                {isOverdue(todo.due_date) && ' (Overdue)'}
                                {isDueSoon(todo.due_date) && ' (Due Soon)'}
                            </div>
                        )}
                        {!isOwner && (
                            <div className="text-xs text-blue-600 mt-1">
                                Shared with you
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Due Date Button */}
                    <button
                        onClick={() => onSetDueDate(todo.id, todo.due_date)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                        title="Set due date"
                    >
                        📅
                    </button>

                    {/* Share Button */}
                    {isOwner && (
                        <button
                            onClick={() => onShare(todo.id)}
                            className="text-green-600 hover:text-green-800 text-sm"
                            title="Share todo"
                        >
                            🔗
                        </button>
                    )}

                    {/* Delete Button */}
                    {isOwner && (
                        <button
                            onClick={() => onDelete(todo.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                            title="Delete todo"
                        >
                            🗑️
                        </button>
                    )}
                </div>
            </div>
        </li>
    );
}