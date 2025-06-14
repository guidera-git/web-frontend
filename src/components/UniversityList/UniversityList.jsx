import React, { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./UniversityList.css";
import { ThemeContext } from "../../ThemeContext";
import {
  Modal,
  Button,
  Nav,
  Tab,
  Row,
  Col,
  ListGroup,
  Spinner,
} from "react-bootstrap";
import axios from "axios";

const UniversityList = ({
  university,
  onCompare,
  isComparisonDisabled,
  isComparisonCleared,
}) => {
  const { theme } = useContext(ThemeContext);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isSelectedForComparison, setIsSelectedForComparison] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [programDetails, setProgramDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const universityId =
    university?.university_id || university?.id || university?.uid;

  // Load bookmark from localStorage
  useEffect(() => {
    const storedBookmarks = JSON.parse(
      localStorage.getItem("bookmarkedUniversities") || "{}"
    );

    if (universityId && storedBookmarks[universityId]) {
      setIsBookmarked(true);
    }
  }, [universityId]);

  // Reset comparison toggle if cleared from parent
  useEffect(() => {
    if (isComparisonCleared) {
      setIsSelectedForComparison(false);
    }
  }, [isComparisonCleared]);

  const toggleBookmark = () => {
    const stored = JSON.parse(
      localStorage.getItem("bookmarkedUniversities") || "{}"
    );
    if (isBookmarked) {
      delete stored[universityId];
    } else {
      stored[universityId] = university;
    }
    localStorage.setItem("bookmarkedUniversities", JSON.stringify(stored));
    setIsBookmarked(!isBookmarked);
  };

  const handleComparisonClick = () => {
    if (isComparisonDisabled && !isSelectedForComparison) return;
    setIsSelectedForComparison((prev) => !prev);
    onCompare(university);
  };

  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };
  const programId = university.program_id;

  const handleShowModal = async () => {
    setShowModal(true);
    if (!programDetails && programId) {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:3000/api/programs/specific/${programId}`,
          authHeader
        );
        setProgramDetails(response.data);
      } catch (error) {
        console.error("Error fetching program details:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Helper to get data - uses API data if available, falls back to props
  const getData = (key) => {
    return programDetails?.[key] || university?.[key];
  };

  if (!university) return null;

  return (
    <>
      {/* University Card - uses only props data */}
      <div
        className={`university-card container p-4 rounded shadow-lg ${
          theme === "dark" ? "bg-dark text-light" : "bg-light text-dark"
        }`}
        style={{ cursor: "pointer", transition: "0.3s" }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <div className="d-flex justify-content-between align-items-center">
          <h5
            className="fw-bold"
            style={{ maxWidth: "400px", wordBreak: "break-word" }}
          >
            {university?.university_title || "Unknown University"}
          </h5>
          <div>
            <i
              className={`bi ${
                isBookmarked ? "bi-bookmark-fill text-primary" : "bi-bookmark"
              } me-2`}
              onClick={toggleBookmark}
              style={{ cursor: "pointer", fontSize: "1.5rem" }}
            ></i>

            <i
              className={`bi bi-arrow-left-right ${
                isSelectedForComparison ? "text-primary" : "text-white"
              } ${
                isComparisonDisabled && !isSelectedForComparison
                  ? "text-muted"
                  : ""
              } me-2`}
              style={{
                cursor:
                  isComparisonDisabled && !isSelectedForComparison
                    ? "not-allowed"
                    : "pointer",
                fontSize: "1.5rem",
              }}
              onClick={handleComparisonClick}
              title={
                isComparisonDisabled && !isSelectedForComparison
                  ? "Only two universities can be compared at a time"
                  : "Add to comparison"
              }
            ></i>

            <i
              className="bi bi-info-circle"
              style={{ fontSize: "1.2rem", cursor: "pointer" }}
              onClick={handleShowModal}
            ></i>
          </div>
        </div>

        <div className="row">
          <div className="col-6">
            <p className="mb-1">Degree</p>
            <h6 className="fw-bold">
              {university?.program_title || university?.degree || "N/A"}
            </h6>
            <p className="mt-2">Location</p>
            <h6>
              <i className="bi bi-geo-alt-fill text-danger"></i>{" "}
              {university?.location || "Unknown Location"}
            </h6>
          </div>

          <div className="col-6 text-end">
            <p className="mb-1">Duration</p>
            <h6 className="fw-bold">{university?.program_duration || "N/A"}</h6>

            <p className="mb-1">Tuition Fee Per Credit Hour</p>
            <h6 className="fw-bold mt-1">
              {Array.isArray(university?.fee) &&
              university.fee[0]?.per_credit_hour_fee
                ? university.fee[0].per_credit_hour_fee
                : "N/A"}
            </h6>
            <p className="mb-1">Total Fee</p>
            <h6 className="fw-bold mt-1">
              {university.fee[0].total_tution_fee || "N/A"}
            </h6>
          </div>
        </div>
      </div>

      {/* Modal - uses API data when available, falls back to props */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            {getData("university_title") || "University Details"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#222222", color: "white" }}>
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="light" />
              <p>Loading program details...</p>
            </div>
          ) : (
            <Tab.Container defaultActiveKey="overview">
              <Row>
                <Col sm={3}>
                  <Nav variant="pills" className="flex-column">
                    {[
                      "overview",
                      "courseDetails",
                      "requirements",
                      "registration",
                      "fee",
                      "about",
                    ].map((key) => (
                      <Nav.Item key={key}>
                        <Nav.Link eventKey={key}>
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </Nav.Link>
                      </Nav.Item>
                    ))}
                  </Nav>
                </Col>
                <Col sm={9}>
                  <Tab.Content>
                    <Tab.Pane eventKey="overview">
                      <h5>Overview</h5>
                      <p>
                        {getData("program_description") ||
                          getData("overview") ||
                          "No overview available."}
                      </p>
                    </Tab.Pane>
                    <Tab.Pane eventKey="courseDetails">
                      <h5>Important Dates</h5>
                      <ListGroup>
                        {Array.isArray(getData("important_dates")) &&
                        getData("important_dates").length > 0 ? (
                          getData("important_dates").map((item, i) => {
                            if (
                              typeof item === "object" &&
                              item.criteria &&
                              item.date
                            ) {
                              return (
                                <ListGroup.Item key={i}>
                                  <strong>{item.criteria}</strong>:{" "}
                                  {new Date(item.date).toLocaleDateString()}
                                </ListGroup.Item>
                              );
                            } else if (typeof item === "object") {
                              return (
                                <ListGroup.Item key={i}>
                                  {Object.entries(item).map(([key, value]) => (
                                    <div key={key}>
                                      <strong>{key}</strong>: {String(value)}
                                    </div>
                                  ))}
                                </ListGroup.Item>
                              );
                            } else {
                              return (
                                <ListGroup.Item key={i}>
                                  {String(item)}
                                </ListGroup.Item>
                              );
                            }
                          })
                        ) : (
                          <ListGroup.Item>No important dates</ListGroup.Item>
                        )}
                      </ListGroup>

                      <h5 className="mt-3">Course Outline</h5>
                      {!getData("course_outline") ? (
                        <p>Not provided</p>
                      ) : (
                        <a
                          href={getData("course_outline")}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Outline
                        </a>
                      )}
                    </Tab.Pane>
                    <Tab.Pane eventKey="requirements">
                      <h5>Admission Requirements</h5>
                      <ListGroup>
                        {Array.isArray(getData("admission_criteria")) &&
                        getData("admission_criteria").length > 0 ? (
                          getData("admission_criteria").map((item, i) =>
                            typeof item === "object" ? (
                              <ListGroup.Item key={i}>
                                {item.criteria ||
                                  item["s.no"] ||
                                  JSON.stringify(item)}
                              </ListGroup.Item>
                            ) : (
                              <ListGroup.Item key={i}>{item}</ListGroup.Item>
                            )
                          )
                        ) : (
                          <ListGroup.Item>No criteria</ListGroup.Item>
                        )}
                      </ListGroup>
                    </Tab.Pane>
                    <Tab.Pane eventKey="registration">
                      <h5>Teaching System</h5>
                      <p>
                        {getData("teaching_system") || "No registration info."}
                      </p>
                    </Tab.Pane>
                    <Tab.Pane eventKey="fee">
                      <h5>Fee Details</h5>
                      <ListGroup>
                        {getData("fee") &&
                        Array.isArray(getData("fee")) &&
                        getData("fee").length > 0 ? (
                          Object.entries(getData("fee")[0]).map(
                            ([key, val]) => (
                              <ListGroup.Item key={key}>
                                <strong>{key}:</strong> {val}
                              </ListGroup.Item>
                            )
                          )
                        ) : (
                          <ListGroup.Item>No fee info</ListGroup.Item>
                        )}
                      </ListGroup>
                    </Tab.Pane>
                    <Tab.Pane eventKey="about">
                      <h5>About {getData("university_title")}</h5>
                      <p>
                        {getData("introduction") || "No information available."}
                      </p>
                      <p>
                        <strong>Contact:</strong>
                        <br />
                        {getData("contact_details")?.call ||
                        getData("contact")?.phone ? (
                          <>
                            <strong> Call:</strong>{" "}
                            {getData("contact_details")?.call ||
                              getData("contact")?.phone}
                            <br />
                          </>
                        ) : null}
                        {getData("contact_details")?.info_email ||
                        getData("contact")?.email ? (
                          <>
                            <strong> Email:</strong>{" "}
                            {getData("contact_details")?.info_email ||
                              getData("contact")?.email}
                          </>
                        ) : null}
                      </p>

                      <div className="text-break">
                        <strong>Campuses:</strong>
                        <ul className="mt-2">
                          {getData("campuses") &&
                            typeof getData("campuses") === "object" &&
                            Object.entries(getData("campuses")).map(
                              ([campusName, link]) => (
                                <li key={campusName}>
                                  <strong>
                                    {campusName
                                      .replace(/_/g, " ")
                                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                                    :
                                  </strong>{" "}
                                  <a
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-light text-break"
                                  >
                                    {link}
                                  </a>
                                </li>
                              )
                            )}
                        </ul>
                      </div>

                      <p>
                        <strong>Main Link:</strong>{" "}
                        {getData("main_link") || getData("link") ? (
                          <a
                            href={getData("main_link") || getData("link")}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {getData("main_link") || getData("link")}
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </p>
                    </Tab.Pane>
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
          )}
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: "#222222", color: "white" }}>
          <Button
            variant="secondary"
            className="btn-primary"
            onClick={handleCloseModal}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UniversityList;
