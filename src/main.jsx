import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Pages/HomePage/Home";
import Signup from "./Pages/SignUp/SignUp";
import AboutUs from "./Pages/AboutUs/AboutUs";
import Login from "./Pages/Login/Login";
import Chatbot from "./Pages/Chatbot/Chatbot";
import TestPreparation from "./Pages/TestPreparation/TestPreparation";
import ContactUs from "./Pages/ContactUs/ContactUs";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/chatbot", element: <Chatbot /> },
      { path: "/aboutus", element: <AboutUs /> },
      { path: "/contactus", element: <ContactUs /> },
      { path: "/TestPreparation", element: <TestPreparation /> },
    ],
  },
  { path: "/signup", element: <Signup /> },
  { path: "/login", element: <Login /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
