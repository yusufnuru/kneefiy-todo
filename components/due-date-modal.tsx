'use client';
import { useState, useEffect } from 'react';

interface DueDateModalProps {
    isOpen: boolean;
    currentDueDate?: string;
    onClose: () => void;
    onSave: (dueDate: string) => void;
}

export default function DueDateModal({ isOpen, currentDueDate, onClose, onSave }: DueDateModalProps) {
    const [dueDate, setDueDate] = useState('');

    useEffect(() => {
        if (isOpen) {
            setDueDate(currentDueDate || '');
        }
    }, [isOpen, currentDueDate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(dueDate);
        onClose();
    };

    const handleRemoveDate = () => {
        onSave('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-primary-foreground p-6 rounded-lg w-80 sm:w-96">
                <h3 className="font-semibold mb-4">Set Due Date</h3>
                <form onSubmit={handleSubmit}>
                    <input
                        type="datetime-local"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full p-2 border rounded mb-4"
                    />
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={handleRemoveDate}
                            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                        >
                            Remove Date
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}