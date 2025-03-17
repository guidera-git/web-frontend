import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./UniversityList.css";
import { Modal, Button, Nav, Tab, Row, Col, ListGroup } from "react-bootstrap";

const UniversityList = ({
  university,
  onCompare,
  isComparisonDisabled,
  isComparisonCleared,
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [rating, setRating] = useState(university.rating);
  const [isSelectedForComparison, setIsSelectedForComparison] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isComparisonCleared) {
      setIsSelectedForComparison(false);
    }
  }, [isComparisonCleared]);

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleStarClick = (index) => {
    setRating(index + 1);
  };

  const handleComparisonClick = () => {
    if (isComparisonDisabled && !isSelectedForComparison) {
      return;
    }
    setIsSelectedForComparison((prev) => !prev);
    onCompare(university);
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <>
      <div
        className="university-card container p-4 rounded shadow-lg bg-light"
        onClick={handleShowModal}
        style={{ cursor: "pointer", transition: "0.3s", hover: { transform: "scale(1.02)" } }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="fw-bold">{university.name}</h4>
          <div>
            <i
              className={`bi ${isBookmarked ? "bi-bookmark-fill text-warning" : "bi-bookmark"} me-2`}
              onClick={toggleBookmark}
              style={{ cursor: "pointer", fontSize: "1.5rem" }}
            ></i>
            <i
              className={`bi bi-arrow-left-right ${isSelectedForComparison ? "text-primary" : "text-dark"}
              ${isComparisonDisabled && !isSelectedForComparison ? "text-muted" : ""}`}
              style={{
                cursor: isComparisonDisabled && !isSelectedForComparison ? "not-allowed" : "pointer",
                fontSize: "1.5rem",
              }}
              onClick={handleComparisonClick}
              title={
                isComparisonDisabled && !isSelectedForComparison
                  ? "Only two universities can be compared at a time"
                  : "Add to comparison"
              }
            ></i>
          </div>
        </div>

        <div className="row">
          <div className="col-6">
            <p className="text-muted mb-1">Degree</p>
            <h6 className="fw-bold">{university.degree}</h6>

            <p className="text-muted mb-1">Beginning</p>
            <h6 className="fw-bold">{university.beginning}</h6>
            <div className="mt-2">
              {[...Array(5)].map((_, index) => (
                <i
                  key={index}
                  className={`bi ${index + 1 <= rating ? "bi-star-fill text-warning" : "bi-star"} `}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleStarClick(index)}
                ></i>
              ))}
            </div>
          </div>
          <div className="col-6 text-end">
            <p className="text-muted mb-1">Duration</p>
            <h6 className="fw-bold">{university.duration}</h6>

            <p className="text-muted mb-1">Tuition Fee Per Sem</p>
            <h6 className="fw-bold">${university.tuition}</h6>

            <p className="text-muted mt-2">
              <i className="bi bi-geo-alt-fill text-danger"></i> {university.location}
            </p>
          </div>
        </div>
      </div>

      {/* Modal for Detailed Information */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>{university.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#222222", color: "white" }}>
          <Tab.Container defaultActiveKey="overview">
            <Row>
              <Col sm={3}>
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link eventKey="overview">Overview</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="courseDetails">Course Details</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="requirements">Requirements</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="registration">Registration</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="fee">Fee Structure</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="about">About University</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col sm={9}>
                <Tab.Content>
                  <Tab.Pane eventKey="overview">
                    <h5>Overview</h5>
                    <p>{university.overview}</p>
                  </Tab.Pane>
                  <Tab.Pane eventKey="courseDetails">
                    <h5>Course Details</h5>
                    <ListGroup>
                      {(university.courses || []).map((course, index) => (
                        <ListGroup.Item key={index}>{course}</ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Tab.Pane>
                  <Tab.Pane eventKey="requirements">
                    <h5>Admission Requirements</h5>
                    <ul>
                      {(university.requirements || []).map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </Tab.Pane>
                  <Tab.Pane eventKey="registration">
                    <h5>How to Register</h5>
                    <p>{university.registration}</p>
                  </Tab.Pane>
                  <Tab.Pane eventKey="fee">
                    <h5>Fee Structure</h5>
                    <p>
                      <strong>Tuition per Semester:</strong> ${university.tuition}
                    </p>
                    <p><strong>Other Fees:</strong> {university.otherFees}</p>
                  </Tab.Pane>
                  <Tab.Pane eventKey="about">
                    <h5>About {university.name}</h5>
                    <p>{university.about}</p>
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: "#222222", color: "white" }}>
          <Button variant="secondary" className="btn-primary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
};

export default UniversityList;
