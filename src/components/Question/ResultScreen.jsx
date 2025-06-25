import React, { useState } from "react";
import PropTypes from "prop-types";

const ResultsScreen = ({
  results,
  detailedResults,
  onTryAgain,
  onBackToSubjects,
  expectedCount = 5,
}) => {
  const incorrect = results.total - results.correct;
  const [showAllAnswers, setShowAllAnswers] = useState(false);

  const toggleShowAllAnswers = () => {
    setShowAllAnswers(!showAllAnswers);
  };

  return (
    <div className="container mt-2 text-center">
      {/* Show warning if test was shorter than expected */}
      {results.total < expectedCount && (
        <div className="alert alert-warning">
          Note: This test was shorter than usual ({results.total} questions
          instead of {expectedCount})
        </div>
      )}

      <h1 className="display-4">Performance Summary</h1>

      {/* Circular progress indicator */}
      <div className="mt-4">
        <div className="position-relative d-inline-flex align-items-center justify-content-center">
          <div
            className="progress-circle-overlay"
            style={{
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              border: "10px solid #e0e0e0",
              position: "relative",
            }}
          >
            <div
              className="progress-circle-fill"
              style={{
                position: "absolute",
                top: "-10px",
                left: "-10px",
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                border: "10px solid transparent",
                borderTopColor: "#4FFDB0",
                borderRightColor: "#4CAF50",
                transform: `rotate(${
                  (360 * results.percentage) / 100 - 90
                }deg)`,
                clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)",
              }}
            ></div>
            <div className="position-absolute top-50 start-50 translate-middle">
              <h2 className="display-4 mb-0 fw-bold">{results.percentage}%</h2>
            </div>
          </div>
        </div>
        <h3 className="mt-2 fw-bold">Grade: {results.grade}</h3>
      </div>

      {/* Correct/Incorrect counters */}
      <div className="d-flex justify-content-center align-items-center m-5">
        <div
          className="row bg-dark p-3 rounded"
          style={{ maxWidth: "550px", width: "100%" }}
        >
          <div className="col-6 text-center text-white border-end">
            <h3 className="text-success">{results.correct}</h3>
            <p className="fw-bold">Correct</p>
          </div>
          <div className="col-6 text-center text-white">
            <h3 className="text-danger">{incorrect}</h3>
            <p className="fw-bold">Incorrect</p>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4" style={{ maxWidth: "500px", margin: "0 auto" }}>
        <div className="progress" style={{ height: "30px" }}>
          <div
            className="progress-bar"
            style={{ width: `${results.percentage}%`, background: "#4FFDB0" }}
          ></div>
        </div>
        <div className="d-flex justify-content-between mt-2">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Show Answers button */}
      {detailedResults && (
        <div className="mt-4">
          <button
            className={`btn ${
              showAllAnswers ? "btn-secondary" : "btn-primary"
            } px-4 py-2`}
            onClick={toggleShowAllAnswers}
          >
            {showAllAnswers ? "Hide Answers" : "Show Answers"}
          </button>
        </div>
      )}

      {/* Detailed results section - Shows all when button is clicked */}
      {showAllAnswers && detailedResults && (
        <div
          className="mt-5 text-start"
          style={{ maxWidth: "800px", margin: "0 auto" }}
        >
          <h3 className="mb-4">Question Details</h3>
          {detailedResults.map((result, index) => (
            <div
              key={result.id}
              className={`card mb-3 ${
                result.is_correct ? "border-success" : "border-danger"
              }`}
            >
              <div className="card-body">
                <h5 className="card-title">Question {index + 1}</h5>
                <p className="card-text">{result.question}</p>

                <div className="mb-2">
                  <strong>Your answer:</strong>{" "}
                  {result.selected_ans || "Not answered"}
                </div>
                <div className="mb-2">
                  <strong>Correct answer:</strong> {result.correct_ans}
                </div>

                {result.explanation && (
                  <div className="alert alert-light mt-2">
                    <strong>Explanation:</strong> {result.explanation}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action buttons */}
      <div className="d-flex justify-content-center gap-3 mt-4 mb-5">
        <button
          className="btn btn-outline-primary px-4 py-2 fw-bold"
          onClick={onBackToSubjects}
        >
          Back to Subjects
        </button>
        <button
          className="btn btn-primary px-4 py-2 fw-bold"
          onClick={onTryAgain}
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

ResultsScreen.propTypes = {
  results: PropTypes.shape({
    total: PropTypes.number.isRequired,
    correct: PropTypes.number.isRequired,
    percentage: PropTypes.number.isRequired,
    grade: PropTypes.string.isRequired,
  }).isRequired,
  detailedResults: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      question: PropTypes.string.isRequired,
      selected_ans: PropTypes.string,
      correct_ans: PropTypes.string.isRequired,
      explanation: PropTypes.string,
      is_correct: PropTypes.bool.isRequired,
    })
  ),
  onTryAgain: PropTypes.func.isRequired,
  onBackToSubjects: PropTypes.func.isRequired,
  expectedCount: PropTypes.number.isRequired,
};

export default ResultsScreen;
