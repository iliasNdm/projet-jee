import { Outlet, Link } from "react-router-dom"
import { Scissors } from "lucide-react"

export function AuthLayout() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="flex flex-col items-center text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-barber-gold">
                        <Scissors className="h-6 w-6 text-barber-black" />
                    </div>
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
                        Gentleman's Cut
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">
                        Premium Barber Services Management
                    </p>
                </div>

                <Outlet />

                <div className="text-center text-sm text-slate-500">
                    <Link to="/" className="font-medium text-barber-gold hover:text-barber-gold/80">
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
