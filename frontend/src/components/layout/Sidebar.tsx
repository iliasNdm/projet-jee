import { Link, useLocation } from "react-router-dom"
import { cn } from "../../lib/utils"
import {
    LayoutDashboard,
    Scissors,
    Settings,
    LogOut,
    Home,
    Calendar,
    User
} from "lucide-react"

const defaultNavigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Client Dashboard", href: "/client", icon: LayoutDashboard },
    { name: "Barber Dashboard", href: "/barber", icon: Scissors },
    { name: "Admin Dashboard", href: "/admin", icon: Settings },
]

const clientNavigation = [
    { name: "Dashboard", href: "/client", icon: LayoutDashboard },
    { name: "Appointments", href: "#appointments", icon: Calendar },
    { name: "Profile", href: "#profile", icon: User },
]

const barberNavigation = [
    { name: "Dashboard", href: "/barber", icon: LayoutDashboard },
    { name: "Schedule", href: "#schedule", icon: Calendar },
    { name: "Services", href: "#services", icon: Scissors },
    { name: "Profile", href: "#profile", icon: User },
]

const adminNavigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "#users", icon: User },
    { name: "Barbers", href: "#barbers", icon: Scissors },
    { name: "Reports", href: "#reports", icon: Calendar },
    { name: "Settings", href: "#settings", icon: Settings },
]

export function Sidebar() {
    const location = useLocation()
    const pathname = location.pathname

    let navigation = defaultNavigation
    if (pathname.startsWith("/client")) {
        navigation = clientNavigation
    } else if (pathname.startsWith("/barber")) {
        navigation = barberNavigation
    } else if (pathname.startsWith("/admin")) {
        navigation = adminNavigation
    }

    return (
        <div className="flex h-full w-64 flex-col border-r border-slate-800 bg-slate-900 shadow-xl">
            <div className="flex h-16 items-center border-b border-slate-800 px-6 bg-slate-950">
                <Scissors className="mr-2 h-6 w-6 text-barber-gold" />
                <span className="text-lg font-bold text-white tracking-tight">BarberShop</span>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1 px-3">
                    {navigation.map((item) => {
                        // Simple active check
                        const isActive = pathname === item.href

                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={cn(
                                    "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-barber-gold text-slate-900 shadow-md font-semibold"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                )}
                            >
                                <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-slate-900" : "text-slate-500 group-hover:text-white")} />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>
            </div>

            <div className="border-t border-slate-800 p-4 bg-slate-950">
                <Link
                    to="/login"
                    className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors"
                >
                    <LogOut className="mr-3 h-5 w-5" />
                    Sign Out
                </Link>
            </div>
        </div>
    )
}
