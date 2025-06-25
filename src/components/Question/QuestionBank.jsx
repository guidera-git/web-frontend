import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Question from "./Question";
import ResultsScreen from "./ResultScreen";
import "bootstrap/dist/css/bootstrap.min.css";
import { ThemeContext } from "../../ThemeContext"; // Adjust path as needed

const apiService = {
  baseURL: "http://localhost:3000/api/tests",

  getConfig: () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }),

  startTest: async (subject) => {
    const response = await axios.get(
      `${apiService.baseURL}/${subject.toUpperCase()}`,
      apiService.getConfig()
    );
    return response.data;
  },
  submitTest: async (attemptId, answers) => {
    const response = await axios.post(
      `${apiService.baseURL}/${attemptId}/submit`,
      { answers },
      apiService.getConfig()
    );
    return response.data;
  },

  getResults: async (attemptId) => {
    const response = await axios.get(
      `${apiService.baseURL}/${attemptId}/result`,
      apiService.getConfig()
    );
    return response.data;
  },
};

function QuestionBank() {
  const { theme } = useContext(ThemeContext);
  const { subject } = useParams();
  const navigate = useNavigate();

  const [state, setState] = useState({
    questions: [],
    answers: {},
    error: "",
    submitted: false,
    results: null,
    attemptId: null,
    startedAt: null,
    loading: true,
    expectedCount: null,
  });

  const updateState = (updates) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        updateState({ loading: true, error: "" });

        const {
          questions: fetchedQuestions,
          attemptId,
          startedAt,
          expectedCount,
        } = await apiService.startTest(subject);

        updateState({
          questions: fetchedQuestions,
          attemptId,
          startedAt,
          expectedCount,
          answers: {},
          loading: false,
          submitted: false,
          results: null,
        });
      } catch (err) {
        updateState({
          error:
            err.response?.data?.error ||
            err.message ||
            "Failed to load questions",
          questions: [],
          loading: false,
        });
        console.error("Error loading questions:", err);
      }
    };

    if (subject) fetchQuestions();
  }, [subject]);

  const handleAnswerChange = (questionId, answer) => {
    updateState({
      answers: { ...state.answers, [questionId]: answer },
    });
  };

  const handleSubmit = async () => {
    if (Object.keys(state.answers).length < state.questions.length) {
      updateState({ error: "Please answer all questions before submitting." });
      return;
    }

    try {
      const { total, correct, score } = await apiService.submitTest(
        state.attemptId,
        state.answers
      );

      const { attempt, results: detailedResults } = await apiService.getResults(
        state.attemptId
      );

      updateState({
        submitted: true,
        results: {
          total,
          correct,
          score,
          detailedResults,
          percentage: score,
          grade: calculateGrade(score),
        },
      });
    } catch (err) {
      updateState({
        error: "Failed to submit results. Please try again.",
      });
      console.error("Failed to submit results:", err);
    }
  };

  const calculateGrade = (percentage) => {
    if (percentage >= 90) return "A";
    if (percentage >= 80) return "B";
    if (percentage >= 70) return "C";
    if (percentage >= 60) return "D";
    return "F";
  };

  const handleTryAgain = () => {
    window.location.reload();
  };

  const handleBackToSubjects = () => {
    navigate("/TestPreparation");
  };

  if (state.loading) {
    return (
      <div
        className={`container mt-4 text-center ${
          theme === "dark" ? "bg-dark text-white" : ""
        }`}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading questions...</p>
      </div>
    );
  }

  if (state.submitted && state.results) {
    return (
      <ResultsScreen
        results={state.results}
        detailedResults={state.results.detailedResults}
        onTryAgain={handleTryAgain}
        onBackToSubjects={handleBackToSubjects}
        expectedCount={state.expectedCount}
        theme={theme}
      />
    );
  }

  return (
    <div
      className={`container mt-4 ${
        theme === "dark" ? "bg-dark text-white" : ""
      }`}
    >
      <h2
        className={`text-center ${
          theme === "dark" ? "text-light" : "text-primary"
        }`}
      >
        {subject.charAt(0).toUpperCase() + subject.slice(1)} Quiz
        {state.expectedCount ? <small>({state.questions.length})</small> : null}
      </h2>

      {state.error && (
        <div
          className={`alert ${
            theme === "dark" ? "alert-dark" : "alert-warning"
          } text-center`}
        >
          {state.error}
          {state.questions.length > 0 && (
            <button
              className={`btn btn-sm ms-2 ${
                theme === "dark" ? "btn-outline-light" : "btn-outline-secondary"
              }`}
              onClick={() => updateState({ error: "" })}
            >
              Continue
            </button>
          )}
        </div>
      )}

      {state.questions.length > 0 ? (
        <>
          <div className="list-group mt-3">
            {state.questions.map((q, index) => (
              <Question
                key={q.id}
                question={q}
                questionNumber={index + 1}
                totalQuestions={state.expectedCount}
                onAnswerChange={handleAnswerChange}
                selectedAnswer={state.answers[q.id]}
                theme={theme}
              />
            ))}
          </div>

          <div className="text-center mt-3">
            <button
              className="btn btn-primary px-4"
              onClick={handleSubmit}
              disabled={
                Object.keys(state.answers).length < state.questions.length
              }
            >
              Submit Quiz
            </button>
          </div>
        </>
      ) : (
        <div className="text-center mt-5">
          <p className={theme === "dark" ? "text-warning" : "text-danger"}>
            No questions available for this subject.
          </p>
          <button
            className="btn btn-primary mt-3"
            onClick={handleBackToSubjects}
          >
            Back to Subjects
          </button>
        </div>
      )}
    </div>
  );
}

export default QuestionBank;
