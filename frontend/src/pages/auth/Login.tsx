import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Link, useNavigate } from "react-router-dom"
import { Modal } from "../../components/ui/modal"
import { CheckCircle2, User, Scissors, Settings } from "lucide-react"
import { demoAuth } from "../../mock/demoAuth"

export default function Login() {
    const navigate = useNavigate()
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
            setShowSuccessModal(true)
            demoAuth.login('client') // Default login is client
            // Navigate after a short delay to let user see the modal
            setTimeout(() => {
                navigate("/client")
            }, 1500)
        }, 1000)
    }

    const handleDemoLogin = (role: string) => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            demoAuth.login(role as any)
            navigate(role === "client" ? "/client" : role === "barber" ? "/barber" : "/admin")
        }, 800)
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
                <p className="text-sm text-slate-500">
                    Enter your email to sign in to your account
                </p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
                <Input label="Email" placeholder="m@example.com" type="email" required />
                <Input label="Password" type="password" required />

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="remember"
                            className="h-4 w-4 rounded border-slate-300 text-barber-gold focus:ring-barber-gold"
                        />
                        <label htmlFor="remember" className="text-sm text-slate-500 cursor-pointer">Remember me</label>
                    </div>
                    <Link to="#" className="text-sm font-medium text-barber-gold hover:underline">
                        Forgot password?
                    </Link>
                </div>

                <Button className="w-full" type="submit" isLoading={isLoading}>
                    Sign In
                </Button>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-slate-50 px-2 text-slate-500">
                        Demo Accounts
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
                <Button
                    variant="outline"
                    className="w-full justify-start space-x-3"
                    onClick={() => handleDemoLogin("client")}
                    disabled={isLoading}
                >
                    <User className="h-4 w-4 text-slate-500" />
                    <span>Continue as Client</span>
                </Button>
                <Button
                    variant="outline"
                    className="w-full justify-start space-x-3"
                    onClick={() => handleDemoLogin("barber")}
                    disabled={isLoading}
                >
                    <Scissors className="h-4 w-4 text-slate-500" />
                    <span>Continue as Barber</span>
                </Button>
                <Button
                    variant="outline"
                    className="w-full justify-start space-x-3"
                    onClick={() => handleDemoLogin("admin")}
                    disabled={isLoading}
                >
                    <Settings className="h-4 w-4 text-slate-500" />
                    <span>Continue as Admin</span>
                </Button>
            </div>

            <div className="text-center text-sm">
                <span className="text-slate-500">Don't have an account? </span>
                <Link to="/signup" className="font-semibold text-barber-gold hover:underline">
                    Sign up
                </Link>
            </div>

            <Modal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title="Login Successful"
                className="max-w-sm text-center"
            >
                <div className="flex flex-col items-center py-4">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-slate-600 mb-4">Redirecting you to the dashboard...</p>
                </div>
            </Modal>
        </div>
    )
}
