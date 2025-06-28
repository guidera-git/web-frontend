import React, { useContext } from "react";
import { ThemeContext } from "../../ThemeContext";
import Footer from "../../components/Footer/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import { FaArrowRight } from "react-icons/fa";
import "./Home.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`home-page ${theme}`}>
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
    </div>
  );
}

function Section1() {
  const { theme } = useContext(ThemeContext);
  return (
    <div className="custom-container container-fluid border-bottom border-2 border-primary">
      <div className="row min-vh-20">
        <div className="col-md-6 d-flex flex-column justify-content-center p-5">
          <h2>
            Guiding Your <span className="text-primary">Academic Journey</span>
          </h2>
          <p>
            We support students in achieving their academic goals through
            personalized guidance and AI-driven recommendations.
          </p>
          <div className="d-flex gap-3 justify-content-center">
            <button className="btn btn-primary">Learn More</button>
            <button className="btn sign-up btn-outline-secondary">
              Get Started
            </button>
          </div>
        </div>
        <div className="col-md-6 d-flex justify-content-center align-items-center p-0">
          <img
            src={
              theme === "light"
                ? "/student_laptop.svg"
                : "/student_laptop_whit.svg"
            }
            alt="Home1"
            width={400}
            height={400}
          />
        </div>
      </div>
    </div>
  );
}

function Section2() {
  const { theme } = useContext(ThemeContext);
  return (
    <div className="custom-container container-fluid border-bottom border-2 border-primary">
      <div className="row p-5 text-center">
        <div className="col-md-4 px-4 border-end">
          <img
            src={theme === "light" ? "/homee7.png" : "/home7.png"}
            alt="Mission Icon"
            width={80}
            className="mb-3"
          />
          <h3>
            Our <span className="text-primary">Mission</span>
          </h3>
          <hr className="border-secondary w-50 mx-auto" />
          <p>
            Empowering students to achieve their academic dreams by providing
            personalized guidance, innovative tools, and dedicated support.
          </p>
        </div>
        <div className="col-md-4 px-4 border-end">
          <img
            src={theme === "light" ? "/homee6.png" : "/home6.png"}
            alt="Vision Icon"
            width={80}
            className="mb-3"
          />
          <h3>
            Our <span className="text-primary">Vision</span>
          </h3>
          <hr className="border-secondary w-50 mx-auto" />
          <p>
            To revolutionize academic decision-making with innovative AI
            solutions.
          </p>
        </div>
        <div className="col-md-4 px-4">
          <img
            src={theme === "light" ? "/homee5.png" : "/home5.png"}
            alt="Values Icon"
            width={80}
            className="mb-3"
          />
          <h3>
            Our <span className="text-primary">Values</span>
          </h3>
          <hr className="border-secondary w-50 mx-auto" />
          <p>
            Our Values are Integrity in Guidance, Focused on Student Success,
            and commitment to excellence.
          </p>
        </div>
      </div>
    </div>
  );
}

function Section3() {
  return (
    <div className="custom-container container-fluid border-bottom border-2 border-primary">
      <div className="row min-vh-20">
        <div className="col-md-6 d-flex justify-content-center align-items-center p-5">
          <img src="/home3.PNG" alt="Home3" width={400} height={400} />
        </div>
        <div className="col-md-6 d-flex flex-column justify-content-center p-5">
          <h2>Who we are</h2>
          <p>
            Guidera is your dedicated partner in academic decision-making. With
            a blend of advanced AI technology and personalized guidance, we help
            students find their ideal university and degree programs. Our
            mission is to simplify the complexities of academic planning, so
            students can focus on achieving their dreams.
          </p>
        </div>
      </div>
    </div>
  );
}

function Section4() {
  const { theme } = useContext(ThemeContext);

  const navigate = useNavigate();
  const services = [
    {
      image: "/home8.png",
      title: "Find University",
      description:
        "Get tailored university suggestions that align with your academic goals and preferences.",
      link: "/FindUniversity",
    },
    {
      image: "/home9.png",
      title: "Analysis & Tracking",
      description:
        "Find the perfect degree program that suits your interests and career ambitions.",
      link: "/tracking",
    },
    {
      image: "/home10.png",
      title: "Test Preparation Assistance",
      description:
        "Prepare for entrance exams with customized question sets and expert tips.",
      link: "/TestPreparation",
    },
    {
      image: "/home11.png",
      title: "AI Chatbot",
      description: "24/7 support for all your academic queries and planning.",
      link: "/chatbot",
    },
  ];

  return (
    <div className="custom-container container-fluid border-bottom border-2 py-1">
      <div className="container mb-4">
        <h2 className="text-center mb-5">Our Services</h2>
        <div className="row g-0">
          {services.map((service, index) => (
            <div key={index} className="col-md-6 p-0">
              <div
                className="h-100 d-flex flex-column align-items-center text-center p-4"
                style={{
                  borderRight: index === 0 ? "1px solid" : "none",
                  borderBottom: index === 1 ? "1px solid" : "none",
                  borderTop: index === 2 ? "1px solid" : "none",
                  borderLeft: index === 3 ? "1px solid" : "none",
                  borderColor: theme === "dark" ? "#ffffff" : "#0d6efd",
                }}
              >
                <img
                  src={service.image}
                  alt={service.title}
                  width={100}
                  height={100}
                  className="mb-3"
                />
                <h4>{service.title}</h4>
                <p>{service.description}</p>
                <button
                  className="btn btn-transparent d-flex align-items-center justify-content-center gap-3 border-0 w-100"
                  style={{
                    color: theme === "dark" ? "#ffffff" : "#0d6efd",
                  }}
                  onClick={() => navigate(service.link)}
                >
                  <FaArrowRight
                    style={{
                      fontSize: "1.5rem",
                      color: theme === "dark" ? "#ffffff" : "#0d6efd",
                    }}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
