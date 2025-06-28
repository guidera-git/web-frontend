import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ThemeContext } from "../../ThemeContext"; // Adjust path as needed

const DegreeRecommendation = () => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { predictionResult } = location.state || {};

  if (!predictionResult) {
    return null;
  }

  const careerInsights = {
    "Software Engineering": {
      marketDemand: "High",
      growthRate: "15% annually",
      startingSalary: "PKR 120,000",
      jobSecurity: "Very High",
    },
    "Data Science": {
      marketDemand: "High",
      growthRate: "20% annually",
      startingSalary: "PKR 150,000",
      jobSecurity: "High",
    },
    "Computer Science": {
      marketDemand: "High",
      growthRate: "12% annually",
      startingSalary: "PKR 110,000",
      jobSecurity: "High",
    },
    "Civil Engineering": {
      marketDemand: "Moderate",
      growthRate: "8% annually",
      startingSalary: "PKR 90,000",
      jobSecurity: "High",
    },
    "Dental Surgery": {
      marketDemand: "High",
      growthRate: "10% annually",
      startingSalary: "PKR 180,000",
      jobSecurity: "Very High",
    },
    Medicine: {
      marketDemand: "Very High",
      growthRate: "12% annually",
      startingSalary: "PKR 200,000",
      jobSecurity: "Very High",
    },
    "Biomedical Engineering": {
      marketDemand: "Growing",
      growthRate: "18% annually",
      startingSalary: "PKR 100,000",
      jobSecurity: "High",
    },
  };

  // Static alternative recommendations - expanded with more degrees
  const alternativeDegrees = {
    "Software Engineering": [
      {
        name: "Data Science",
        match: "89%",
        description: "Growing field with AI/ML focus",
      },
      {
        name: "Cybersecurity",
        match: "85%",
        description: "Critical need in digital era",
      },
    ],
    "Data Science": [
      {
        name: "Software Engineering",
        match: "92%",
        description: "High demand in tech industry",
      },
      {
        name: "Artificial Intelligence",
        match: "87%",
        description: "Cutting-edge technology field",
      },
    ],
    "Computer Science": [
      {
        name: "Software Engineering",
        match: "95%",
        description: "Core tech development field",
      },
      {
        name: "Information Technology",
        match: "88%",
        description: "Broad IT infrastructure focus",
      },
    ],
    "Civil Engineering": [
      {
        name: "Architecture",
        match: "82%",
        description: "Design-focused construction field",
      },
      {
        name: "Environmental Engineering",
        match: "78%",
        description: "Sustainable infrastructure development",
      },
    ],
    "Dental Surgery": [
      {
        name: "Medicine",
        match: "85%",
        description: "Comprehensive medical practice",
      },
      {
        name: "Biomedical Sciences",
        match: "75%",
        description: "Research-focused medical field",
      },
    ],
    Medicine: [
      {
        name: "Dental Surgery",
        match: "83%",
        description: "Specialized oral healthcare",
      },
      {
        name: "Allied Health Sciences",
        match: "78%",
        description: "Diverse healthcare support roles",
      },
    ],
    "Biomedical Engineering": [
      {
        name: "Biotechnology",
        match: "88%",
        description: "Biological technology applications",
      },
      {
        name: "Mechanical Engineering",
        match: "75%",
        description: "Engineering principles with broader applications",
      },
    ],
  };

  // Get insights for predicted degree, default to Computer Science if not found
  const insights =
    careerInsights[predictionResult.predicted_degree] ||
    careerInsights["Computer Science"];
  const alternatives =
    alternativeDegrees[predictionResult.predicted_degree] ||
    alternativeDegrees["Computer Science"];

  const handleViewPrograms = () => {
    navigate("/FindUniversity", {
      state: { program: predictionResult.predicted_degree },
    });
  };
  // Theme-based styling variables
  const cardHeaderBg = theme === "dark" ? "bg-dark" : "bg-primary";
  const cardBg = theme === "dark" ? "bg-secondary text-white" : "bg-white";
  const borderColor = theme === "dark" ? "border-light" : "border-dark";
  const textMuted = theme === "dark" ? "text-light" : "text-muted";
  return (
    <div
      className={`container py-4 ${
        theme === "dark" ? "bg-dark text-white" : ""
      }`}
    >
      <div className="text-center mb-4">
        <h2 className="mt-3">Hi, {predictionResult.name || "User"}!</h2>
        <p className="lead">
          Here are your personalized recommendations based on your academic
          profile and personality assessment:
        </p>
      </div>

      {/* Top Recommended Field */}
      <div className={`card mb-4 shadow-sm ${cardBg}`}>
        <div className={`card-header ${cardHeaderBg} text-white`}>
          <h3 className="mb-0">Top Recommended Field</h3>
        </div>
        <div className="card-body text-center">
          <h2
            className={`mb-4 ${theme === "dark" ? "text-white" : "text-dark"}`}
          >
            {predictionResult.predicted_degree}
          </h2>
        </div>
      </div>

      {/* Career Insights */}
      <div className={`card mb-4 shadow-sm ${cardBg}`}>
        <div
          className={`card-header ${theme === "dark" ? "bg-dark" : "bg-light"}`}
        >
          <h3 className="mb-0">Career Insights</h3>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-3">
              <div className="d-flex justify-content-between align-items-center gap-2">
                <span className="fw-bold">Market Demand</span>
                <span
                  className={`badge ${
                    insights.marketDemand === "Very High"
                      ? "bg-success"
                      : insights.marketDemand === "High"
                      ? "bg-success"
                      : insights.marketDemand === "Growing"
                      ? "bg-info"
                      : "bg-warning"
                  }`}
                >
                  {insights.marketDemand}
                </span>
              </div>
              <div className="mt-2">
                <small className={textMuted}>Starting Salary</small>
                <p className="mb-0">{insights.startingSalary}</p>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="d-flex justify-content-between align-items-center gap-2">
                <span className="fw-bold">Growth Rate</span>
                <span>{insights.growthRate}</span>
              </div>
              <div className="mt-2">
                <small className={textMuted}>Job Security</small>
                <p className="mb-0">{insights.jobSecurity}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Programs Button */}
      <div className="d-grid gap-2 mb-5">
        <button className="btn btn-primary btn-lg" onClick={handleViewPrograms}>
          View Available Programs
        </button>
      </div>

      {/* Alternative Recommendations */}
      <div className={`card mb-4 shadow-sm ${cardBg}`}>
        <div
          className={`card-header ${theme === "dark" ? "bg-dark" : "bg-light"}`}
        >
          <h3 className="mb-0">Alternative Recommendations</h3>
        </div>
        <div className="card-body">
          {alternatives.map((alt, index) => (
            <div
              key={index}
              className={`mb-3 p-3 border rounded ${borderColor}`}
            >
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`alt-${index}`}
                />
                <label
                  className={`form-check-label w-100 ${
                    theme === "dark" ? "text-light" : ""
                  }`}
                  htmlFor={`alt-${index}`}
                >
                  <div className="d-flex justify-content-between">
                    <h5 className="mb-1">{alt.name}</h5>
                    <span className="badge bg-info">{alt.match} Match</span>
                  </div>
                  <p className={`mb-0 ${textMuted}`}>{alt.description}</p>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="d-flex justify-content-center mt-4">
        <button
          className={`btn ${
            theme === "dark" ? "btn-outline-light" : "btn-outline-primary"
          }`}
          onClick={() => navigate(-1)}
        >
          Back to Form
        </button>
      </div>
    </div>
  );
};

export default DegreeRecommendation;
