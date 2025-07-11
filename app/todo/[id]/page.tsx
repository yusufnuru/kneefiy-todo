'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import TodoDetail from '@/components/todo-detail';
import { createClient } from '@/lib/supabase/client';

export default function TodoDetailPage() {
    const params = useParams();
    const [userId, setUserId] = useState<string>('');
    const [userEmail, setUserEmail] = useState<string>('');
    const [loading, setLoading] = useState(true);

    const supabase = createClient();
    const todoId = params.id as string;

    useEffect(() => {
        const getUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    setUserId(user.id);
                    setUserEmail(user.email || '');
                }
            } catch (error) {
                console.error('Error getting user:', error);
            } finally {
                setLoading(false);
            }
        };

        getUser();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    if (!userId) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
                    <p className="text-gray-600">Please log in to view todo details.</p>
                </div>
            </div>
        );
    }

    return (
        <TodoDetail
            todoId={todoId}
            userId={userId}
        />
    );
}