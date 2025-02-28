import Footer from "../../components/Footer/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
function AboutUs() {
  return (
    <>
      <NavigationBar />
      <Section1></Section1>
      <Footer />
    </>
  );
}
function Section1() {
  return (
    <div className="custom-container text-white container-xxl border-bottom border-2 border-primary">
      <div className="row min-vh-20">
        <div className="d-flex flex-column justify-content-center align-items-start p-5">
          <h1>
            Your <span className="text-primary">Academic</span> Partner
          </h1>
          <h5>
            We support students in achieving their academic goals through
            personalized guidance and AI-driven recommendations.
          </h5>
          <div className="d-flex gap-3">
            <button className="btn btn-primary">Learn More</button>
          </div>
          {/* <div className="mt-3 w-100 d-flex justify-content-center">
            <img src="/home2.png" alt="Home2" width={200} height={200} />
          </div> */}
        </div>

        {/* <div className="col-md-6 d-flex justify-content-center align-items-center p-0">
          <img src="/home1.PNG" alt="Home1" width={400} height={400} />
        </div> */}
      </div>
    </div>
  );
}

export default AboutUs;
