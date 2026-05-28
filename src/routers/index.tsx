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
import AddQuotationRequest from "@/pages/Quote/components/AddQuotationRequest";
import Approvals from "@/pages/Approvals/Approvals";
import ContractPage from "@/pages/Contract/Contract";
import AddContract from "@/pages/Contract/component/AddContract";
import DeliverySchedulePage from "@/pages/DeliverySchedule/DeliverySchedule";
import AddDeliverySchedule from "@/pages/DeliverySchedule/components/AddDeliverySchedule";
import OtkCostCalculation from "@/pages/Otk/components/OtkCostCalculation";
import OtkPage from "@/pages/Otk/OtkPage";
import OtkInspection from "@/pages/Otk/components/OtkInspection";
import InventoryReceiptPage from "@/pages/Inventory/InventoryReceiptPage";
import InventoryReceiptDetail from "@/pages/Inventory/InventoryReceiptDetail";
import WarehousePage from "@/pages/Warehouse/WarehousePage";
import WarehouseStockPage from "@/pages/Warehouse/WarehouseStockPage";
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
                            {
                                path: "contracts",
                                index: true,
                                element: <ContractPage />
                            },
                            {
                                path: "delivery-schedule",
                                index: true,
                                element: <DeliverySchedulePage />
                            }
                        ]
                    },
                    {
                        path: "otk",
                        element: <AuthGuard
                            requiredPosition={[Position.MANAGER, Position.STAFF_OTK]}
                            roles={[Roles.MANAGE_OTK, Roles.STAFF_VIEW]} />,
                        children: [
                            {
                                index: true,
                                element: <OtkPage />
                            }
                        ]
                    },
                    {
                        path: "warehouse",
                        element: <AuthGuard
                            requiredPosition={[Position.MANAGER, Position.STAFF_WH]}
                            roles={[Roles.MANAGE_WH, Roles.STAFF_VIEW]} />,
                        children: [
                            {
                                path: "",
                                index: true,
                                element: <WarehousePage />
                            },
                            {
                                path: "inventory-receipts",
                                index: true,
                                element: <InventoryReceiptPage />
                            },
                            {
                                path: "inventory-receipts/:id",
                                element: <InventoryReceiptDetail />
                            }
                        ]
                    },
                    {
                        path: "hr",
                        element: <AuthGuard
                            requiredPosition={[Position.MANAGER]}
                            roles={[Roles.MANAGE_HR]} />,
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
                    },
                    {
                        path: "approvals",
                        element: <AuthGuard
                            requiredPosition={[Position.MANAGER]}
                            roles={[Roles.MANAGE_HR, Roles.MANAGE_XNK, Roles.MANAGE_OTK]} />,
                        children: [
                            {
                                index: true,
                                element: <Approvals />
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
                    requiredPosition={[Position.MANAGER]}
                    roles={[Roles.MANAGE_HR]} />,
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
                    roles={[Roles.MANAGE_XNK, Roles.STAFF_ADD, Roles.STAFF_EDIT]}
                />,
                children: [
                    {
                        path: "add",
                        element: <AddQuotationRequest />
                    },
                    {
                        path: "update/:id",
                        element: <AddQuotationRequest />
                    }
                ]
            },
            {
                path: "xnk/contracts",
                element: <AuthGuard
                    requiredPosition={[Position.MANAGER, Position.STAFF_XNK]}
                    roles={[Roles.MANAGE_XNK, Roles.STAFF_ADD, Roles.STAFF_EDIT]}
                />,
                children: [
                    {
                        path: "add",
                        element: <AddContract />
                    },
                    {
                        path: "update/:id",
                        element: <AddContract />
                    }
                ]
            },
            {
                path: "xnk/delivery-schedule",
                element: <AuthGuard
                    requiredPosition={[Position.MANAGER, Position.STAFF_XNK]}
                    roles={[Roles.MANAGE_XNK, Roles.STAFF_ADD, Roles.STAFF_EDIT]}
                />,
                children: [
                    {
                        path: "add",
                        element: <AddDeliverySchedule />
                    },
                    {
                        path: "update/:id",
                        element: <AddDeliverySchedule />
                    }
                ]
            },
            {
                path: "otk",
                element: <AuthGuard
                    requiredPosition={[Position.MANAGER, Position.STAFF_XNK, Position.STAFF_OTK]}
                    roles={[Roles.MANAGE_XNK, Roles.MANAGE_OTK, Roles.STAFF_ADD, Roles.STAFF_EDIT]}
                />,
                children: [
                    {
                        path: "inspection/:id",
                        element: <OtkInspection />
                    },
                    {
                        path: "cost/:id/:dsId",
                        element: <OtkCostCalculation />
                    }
                ]
            },
            {
                path: "inventory/receipt/:otkId/:receiptId",
                element: <InventoryReceiptDetail />
            },
            {
                path: "warehouse/stock/:warehouseId",
                element: <WarehouseStockPage />
            }
        ]
    },
    {
        path: "*",
        element: <Navigate to="/dashboard" replace />
    }
]);