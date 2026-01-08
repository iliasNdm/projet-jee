import { useEffect, useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../components/ui/table"
import {
    Calendar as CalendarIcon,
    Clock,
    Scissors,
    CreditCard,
    CheckCircle2,
    Calendar
} from "lucide-react"
import { Badge } from "../../components/ui/badge"
import { Modal } from "../../components/ui/modal"
import { Input } from "../../components/ui/input"
import { mockApi } from "../../mock/mockApi"
import type { ClientDashboardData, Barber } from "../../mock/mockApi"
import type { Appointment, Service } from "../../mock/data"
import { formatCurrency, formatDateTime, getStatusBadgeClass } from "../../lib/utils"

export default function ClientDashboard() {
    const [data, setData] = useState<ClientDashboardData | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Booking Form State
    const [services, setServices] = useState<Service[]>([])
    const [barbers, setBarbers] = useState<Barber[]>([])
    const [selectedService, setSelectedService] = useState("")
    const [selectedBarber, setSelectedBarber] = useState("")
    const [selectedDate, setSelectedDate] = useState("")
    const [selectedTime, setSelectedTime] = useState("")
    const [isBookingLoading, setIsBookingLoading] = useState(false)
    const [showBookingSuccess, setShowBookingSuccess] = useState(false)
    const [showBookingModal, setShowBookingModal] = useState(false)

    // Appointment Details State
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
    const [showProfile, setShowProfile] = useState(false)

    useEffect(() => {
        const loadData = async () => {
            try {
                const [dashboardData, servicesData, barbersData] = await Promise.all([
                    mockApi.getClientDashboard(),
                    mockApi.getServices(),
                    mockApi.getBarbers()
                ])
                setData(dashboardData)
                setServices(servicesData)
                setBarbers(barbersData)
            } catch (error) {
                console.error("Failed to load dashboard data", error)
            } finally {
                setIsLoading(false)
            }
        }

        loadData()

        // Handle strict hash navigation (from sidebar)
        const handleHashChange = () => {
            if (window.location.hash === '#profile') {
                setShowProfile(true)
                // Reset hash so it doesn't stick
                window.history.replaceState(null, '', window.location.pathname)
            } else if (window.location.hash === '#appointments') {
                document.getElementById('appointments-section')?.scrollIntoView({ behavior: 'smooth' })
            }
        }

        window.addEventListener('hashchange', handleHashChange)
        // Check initial hash
        handleHashChange()

        return () => window.removeEventListener('hashchange', handleHashChange)

    }, [])

    const handleBookingSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsBookingLoading(true)
        setTimeout(() => {
            setIsBookingLoading(false)
            setShowBookingSuccess(true)
            // Reset form
            setSelectedService("")
            setSelectedBarber("")
            setSelectedDate("")
            setSelectedTime("")
        }, 1000)
    }

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-barber-gold border-t-transparent"></div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Client Dashboard</h2>
                    <p className="text-slate-500">Welcome back, Alex!</p>
                </div>
                <Button
                    onClick={() => setShowBookingModal(true)}
                    className="bg-barber-gold text-barber-black hover:bg-barber-gold/90 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 font-semibold"
                >
                    Book Appointment
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
                        <CalendarIcon className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.upcomingAppointments.length}</div>
                        <p className="text-xs text-slate-500">Scheduled appointments</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Points</CardTitle>
                        <Scissors className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-barber-gold">{data?.loyaltyPoints}</div>
                        <p className="text-xs text-slate-500">{data?.memberStatus}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
                        <Clock className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.totalVisits}</div>
                        <p className="text-xs text-slate-500">Lifetime visits</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                        <CreditCard className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(450)}</div>
                        <p className="text-xs text-slate-500">Estimated value</p>
                    </CardContent>
                </Card>
            </div>

            {/* Booking Modal */}
            <Modal isOpen={showBookingModal} onClose={() => setShowBookingModal(false)} title="Book New Appointment">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    setShowBookingModal(false);
                    handleBookingSubmit(e);
                }} className="space-y-4 pt-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Service</label>
                        <select
                            className="flex h-10 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-barber-gold"
                            value={selectedService}
                            onChange={(e) => setSelectedService(e.target.value)}
                            required
                        >
                            <option value="">Select Service</option>
                            {services.map(s => (
                                <option key={s.id} value={s.id}>{s.name} ({formatCurrency(s.price)})</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Barber</label>
                        <select
                            className="flex h-10 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-barber-gold"
                            value={selectedBarber}
                            onChange={(e) => setSelectedBarber(e.target.value)}
                            required
                        >
                            <option value="">Select Barber</option>
                            {barbers.map(b => (
                                <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Date</label>
                            <input
                                type="date"
                                className="flex h-10 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-barber-gold"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Time</label>
                            <input
                                type="time"
                                className="flex h-10 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-barber-gold"
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button type="submit" disabled={isBookingLoading} className="w-full bg-barber-gold text-barber-black hover:bg-barber-gold/90">
                            {isBookingLoading ? 'Confirming...' : 'Confirm Booking'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Upcoming Appointments Table */}
            <div id="appointments-section" className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">Upcoming Appointments</h3>
                    <p className="text-sm text-slate-500">Manage your scheduled visits.</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50 border-b border-slate-100">
                                <TableHead className="py-4 pl-6 font-semibold text-slate-900">Date & Time</TableHead>
                                <TableHead className="py-4 font-semibold text-slate-900">Service</TableHead>
                                <TableHead className="py-4 font-semibold text-slate-900">Barber</TableHead>
                                <TableHead className="py-4 font-semibold text-slate-900">Price</TableHead>
                                <TableHead className="py-4 font-semibold text-slate-900">Status</TableHead>
                                <TableHead className="py-4 pr-6 text-right font-semibold text-slate-900">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data?.upcomingAppointments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24 text-slate-500">
                                        No upcoming appointments.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data?.upcomingAppointments.map((apt) => (
                                    <TableRow
                                        key={apt.id}
                                        onClick={() => setSelectedAppointment(apt)}
                                        className="cursor-pointer hover:bg-slate-50/80 transition-colors border-b border-slate-50 last:border-0"
                                    >
                                        <TableCell className="py-4 pl-6 font-medium text-slate-900">
                                            <div className="flex flex-col">
                                                <span>{formatDateTime(apt.date).split(',')[0]}</span>
                                                <span className="text-xs text-slate-500">{apt.time}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <span className="font-medium text-slate-700">{apt.serviceName}</span>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex items-center space-x-2">
                                                <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                                    {apt.barberName.charAt(0)}
                                                </div>
                                                <span className="text-slate-600">{apt.barberName}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 font-medium text-slate-900">{formatCurrency(apt.price)}</TableCell>
                                        <TableCell className="py-4">
                                            <Badge className={getStatusBadgeClass(apt.status) + " px-2 py-1"}>
                                                {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-4 pr-6 text-right">
                                            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedAppointment(apt); }} className="text-barber-gold hover:text-barber-black hover:bg-barber-gold/10">
                                                Details
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Success Modal */}
            <Modal isOpen={showBookingSuccess} onClose={() => setShowBookingSuccess(false)} title="Booking Confirmed">
                <div className="flex flex-col items-center py-6 text-center">
                    <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">You're all set!</h3>
                    <p className="text-slate-600 mb-6">
                        Your appointment has been successfully booked. A confirmation email has been sent to you.
                    </p>
                    <Button onClick={() => setShowBookingSuccess(false)} className="w-full">
                        View Appointments
                    </Button>
                </div>
            </Modal>

            {/* Appointment Details Modal */}
            <Modal isOpen={!!selectedAppointment} onClose={() => setSelectedAppointment(null)} title="Appointment Details">
                {selectedAppointment && (
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
                            <div className="h-12 w-12 rounded-full bg-barber-gold/20 flex items-center justify-center">
                                <Calendar className="h-6 w-6 text-barber-gold" />
                            </div>
                            <div>
                                <p className="font-semibold text-lg">{selectedAppointment.serviceName}</p>
                                <p className="text-slate-500">{formatDateTime(selectedAppointment.date, selectedAppointment.time)}</p>
                            </div>
                        </div>

                        <div className="space-y-4 border-t pt-4">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Barber</span>
                                <span className="font-medium">{selectedAppointment.barberName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Duration</span>
                                <span className="font-medium">45 mins</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Price</span>
                                <span className="font-medium">{formatCurrency(selectedAppointment.price)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500">Status</span>
                                <Badge className={getStatusBadgeClass(selectedAppointment.status)}>
                                    {selectedAppointment.status.toUpperCase()}
                                </Badge>
                            </div>
                        </div>

                        <div className="flex space-x-3 pt-4">
                            <Button variant="outline" className="flex-1" onClick={() => setSelectedAppointment(null)}>Close</Button>
                            {selectedAppointment.status !== 'cancelled' && (
                                <Button variant="destructive" className="flex-1">Cancel Appointment</Button>
                            )}
                        </div>
                    </div>
                )}
            </Modal>

            {/* Profile Modal */}
            <Modal isOpen={showProfile} onClose={() => setShowProfile(false)} title="My Profile">
                <div className="space-y-6">
                    <div className="flex flex-col items-center">
                        <div className="h-20 w-20 rounded-full bg-slate-200 mb-4 overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200" alt="Profile" className="h-full w-full object-cover" />
                        </div>
                        <h3 className="text-xl font-bold">Alex Johnson</h3>
                        <p className="text-slate-500">Gold Member</p>
                    </div>

                    <div className="space-y-4">
                        <Input label="Email" value="alex@example.com" readOnly />
                        <Input label="Phone" value="+1 (555) 123-4567" readOnly />
                        <Button className="w-full">Edit Profile</Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
