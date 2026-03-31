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
import Quote from "@/pages/Quote/Quote";
import Department from "@/pages/Department/Department";
import Employee from "@/pages/Employee/Employee";
import AddEmployee from "@/pages/Employee/component/AddEmployee";
import { Roles } from "@/utils/roles";
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
                        path: "xnk",
                        element: <AuthGuard requiredFeature="/xnk" />,
                        children: [
                            {
                                path: "config",
                                index: true,
                                element: <Config />
                            },
                            {
                                path: "products",
                                index: true,
                                element: <Product />
                            },
                            {
                                path: "suppliers",
                                index: true,
                                element: <Supplier />
                            },
                            {
                                path: "orders/request-quote",
                                index: true,
                                element: <Quote />
                            },
                        ]
                    },
                    {
                        path: "otk",
                        element: <AuthGuard requiredFeature="/otk" />,
                        children: [
                            {
                                path: "otk",
                                index: true,
                                element: <div>Trang chính OTK</div>
                            }
                        ]
                    },
                    {
                        path: "admin",
                        element: <AuthGuard requiredFeature="/admin" />,
                        children: [
                            {
                                path: "departments",
                                index: true,
                                element: <Department />
                            },
                            {
                                path: "employees",
                                index: true,
                                element: <Employee />
                            }
                        ]
                    }
                ]
            },
            {
                path: "xnk/products",
                element: <AuthGuard requiredFeature="/xnk" roles={[Roles.ADMIN, Roles.MANAGER]} />,
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
            },
            {
                path: "admin/employees",
                element: <AuthGuard requiredFeature="/admin" roles={[Roles.ADMIN, Roles.MANAGER]} />,
                children: [
                    {
                        path: "add",
                        element: <AddEmployee />
                    },
                    {
                        path: "update/:id",
                        element: <AddEmployee />
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