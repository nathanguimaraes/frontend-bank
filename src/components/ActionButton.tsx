import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ icon: Icon, label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100"
    >
      <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-full">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <span className="text-sm text-gray-600">{label}</span>
    </button>
  );
};