import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Question from "./Question";
import "bootstrap/dist/css/bootstrap.min.css";

const questionsData = {
  biology: [
    {
      id: 1,
      text: "What is the powerhouse of the cell?",
      options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi body"],
      correct: "Mitochondria",
    },
    {
      id: 2,
      text: "What carries oxygen in the blood?",
      options: ["White blood cells", "Platelets", "Hemoglobin", "Plasma"],
      correct: "Hemoglobin",
    },
    {
      id: 3,
      text: "What is the basic unit of life?",
      options: ["Atom", "Tissue", "Cell", "Organ"],
      correct: "Cell",
    },
    {
      id: 4,
      text: "Which organ filters blood?",
      options: ["Liver", "Kidney", "Heart", "Lungs"],
      correct: "Kidney",
    },
    {
      id: 5,
      text: "What is the longest bone in the body?",
      options: ["Femur", "Humerus", "Tibia", "Fibula"],
      correct: "Femur",
    },
    {
      id: 6,
      text: "What is the function of the cerebrum?",
      options: ["Balance", "Memory", "Digestion", "Breathing"],
      correct: "Memory",
    },
    {
      id: 7,
      text: "What is the primary function of red blood cells?",
      options: [
        "Fight infection",
        "Transport oxygen",
        "Digest food",
        "Produce hormones",
      ],
      correct: "Transport oxygen",
    },
    {
      id: 8,
      text: "Where does photosynthesis occur?",
      options: ["Chloroplast", "Mitochondria", "Nucleus", "Ribosome"],
      correct: "Chloroplast",
    },
    {
      id: 9,
      text: "Which part of the brain controls balance?",
      options: ["Cerebrum", "Cerebellum", "Brainstem", "Hypothalamus"],
      correct: "Cerebellum",
    },
    {
      id: 10,
      text: "What is the human body's largest organ?",
      options: ["Liver", "Skin", "Heart", "Lungs"],
      correct: "Skin",
    },
  ],
  physics: [
    {
      id: 1,
      text: "What is the SI unit of force?",
      options: ["Joule", "Watt", "Newton", "Pascal"],
      correct: "Newton",
    },
    {
      id: 2,
      text: "What is the speed of light?",
      options: ["3 x 10^8 m/s", "3 x 10^6 m/s", "3 x 10^5 m/s", "3 x 10^9 m/s"],
      correct: "3 x 10^8 m/s",
    },
    {
      id: 3,
      text: "What does E=mc² represent?",
      options: ["Force", "Energy", "Momentum", "Power"],
      correct: "Energy",
    },
    {
      id: 4,
      text: "Which law states that an object at rest stays at rest?",
      options: [
        "Newton's First Law",
        "Newton's Second Law",
        "Newton's Third Law",
        "Law of Gravity",
      ],
      correct: "Newton's First Law",
    },
    {
      id: 5,
      text: "What is the unit of electrical resistance?",
      options: ["Ohm", "Ampere", "Volt", "Joule"],
      correct: "Ohm",
    },
    {
      id: 6,
      text: "What type of mirror is used in car rear-view mirrors?",
      options: ["Concave", "Convex", "Plane", "None"],
      correct: "Convex",
    },
    {
      id: 7,
      text: "What is the acceleration due to gravity?",
      options: ["9.8 m/s²", "10 m/s²", "5 m/s²", "7.2 m/s²"],
      correct: "9.8 m/s²",
    },
    {
      id: 8,
      text: "What property of a wave determines its pitch?",
      options: ["Amplitude", "Wavelength", "Frequency", "Speed"],
      correct: "Frequency",
    },
    {
      id: 9,
      text: "What is the SI unit of work?",
      options: ["Joule", "Watt", "Newton", "Pascal"],
      correct: "Joule",
    },
    {
      id: 10,
      text: "What is the principle of a rocket launch?",
      options: ["Gravity", "Buoyancy", "Newton's Third Law", "Friction"],
      correct: "Newton's Third Law",
    },
  ],
  chemistry: [
    {
      id: 1,
      text: "What is the chemical symbol for water?",
      options: ["H2O", "O2", "CO2", "NaCl"],
      correct: "H2O",
    },
    {
      id: 2,
      text: "What is the pH of pure water?",
      options: ["5", "7", "9", "3"],
      correct: "7",
    },
    {
      id: 3,
      text: "Which gas is essential for combustion?",
      options: ["Nitrogen", "Oxygen", "Carbon Dioxide", "Helium"],
      correct: "Oxygen",
    },
    {
      id: 4,
      text: "What is the atomic number of Carbon?",
      options: ["6", "8", "12", "14"],
      correct: "6",
    },
    {
      id: 5,
      text: "What is the formula of Sodium Chloride?",
      options: ["NaCl", "KCl", "HCl", "NaOH"],
      correct: "NaCl",
    },
    {
      id: 6,
      text: "Which type of bond is present in NaCl?",
      options: ["Covalent", "Ionic", "Metallic", "Hydrogen"],
      correct: "Ionic",
    },
    {
      id: 7,
      text: "Which element is a noble gas?",
      options: ["Oxygen", "Nitrogen", "Helium", "Sulfur"],
      correct: "Helium",
    },
    {
      id: 8,
      text: "What is the main component of natural gas?",
      options: ["Methane", "Ethane", "Propane", "Butane"],
      correct: "Methane",
    },
    {
      id: 9,
      text: "Which acid is found in the stomach?",
      options: [
        "Sulfuric Acid",
        "Hydrochloric Acid",
        "Acetic Acid",
        "Nitric Acid",
      ],
      correct: "Hydrochloric Acid",
    },
    {
      id: 10,
      text: "What type of reaction is burning of fuel?",
      options: ["Reduction", "Oxidation", "Neutralization", "Hydrolysis"],
      correct: "Oxidation",
    },
  ],
  computer: [
    {
      id: 1,
      text: "What does CPU stand for?",
      options: [
        "Central Process Unit",
        "Central Processing Unit",
        "Computer Personal Unit",
        "Central Processor Unit",
      ],
      correct: "Central Processing Unit",
    },
    {
      id: 2,
      text: "Which of the following is an example of an Operating System?",
      options: ["Microsoft Word", "Google Chrome", "Linux", "Intel"],
      correct: "Linux",
    },
    {
      id: 3,
      text: "Which language is used to create web pages?",
      options: ["C++", "Python", "HTML", "Java"],
      correct: "HTML",
    },
    {
      id: 4,
      text: "What does RAM stand for?",
      options: [
        "Read Access Memory",
        "Random Access Memory",
        "Run All Memory",
        "Random Allocated Memory",
      ],
      correct: "Random Access Memory",
    },
    {
      id: 5,
      text: "Which device is used for input?",
      options: ["Monitor", "Printer", "Keyboard", "Speaker"],
      correct: "Keyboard",
    },
    {
      id: 6,
      text: "Which unit is used to measure the speed of a processor?",
      options: ["Hertz", "Bytes", "Pixels", "Volts"],
      correct: "Hertz",
    },
    {
      id: 7,
      text: "Which of the following is an example of system software?",
      options: ["MS Excel", "Windows 10", "Adobe Photoshop", "Google Chrome"],
      correct: "Windows 10",
    },
    {
      id: 8,
      text: "What is the full form of HTTP?",
      options: [
        "HyperText Transfer Protocol",
        "High Transfer Text Protocol",
        "Hyper Transfer Text Program",
        "High Transmission Text Protocol",
      ],
      correct: "HyperText Transfer Protocol",
    },
    {
      id: 9,
      text: "Which of the following is a programming language?",
      options: ["Windows", "Python", "Google", "Adobe"],
      correct: "Python",
    },
    {
      id: 10,
      text: "Which of the following is considered volatile memory?",
      options: ["HDD", "SSD", "RAM", "ROM"],
      correct: "RAM",
    },
  ],
  english: [
    {
      id: 1,
      text: "What is the synonym of 'Happy'?",
      options: ["Sad", "Angry", "Joyful", "Tired"],
      correct: "Joyful",
    },
    {
      id: 2,
      text: "Which word is a noun?",
      options: ["Quickly", "Run", "Happiness", "Bright"],
      correct: "Happiness",
    },
    {
      id: 3,
      text: "What is the plural of 'child'?",
      options: ["Childs", "Children", "Childes", "Childies"],
      correct: "Children",
    },
    {
      id: 4,
      text: "Which is a correct sentence?",
      options: [
        "He go to school.",
        "He goes to school.",
        "He going to school.",
        "He goed to school.",
      ],
      correct: "He goes to school.",
    },
    {
      id: 5,
      text: "What is the antonym of 'Brave'?",
      options: ["Fearful", "Strong", "Bold", "Confident"],
      correct: "Fearful",
    },
    {
      id: 6,
      text: "Which word is an adjective?",
      options: ["Run", "Happy", "Quickly", "Jump"],
      correct: "Happy",
    },
    {
      id: 7,
      text: "Which is the correct form of past tense for 'Go'?",
      options: ["Goes", "Going", "Went", "Gone"],
      correct: "Went",
    },
    {
      id: 8,
      text: "What is a pronoun?",
      options: ["Run", "He", "Quick", "Table"],
      correct: "He",
    },
    {
      id: 9,
      text: "Which is an example of an interjection?",
      options: ["Wow!", "Run", "Table", "Quick"],
      correct: "Wow!",
    },
    {
      id: 10,
      text: "Which sentence is correct?",
      options: [
        "She have a book.",
        "She has a book.",
        "She haves a book.",
        "She having a book.",
      ],
      correct: "She has a book.",
    },
  ],
};

