import Login from "@/pages/Login/Login";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Dashboard from "@/pages/Dashboard/Dashboard";
import AuthGuard from "@/components/auth/AuthGuard";
import MainLayout from "@/components/layout/MainLayout";
import Config from "@/pages/Config/Config";
import Unauthorized from "@/pages/Unauthorized/Unauthorized";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/login" replace />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/unauthorized",
        element: <Unauthorized />
    },
    {
        path: "/",
        element: <AuthGuard />,
        children: [
            {
                element: <MainLayout />,
                children: [
                    {
                        path: "dashboard",
                        element: <Dashboard />
                    },
                    {
                        element: <AuthGuard requiredFeature="/xnk" />,
                        children: [
                            {
                                path: "config",
                                element: <Config />
                            },
                        ]
                    },
                    {
                        element: <AuthGuard requiredFeature="/otk" />,
                        children: [
                            {
                                path: "otk",
                                element: <div>Trang chính OTK</div>
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        path: "*",
        element: <Navigate to="/dashboard" replace />
    }
]);