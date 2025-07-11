// hooks/useTodos.ts
import { useState, useEffect } from 'react';
import { Todo } from '@/types/todo';
import { TodoService } from '@/services/todo-service';

interface UseTodosProps {
    userId: string;
    userEmail?: string;
}

export function useTodos({ userId, userEmail }: UseTodosProps) {
    const [todos, setTodos] = useState<Todo[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const todoService = new TodoService();

    const fetchTodos = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await todoService.getTodos(userId, userEmail);
            setTodos(data);
        } catch (err: any) {
            console.error('Error fetching todos:', err);
            setError(err?.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const toggleTodoStatus = async (todoId: string, currentStatus: boolean) => {
        try {
            await todoService.toggleTodoStatus(todoId, currentStatus);

            setTodos(prev => prev ? prev.map(todo =>
                todo.id === todoId
                    ? { ...todo, completed: !currentStatus }
                    : todo
            ) : null);
        } catch (err: any) {
            console.error('Error updating todo:', err);
            setError('Failed to update todo status');
        }
    };

    const deleteTodo = async (todoId: string) => {
        if (!confirm('Are you sure you want to delete this todo?')) {
            return;
        }

        try {
            await todoService.deleteTodo(todoId);

            setTodos(prev => prev ? prev.filter(todo => todo.id !== todoId) : null);
        } catch (err: any) {
            console.error('Error deleting todo:', err);
            setError('Failed to delete todo');
        }
    };

    const updateDueDate = async (todoId: string, dueDate: string) => {
        try {
            await todoService.updateDueDate(todoId, dueDate);

            setTodos(prev => prev ? prev.map(todo =>
                todo.id === todoId
                    ? { ...todo, due_date: dueDate || undefined }
                    : todo
            ) : null);
        } catch (err: any) {
            console.error('Error updating due date:', err);
            setError('Failed to update due date');
        }
    };

    const shareTodo = async (todoId: string, email: string) => {
        try {
            await todoService.shareTodo(todoId, email);
            // Optionally refresh todos to show updated share info
            await fetchTodos();
            return true;
        } catch (err: any) {
            console.error('Error sharing todo:', err);
            setError(err.message || 'Failed to share todo');
            return false;
        }
    };

    const createTodo = async (newTodo: Omit<Todo, 'id' | 'created_at' | 'updated_at' | 'todo_shares'>) => {
        try {
            setError(null);
            const createdTodo = await todoService.createTodo(newTodo);
            
            // Add the new todo to the current list
            setTodos(prevTodos => [
                { ...createdTodo, todo_shares: [] },
                ...(prevTodos || [])
            ]);
            
            return createdTodo;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create todo';
            setError(errorMessage);
            throw err;
        }
    };

    const clearError = () => {
        setError(null);
    };

    useEffect(() => {
        if (userId) {
            fetchTodos();
        }
    }, [userId, userEmail]);

    return {
        todos,
        loading,
        error,
        toggleTodoStatus,
        deleteTodo,
        updateDueDate,
        shareTodo,
        clearError,
        createTodo,
        refetch: fetchTodos
    };
}