function QuestionBank() {
  const { subject } = useParams();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState(false);
  const [submitted, setSubmitted] = useState(false); // New state
  const [results, setResults] = useState(null);
  useEffect(() => {
    setAnswers({});
    setError(false);
    setSubmitted(false);
    setResults(null);
  }, [subject]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const calculateResults = () => {
    const questions = questionsData[subject];
    let correct = 0;
    let incorrect = 0;

    questions.forEach((q) => {
      if (answers[q.id] === q.correct) {
        correct++;
      } else {
        incorrect++;
      }
    });

    const percentage = Math.round((correct / questions.length) * 100);
    let grade = "F";

    if (percentage >= 90) grade = "A";
    else if (percentage >= 80) grade = "B";
    else if (percentage >= 70) grade = "C";
    else if (percentage >= 60) grade = "D";

    return {
      correct,
      incorrect,
      percentage,
      grade,
      total: questions.length,
    };
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < questionsData[subject].length) {
      setError(true);
    } else {
      setResults(calculateResults());
      setSubmitted(true);
    }
  };
  const handleTryAgain = () => {
    // Reset the quiz state to start again
    setAnswers({});
    setError(false);
    setSubmitted(false);
    setResults(null);
  };

  const handleBackToSubjects = () => {
    // Navigate back to the subjects page
    navigate("/TestPreparation");
  };

  const ResultsScreen = ({ results, onTryAgain, onBackToSubjects }) => {
    return (
      <div className="container mt-2 text-center">
        <h1 className="display-4">Performance Summary</h1>
        <div className="mt-4">
          {/* Hollow circular progress bar */}
          <div className="position-relative d-inline-flex align-items-center justify-content-center">
            <div
              className="progress-circle-overlay"
              style={{
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                border: "10px solid #e0e0e0", // Light gray background track
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
                  borderTopColor: "#4FFDB0", // Green progress color
                  borderRightColor: "#4CAF50",
                  transform: `rotate(${
                    (360 * results.percentage) / 100 - 90
                  }deg)`,
                  clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)",
                }}
              ></div>
              <div className="position-absolute top-50 start-50 translate-middle">
                <h2 className="display-4 mb-0 fw-bold">
                  {results.percentage}%
                </h2>
              </div>
            </div>
          </div>
          <h3 className="mt-2 fw-bold">Grade: {results.grade}</h3>
        </div>

        {/* Stats container */}
        <div className="d-flex justify-content-center align-items-center m-5">
          <div
            className="row bg-dark p-3 rounded"
            style={{
              maxWidth: "550px",
              width: "100%",
            }}
          >
            <div className="col-6 text-center text-white border-end">
              <h3 className="text-success">{results.correct}</h3>
              <p className="fw-bold">Correct</p>
            </div>
            <div className="col-6 text-center text-white">
              <h3 className="text-danger">{results.incorrect}</h3>
              <p className="fw-bold">Incorrect</p>
            </div>
          </div>
        </div>

        {/* Horizontal progress bar */}
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

        {/* Action buttons */}
        <div className="d-flex justify-content-center gap-3 mt-4 mb-5">
          <button
            className="btn btn-outline-primary px-4 py-2 fw-bold"
            onClick={onBackToSubjects}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Back to Subjects
          </button>
          <button
            className="btn btn-primary px-4 py-2 fw-bold"
            onClick={onTryAgain}
          >
            <i className="bi bi-arrow-repeat me-2"></i>
            Try Again
          </button>
        </div>

        {/* Optional CSS for smoother animation */}
        <style jsx>{`
          .progress-circle-fill {
            transition: transform 0.5s ease;
          }
        `}</style>
      </div>
    );
  };
  return (
    <div className="container mt-4">
      {submitted ? (
        <ResultsScreen
          results={results}
          onTryAgain={handleTryAgain}
          onBackToSubjects={handleBackToSubjects}
        />
      ) : (
        <>
          <h2 className="text-center text-primary">
            {subject.charAt(0).toUpperCase() + subject.slice(1)} Quiz
          </h2>
          {questionsData[subject] ? (
            <div className="list-group mt-3">
              {questionsData[subject].map((q) => (
                <Question
                  key={q.id}
                  question={q}
                  onAnswerChange={handleAnswerChange}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted">No questions available.</p>
          )}
          <div className="text-center mt-3">
            {error && (
              <p className="text-danger text-center">
                Please answer all questions before submitting.
              </p>
            )}
            <button className="btn btn-primary px-4" onClick={handleSubmit}>
              Submit Quiz
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default QuestionBank;
