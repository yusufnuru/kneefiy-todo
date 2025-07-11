'use client';
import { useState } from "react";
import { useTodos } from "@/hooks/useTodos";
import TodoList from "@/components/todo-list";
import ShareModal from "@/components/share-modal";
import DueDateModal from "@/components/due-date-modal";
import AddTodoModal from "@/components/add-todo-modal";
import { Plus } from "lucide-react";

interface ViewTodoProps {
    userId: string;
    userEmail?: string;
}

export default function ViewTodoSimplified({ userId, userEmail }: ViewTodoProps) {
    const [shareModalOpen, setShareModalOpen] = useState<string | null>(null);
    const [dueDateModalOpen, setDueDateModalOpen] = useState<string | null>(null);
    const [addTodoModalOpen, setAddTodoModalOpen] = useState(false);
    const [currentDueDate, setCurrentDueDate] = useState<string>('');

    const {
        todos,
        loading,
        error,
        toggleTodoStatus,
        deleteTodo,
        updateDueDate,
        shareTodo,
        createTodo,
        clearError
    } = useTodos({ userId, userEmail });

    const handleSetDueDate = (todoId: string, currentDueDate?: string) => {
        setDueDateModalOpen(todoId);
        setCurrentDueDate(currentDueDate || '');
    };

    const handleShare = (todoId: string) => {
        setShareModalOpen(todoId);
    };

    const handleShareSubmit = async (email: string) => {
        if (shareModalOpen) {
            const success = await shareTodo(shareModalOpen, email);
            if (success) {
                setShareModalOpen(null);
                alert('Todo shared successfully!');
            }
        }
    };

    const handleDueDateSubmit = async (dueDate: string) => {
        if (dueDateModalOpen) {
            await updateDueDate(dueDateModalOpen, dueDate);
        }
    };

    const handleAddTodo = async (newTodo: { content: string; description?: string; due_date?: string }) => {
        await createTodo({
            ...newTodo,
            user_id: userId,
            completed: false,
        });
    };

    if (loading) {
        return <div>Loading todos...</div>;
    }

    return (
        <div className="flex-1 w-full flex flex-col">
            <div className="flex flex-col gap-2 items-start">
                <div className="flex items-center justify-between w-full mb-4 gap-2">
                    <h2 className="font-bold text-2xl">Todo Details</h2>
                    <button
                        onClick={() => setAddTodoModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={20} />
                        Add Todo
                    </button>
                </div>

                {error && (
                    <div className="text-red-600 mb-4 p-3 bg-red-50 border border-red-200 rounded w-full">
                        Error: {error}
                        <button
                            onClick={clearError}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                            Dismiss
                        </button>
                    </div>
                )}

                {todos && todos.length > 0 ? (
                    <TodoList
                        todos={todos}
                        userId={userId}
                        onToggleStatus={toggleTodoStatus}
                        onDelete={deleteTodo}
                        onSetDueDate={handleSetDueDate}
                        onShare={handleShare}
                    />
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <p className="mb-4">No todos found.</p>
                        <button
                            onClick={() => setAddTodoModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mx-auto"
                        >
                            <Plus size={20} />
                            Add Your First Todo
                        </button>
                    </div>
                )}
            </div>

            {/* Add Todo Modal */}
            <AddTodoModal
                isOpen={addTodoModalOpen}
                onClose={() => setAddTodoModalOpen(false)}
                onAdd={handleAddTodo}
            />

            {/* Due Date Modal */}
            <DueDateModal
                isOpen={dueDateModalOpen !== null}
                currentDueDate={currentDueDate}
                onClose={() => {
                    setDueDateModalOpen(null);
                    setCurrentDueDate('');
                }}
                onSave={handleDueDateSubmit}
            />

            {/* Share Modal */}
            <ShareModal
                isOpen={shareModalOpen !== null}
                onClose={() => setShareModalOpen(null)}
                onShare={handleShareSubmit}
            />
        </div>
    );
}