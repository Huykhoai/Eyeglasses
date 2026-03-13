import Login from "@/pages/Login/Login";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Dashboard from "@/pages/Dashboard/Dashboard";
import AuthGuard from "@/components/auth/AuthGuard";
import MainLayout from "@/components/layout/MainLayout";
import Config from "@/pages/Config/Config";
import Unauthorized from "@/pages/Unauthorized/Unauthorized";
import Product from "@/pages/Product/Product";
import FormProduct from "@/pages/Product/components/Add/FormProduct";
import Supplier from "@/pages/Supplier/Supplier";

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
                            {
                                path: "products",
                                element: <Product />
                            },
                            {
                                path: "suppliers",
                                element: <Supplier />
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
            },
            {
                path: "products",
                element: <AuthGuard requiredFeature="/xnk" />,
                children: [
                    {
                        path: "add",
                        element: <FormProduct />
                    },
                    {
                        path: "update/:id",
                        element: <FormProduct />
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