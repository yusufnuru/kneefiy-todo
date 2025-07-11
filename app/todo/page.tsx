'use client'
import { useAuth } from "@/context/auth-context";
import ViewTodo from "@/components/view-todo";

export default function TodoPage() {
    const auth = useAuth();
    const user = auth?.user;

    console.log('User ID:', user?.id);

    if (!user) {
        return (
            <div className="flex-1 w-full flex flex-col gap-12">
                <div className="w-full">
                    <p>Please log in to view your todos.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 w-full flex flex-col gap-12">
            <div className="w-full">
                <ViewTodo userId={user.id} userEmail={user?.email}/>
            </div>
        </div>
    );
}