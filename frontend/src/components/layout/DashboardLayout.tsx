import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import { Topbar } from "./Topbar"


export function DashboardLayout() {
    return (
        <div className="flex flex-col h-screen overflow-hidden">


            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <div className="flex flex-1 flex-col overflow-hidden bg-slate-50/50">
                    <Topbar />
                    <main className="flex-1 overflow-y-auto p-6 md:p-8">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    )
}
