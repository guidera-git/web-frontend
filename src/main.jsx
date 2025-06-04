import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  RouterProvider,
  createBrowserRouter,
  useNavigate,
} from "react-router-dom";
import { ThemeProvider } from "./ThemeContext";
import Layout from "./Layout";
import Home from "./Pages/HomePage/Home";
import Signup from "./Pages/SignUp/SignUp";
import AboutUs from "./Pages/AboutUs/AboutUs";
import Login from "./Pages/Login/login";
import Chatbot from "./Pages/Chatbot/Chatbot";
import TestPreparation from "./Pages/TestPreparation/TestPreparation";
import ContactUs from "./Pages/ContactUs/ContactUs";
import FindUniversity from "./Pages/FindUniversity/FindUniversity";
import Recommendation from "./Pages/Recommendation/Recommendation";
import TrackingAnalysis from "./Pages/TrackingAnalysis/TrackingAnalysis";
import SubjectCard from "./components/card/SubjectCard";
import QuestionBank from "./components/Question/QuestionBank";
import ProfilePage from "./Pages/Profile/Profile";
import Form from "./Pages/Form/Form";

// ✅ Token check helper
function isTokenExpired(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const { exp } = JSON.parse(jsonPayload);
    const now = Math.floor(Date.now() / 1000);
    return exp < now;
  } catch (e) {
    return true;
  }
}

// ✅ Layout wrapper with logout logic
function ProtectedLayout({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && isTokenExpired(token)) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, []);

  return children;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedLayout>
        <Layout />
      </ProtectedLayout>
    ),
    children: [
      { path: "/", element: <Home /> },
      { path: "/chatbot", element: <Chatbot /> },
      { path: "/aboutus", element: <AboutUs /> },
      { path: "/contactus", element: <ContactUs /> },
      { path: "/FindUniversity", element: <FindUniversity /> },
      { path: "/TestPreparation", element: <TestPreparation /> },
      { path: "/Recommendation", element: <Recommendation /> },
      { path: "/tracking", element: <TrackingAnalysis /> },
      { path: "/", element: <SubjectCard /> },
      { path: "/quiz/:subject", element: <QuestionBank /> },
    ],
  },
  { path: "/signup", element: <Signup /> },
  { path: "/login", element: <Login /> },
  { path: "/Profile", element: <ProfilePage /> },
  { path: "/Form", element: <Form /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
);
