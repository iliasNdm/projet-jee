import * as React from "react"
import { cn } from "../../lib/utils"

interface Tab {
    id: string
    label: string
    content: React.ReactNode
}

interface TabsProps {
    tabs: Tab[]
    defaultTab?: string
    className?: string
}

export function Tabs({ tabs, defaultTab, className }: TabsProps) {
    const [activeTab, setActiveTab] = React.useState(defaultTab || tabs[0]?.id)

    return (
        <div className={cn("w-full", className)}>
            <div className="flex border-b border-slate-200">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "px-4 py-2 text-sm font-medium transition-colors border-b-2 hover:bg-slate-50",
                            activeTab === tab.id
                                ? "border-barber-gold text-barber-black"
                                : "border-transparent text-slate-500 hover:text-slate-700"
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="mt-4 p-1">
                {tabs.find((t) => t.id === activeTab)?.content}
            </div>
        </div>
    )
}
