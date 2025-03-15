import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./card.css";

function SubjectCard() {
  const subjects = [
    { title: "Biology", icon: "/person_cat.jpg", color: "#ffffff" },
    { title: "Physics", icon: "/Analytics.png", color: "#0d6efd" },
    { title: "Chemistry", icon: "/person_cat.jpg", color: "#ffffff" },
    { title: "Computer", icon: "/Analytics.png", color: "#0d6efd" },
    { title: "English", icon: "/person_cat.jpg", color: "#ffffff" },
  ];

  const [index, setIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);

  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth < 768) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };
    updateVisibleCards();
    window.addEventListener("resize", updateVisibleCards);
    return () => window.removeEventListener("resize", updateVisibleCards);
  }, []);

  const handleNext = () =>
    setIndex((prevIndex) => (prevIndex + 1) % subjects.length);

  const handlePrev = () =>
    setIndex(
      (prevIndex) => (prevIndex - 1 + subjects.length) % subjects.length
    );

  const currentVisibleCards = Array.from(
    { length: visibleCards },
    (_, i) => subjects[(index + i) % subjects.length]
  );

  return (
    <div className="py-4 d-flex flex-column align-items-center custom-container border-bottom border-2 border-primary text-white">
      <h1 className="text-center mb-4">Subject Based Preparation</h1>
      <div className="slider-container position-relative d-flex justify-content-center w-100">
        <button
          className="arrow-btn left position-absolute start-0 top-50 translate-middle-y ms-3"
          onClick={handlePrev}
          style={{ zIndex: 10 }}
        >
          <i className="bi bi-arrow-left-circle fs-1"></i>
        </button>
        <div
          className="scroll-container d-flex justify-content-center py-3"
          style={{ gap: "20px" }}
        >
          {currentVisibleCards.map((subject, idx) => (
            <div
              key={idx}
              className="scroll-item p-4 mx-3 d-flex flex-column justify-content-between rounded-4 shadow-lg"
              style={{
                backgroundColor: subject.color,
                width: "250px",
                height: "200px",
                color: "white",
                transition: "transform 0.5s ease-in-out",
              }}
            >
              <h5>
                <span
                  className="badge rounded-pill px-3 py-2"
                  style={{
                    backgroundColor:
                      subject.color === "#ffffff" ? "#0d6efd" : "#ffffff",
                    color: subject.color,
                  }}
                >
                  {subject.title}
                </span>
              </h5>
              <div className="d-flex justify-content-between align-items-end w-100">
                <img
                  src="Vector1.svg"
                  className="fs-3 rounded-circle p-1 img-fluid"
                  style={{
                    backgroundColor:
                      subject.color === "#ffffff" ? "#0d6efd" : "#ffffff",
                    width: 30,
                    height: 30,
                  }}
                />
                <img
                  src={subject.icon}
                  alt="icon"
                  className="img-fluid"
                  style={{ width: 150, height: 120 }}
                />
              </div>
            </div>
          ))}
        </div>
        <button
          className="arrow-btn right position-absolute end-0 top-50 translate-middle-y me-3"
          onClick={handleNext}
          style={{ zIndex: 10 }}
        >
          <i className="bi bi-arrow-right-circle fs-1"></i>
        </button>
      </div>
      <div className="dots-container mt-3">
        {subjects.map((_, idx) => (
          <span
            key={idx}
            className={`dot ${idx === index ? "active" : ""}`}
            onClick={() => setIndex(idx)}
          ></span>
        ))}
      </div>
    </div>
  );
}

export default SubjectCard;
