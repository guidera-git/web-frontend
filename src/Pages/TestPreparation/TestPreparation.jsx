import Footer from "../../components/Footer/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import "./TestPreparation.css";
import React from "react";
import { useRef } from "react";

function TestPreparation() {
  return (
    <>
      <NavigationBar />
      <Section1></Section1>
      <Section2></Section2>
      <Section3></Section3>
      <Footer />
    </>
  );
}
function Section1() {
  return (
    <div className="custom-container border-bottom border-2 border-primary text-white py-5">
      <div className="container">
        <div className="d-flex flex-column flex-lg-row align-items-center bg-light text-dark p-4 rounded shadow-lg">
          <div className="text-center text-lg-start flex-grow-1 p-3">
            <h2 className="fw-bold text-primary">Test Preparation</h2>
            <h4 className="fw-bold">
              Ace Your <span className="text-primary">University</span> Entrance
              Tests with Confidence!
            </h4>
            <p className="text-muted">
              Access tailored resources, test strategies, and progress tracking
              to achieve your goals.
            </p>
            <button className="btn btn-primary mt-2">Explore Resources</button>
          </div>
          <div className="d-flex justify-content-center p-3">
            <img
              src="book_pen.png"
              alt="Study Materials"
              className="img-fluid rounded"
            />
          </div>
        </div>
        <div className="mt-4 text-center">
          <div className="mx-auto" style={{ maxWidth: "400px" }}>
            <select className="form-select mb-3">
              <option>Choose the Test</option>
              <option>SAT</option>
              <option>NAT</option>
              <option>ECAT</option>
              <option>NED</option>
            </select>
            <button className="btn btn-primary">Start Now</button>
          </div>
        </div>
      </div>
    </div>
  );
}
function Section2() {
  const subjects = [
    { title: "Biology", icon: "/person_cat.jpg", color: "bg-primary" },
    { title: "Physics", icon: "/Analytics.png", color: "bg-light" },
    { title: "Chemistry", icon: "/person_cat.jpg", color: "bg-primary" },
    { title: "Computer", icon: "/Analytics.png", color: "bg-light" },
    { title: "English", icon: "/person_cat.jpg", color: "bg-primary" },
  ];

  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction * 300, behavior: "smooth" });
    }
  };

  return (
    <div className="text-center custom-container text-white py-4 border-bottom border-2 border-primary">
      <h4 className="fw-bold">Subject Based Preparation</h4>
      <div className="position-relative">
        <button
          className="scroll-btn left btn btn-dark position-absolute top-50 start-0 translate-middle-y"
          onClick={() => handleScroll(-1)}
        >
          ◀
        </button>

        <div
          ref={scrollRef}
          className="d-flex overflow-auto gap-3 px-3 py-2 scroll-container"
        >
          {subjects.map((subject, index) => (
            <div
              key={index}
              className={`subject-card d-flex flex-column align-items-center justify-content-center ${subject.color}`}
            >
              <span
                className={`badge ${
                  !subject.color ? "bg-light" : "bg-primary"
                }`}
              >
                {subject.title}
              </span>
              <img
                src={subject.icon}
                alt={subject.title}
                className="img-fluid"
              />
              <button className="btn btn-primary mt-2">➜</button>
            </div>
          ))}
        </div>

        <button
          className="scroll-btn right btn btn-dark position-absolute top-50 end-0 translate-middle-y"
          onClick={() => handleScroll(1)}
        >
          ▶
        </button>
      </div>

      {/* Dots for Indicators */}
      <div className="mt-2">
        <span className="dot active"></span>
        <span className="dot"></span>
      </div>
    </div>
  );
}
function Section3() {
  const categories = [
    { title: "Past Papers", icon: "/Brain.svg" },
    { title: "Practice Questions", icon: "/Paper.svg" },
    { title: "Video Tutorials", icon: "/Video.svg" },
  ];

  return (
    <div className="text-center custom-container text-white py-4 border-bottom border-2 border-primary ">
      <h4 className="fw-bold mb-5">Test Material Categories</h4>

      <div className="row g-4 px-3">
        {categories.map((category, index) => (
          <div
            key={index}
            className="col-12 col-md-4 col-lg-4 d-flex flex-column align-items-center justify-content-center"
          >
            <div className="category-card d-flex flex-column align-items-center p-4">
              <img
                src={category.icon}
                alt={category.title}
                className="icon-img mb-3"
              />
              <p className="fw-semibold mt-4">{category.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TestPreparation;
