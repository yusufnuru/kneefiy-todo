'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Todo } from '@/types/todo';
import { TodoService } from '@/services/todo-service';
import { formatDueDate, formatDateTime, getDueDateClasses, isOverdue, isDueSoon } from '@/lib/todoUtils';
import ShareModal from '@/components/share-modal';
import DueDateModal from '@/components/due-date-modal';

interface TodoDetailProps {
    todoId: string;
    userId: string;
    userEmail?: string;
}

export default function TodoDetail({ todoId, userId, userEmail }: TodoDetailProps) {
    const [todo, setTodo] = useState<Todo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [dueDateModalOpen, setDueDateModalOpen] = useState(false);
    const [shareToRemove, setShareToRemove] = useState<string | null>(null);

    const router = useRouter();
    const todoService = new TodoService();

    useEffect(() => {
        const fetchTodo = async () => {
            try {
                setLoading(true);
                const data = await todoService.getTodoById(todoId);
                setTodo(data);
            } catch (err: any) {
                console.error('Error fetching todo:', err);
                setError(err?.message || 'Failed to fetch todo');
            } finally {
                setLoading(false);
            }
        };

        if (todoId) {
            fetchTodo();
        }
    }, [todoId]);

    const toggleTodoStatus = async () => {
        if (!todo) return;

        try {
            await todoService.toggleTodoStatus(todo.id, todo.completed);
            setTodo(prev => prev ? { ...prev, completed: !prev.completed } : null);
        } catch (err: any) {
            console.error('Error updating todo:', err);
            setError('Failed to update todo status');
        }
    };

    const updateDueDate = async (dueDate: string) => {
        if (!todo) return;

        try {
            await todoService.updateDueDate(todo.id, dueDate);
            setTodo(prev => prev ? { ...prev, due_date: dueDate || undefined } : null);
        } catch (err: any) {
            console.error('Error updating due date:', err);
            setError('Failed to update due date');
        }
    };

    const shareTodo = async (email: string) => {
        if (!todo) return;

        try {
            await todoService.shareTodo(todo.id, email);
            const updatedTodo = await todoService.getTodoById(todo.id);
            setTodo(updatedTodo);
            setShareModalOpen(false);
            alert('Todo shared successfully!');
        } catch (err: any) {
            console.error('Error sharing todo:', err);
            setError(err.message || 'Failed to share todo');
        }
    };

    const removeShare = async (email: string) => {
        if (!todo) return;

        try {
            await todoService.removeTodoShare(todo.id, email);
            const updatedTodo = await todoService.getTodoById(todo.id);
            setTodo(updatedTodo);
            setShareToRemove(null);
        } catch (err: any) {
            console.error('Error removing share:', err);
            setError('Failed to remove share');
        }
    };

    const updateSharePermission = async (email: string, permission: 'read' | 'read_write') => {
        if (!todo) return;

        try {
            await todoService.updateSharePermission(todo.id, email, permission);
            const updatedTodo = await todoService.getTodoById(todo.id);
            setTodo(updatedTodo);
        } catch (err: any) {
            console.error('Error updating permission:', err);
            setError('Failed to update permission');
        }
    };

    const deleteTodo = async () => {
        if (!todo) return;

        if (!confirm('Are you sure you want to delete this todo?')) {
            return;
        }

        try {
            await todoService.deleteTodo(todo.id);
            router.push('/todo');
        } catch (err: any) {
            console.error('Error deleting todo:', err);
            setError('Failed to delete todo');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Loading todo details...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="text-red-800 font-semibold">Error</h3>
                    <p className="text-red-700">{error}</p>
                    <button
                        onClick={() => router.push('/todo')}
                        className="mt-2 text-blue-600 hover:text-blue-800"
                    >
                        ← Back to Todos
                    </button>
                </div>
            </div>
        );
    }

    if (!todo) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Todo Not Found</h2>
                    <p className="text-gray-600 mb-4">The todo you're looking for doesn't exist or you don't have permission to view it.</p>
                    <button
                        onClick={() => router.push('/todos')}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        ← Back to Todos
                    </button>
                </div>
            </div>
        );
    }

    const isOwner = todo.user_id === userId;
    const todoShares = todo.todo_shares || [];

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={() => router.push('/todo')}
                    className="text-blue-600 hover:text-blue-800 mb-4"
                >
                    ← Back to Todos
                </button>
                <h1 className="text-3xl font-bold mb-2">Todo Details</h1>
            </div>

            {/* Main Todo Information */}
            <div className="border rounded-lg shadow-lg p-6 mb-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {isOwner && ( <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={toggleTodoStatus}
                            className="w-6 h-6 text-blue-600 rounded"
                        />)
                      }
                        <div>
                            <h2 className={`text-2xl font-semibold ${
                                todo.completed ? 'line-through text-gray-500' : ''
                            }`}>
                                {todo.content}
                            </h2>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                <span className={`px-2 py-1 rounded-full ${
                                    todo.completed
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {todo.completed ? 'Completed' : 'Pending'}
                                </span>
                                {!isOwner && (
                                    <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                                        Shared with you
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {isOwner && (
                      <div className="mx-2 flex gap-2">
                        <button
                          onClick={() => setDueDateModalOpen(true)}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          📅 <span className="hidden sm:inline">Set Due Date</span>
                        </button>
                        <button
                          onClick={() => setShareModalOpen(true)}
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          🔗 <span className="hidden sm:inline">Share</span>
                        </button>
                        <button
                          onClick={deleteTodo}
                          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          🗑️ <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    )}
                </div>

                {/* Description */}
                {todo.description && (
                    <div className="mb-4">
                        <h3 className="font-semibold mb-2">Description</h3>
                        <p className="p-3 rounded">{todo.description}</p>
                    </div>
                )}

                {/* Due Date */}
                {todo.due_date && (
                    <div className="mb-4">
                        <h3 className="font-semibold mb-2">Due Date</h3>
                        <div className={`text-lg ${getDueDateClasses(todo.due_date)}`}>
                            {formatDueDate(todo.due_date)}
                            {isOverdue(todo.due_date) && ' (Overdue)'}
                            {isDueSoon(todo.due_date) && ' (Due Soon)'}
                        </div>
                    </div>
                )}

            </div>

            {/* Owner Information */}
            <div className="border rounded-lg shadow-lg p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">Owner Information</h3>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {isOwner ? 'You' : todo.todo_shares[0].owner_email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-semibold">
                            {isOwner ? 'You' : todo.todo_shares[0].owner_email}
                        </p>
                        <p className="text-sm ">
                            Owner • Created {todo.created_at ? formatDateTime(todo.created_at) : 'Unknown'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Sharing Information */}
            {isOwner && (
                <div className="border rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold">Shared With</h3>
                        <button
                            onClick={() => setShareModalOpen(true)}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            + Add Person
                        </button>
                    </div>

                    {todoShares.length === 0 ? (
                        <p>This todo is not shared with anyone.</p>
                    ) : (
                        <div className="space-y-3">
                            {todoShares.map((share, index) => (
                                <div key={index} className="border flex items-center justify-between p-3 flex-col sm:flex-row rounded gap-2 sm:gap-1">
                                    <div className="rounded flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                            {share.shared_with_email.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold">{share.shared_with_email}</p>
                                            <p className="text-sm text-gray-600">
                                                Shared {share.created_at ? formatDateTime(share.created_at) : 'Unknown'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <select
                                            value={share.permission}
                                            onChange={(e) => updateSharePermission(share.shared_with_email, e.target.value as 'read' | 'read_write')}
                                            className="px-2 py-1 border rounded text-sm"
                                        >
                                            <option value="read">Read Only</option>
                                            <option value="read_write">Read & Write</option>
                                        </select>
                                        <button
                                            onClick={() => setShareToRemove(share.shared_with_email)}
                                            className="text-red-600 hover:text-red-800 text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Share Modal */}
            <ShareModal
                isOpen={shareModalOpen}
                onClose={() => setShareModalOpen(false)}
                onShare={shareTodo}
            />

            {/* Due Date Modal */}
            <DueDateModal
                isOpen={dueDateModalOpen}
                currentDueDate={todo.due_date}
                onClose={() => setDueDateModalOpen(false)}
                onSave={updateDueDate}
            />

            {/* Remove Share Confirmation */}
            {shareToRemove && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-primary-foreground p-6 rounded-lg w-96">
                        <h3 className="font-semibold mb-4">Remove Share</h3>
                        <p className="mb-4">
                            Are you sure you want to remove access for <strong>{shareToRemove}</strong>?
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => removeShare(shareToRemove)}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                                Remove
                            </button>
                            <button
                                onClick={() => setShareToRemove(null)}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}