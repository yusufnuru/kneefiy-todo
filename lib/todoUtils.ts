export const isOverdue = (dueDate: string): boolean => {
    return new Date(dueDate) < new Date();
};

export const isDueSoon = (dueDate: string): boolean => {
    const due = new Date(dueDate);
    const now = new Date();
    const timeDiff = due.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff <= 3 && daysDiff > 0;
};

export const formatDueDate = (dueDate: string): string => {
    return new Date(dueDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

export const formatDateTime = (dateTime: string): string => {
    return new Date(dateTime).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const getDueDateStatus = (dueDate: string): 'overdue' | 'due-soon' | 'normal' => {
    if (isOverdue(dueDate)) return 'overdue';
    if (isDueSoon(dueDate)) return 'due-soon';
    return 'normal';
};

export const getDueDateClasses = (dueDate: string): string => {
    const status = getDueDateStatus(dueDate);
    switch (status) {
        case 'overdue':
            return 'text-red-600 font-semibold';
        case 'due-soon':
            return 'text-orange-600 font-semibold';
        default:
            return 'text-gray-500';
    }
};