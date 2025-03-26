import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Question({ question, onAnswerChange }) {
  return (
    <div className="list-group-item border rounded shadow-sm p-3 mb-3">
      <h5>{`Q${question.id}: ${question.text}`}</h5>
      {question.options.map((option, idx) => (
        <div key={idx} className="form-check mt-2">
          <input
            className="form-check-input border-3"
            type="radio"
            name={`question-${question.id}`}
            id={`option-${question.id}-${idx}`}
            value={option}
            onChange={(e) => onAnswerChange(question.id, e.target.value)}
          />
          <label
            className="form-check-label"
            htmlFor={`option-${question.id}-${idx}`}
          >
            {option}
          </label>
        </div>
      ))}
    </div>
  );
}

export default Question;
