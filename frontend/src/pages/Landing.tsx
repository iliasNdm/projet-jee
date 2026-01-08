import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import {
    Scissors,
    Calendar,
    ShieldCheck,
    Bell,
    CreditCard,
    BarChart3
} from "lucide-react"

export default function Landing() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-slate-900 px-6 py-24 sm:py-32 lg:px-8">
                <div className="absolute inset-0 -z-10 h-full w-full object-cover opacity-20 bg-[url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80')] bg-cover bg-center" />
                <div className="mx-auto max-w-2xl text-center">
                    <div className="flex justify-center mb-6">
                        <div className="rounded-full bg-barber-gold/20 p-3">
                            <Scissors className="h-10 w-10 text-barber-gold" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                        Streamline Your Style
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-slate-300">
                        The ultimate platform for modern barbershops. Manage appointments, clients, and payments effortlessly.
                        Experience the art of grooming with technology that works for you.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Button size="lg" className="text-lg bg-barber-gold text-slate-900 hover:bg-barber-gold/90 h-12 px-8" asChild>
                            <Link to="/login">Login</Link>
                        </Button>
                        <Button variant="outline" size="lg" className="text-lg text-white hover:text-slate-900 hover:bg-white h-12 px-8" asChild>
                            <Link to="/signup">Sign up</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Everything you need to run your shop
                    </h2>
                    <p className="mt-4 text-lg text-slate-600">
                        Powerful features designed for both barbers and clients.
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    <FeatureCard
                        icon={Calendar}
                        title="Smart Booking"
                        description="Effortless appointment scheduling with real-time availability."
                    />
                    <FeatureCard
                        icon={Scissors}
                        title="Barber Management"
                        description="Manage profiles, schedules, and services for your entire team."
                    />
                    <FeatureCard
                        icon={BarChart3}
                        title="Admin Insights"
                        description="Track revenue, client retention, and business growth."
                    />
                    <FeatureCard
                        icon={Bell}
                        title="Notifications"
                        description="Automated reminders for upcoming appointments."
                    />
                    <FeatureCard
                        icon={CreditCard}
                        title="Seamless Payments"
                        description="Secure and fast payment processing for all services."
                    />
                    <FeatureCard
                        icon={ShieldCheck}
                        title="Secure Platform"
                        description="Your data is protected with enterprise-grade security."
                    />
                </div>
            </section>

            {/* How It Works Section */}
            <section className="bg-slate-100 py-20">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            How it works
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                        <Step
                            number="1"
                            title="Create an Account"
                            description="Sign up as a client or a barber to get started with our platform."
                        />
                        <Step
                            number="2"
                            title="Book or Manage"
                            description="Clients book appointments; barbers manage their schedule and queue."
                        />
                        <Step
                            number="3"
                            title="Show Up & Style"
                            description="Enjoy the premium service. We handle the reminders and payments."
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 py-12 mt-auto">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center space-x-2 mb-4 md:mb-0">
                        <Scissors className="h-6 w-6 text-barber-gold" />
                        <span className="text-lg font-bold text-white">Gentleman's Cut</span>
                    </div>
                    <div className="flex space-x-6 text-slate-400">
                        <Link to="#" className="hover:text-white transition-colors">Privacy</Link>
                        <Link to="#" className="hover:text-white transition-colors">Terms</Link>
                        <Link to="#" className="hover:text-white transition-colors">Contact</Link>
                    </div>
                    <p className="text-sm text-slate-500 mt-4 md:mt-0">
                        © 2024 Gentleman's Cut. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
    return (
        <div className="flex flex-col items-start p-6 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="p-3 bg-barber-gold/10 rounded-lg mb-4">
                <Icon className="h-6 w-6 text-barber-gold" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-slate-900">{title}</h3>
            <p className="text-slate-600">{description}</p>
        </div>
    )
}

function Step({ number, title, description }: { number: string, title: string, description: string }) {
    return (
        <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-900 text-barber-gold font-bold text-xl mb-6 shadow-lg">
                {number}
            </div>
            <h3 className="text-xl font-semibold mb-3 text-slate-900">{title}</h3>
            <p className="text-slate-600 max-w-xs">{description}</p>
        </div>
    )
}
