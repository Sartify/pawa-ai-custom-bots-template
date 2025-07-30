"use client";
import React from "react";
import { Button } from "@/components/ui/button";

interface ActionButtonProps {
  icon: React.ReactNode;
  tooltipText: string;
  onClick: () => void;
  filled?: boolean;
  disabled?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  tooltipText,
  onClick,
  // filled,
  disabled,
}) => (
  <Button
    variant="ghost"
    size="sm"
    className="relative group text-gray-400 hover:text-yellow-400 p-0 transition-all duration-200"
    onClick={onClick}
    disabled={disabled}
  >
    {icon}
    <div className="absolute left-1/2 -translate-x-1/2 -top-6 bg-black text-white text-xs rounded px-2 py-1 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap">
      {tooltipText}
    </div>
  </Button>
);
