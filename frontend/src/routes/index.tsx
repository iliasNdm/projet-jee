import { createBrowserRouter } from "react-router-dom"
import { AuthLayout } from "../components/layout/AuthLayout"
import { DashboardLayout } from "../components/layout/DashboardLayout"
import LandingPage from "../pages/Landing"
import Login from "../pages/auth/Login"
import Signup from "../pages/auth/Signup"
import ClientDashboard from "../pages/dashboard/ClientDashboard"
import BarberDashboard from "../pages/dashboard/BarberDashboard"
import AdminDashboard from "../pages/admin/AdminDashboard"
import NotFound from "../pages/NotFound"

export const router = createBrowserRouter([
    {
        path: "/",
        element: <AuthLayout />,
        children: [
            {
                index: true,
                element: <LandingPage />,
            },
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "signup",
                element: <Signup />,
            },
        ],
    },
    {
        path: "/",
        element: <DashboardLayout />,
        children: [
            {
                path: "client",
                element: <ClientDashboard />,
            },
            {
                path: "barber",
                element: <BarberDashboard />,
            },
            {
                path: "admin",
                element: <AdminDashboard />,
            },
        ],
    },
    {
        path: "*",
        element: <NotFound />,
    },
])
