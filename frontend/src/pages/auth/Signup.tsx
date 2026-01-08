import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Link, useNavigate } from "react-router-dom"
import { Modal } from "../../components/ui/modal"
import { CheckCircle2, User, Scissors } from "lucide-react"

export default function Signup() {
    const navigate = useNavigate()
    const [role, setRole] = useState<"client" | "barber">("client")
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
            setShowSuccessModal(true)
        }, 1200)
    }

    const handleModalClose = () => {
        setShowSuccessModal(false)
        navigate("/login")
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
                <p className="text-sm text-slate-500">
                    Enter your details below to create your account
                </p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <Input label="First Name" placeholder="John" required />
                    <Input label="Last Name" placeholder="Doe" required />
                </div>
                <Input label="Email" placeholder="m@example.com" type="email" required />

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        I am a...
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        <div
                            className={`flex cursor-pointer items-center justify-center rounded-md border p-3 hover:bg-slate-50 ${role === "client" ? "border-barber-gold bg-barber-gold/5 ring-1 ring-barber-gold" : "border-slate-200"}`}
                            onClick={() => setRole("client")}
                        >
                            <User className={`mr-2 h-4 w-4 ${role === "client" ? "text-barber-gold" : "text-slate-500"}`} />
                            <span className={`text-sm font-medium ${role === "client" ? "text-barber-black" : "text-slate-600"}`}>Client</span>
                        </div>
                        <div
                            className={`flex cursor-pointer items-center justify-center rounded-md border p-3 hover:bg-slate-50 ${role === "barber" ? "border-barber-gold bg-barber-gold/5 ring-1 ring-barber-gold" : "border-slate-200"}`}
                            onClick={() => setRole("barber")}
                        >
                            <Scissors className={`mr-2 h-4 w-4 ${role === "barber" ? "text-barber-gold" : "text-slate-500"}`} />
                            <span className={`text-sm font-medium ${role === "barber" ? "text-barber-black" : "text-slate-600"}`}>Barber</span>
                        </div>
                    </div>
                </div>

                <Input label="Password" type="password" required />
                <Input label="Confirm Password" type="password" required />

                <Button className="w-full" type="submit" isLoading={isLoading}>
                    Create Account
                </Button>
            </form>

            <div className="text-center text-sm">
                <span className="text-slate-500">Already have an account? </span>
                <Link to="/login" className="font-semibold text-barber-gold hover:underline">
                    Sign in
                </Link>
            </div>

            <Modal
                isOpen={showSuccessModal}
                onClose={handleModalClose}
                title="Account Created"
                className="max-w-sm text-center"
            >
                <div className="flex flex-col items-center py-4">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-slate-600 mb-6">
                        Your account has been successfully created. You can now sign in to start booking.
                    </p>
                    <Button onClick={handleModalClose} className="w-full">
                        Go to Login
                    </Button>
                </div>
            </Modal>
        </div>
    )
}
