import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Footer from "./components/Footer/Footer";
import NavigationBar from "./components/NavigationBar/NavigationBar";
import App from "./App";
import Home from "./Pages/HomePage/Home";
import Signup from "./Pages/SignUp/SignUp";
import AboutUs from "./Pages/AboutUs/AboutUs";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Home />  
  </StrictMode>
);
