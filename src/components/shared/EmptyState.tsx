import React from "react";

interface EmptyStateProps {
  icon: string;
  message: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, message }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-neutral-500 py-20">
      <div className="text-4xl mb-4 opacity-40">{icon}</div>
      <div className="text-sm">{message}</div>
    </div>
  );
};
