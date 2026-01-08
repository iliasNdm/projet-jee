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
import { Tabs } from "../../components/ui/tabs"
import {
    Calendar as CalendarIcon,
    Scissors,
    User,
    DollarSign,
    Search,
    TrendingUp,
    Download
} from "lucide-react"
import { Badge } from "../../components/ui/badge"
import { Modal } from "../../components/ui/modal"
import { Input } from "../../components/ui/input"
import { mockApi } from "../../mock/mockApi"
import type { AdminDashboardData } from "../../mock/mockApi"
import type { Appointment, Barber, User as UserType } from "../../mock/data"
import { formatCurrency, formatDateTime, getStatusBadgeClass } from "../../lib/utils"

export default function AdminDashboard() {
    const [data, setData] = useState<AdminDashboardData | null>(null)
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [barbers, setBarbers] = useState<Barber[]>([])
    // Mock user list - effectively barbers + clients for demo
    const [users, setUsers] = useState<UserType[]>([])

    const [isLoading, setIsLoading] = useState(true)

    // UI States
    const [searchTerm, setSearchTerm] = useState("")
    const [showReportsModal, setShowReportsModal] = useState(false)
    const [showSettingsModal, setShowSettingsModal] = useState(false)
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

    useEffect(() => {
        const loadData = async () => {
            try {
                const [dashboardData, allApts, barbersList] = await Promise.all([
                    mockApi.getAdminDashboard(),
                    mockApi.listAppointmentsByRole('admin'),
                    mockApi.getBarbers()
                ])

                setData(dashboardData)
                setAppointments(allApts)
                setBarbers(barbersList)

                // create a mock list of users from the appointments clients + barbers
                const mockClients: UserType[] = [
                    { id: 'u1', name: 'Alex Johnson', email: 'alex@example.com', role: 'client' },
                    { id: 'u2', name: 'Sarah Connor', email: 'sarah@example.com', role: 'client' },
                    { id: 'u3', name: 'Tom Hardy', email: 'tom@example.com', role: 'client' },
                ];
                setUsers([...mockClients, ...barbersList])

            } catch (error) {
                console.error("Failed to load admin data", error)
            } finally {
                setIsLoading(false)
            }
        }
        loadData()

        const handleHashChange = () => {
            if (window.location.hash === '#reports') {
                setShowReportsModal(true)
                window.history.replaceState(null, '', window.location.pathname)
            } else if (window.location.hash === '#settings') {
                setShowSettingsModal(true)
                window.history.replaceState(null, '', window.location.pathname)
            }
        }
        window.addEventListener('hashchange', handleHashChange)
        return () => window.removeEventListener('hashchange', handleHashChange)
    }, [])

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const filteredBarbers = barbers.filter(b =>
        b.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const filteredAppointments = appointments.filter(a =>
        a.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.barberName.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-barber-gold border-t-transparent"></div>
            </div>
        )
    }

    const UsersTable = (
        <div className="space-y-4">
            <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-slate-500" />
                <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
            </div>
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50 border-b border-slate-100">
                            <TableHead className="py-4 pl-6 font-semibold text-slate-900">Name</TableHead>
                            <TableHead className="py-4 font-semibold text-slate-900">Email</TableHead>
                            <TableHead className="py-4 font-semibold text-slate-900">Role</TableHead>
                            <TableHead className="py-4 pr-6 text-right font-semibold text-slate-900">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.map(user => (
                            <TableRow key={user.id} className="hover:bg-slate-50/80 transition-colors border-b border-slate-50 last:border-0">
                                <TableCell className="py-4 pl-6 font-medium text-slate-900">
                                    <div className="flex items-center space-x-3">
                                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                                            {user.name.charAt(0)}
                                        </div>
                                        <span>{user.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4 text-slate-600">{user.email}</TableCell>
                                <TableCell className="py-4">
                                    <Badge variant={user.role === 'admin' ? 'default' : user.role === 'barber' ? 'secondary' : 'outline'} className="capitalize">
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-4 pr-6 text-right">
                                    <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900">Edit</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )

    const BarbersTable = (
        <div className="space-y-4">
            <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-slate-500" />
                <Input
                    placeholder="Search barbers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
            </div>
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50 border-b border-slate-100">
                            <TableHead className="py-4 pl-6 font-semibold text-slate-900">Name</TableHead>
                            <TableHead className="py-4 font-semibold text-slate-900">Rating</TableHead>
                            <TableHead className="py-4 font-semibold text-slate-900">Status</TableHead>
                            <TableHead className="py-4 pr-6 text-right font-semibold text-slate-900">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredBarbers.map(barber => (
                            <TableRow key={barber.id} className="hover:bg-slate-50/80 transition-colors border-b border-slate-50 last:border-0">
                                <TableCell className="py-4 pl-6 font-medium text-slate-900">
                                    <div className="flex items-center space-x-3">
                                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                                            {barber.name.charAt(0)}
                                        </div>
                                        <span>{barber.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">{barber.rating} / 5.0</TableCell>
                                <TableCell className="py-4">
                                    <Badge className={barber.isAvailable ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-red-100 text-red-700 hover:bg-red-100"}>
                                        {barber.isAvailable ? "Available" : "Unavailable"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-4 pr-6 text-right">
                                    <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900">Manage</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )

    const AppointmentsTable = (
        <div className="space-y-4">
            <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-slate-500" />
                <Input
                    placeholder="Search appointments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
            </div>
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50 border-b border-slate-100">
                            <TableHead className="py-4 pl-6 font-semibold text-slate-900">Date</TableHead>
                            <TableHead className="py-4 font-semibold text-slate-900">Client</TableHead>
                            <TableHead className="py-4 font-semibold text-slate-900">Barber</TableHead>
                            <TableHead className="py-4 font-semibold text-slate-900">Service</TableHead>
                            <TableHead className="py-4 font-semibold text-slate-900">Price</TableHead>
                            <TableHead className="py-4 font-semibold text-slate-900">Status</TableHead>
                            <TableHead className="py-4 pr-6 text-right font-semibold text-slate-900">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAppointments.map(apt => (
                            <TableRow key={apt.id} className="hover:bg-slate-50/80 transition-colors border-b border-slate-50 last:border-0">
                                <TableCell className="py-4 pl-6 font-medium text-slate-900">
                                    <div className="flex flex-col">
                                        <span>{formatDateTime(apt.date).split(',')[0]}</span>
                                        <span className="text-xs text-slate-500">{apt.time}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4 md:whitespace-nowrap">{apt.clientName}</TableCell>
                                <TableCell className="py-4 md:whitespace-nowrap">{apt.barberName}</TableCell>
                                <TableCell className="py-4 md:whitespace-nowrap">{apt.serviceName}</TableCell>
                                <TableCell className="py-4 font-medium text-slate-900">{formatCurrency(apt.price)}</TableCell>
                                <TableCell className="py-4">
                                    <Badge className={getStatusBadgeClass(apt.status) + " px-2 py-1 capitalize"}>
                                        {apt.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-4 pr-6 text-right">
                                    <Button variant="ghost" size="sm" onClick={() => setSelectedAppointment(apt)} className="text-slate-500 hover:text-slate-900">View</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Admin Dashboard</h2>
                <p className="text-slate-500">Platform overview and management.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(data?.totalRevenue || 0)}</div>
                        <p className="text-xs text-slate-500">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bookings</CardTitle>
                        <CalendarIcon className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.totalBookings}</div>
                        <p className="text-xs text-slate-500">+180 this month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Barbers</CardTitle>
                        <Scissors className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.activeBarbers}</div>
                        <p className="text-xs text-slate-500">Currently available</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <User className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{users.length}</div>
                        <p className="text-xs text-slate-500">Active accounts</p>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs
                tabs={[
                    { id: 'users', label: 'Users', content: UsersTable },
                    { id: 'barbers', label: 'Barbers', content: BarbersTable },
                    { id: 'appointments', label: 'Appointments', content: AppointmentsTable },
                ]}
            />

            {/* Reports Modal */}
            <Modal isOpen={showReportsModal} onClose={() => setShowReportsModal(false)} title="Platform Reports">
                <div className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-lg flex items-center justify-between">
                        <div className="flex items-center">
                            <TrendingUp className="h-5 w-5 text-green-600 mr-3" />
                            <div>
                                <p className="font-medium">Monthly Revenue Report</p>
                                <p className="text-xs text-slate-500">Generated on Jan 08, 2026</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" /> Download
                        </Button>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg flex items-center justify-between">
                        <div className="flex items-center">
                            <User className="h-5 w-5 text-blue-600 mr-3" />
                            <div>
                                <p className="font-medium">User Growth Statistics</p>
                                <p className="text-xs text-slate-500">Generated on Jan 01, 2026</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" /> Download
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Settings Modal */}
            <Modal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} title="Platform Settings">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Platform Name</label>
                        <Input defaultValue="Gentleman's Cut" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Support Email</label>
                        <Input defaultValue="support@gentlemanscut.com" />
                    </div>
                    <div className="pt-2">
                        <Button className="w-full">Save Changes</Button>
                    </div>
                </div>
            </Modal>

            {/* Appointment Detail Modal just for Admin view */}
            <Modal isOpen={!!selectedAppointment} onClose={() => setSelectedAppointment(null)} title="Appointment Details">
                {selectedAppointment && (
                    <div className="space-y-4">
                        <p><strong>ID:</strong> {selectedAppointment.id}</p>
                        <p><strong>Client:</strong> {selectedAppointment.clientName}</p>
                        <p><strong>Barber:</strong> {selectedAppointment.barberName}</p>
                        <p><strong>Service:</strong> {selectedAppointment.serviceName}</p>
                        <p><strong>Date:</strong> {formatDateTime(selectedAppointment.date, selectedAppointment.time)}</p>
                        <p><strong>Status:</strong> {selectedAppointment.status}</p>
                        <Button variant="outline" onClick={() => setSelectedAppointment(null)}>Close</Button>
                    </div>
                )}
            </Modal>
        </div>
    )
}
