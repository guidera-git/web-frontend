import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Form = () => {
  const [activeSection, setActiveSection] = useState("personal");
  const [formData, setFormData] = useState({
    // Personal section
    fullName: "",
    email: "",
    aboutMe: "",
    dateOfBirth: "",
    gender: "",
    location: "",

    // Academic section
    studentType: "",
    matriculationMarks: "",
    intermediateMarks: "",
    studyStream: "",

    // Personality section
    analysisEnjoyment: "",
    logicalTasks: "",
    explainingAbility: "",
    excitingActivity: "",
    projectPreference: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add form submission logic here
  };

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4" style={{ color: "#2E86AB" }}>
        Guidera
      </h1>

      {/* Progress Navigation */}
      <div className="d-flex justify-content-center mb-4">
        <button
          className={`btn ${
            activeSection === "personal" ? "btn-primary" : "btn-outline-primary"
          } mx-2`}
          onClick={() => setActiveSection("personal")}
        >
          Personal
        </button>
        <button
          className={`btn ${
            activeSection === "academic" ? "btn-primary" : "btn-outline-primary"
          } mx-2`}
          onClick={() => setActiveSection("academic")}
        >
          Academic
        </button>
        <button
          className={`btn ${
            activeSection === "personality"
              ? "btn-primary"
              : "btn-outline-primary"
          } mx-2`}
          onClick={() => setActiveSection("personality")}
        >
          Personality
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Personal Section */}
        {activeSection === "personal" && (
          <div className="card mb-4 border-primary border-2">
            <div className="card-header bg-primary text-white">
              <h3>Personal Information</h3>
            </div>
            <div
              className="card-body text-white"
              style={{ background: "#222222" }}
            >
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control text-white"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  style={{ background: "#918e8e" }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control text-white"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{ background: "#918e8e" }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">About Me</label>
                <textarea
                  className="form-control text-white"
                  rows="3"
                  name="aboutMe"
                  value={formData.aboutMe}
                  onChange={handleChange}
                  maxLength="200"
                  style={{ background: "#918e8e" }}
                ></textarea>
                <small className="text-muted">
                  {formData.aboutMe.length}/200
                </small>
              </div>

              <div className="mb-3">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  className="form-control text-white"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  style={{ background: "#918e8e" }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Gender</label>
                <div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input text-white"
                      type="radio"
                      name="gender"
                      id="male"
                      value="Male"
                      checked={formData.gender === "Male"}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="male">
                      Male
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      id="female"
                      value="Female"
                      checked={formData.gender === "Female"}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="female">
                      Female
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      id="other"
                      value="Other"
                      checked={formData.gender === "Other"}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="other">
                      Other
                    </label>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-control text-white"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  style={{ background: "#918e8e" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Academic Section */}
        {activeSection === "academic" && (
          <div className="card mb-4 border-primary border-2">
            <div className="card-header bg-primary text-white">
              <h3>Academic Information</h3>
            </div>
            <div
              className="card-body text-white"
              style={{ background: "#222222" }}
            >
              <div className="mb-3">
                <label className="form-label">Student Type</label>
                <select
                  className="form-select text-white"
                  name="studentType"
                  value={formData.studentType}
                  onChange={handleChange}
                  style={{ background: "#918e8e" }}
                >
                  <option value="">Select student type</option>
                  <option value="Board">Board</option>
                  <option value="O/A Level">O/A level</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Matriculation Marks</label>
                <input
                  type="text"
                  className="form-control text-white"
                  name="matriculationMarks"
                  value={formData.matriculationMarks}
                  onChange={handleChange}
                  style={{ background: "#918e8e" }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Intermediate Marks</label>
                <input
                  type="text"
                  className="form-control text-white"
                  name="intermediateMarks"
                  value={formData.intermediateMarks}
                  onChange={handleChange}
                  style={{ background: "#918e8e" }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Study Stream</label>
                <select
                  className="form-select text-white"
                  name="studyStream"
                  value={formData.studyStream}
                  onChange={handleChange}
                  style={{ background: "#918e8e" }}
                >
                  <option value="">Select your stream</option>
                  <option value="Biology">Biology</option>
                  <option value="Computer">Computer</option>
                  <option value="Arts">Arts</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Personality Section */}
        {activeSection === "personality" && (
          <div className="card mb-4 border-primary border-2">
            <div className="card-header bg-primary text-white">
              <h3>Personality Assessment</h3>
            </div>
            <div
              className="card-body text-white"
              style={{ background: "#222222" }}
            >
              <div className="mb-4">
                <p className="fw-bold">
                  I enjoy analyzing data and identifying patterns to solve
                  problems.
                </p>
                <div className="btn-group d-flex flex-wrap" role="group">
                  {[
                    "Strongly Disagree",
                    "Disagree",
                    "Neutral",
                    "Agree",
                    "Strongly Agree",
                  ].map((option) => (
                    <React.Fragment key={option}>
                      <input
                        type="radio"
                        className="btn-check"
                        name="analysisEnjoyment"
                        id={`analysisEnjoyment-${option}`}
                        value={option}
                        checked={formData.analysisEnjoyment === option}
                        onChange={handleChange}
                      />
                      <label
                        className="btn btn-outline-primary flex-grow-1"
                        htmlFor={`analysisEnjoyment-${option}`}
                      >
                        {option}
                      </label>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="fw-bold">
                  I prefer tasks that require logical thinking and structured
                  solutions.
                </p>
                <div className="btn-group d-flex flex-wrap" role="group">
                  {[
                    "Strongly Disagree",
                    "Disagree",
                    "Neutral",
                    "Agree",
                    "Strongly Agree",
                  ].map((option) => (
                    <React.Fragment key={option}>
                      <input
                        type="radio"
                        className="btn-check"
                        name="logicalTasks"
                        id={`logicalTasks-${option}`}
                        value={option}
                        checked={formData.logicalTasks === option}
                        onChange={handleChange}
                      />
                      <label
                        className="btn btn-outline-primary flex-grow-1"
                        htmlFor={`logicalTasks-${option}`}
                      >
                        {option}
                      </label>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="fw-bold">
                  I can explain complex topics to others in an engaging way.
                </p>
                <div className="btn-group d-flex flex-wrap" role="group">
                  {[
                    "Strongly Disagree",
                    "Disagree",
                    "Neutral",
                    "Agree",
                    "Strongly Agree",
                  ].map((option) => (
                    <React.Fragment key={option}>
                      <input
                        type="radio"
                        className="btn-check"
                        name="explainingAbility"
                        id={`explainingAbility-${option}`}
                        value={option}
                        checked={formData.explainingAbility === option}
                        onChange={handleChange}
                      />
                      <label
                        className="btn btn-outline-primary flex-grow-1"
                        htmlFor={`explainingAbility-${option}`}
                      >
                        {option}
                      </label>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="fw-bold">Which activity excites you the most?</p>
                <div className="d-flex flex-column gap-2">
                  {[
                    "Analyzing data to make predictions",
                    "Designing and building systems",
                    "Understanding and improving human health",
                  ].map((option) => (
                    <div key={option} className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="excitingActivity"
                        id={`excitingActivity-${option}`}
                        value={option}
                        checked={formData.excitingActivity === option}
                        onChange={handleChange}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`excitingActivity-${option}`}
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="fw-bold">
                  Which type of project would you prefer?
                </p>
                <div className="d-flex flex-column gap-2">
                  {[
                    "Developing innovative software solutions",
                    "Researching solutions for medical issues",
                    "Designing a new mechanical or electrical system",
                  ].map((option) => (
                    <div key={option} className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="projectPreference"
                        id={`projectPreference-${option}`}
                        value={option}
                        checked={formData.projectPreference === option}
                        onChange={handleChange}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`projectPreference-${option}`}
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="d-flex justify-content-between">
          {activeSection !== "personal" && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() =>
                setActiveSection(
                  activeSection === "academic" ? "personal" : "academic"
                )
              }
            >
              Previous
            </button>
          )}

          {activeSection !== "personality" ? (
            <button
              type="button"
              className="btn btn-primary ms-auto"
              onClick={() =>
                setActiveSection(
                  activeSection === "personal" ? "academic" : "personality"
                )
              }
            >
              Next
            </button>
          ) : (
            <button type="submit" className="btn btn-success ms-auto">
              Save
            </button>
          )}
        </div>
      </form>

      <div className="text-center mt-3">
        <small className="text-primary fw-bold">
          {activeSection === "personal" && "Personal Information"}
          {activeSection === "academic" && "Academic Information"}
          {activeSection === "personality" && "Personality Assessment"}
        </small>
      </div>
    </div>
  );
};

export default Form;
