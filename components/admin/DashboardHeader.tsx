'use client'

export default function DashboardHeader() {
    return (
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-100">Dashboard</h2>
            <div className="text-sm text-gray-400">
                {new Date().toLocaleDateString('tr-TR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}
            </div>
        </div>
    )
}
