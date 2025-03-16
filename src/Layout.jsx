import { Outlet, useLocation } from "react-router-dom";
import NavigationBar from "./components/NavigationBar/NavigationBar";
import Footer from "./components/Footer/Footer";

const Layout = () => {
    const location = useLocation(); // Get current route

    return (
        <>
            <NavigationBar />
            <Outlet />
            {location.pathname !== "/chatbot" && <Footer />}
        </>
    );
};

export default Layout;
