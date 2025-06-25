import { Outlet, useLocation } from "react-router-dom";
import NavigationBar from "./components/NavigationBar/NavigationBar";
import Footer from "./components/Footer/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Layout = () => {
  const location = useLocation(); // Get current route

  return (
    <>
      <NavigationBar />
      <Outlet />
      {location.pathname !== "/chatbot" && <Footer />}
      <ToastContainer />
    </>
  );
};

export default Layout;
