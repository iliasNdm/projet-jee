import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { AlertCircle } from "lucide-react"

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 text-center p-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 mb-6">
                <AlertCircle className="h-10 w-10 text-red-600" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">404</h1>
            <p className="mt-4 text-lg text-slate-600">Page not found</p>
            <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
                Sorry, we couldn’t find the page you’re looking for. It might have been moved or doesn't exist.
            </p>
            <div className="mt-10">
                <Button asChild>
                    <Link to="/">Go back home</Link>
                </Button>
            </div>
        </div>
    )
}
