import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Form = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("academic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);

  // Grade mapping for O/A-Level
  const grade_mapping = { "A*": 95, A: 85, B: 75, C: 65, D: 55, E: 45 };

  // Form state
  const [formData, setFormData] = useState({
    studentType: "Board",
    matriculationMarks: "",
    intermediateMarks: "",
    oLevelGrade: "",
    aLevelGrade: "",
    gender: "",
    studyStream: "",
    analysisEnjoyment: "",
    logicalTasks: "",
    explainingAbility: "",
    innovativeIdeas: "",
    attentionToDetail: "",
    helpingOthers: "",
    excitingActivity: "",
    projectPreference: "",
  });

  // Check form validity whenever formData changes
  useEffect(() => {
    const checkValidity = () => {
      if (activeSection === "academic") {
        if (formData.studentType === "Board") {
          return (
            formData.gender &&
            formData.matriculationMarks &&
            formData.intermediateMarks &&
            formData.studyStream
          );
        } else {
          return (
            formData.gender &&
            formData.oLevelGrade &&
            formData.aLevelGrade &&
            formData.studyStream
          );
        }
      } else {
        return (
          formData.analysisEnjoyment &&
          formData.logicalTasks &&
          formData.explainingAbility &&
          formData.innovativeIdeas &&
          formData.attentionToDetail &&
          formData.helpingOthers &&
          formData.excitingActivity &&
          formData.projectPreference
        );
      }
    };
    setIsFormValid(checkValidity());
  }, [formData, activeSection]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculatePercentage = () => {
    if (formData.studentType === "Board") {
      const matric = parseFloat(formData.matriculationMarks) || 0;
      const inter = parseFloat(formData.intermediateMarks) || 0;
      return ((matric + inter) / 2200) * 100;
    } else {
      const oLevelScore = grade_mapping[formData.oLevelGrade] || 0;
      const aLevelScore = grade_mapping[formData.aLevelGrade] || 0;
      return (oLevelScore + aLevelScore) / 2;
    }
  };

  const mapResponseToNumber = (response) => {
    const map = {
      "Strongly Disagree": 1,
      Disagree: 2,
      Neutral: 3,
      Agree: 4,
      "Strongly Agree": 5,
    };
    return map[response] || 3;
  };

  const mapPreferenceToNumber = (preference, options) => {
    return options.indexOf(preference) + 1;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication required");

      const requestData = {
        Gender: formData.gender === "Male" ? 1 : 0,
        "Academic Percentage": calculatePercentage(),
        "Study Stream": formData.studyStream,
        Analytical: mapResponseToNumber(formData.analysisEnjoyment),
        Logical: mapResponseToNumber(formData.logicalTasks),
        Explaining: mapResponseToNumber(formData.explainingAbility),
        Creative: mapResponseToNumber(formData.innovativeIdeas),
        "Detail-Oriented": mapResponseToNumber(formData.attentionToDetail),
        Helping: mapResponseToNumber(formData.helpingOthers),
        "Activity Preference": mapPreferenceToNumber(
          formData.excitingActivity,
          [
            "Analyzing data to make predictions",
            "Designing and building systems",
            "Understanding and improving human health",
          ]
        ),
        "Project Preference": mapPreferenceToNumber(
          formData.projectPreference,
          [
            "Developing innovative software solutions",
            "Researching solutions for medical issues",
            "Designing a new mechanical or electrical system",
          ]
        ),
      };

      const response = await axios.post(
        "http://localhost:3000/api/degree/predict",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setPredictionResult(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Submission failed"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const radioOptions = [
    "Strongly Disagree",
    "Disagree",
    "Neutral",
    "Agree",
    "Strongly Agree",
  ];

  const renderRadioGroup = (name, question) => (
    <div className="mb-4">
      <p className="fw-bold">{question}</p>
      <div className="btn-group d-flex flex-wrap" role="group">
        {radioOptions.map((option) => (
          <React.Fragment key={option}>
            <input
              type="radio"
              className="btn-check"
              name={name}
              id={`${name}-${option}`}
              value={option}
              checked={formData[name] === option}
              onChange={handleChange}
              required
            />
            <label
              className="btn btn-outline-primary flex-grow-1"
              htmlFor={`${name}-${option}`}
            >
              {option}
            </label>
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  if (predictionResult) {
    return (
      <div className="container py-4 text-center">
        <h2 className="text-primary mb-4">Degree Recommendation</h2>
        <div className="card mx-auto" style={{ maxWidth: "600px" }}>
          <div className="card-header bg-primary text-white">
            <h3>Your Ideal Degree</h3>
          </div>
          <div className="card-body">
            <h4 className="text-success">
              {predictionResult.predicted_degree}
            </h4>
            <p>
              Confidence: {(predictionResult.confidence_score * 100).toFixed(1)}
              %
            </p>
            <button
              className="btn btn-primary mt-3"
              onClick={() => setPredictionResult(null)}
            >
              Back to Form
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4" style={{ color: "#2E86AB" }}>
        Guidera
      </h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="d-flex justify-content-center mb-4">
        {["academic", "personality"].map((section) => (
          <button
            key={section}
            className={`btn ${
              activeSection === section ? "btn-primary" : "btn-outline-primary"
            } mx-2`}
            onClick={() => setActiveSection(section)}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {activeSection === "academic" && (
          <div className="card mb-4 border-primary border-2">
            <div className="card-header bg-primary text-white">
              <h3>Academic Information</h3>
            </div>
            <div
              className="card-body"
              style={{ background: "#222222", color: "white" }}
            >
              {/* Gender Field */}
              <div className="mb-3">
                <label className="form-label">Gender*</label>
                <div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      id="gender-male"
                      value="Male"
                      checked={formData.gender === "Male"}
                      onChange={handleChange}
                      required
                    />
                    <label className="form-check-label" htmlFor="gender-male">
                      Male
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      id="gender-female"
                      value="Female"
                      checked={formData.gender === "Female"}
                      onChange={handleChange}
                      required
                    />
                    <label className="form-check-label" htmlFor="gender-female">
                      Female
                    </label>
                  </div>
                </div>
              </div>

              {/* Student Type */}
              <div className="mb-3">
                <label className="form-label">Student Type*</label>
                <select
                  className="form-select"
                  name="studentType"
                  value={formData.studentType}
                  onChange={handleChange}
                  required
                >
                  <option value="Board">Matric/FSc (Board)</option>
                  <option value="O/A Level">O/A Level</option>
                </select>
              </div>

              {/* Conditional Fields */}
              {formData.studentType === "Board" ? (
                <>
                  <div className="mb-3">
                    <label className="form-label">
                      Matriculation Marks (out of 1100)*
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="matriculationMarks"
                      value={formData.matriculationMarks}
                      onChange={handleChange}
                      min="0"
                      max="1100"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Intermediate Marks (out of 1100)*
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="intermediateMarks"
                      value={formData.intermediateMarks}
                      onChange={handleChange}
                      min="0"
                      max="1100"
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-3">
                    <label className="form-label">O-Level Grade*</label>
                    <select
                      className="form-select"
                      name="oLevelGrade"
                      value={formData.oLevelGrade}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select grade</option>
                      {Object.keys(grade_mapping).map((grade) => (
                        <option key={grade} value={grade}>
                          {grade}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">A-Level Grade*</label>
                    <select
                      className="form-select"
                      name="aLevelGrade"
                      value={formData.aLevelGrade}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select grade</option>
                      {Object.keys(grade_mapping).map((grade) => (
                        <option key={grade} value={grade}>
                          {grade}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* Study Stream */}
              <div className="mb-3">
                <label className="form-label">Study Stream*</label>
                <select
                  className="form-select"
                  name="studyStream"
                  value={formData.studyStream}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select your stream</option>
                  <option value="Pre-Medical">Pre-Medical</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Pre-Engineering">Pre-Engineering</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeSection === "personality" && (
          <div className="card mb-4 border-primary border-2">
            <div className="card-header bg-primary text-white">
              <h3>Personality Assessment</h3>
            </div>
            <div
              className="card-body"
              style={{ background: "#222222", color: "white" }}
            >
              {renderRadioGroup(
                "analysisEnjoyment",
                "I enjoy analyzing data and identifying patterns to solve problems."
              )}
              {renderRadioGroup(
                "logicalTasks",
                "I prefer tasks that require logical thinking and structured solutions."
              )}
              {renderRadioGroup(
                "explainingAbility",
                "I can explain complex topics to others in an engaging way."
              )}
              {renderRadioGroup(
                "innovativeIdeas",
                "I enjoy brainstorming innovative ideas to solve challenges."
              )}
              {renderRadioGroup(
                "attentionToDetail",
                "I pay close attention to details to ensure accuracy in my work."
              )}
              {renderRadioGroup(
                "helpingOthers",
                "I feel fulfilled when helping others overcome challenges."
              )}

              <div className="mb-4">
                <p className="fw-bold">Which activity excites you the most?*</p>
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
                      required
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

              <div className="mb-4">
                <p className="fw-bold">
                  Which type of project would you prefer?*
                </p>
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
                      required
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
        )}

        <div className="d-flex justify-content-between">
          {activeSection === "personality" && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setActiveSection("academic")}
            >
              Previous
            </button>
          )}
          {activeSection === "academic" ? (
            <button
              type="button"
              className="btn btn-primary ms-auto"
              onClick={() => setActiveSection("personality")}
              disabled={!isFormValid}
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="btn btn-success ms-auto"
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Predicting...
                </>
              ) : (
                "Submit"
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Form;
