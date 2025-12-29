'use client';

import { Calendar } from 'lucide-react';

interface DateTimePickerProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
}

export default function DateTimePicker({ value, onChange, label }: DateTimePickerProps) {
    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-medium text-gray-300">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    type="datetime-local"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="block w-full rounded-md border-gray-600 bg-[#1F2228] text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-10"
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
        </div>
    );
}
