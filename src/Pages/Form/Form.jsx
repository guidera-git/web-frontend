import React, { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../ThemeContext";

const Form = () => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("academic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [gender, setGender] = useState("");

  const grade_mapping = { "A*": 95, A: 85, B: 75, C: 65, D: 55, E: 45 };

  const [formData, setFormData] = useState({
    studentType: "Board",
    matriculationMarks: "",
    intermediateMarks: "",
    oLevelGrade: "",
    aLevelGrade: "",
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

  useEffect(() => {
    const fetchGender = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get("http://localhost:3000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGender(res.data.gender || "");
      } catch (err) {
        console.error("Failed to fetch gender from profile:", err);
      }
    };

    fetchGender();
  }, []);

  useEffect(() => {
    const checkValidity = () => {
      if (activeSection === "academic") {
        if (formData.studentType === "Board") {
          return (
            gender &&
            formData.matriculationMarks &&
            formData.intermediateMarks &&
            formData.studyStream
          );
        } else {
          return (
            gender &&
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
  }, [formData, gender, activeSection]);

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
        Gender: gender === "Male" ? 1 : 0,
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
      <p
        className="fw-bold"
        style={{ color: theme === "dark" ? "white" : "inherit" }}
      >
        {question}
      </p>
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
              className={`btn btn-outline-primary flex-grow-1 ${
                theme === "dark" ? "text-white" : ""
              }`}
              htmlFor={`${name}-${option}`}
              style={{
                backgroundColor:
                  formData[name] === option ? "#0d6efd" : "transparent",
                color:
                  formData[name] === option
                    ? "white"
                    : theme === "dark"
                    ? "white"
                    : "inherit",
              }}
            >
              {option}
            </label>
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  if (predictionResult) {
    navigate("/degree-recommendation", { state: { predictionResult } });
    return null;
  }

  return (
    <div
      className="container py-4"
      style={{
        backgroundColor: theme === "dark" ? "#212529" : "white",
        color: theme === "dark" ? "white" : "inherit",
        minHeight: "100vh",
      }}
    >
      <h1 className="text-center mb-4 text-primary">Guidera</h1>

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
          <>
            <h3 className="text-primary text-center">Academic Information</h3>
            <div
              className="form-control p-4 mb-3"
              style={{
                backgroundColor: theme === "dark" ? "#343a40" : "white",
                borderColor: theme === "dark" ? "#495057" : "#dee2e6",
                color: theme === "dark" ? "white" : "inherit",
              }}
            >
              {/* Student Type */}
              <div className="mb-3">
                <label className="form-label">Student Type*</label>
                <select
                  className="form-select"
                  name="studentType"
                  value={formData.studentType}
                  onChange={handleChange}
                  required
                  style={{
                    backgroundColor: theme === "dark" ? "#495057" : "white",
                    color: theme === "dark" ? "white" : "inherit",
                  }}
                >
                  <option value="Board">Matric/FSc (Board)</option>
                  <option value="O/A Level">O/A Level</option>
                </select>
              </div>

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
                      style={{
                        backgroundColor: theme === "dark" ? "#495057" : "white",
                        color: theme === "dark" ? "white" : "inherit",
                        borderColor: theme === "dark" ? "#6c757d" : "#ced4da",
                      }}
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
                      style={{
                        backgroundColor: theme === "dark" ? "#495057" : "white",
                        color: theme === "dark" ? "white" : "inherit",
                        borderColor: theme === "dark" ? "#6c757d" : "#ced4da",
                      }}
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
                      style={{
                        backgroundColor: theme === "dark" ? "#495057" : "white",
                        color: theme === "dark" ? "white" : "inherit",
                      }}
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
                      style={{
                        backgroundColor: theme === "dark" ? "#495057" : "white",
                        color: theme === "dark" ? "white" : "inherit",
                      }}
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
                  style={{
                    backgroundColor: theme === "dark" ? "#495057" : "white",
                    color: theme === "dark" ? "white" : "inherit",
                  }}
                >
                  <option value="">Select your stream</option>
                  <option value="Pre-Medical">Pre-Medical</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Pre-Engineering">Pre-Engineering</option>
                </select>
              </div>
            </div>
          </>
        )}

        {activeSection === "personality" && (
          <>
            <h3 className="text-primary text-center">Personality Assessment</h3>
            <div
              className="form-control p-4 mb-3"
              style={{
                backgroundColor: theme === "dark" ? "#343a40" : "white",
                borderColor: theme === "dark" ? "#495057" : "#dee2e6",
                color: theme === "dark" ? "white" : "inherit",
              }}
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
                <p
                  className="fw-bold"
                  style={{ color: theme === "dark" ? "white" : "inherit" }}
                >
                  Which activity excites you the most?*
                </p>
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
                      style={{ color: theme === "dark" ? "white" : "inherit" }}
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <p
                  className="fw-bold"
                  style={{ color: theme === "dark" ? "white" : "inherit" }}
                >
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
                      style={{ color: theme === "dark" ? "white" : "inherit" }}
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </>
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
