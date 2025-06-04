import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Question from "./Question";
import ResultsScreen from "./ResultScreen"; // Extracted to separate component
import "bootstrap/dist/css/bootstrap.min.css";

// Or use this arrow function version
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
    return response.data; // Will now include expectedCount
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
  const { subject } = useParams();
  const navigate = useNavigate();

  // State management
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

  // Helper to update state without losing other values
  const updateState = (updates) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  // Fetch questions when component mounts or subject changes
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        updateState({ loading: true, error: "" });

        const {
          questions: fetchedQuestions,
          attemptId,
          startedAt,
          expectedCount, // Get from backend
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
      // Submit answers to backend
      const { total, correct, score } = await apiService.submitTest(
        state.attemptId,
        state.answers
      );

      // Get detailed results from backend
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

  // Grade calculation helper
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
      <div className="container mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading questions...</p>
      </div>
    );
  }

  // Render results screen - FIXED SECTION
  if (state.submitted && state.results) {
    return (
      <ResultsScreen
        results={state.results}
        detailedResults={state.results.detailedResults}
        onTryAgain={handleTryAgain}
        onBackToSubjects={handleBackToSubjects}
        expectedCount={state.expectedCount}
      />
    );
  }

  // Render main quiz interface
  return (
    <div className="container mt-4">
      <h2 className="text-center text-primary">
        {subject.charAt(0).toUpperCase() + subject.slice(1)} Quiz
        {state.expectedCount ? (
          <small>
            ({state.questions.length}/{state.expectedCount})
          </small>
        ) : null}
      </h2>

      {state.error && (
        <div className="alert alert-warning text-center">
          {state.error}
          {state.questions.length > 0 && (
            <button
              className="btn btn-sm btn-outline-secondary ms-2"
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
          <p className="text-danger">
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
