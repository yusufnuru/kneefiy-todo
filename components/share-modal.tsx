"use client";
import { useState } from "react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (email: string) => void;
}

export default function ShareModal({
  isOpen,
  onClose,
  onShare,
}: ShareModalProps) {
  const [shareEmail, setShareEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (shareEmail.trim()) {
      onShare(shareEmail.trim());
      setShareEmail("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-primary-foreground p-6 rounded-lg w-80">
        <h3 className="font-semibold mb-4">Share Todo</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter email address"
            value={shareEmail}
            onChange={(e) => setShareEmail(e.target.value)}
            className="w-full p-2 border rounded mb-4"
            required
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              disabled={!shareEmail.trim()}
            >
              Share
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                setShareEmail("");
              }}
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
