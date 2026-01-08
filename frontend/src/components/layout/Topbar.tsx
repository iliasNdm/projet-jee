import { Bell, Search, User, LogOut } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { demoAuth } from "../../mock/demoAuth"
import type { UserRole } from "../../mock/demoAuth"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Badge } from "../ui/badge"

export function Topbar() {
    const navigate = useNavigate()
    const [role, setRole] = useState<UserRole>('client')
    const [name, setName] = useState('')
    const [showDropdown, setShowDropdown] = useState(false)

    useEffect(() => {
        const updateAuth = () => {
            setRole(demoAuth.getRole())
            setName(demoAuth.getUserName())
        }

        updateAuth()
        window.addEventListener('auth-change', updateAuth)
        return () => window.removeEventListener('auth-change', updateAuth)
    }, [])

    const handleLogout = () => {
        demoAuth.logout()
        navigate('/login')
    }

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-sm shadow-sm">
            <div className="flex w-full max-w-sm items-center space-x-2">
                <Search className="h-5 w-5 text-barber-gold" />
                <Input
                    placeholder="Search..."
                    className="h-9 w-64 border-0 bg-slate-50 focus-visible:ring-1 focus-visible:ring-barber-gold"
                />
            </div>

            <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-barber-gold transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                </Button>

                <div className="relative">
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center space-x-3 border-l pl-4 focus:outline-none"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-barber-gold shadow-sm">
                            <User className="h-5 w-5 text-barber-black" />
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="text-sm font-medium text-slate-900">{name}</p>
                            <div className="flex items-center space-x-1">
                                <span className="text-xs text-slate-500 capitalize">{role}</span>
                                {role === 'admin' && <Badge variant="default" className="h-3 px-1 text-[10px]">ADMIN</Badge>}
                            </div>
                        </div>
                    </button>

                    {showDropdown && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setShowDropdown(false)}
                            />
                            <div className="absolute right-0 top-full z-20 mt-2 w-48 rounded-md border border-slate-200 bg-white shadow-lg py-1 animate-in fade-in zoom-in-95 duration-200">
                                <div className="px-4 py-2 border-b border-slate-100">
                                    <p className="text-sm font-medium text-slate-900">My Account</p>
                                    <p className="text-xs text-slate-500 truncate">{name}</p>
                                </div>
                                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center">
                                    <User className="mr-2 h-4 w-4" />
                                    Profile
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Sign out
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}
