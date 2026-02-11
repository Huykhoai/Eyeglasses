import Login from "@/pages/Login/Login";
import MainLayout from "@/components/layout/MainLayout";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Dashboard from "@/pages/Dashboard/Dashboard";
import AuthGuard from "@/components/auth/AuthGuard";
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
        element: <AuthGuard />,
        children: [
            {
                path: "/",
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
                                path: "xnk",
                                element: <div>Trang chính Xuất Nhập Khẩu</div>
                            }
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