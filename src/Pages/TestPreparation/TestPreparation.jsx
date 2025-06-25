import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useContext } from "react"; // Added useState here
import { ThemeContext } from "../../ThemeContext"; // Adjust path as needed
import SubjectCard from "../../components/card/SubjectCard";

function TestPreparation() {
  return (
    <>
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
    </>
  );
}

function Section1() {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={` border-bottom border-2 border-primary py-5 ${
        theme === "dark" ? "bg-dark text-white" : "bg-light text-dark"
      }`}
    >
      <div className="container">
        <div
          className={`d-flex flex-column flex-lg-row align-items-center p-4 rounded shadow-lg ${
            theme === "dark" ? "bg-secondary text-white" : "bg-light text-dark"
          }`}
        >
          <div className="text-center text-lg-start flex-grow-1 p-3">
            <h2 className="fw-bold text-primary">Test Preparation</h2>
            <h4 className="fw-bold">
              Ace Your <span className="text-primary">University</span> Entrance
              Tests with Confidence!
            </h4>
            <p className={theme === "dark" ? "text-light" : "text-muted"}>
              Access tailored resources, test strategies, and progress tracking
              to achieve your goals.
            </p>
            <button className="btn btn-primary mt-2">Explore Resources</button>
          </div>
          <div className="d-flex justify-content-center p-3">
            <img
              src="book_pen.png"
              alt="Study Materials"
              className="img-fluid rounded"
            />
          </div>
        </div>
        <div className="mt-4 text-center">
          <div className="mx-auto" style={{ maxWidth: "400px" }}>
            <select
              className={`form-select mb-3 ${
                theme === "dark" ? "bg-secondary text-white" : ""
              }`}
            >
              <option>Choose the Test</option>
              <option>SAT</option>
              <option>NAT</option>
              <option>ECAT</option>
              <option>NED</option>
            </select>
            <button className="btn btn-primary">Start Now</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section2() {
  return <SubjectCard />;
}

function Section3() {
  const { theme } = useContext(ThemeContext);
  const categories = [
    { title: "Past Papers", icon: "/Brain.svg" },
    { title: "Practice Questions", icon: "/Paper.svg" },
    { title: "Video Tutorials", icon: "/Video.svg" },
  ];

  return (
    <div
      className={`text-center py-4 border-bottom border-2 border-primary ${
        theme === "dark" ? "bg-dark text-white" : "bg-light text-dark"
      }`}
    >
      <h4 className="fw-bold mb-5">Test Material Categories</h4>

      <div className="row g-4 px-3">
        {categories.map((category, index) => (
          <div
            key={index}
            className="col-12 col-md-4 col-lg-4 d-flex flex-column align-items-center justify-content-center"
          >
            <div
              className={`category-card d-flex flex-column align-items-center p-4 ${
                theme === "dark" ? "bg-secondary text-white" : "bg-light"
              }`}
            >
              <img
                src={category.icon}
                alt={category.title}
                className="icon-img mb-3"
              />
              <p className="fw-semibold mt-4">{category.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Section4() {
  const { theme } = useContext(ThemeContext);
  const [overallProgress] = useState(65); // Now properly imported

  const subjects = [
    { name: "Biology", progress: 75 },
    { name: "Computer", progress: 60 },
    { name: "Chemistry", progress: 50 },
    { name: "Math", progress: 80 },
    { name: "Physics", progress: 40 },
  ];

  return (
    <div
      className={`text-center py-4 border-bottom border-2 border-primary ${
        theme === "dark" ? "bg-dark text-white" : "bg-light text-dark"
      }`}
    >
      <h4 className="fw-bold mb-4">Track Your Progress</h4>
      <div className="row g-3 px-3">
        <div className="col-md-6">
          <h6 className="mb-4">Subject Based Learning</h6>
          {subjects.map((subject, index) => (
            <div
              key={index}
              className="d-flex align-items-center justify-content-between mb-2"
            >
              <span
                className={`fw-bold subject-name ms-5 ${
                  theme === "dark" ? "text-white" : ""
                }`}
              >
                {subject.name}
              </span>
              <div className="progress flex-grow-1 mx-2 progress-container me-5">
                <div
                  className="progress-bar bg-primary"
                  role="progressbar"
                  style={{ width: `${subject.progress}%` }}
                  aria-valuenow={subject.progress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  {subject.progress}%
                </div>
              </div>
            </div>
          ))}
        </div>
        <div
          className={`col-md-6 d-flex flex-column align-items-center justify-content-center border-primary ${
            theme === "dark" ? "border-secondary" : ""
          } border-start`}
        >
          <h6>Overall Progress</h6>
          <div className="progress-circle mt-3">
            <svg viewBox="0 0 100 100">
              <circle
                className={
                  theme === "dark" ? "progress-bg-dark" : "progress-bg"
                }
                cx="50"
                cy="50"
                r="45"
              ></circle>
              <circle
                className={
                  theme === "dark" ? "progress-fill-dark" : "progress-fill"
                }
                cx="50"
                cy="50"
                r="45"
                style={{
                  strokeDashoffset: 283 - (283 * overallProgress) / 100,
                }}
              ></circle>
              <text
                x="50"
                y="55"
                textAnchor="middle"
                className={
                  theme === "dark" ? "progress-text-dark" : "progress-text"
                }
              >
                {overallProgress}%
              </text>
            </svg>
          </div>
        </div>
      </div>
      <button className="btn btn-lg btn-primary mt-4">
        <strong>View Progress</strong>
        <i className="bi bi-arrow-up-right-circle-fill mx-2"></i>
      </button>
    </div>
  );
}

export default TestPreparation;
