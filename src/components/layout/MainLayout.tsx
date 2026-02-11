import Header from "./Header"
import Footer from "./Footer"
import { Outlet } from "react-router-dom";

const MainLayout = () => {
    return (
        <div className="main-layout">
            <Header />
            <div className="content-wrapper">
                <main>
                    <Outlet />
                </main>
            </div>
            <Footer />
        </div>
    )
}

export default MainLayout