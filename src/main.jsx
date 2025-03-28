import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./ThemeContext"; // Import ThemeProvider
import Layout from "./Layout";
import Home from "./Pages/HomePage/Home";
import Signup from "./Pages/SignUp/SignUp";
import AboutUs from "./Pages/AboutUs/AboutUs";
import Login from "./Pages/Login/Login";
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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
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
