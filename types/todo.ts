export type Todo = {
    id: string;
    content: string;
    completed: boolean;
    user_id: string;
    description?: string;
    due_date?: string;
    created_at?: string;
    updated_at?: string;
    todo_shares: TodoShare[]
};

export type TodoShare = {
    id?: string;
    todo_id: string;
    shared_with_email: string;
    permission: 'read' | 'read_write';
    created_at?: string;
    owner_email: string;
};
