import Footer from "../../components/Footer/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import "./ContactUs.css";
import React from "react";

function ContactUs() {
  return (
    <>
      <Section1></Section1>
      <Section2></Section2>
      <Section3></Section3>
    </>
  );
}
function Section1() {
  return (
    <>
      <div className="container text-white custom-container border-bottom border-2 border-primary d-flex flex-column align-items-center text-center">
        <div className="col-12">
          <h1>
            Get in <span className="text-primary">Touch</span> With Us!
          </h1>
          <h4>We are here to guide you on your academic journey</h4>
          <p>
            Whether it's university selection, test preparation, or guidance
            through our chatbot, we are here to help.
          </p>
        </div>
        <div className="col-12 mt-4">
          <img
            src="/contact.png"
            alt="person on phone"
            className="img-fluid shadow custom-img"
          />
        </div>
      </div>
    </>
  );
}
function Section2() {
  return (
    <div className="container text-white custom-container border-bottom border-2 border-primary">
      <div className="row justify-content-center text-center">
        <h3 className="mb-3 text-center">How to reach us</h3>

        <div className="col-12 col-md-6 d-flex justify-content-center align-items-center gap-3">
          <img src="/Phone.svg" alt="Phone icon" className="img-fluid" />
          <p className="mb-0 fw-bold">Phone Number</p>
          <p className="mb-0">+923124265692</p>
        </div>

        <div className="col-12 col-md-6 d-flex justify-content-center align-items-center gap-3 mt-3 mt-md-0">
          <img src="/Email.svg" alt="email icon" className="img-fluid" />
          <p className="mb-0 fw-bold">Email Address</p>
          <p className="mb-0">support@guidera.com</p>
        </div>
      </div>
    </div>
  );
}
function Section3() {
  return (
    <div className="p-4 rounded custom-container text-light border-bottom border-2 border-primary">
      <h3 className="text-center mb-4">Send Us a Message</h3>
      <div className="d-flex justify-content-center">
        <div className="w-75">
          <form className="row g-3">
            <div className="col-md-6">
              <label htmlFor="firstName" className="form-label">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                className="form-control bg-dark text-light border-primary border-2"
                placeholder="Enter First Name"
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="lastName" className="form-label">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                className="form-control bg-dark text-light border-primary border-2"
                placeholder="Enter Last Name"
              />
            </div>
            <div className="col-12">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="form-control bg-dark text-light border-primary border-2"
                placeholder="name@gmail.com"
              />
            </div>
            <div className="col-12">
              <label htmlFor="subject" className="form-label">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                className="form-control bg-dark text-light border-primary border-2"
                placeholder="What's this about"
              />
            </div>
            <div className="mb-3 col-md-12">
              <label
                htmlFor="messageFormControlTextarea1"
                className="form-label"
              >
                Message
              </label>
              <textarea
                className="form-control bg-dark text-light border-primary border-2"
                id="messageFormControlTextarea1"
                rows="3"
                placeholder="Type Your Message Here"
              ></textarea>
            </div>
            <div className="col-12 text-center">
              <button type="submit" className="btn btn-primary w-50">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
