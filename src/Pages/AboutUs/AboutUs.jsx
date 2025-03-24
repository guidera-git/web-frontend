import Footer from "../../components/Footer/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import "./AboutUs.css";
import { ThemeContext } from "../../ThemeContext";
import React, { useContext, useState } from "react";
import { Carousel } from "react-bootstrap";

function AboutUs() {
  const { theme } = useContext(ThemeContext);
  return (

    <div className={`find-university ${theme}`}>
      <Section1></Section1>
      <Section2></Section2>
      <Section3></Section3>
    </div>
  );
}
function Section1() {
  return (
    <>
      <div className="custom-container border-bottom border-2 border-primary">
        <div className="header text-center text-white">
          <div className="container">
            <h1 className="heading-title">
              Your <span className="text-primary">Academic</span> Partner
            </h1>
            <h4 className="sub-heading">
              Guidera is here to guide your academic journey with AI-powered
              assistance.
            </h4>
            <p className="description-text">
              Are you confused about which university to choose or which degree
              fits your goals? Guidera is here to guide you every step of the
              way - from identifying the best university for you to acing your
              entry tests. We ensure you never feel lost in this journey.
            </p>
            <div className="mt-4">
              <button className="btn btn-primary btn-lg rounded-pill start-btn">
                Start Your Journey Now
              </button>
            </div>
          </div>
        </div>
        <div className="container-fluid image-section">
          <div className="row justify-content-center align-items-center no-gutters">
            <div className="col-4 img-wrapper">
              <img
                src="/person1.png"
                alt="Person 1"
                className="img-fluid rounded shadow side-img"
              />
            </div>
            <div className="col-4 mt-5 img-wrapper central-img-wrapper">
              <img
                src="/person2.png"
                alt="Person 2"
                className="img-fluid rounded shadow central-img"
              />
            </div>
            <div className="col-4 img-wrapper">
              <img
                src="/person3.png"
                alt="Person 3"
                className="img-fluid rounded shadow side-img"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
function Section2() {
  return (
    <div className="custom-container text-white border-bottom border-2 border-primary">
      <div className="container mt-5">
        <h2 className="text-center mb-4">
          Challenges Faced by Pakistani Students
        </h2>
        <div className="challenge-box">
          <div className="challenge-item">
            <strong>1.</strong> Choosing the right university can be
            overwhelming with so many options and limited guidance.
          </div>
          <div className="challenge-item">
            <strong>2.</strong> Test preparation resources are scattered,
            leaving students unsure about how to prepare effectively.
          </div>
          <div className="challenge-item">
            <strong>3.</strong> Test preparation resources are scattered,
            leaving students unsure about how to prepare effectively.
          </div>
        </div>

        <h2 className="text-center mt-5 mb-4">
          How Guidera Solves These Problems
        </h2>
        <div className="solution-box ">
          <div className="solution-item">
            Personalized AI to recommend universities and degrees based on your
            goals and preferences.
          </div>
          <div className="solution-item mt-2">
            Personalized AI and other comprehensive test preparation resources
            to help you excel in entrance exams.
          </div>
          <div className="solution-item">
            Personalized AI and other comprehensive test preparation resources
            to help you excel in entrance exams.
          </div>
        </div>
      </div>
    </div>
  );
}
const Section3 = () => {
  const teamMembers = [
    { name: "Aliyaan Umar", role: "Team Lead" },
    { name: "Hamza Raza Hussain", role: "Top Developer" },
    { name: "Sami Ullah", role: "AI Specialist" },
    { name: "Saad Mahmood", role: "Data Scientist" },
  ];

  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    if (selectedIndex >= Math.ceil(teamMembers.length / 2)) {
      setIndex(0);
    } else {
      setIndex(selectedIndex);
    }
  };

  return (
    <div className="custom-container text-center py-5 border-bottom border-2 border-primary">
      <h2 className="text-white">Meet Our Team</h2>
      <hr className="team-underline mb-4" />
      <p className="text-white">
        Our passionate team is committed to guiding students in Pakistan through
        this crucial phase of their academic journey.
      </p>

      <Carousel
        indicators={false}
        controls={true}
        interval={null} // No auto-scroll
        activeIndex={index}
        onSelect={handleSelect}
        className="team-carousel"
      >
        {Array.from({ length: Math.ceil(teamMembers.length / 2) }).map(
          (_, i) => (
            <Carousel.Item key={i}>
              <div className="d-flex justify-content-center">
                {teamMembers.slice(i * 2, i * 2 + 2).map((member, idx) => (
                  <div className="team-card mx-2" key={idx}>
                    <img
                      src="./blueprint.png"
                      alt={member.name}
                      className="team-img"
                    />
                    <h5 className="mt-3 text-white">{member.name}</h5>
                    <p className="text-primary">{member.role}</p>
                  </div>
                ))}
              </div>
            </Carousel.Item>
          )
        )}
      </Carousel>
    </div>
  );
};
export default AboutUs;
