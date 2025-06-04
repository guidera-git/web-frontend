import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "bootstrap/dist/css/bootstrap.min.css";

function Question({
  question,
  questionNumber,
  totalQuestions,
  onAnswerChange,
}) {
  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    setSelectedOption("");
  }, [question]);

  const handleOptionChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    onAnswerChange(question.id, selectedValue); // Pass exact selected value
  };

  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-header bg-primary text-white">
        Question {questionNumber}
      </div>
      <div className="card-body">
        <h5 className="card-title">{question.question}</h5>
        <form>
          {question.options.map((option, index) => (
            <div key={index} className="form-check">
              <input
                className="form-check-input border-2"
                type="radio"
                name={`question-${question.id}`}
                value={option} // Use full string value
                checked={selectedOption === option}
                onChange={handleOptionChange}
                id={`q${question.id}-option-${index}`}
              />
              <label
                className="form-check-label"
                htmlFor={`q${question.id}-option-${index}`}
              >
                {option}
              </label>
            </div>
          ))}
        </form>
      </div>
    </div>
  );
}

Question.propTypes = {
  question: PropTypes.object.isRequired,
  questionNumber: PropTypes.number.isRequired,
  totalQuestions: PropTypes.number.isRequired,
  onAnswerChange: PropTypes.func.isRequired,
};

export default Question;
