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
    Scissors,
    CheckCircle2,
    Clock,
    DollarSign,
    Star,
    MoreHorizontal
} from "lucide-react"
import { Badge } from "../../components/ui/badge"
import { Modal } from "../../components/ui/modal"
import { mockApi } from "../../mock/mockApi"
import type { BarberDashboardData } from "../../mock/mockApi"
import type { Appointment, AppointmentStatus, Service } from "../../mock/data"
import { formatCurrency, formatDateTime, getStatusBadgeClass } from "../../lib/utils"

export default function BarberDashboard() {
    const [data, setData] = useState<BarberDashboardData | null>(null)
    const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([])
    const [pendingRequests, setPendingRequests] = useState<Appointment[]>([])
    const [services, setServices] = useState<Service[]>([])

    const [isLoading, setIsLoading] = useState(true)
    const [processingId, setProcessingId] = useState<string | null>(null)

    // Modals
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
    const [showServicesModal, setShowServicesModal] = useState(false)
    const [showProfile, setShowProfile] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState<{ title: string, message: string } | null>(null)

    const fetchData = async () => {
        try {
            // Assume logged in as 'b1' (Michael Chang)
            const barberId = 'b1';

            const [dashboardData, allAppointments, servicesList] = await Promise.all([
                mockApi.getBarberDashboard(),
                mockApi.listAppointmentsByRole('barber', barberId),
                mockApi.getServices()
            ])

            setData(dashboardData)
            setServices(servicesList)

            // Filter appointments manually for better control
            // const today = new Date().toISOString().split('T')[0]; // Unused for now
            const pending = allAppointments.filter(a => a.status === 'pending');
            // For demo purposes, let's say "Today" matches some dates in our mock data or just show all confirmed/completed
            // Since mock data dates are dynamic ("FutureDate"), we'll just take any that are NOT pending for the schedule
            const schedule = allAppointments.filter(a => a.status !== 'pending' && a.status !== 'cancelled').sort((a, b) => a.time.localeCompare(b.time));

            setPendingRequests(pending)
            setTodayAppointments(schedule)

        } catch (error) {
            console.error("Failed to load dashboard data", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()

        const handleHashChange = () => {
            if (window.location.hash === '#profile') {
                setShowProfile(true)
                window.history.replaceState(null, '', window.location.pathname)
            } else if (window.location.hash === '#services') {
                setShowServicesModal(true)
                window.history.replaceState(null, '', window.location.pathname)
            } else if (window.location.hash === '#schedule') {
                document.getElementById('schedule-section')?.scrollIntoView({ behavior: 'smooth' })
            }
        }

        window.addEventListener('hashchange', handleHashChange)
        handleHashChange()
        return () => window.removeEventListener('hashchange', handleHashChange)
    }, [])

    const handleStatusUpdate = async (id: string, status: AppointmentStatus) => {
        setProcessingId(id)
        try {
            await mockApi.updateAppointmentStatus(id, status)

            // Refresh local state without full reload
            setPendingRequests(prev => prev.filter(a => a.id !== id))
            const updatedApt = pendingRequests.find(a => a.id === id)

            if (updatedApt && status === 'confirmed') {
                setTodayAppointments(prev => [...prev, { ...updatedApt, status }].sort((a, b) => a.time.localeCompare(b.time)))
                setShowSuccessModal({
                    title: "Appointment Confirmed",
                    message: `Booking for ${updatedApt.clientName} has been confirmed.`
                })
            } else if (updatedApt && status === 'cancelled') {
                setShowSuccessModal({
                    title: "Request Declined",
                    message: `Booking for ${updatedApt.clientName} has been declined.`
                })
            }
        } catch (error) {
            console.error("Failed to update status", error)
        } finally {
            setProcessingId(null)
        }
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
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Barber Dashboard</h2>
                    <p className="text-slate-500">Manage your schedule and requests.</p>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => setShowServicesModal(true)}>
                        <Scissors className="mr-2 h-4 w-4" />
                        Manage Services
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
                        <CalendarIcon className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{todayAppointments.length}</div>
                        <p className="text-xs text-slate-500">Scheduled for today</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                        <Clock className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-barber-gold">{pendingRequests.length}</div>
                        <p className="text-xs text-slate-500">Action required</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(data?.totalEarningsToday || 0)}</div>
                        <p className="text-xs text-slate-500">Earned today</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Rating</CardTitle>
                        <Star className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.rating}</div>
                        <p className="text-xs text-slate-500">Average client rating</p>
                    </CardContent>
                </Card>
            </div>

            {/* Pending Requests Section */}
            {pendingRequests.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Pending Requests</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pendingRequests.map(req => (
                            <div key={req.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="font-semibold text-slate-900 text-lg">{req.clientName}</h4>
                                        <p className="text-sm text-slate-500 font-medium">{req.serviceName}</p>
                                    </div>
                                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 px-2 py-0.5">New Request</Badge>
                                </div>
                                <div className="flex items-center text-sm text-slate-600 mb-6 space-x-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    <div className="flex items-center font-medium">
                                        <CalendarIcon className="mr-2 h-4 w-4 text-barber-gold" />
                                        {formatDateTime(req.date)}
                                    </div>
                                    <div className="h-4 w-px bg-slate-200"></div>
                                    <div className="flex items-center font-medium">
                                        <Clock className="mr-2 h-4 w-4 text-barber-gold" />
                                        {req.time}
                                    </div>
                                </div>
                                <div className="flex space-x-3">
                                    <Button
                                        className="flex-1 bg-green-600 hover:bg-green-700 shadow-sm text-white font-semibold"
                                        size="sm"
                                        onClick={() => handleStatusUpdate(req.id, 'confirmed')}
                                        disabled={!!processingId}
                                    >
                                        {processingId === req.id ? '...' : 'Confirm'}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300 bg-white"
                                        size="sm"
                                        onClick={() => handleStatusUpdate(req.id, 'cancelled')}
                                        disabled={!!processingId}
                                    >
                                        Decline
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Today's Schedule Table */}
            <div id="schedule-section" className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">Today's Schedule</h3>
                    <p className="text-sm text-slate-500">Your upcoming appointments.</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50 border-b border-slate-100">
                                <TableHead className="py-4 pl-6 font-semibold text-slate-900">Time</TableHead>
                                <TableHead className="py-4 font-semibold text-slate-900">Client</TableHead>
                                <TableHead className="py-4 font-semibold text-slate-900">Service</TableHead>
                                <TableHead className="py-4 font-semibold text-slate-900">Price</TableHead>
                                <TableHead className="py-4 font-semibold text-slate-900">Status</TableHead>
                                <TableHead className="py-4 pr-6 text-right font-semibold text-slate-900">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {todayAppointments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24 text-slate-500">
                                        No upcoming appointments.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                todayAppointments.map((apt) => (
                                    <TableRow key={apt.id} className="hover:bg-slate-50/80 transition-colors border-b border-slate-50 last:border-0 border-slate-100">
                                        <TableCell className="py-4 pl-6 font-medium text-slate-900">
                                            <div className="flex items-center">
                                                <Clock className="mr-2 h-4 w-4 text-barber-gold" />
                                                {apt.time}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 font-medium text-slate-700">{apt.clientName}</TableCell>
                                        <TableCell className="py-4 text-slate-500">{apt.serviceName}</TableCell>
                                        <TableCell className="py-4 font-medium text-slate-900">{formatCurrency(apt.price)}</TableCell>
                                        <TableCell className="py-4">
                                            <Badge className={getStatusBadgeClass(apt.status) + " px-2 py-1"}>
                                                {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-4 pr-6 text-right">
                                            <Button variant="ghost" size="icon" onClick={() => setSelectedAppointment(apt)} className="text-slate-400 hover:text-barber-gold hover:bg-barber-gold/10">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Appointment Details Modal */}
            <Modal isOpen={!!selectedAppointment} onClose={() => setSelectedAppointment(null)} title="Appointment Details">
                {selectedAppointment && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                                    {selectedAppointment.clientName.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900">{selectedAppointment.clientName}</p>
                                    <p className="text-sm text-slate-500">Valued Client</p>
                                </div>
                            </div>
                            <Badge className={getStatusBadgeClass(selectedAppointment.status)}>
                                {selectedAppointment.status.toUpperCase()}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <span className="text-xs text-slate-500 uppercase tracking-wider">Service</span>
                                <p className="font-medium text-slate-900">{selectedAppointment.serviceName}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs text-slate-500 uppercase tracking-wider">Price</span>
                                <p className="font-medium text-slate-900">{formatCurrency(selectedAppointment.price)}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs text-slate-500 uppercase tracking-wider">Date</span>
                                <p className="font-medium text-slate-900">{formatDateTime(selectedAppointment.date)}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs text-slate-500 uppercase tracking-wider">Time</span>
                                <p className="font-medium text-slate-900">{selectedAppointment.time}</p>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button variant="outline" onClick={() => setSelectedAppointment(null)}>Close</Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Services Modal */}
            <Modal isOpen={showServicesModal} onClose={() => setShowServicesModal(false)} title="Manage Services">
                <div className="space-y-4">
                    <p className="text-sm text-slate-500">These are the services you currently offer.</p>
                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                        {services.map(s => (
                            <div key={s.id} className="flex items-center justify-between p-3 border rounded-lg bg-slate-50">
                                <div>
                                    <p className="font-medium text-slate-900">{s.name}</p>
                                    <p className="text-xs text-slate-500">{s.duration} mins • {formatCurrency(s.price)}</p>
                                </div>
                                <Button variant="ghost" size="sm">Edit</Button>
                            </div>
                        ))}
                    </div>
                    <Button className="w-full">Add New Service</Button>
                </div>
            </Modal>

            {/* Profile Modal */}
            <Modal isOpen={showProfile} onClose={() => setShowProfile(false)} title="Barber Profile">
                <div className="flex flex-col items-center space-y-4">
                    <div className="h-24 w-24 rounded-full bg-slate-200 overflow-hidden ring-4 ring-white shadow-lg">
                        <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200" alt="Michael" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-slate-900">Michael Chang</h3>
                        <p className="text-slate-500">Master Barber • 10 Years Exp</p>
                        <div className="flex justify-center mt-2">
                            {[1, 2, 3, 4, 5].map(i => (
                                <Star key={i} className="h-4 w-4 text-barber-gold fill-barber-gold" />
                            ))}
                            <span className="ml-2 text-sm font-medium">4.9</span>
                        </div>
                    </div>
                    <div className="w-full pt-4 border-t">
                        <Button className="w-full" variant="outline">Edit Profile Settings</Button>
                    </div>
                </div>
            </Modal>

            {/* Success/Notification Modal */}
            <Modal isOpen={!!showSuccessModal} onClose={() => setShowSuccessModal(null)} title={showSuccessModal?.title || ""}>
                <div className="flex flex-col items-center py-4 text-center">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-slate-600 mb-6">{showSuccessModal?.message}</p>
                    <Button onClick={() => setShowSuccessModal(null)} className="w-full">
                        Okay
                    </Button>
                </div>
            </Modal>
        </div>
    )
}
