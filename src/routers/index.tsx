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
import Quote from "@/pages/Quote/QuotationRequest";
import Department from "@/pages/Department/Department";
import Employee from "@/pages/Employee/Employee";
import AddEmployee from "@/pages/Employee/component/AddEmployee";
import Profile from "@/pages/Profile/Profile";
import { Position, Roles } from "@/utils/roles";
import AddExcelProduct from "@/pages/Product/components/AddByExcel/AddExcelProduct";
import QuotationRequest from "@/pages/Quote/QuotationRequest";
import AddQuotationRequest from "@/pages/Quote/components/AddQuotationRequest";
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
                        path: "profile",
                        element: <Profile />
                    },
                    {
                        path: "xnk",
                        element: <AuthGuard
                            requiredPosition={[Position.MANAGER, Position.STAFF_XNK]}
                            roles={[Roles.MANAGE_XNK, Roles.STAFF_VIEW]} />,
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
                        element: <AuthGuard
                            requiredPosition={[Position.MANAGER, Position.STAFF_OTK]}
                            roles={[Roles.MANAGE_OTK, Roles.STAFF_VIEW]} />,
                        children: [
                            {
                                path: "otk",
                                index: true,
                                element: <div>Trang chính OTK</div>
                            }
                        ]
                    },
                    {
                        path: "hr",
                        element: <AuthGuard
                            requiredPosition={[Position.ADMIN, Position.MANAGER]}
                            roles={[Roles.ADMIN, Roles.MANAGE_HR]} />,
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
                children: [
                    {
                        element: <AuthGuard
                            requiredPosition={[Position.MANAGER, Position.STAFF_XNK]}
                            roles={[Roles.MANAGE_XNK, Roles.STAFF_ADD]} />,
                        children: [
                            {
                                path: "add",
                                element: <FormProduct />
                            },
                            {
                                path: "add-by-excel",
                                element: <AddExcelProduct />
                            }
                        ]
                    },
                    {
                        element: <AuthGuard
                            requiredPosition={[Position.MANAGER, Position.STAFF_XNK]}
                            roles={[Roles.MANAGE_XNK, Roles.STAFF_EDIT]} />,
                        children: [
                            {
                                path: "update/:id",
                                element: <FormProduct />
                            }
                        ]
                    }
                ]
            },
            {
                path: "hr/employees",
                element: <AuthGuard
                    requiredPosition={[Position.ADMIN, Position.MANAGER]}
                    roles={[Roles.ADMIN, Roles.MANAGE_HR]} />,
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
            },
            {
                path: "xnk/orders/quotation-request",
                element: <AuthGuard
                    requiredPosition={[Position.MANAGER, Position.STAFF_XNK]}
                    roles={[Roles.MANAGE_XNK, Roles.STAFF_ADD]}
                />,
                children: [
                    {
                        path: "add",
                        element: <AddQuotationRequest />
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