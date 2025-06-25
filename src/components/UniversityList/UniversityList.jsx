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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [savedId, setSavedId] = useState(null);
  const [applicationStarted, setApplicationStarted] = useState(false);

  const universityId =
    university?.university_id || university?.id || university?.uid;
  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };
  const programId = university.program_id;
  useEffect(() => {
    if (programId && token) {
      checkIfProgramIsSaved();
    }
  }, [programId, token]);

  const checkIfProgramIsSaved = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/saved-programs/check/${programId}`,
        authHeader
      );

      const isSaved = res.data.is_saved;
      if (isSaved) {
        const allSaved = await axios.get(
          "http://localhost:3000/api/saved-programs",
          authHeader
        );
        const match = allSaved.data.find(
          (item) => item.program_id === programId
        );
        setSavedId(match?.saved_id || null);
      } else {
        setSavedId(null);
      }

      setIsBookmarked(isSaved);
    } catch (error) {
      console.error("Error checking saved status:", error);
    }
  };
  // 👇 Add this new state
  const [showAppPrompt, setShowAppPrompt] = useState(false);

  // 👇 Replace only the toggleBookmark logic with this version:
  const toggleBookmark = async () => {
    if (!token) {
      toast.error("Please log in to save programs.");
      return;
    }

    try {
      if (isBookmarked && savedId) {
        // Unbookmark logic
        await axios.delete(
          `http://localhost:3000/api/saved-programs/${savedId}`,
          authHeader
        );
        setIsBookmarked(false);
        setSavedId(null);
        toast.info("Removed from bookmarks.");
      } else {
        // Save logic
        const payload = {
          program_id: programId,
          university_id: universityId,
        };

        const res = await axios.post(
          "http://localhost:3000/api/saved-programs",
          payload,
          authHeader
        );

        const savedProgram = res.data.saved_program;
        if (savedProgram?.id) {
          setIsBookmarked(true);
          setSavedId(savedProgram.id);
          toast.success("Bookmarked successfully.");

          // 🔔 Show Bootstrap modal instead of window.confirm
          setShowAppPrompt(true);
        } else {
          throw new Error("Invalid save response format.");
        }
      }
    } catch (error) {
      console.error("Bookmark error:", error);
      if (error.response?.status === 400) {
        toast.error(error.response.data?.error || "Already bookmarked.");
      } else {
        toast.error("Failed to update bookmark.");
      }
    }
  };

  const handleStartApplication = async () => {
    if (!token) {
      toast.error("You must be logged in to start an application.");
      return;
    }

    if (!programId || !universityId) {
      toast.error("Missing program or university ID.");
      setShowAppPrompt(false);
      return;
    }

    try {
      console.log("📌 Checking existing application...");
      const checkRes = await axios.get(
        `http://localhost:3000/api/applications/check/${programId}/${universityId}`,
        authHeader
      );

      if (!checkRes.data.exists) {
        const appPayload = {
          program_id: programId,
          university_id: universityId,
        };

        console.log("📤 Sending application payload:", appPayload);

        const createRes = await axios.post(
          "http://localhost:3000/api/applications",
          appPayload,
          authHeader
        );

        if (createRes.status === 201) {
          toast.success(
            "Application started successfully. Deadlines will be tracked."
          );
        } else {
          toast.error("Unexpected response from server.");
        }
      } else {
        toast.info("You already have an application for this program.");
      }
    } catch (error) {
      console.error("❌ Application creation error:", error);

      if (error.response?.status === 400) {
        toast.error(error.response?.data?.error || "Bad Request.");
      } else if (error.response?.status === 401) {
        toast.error("Unauthorized. Please log in again.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setShowAppPrompt(false);
    }
  };

  const handleComparisonClick = () => {
    if (isComparisonDisabled && !isSelectedForComparison) return;
    setIsSelectedForComparison((prev) => !prev);
    onCompare(university);
  };

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
  const checkAndSetApplicationStatus = async () => {
    if (!token || !programId || !universityId) return;

    try {
      const res = await axios.get(
        `http://localhost:3000/api/applications/check/${programId}/${universityId}`,
        authHeader
      );
      setApplicationStarted(res.data.exists);
    } catch (error) {
      console.error("Error checking application status:", error);
    }
  };
  useEffect(() => {
    checkAndSetApplicationStatus();
  }, [programId, universityId]);
  const handleApply = async () => {
    if (!token) {
      toast.error("Please log in to apply.");
      return;
    }

    try {
      const checkRes = await axios.get(
        `http://localhost:3000/api/applications/check/${programId}/${universityId}`,
        authHeader
      );

      if (!checkRes.data.exists) {
        const res = await axios.post(
          `http://localhost:3000/api/applications`,
          { program_id: programId, university_id: universityId },
          authHeader
        );

        if (res.status === 201) {
          toast.success("✅ Application started successfully!");
          setApplicationStarted(true);
        } else {
          toast.error("⚠️ Unexpected error occurred.");
        }
      } else {
        toast.info("ℹ️ You already have an application for this program.");
        setApplicationStarted(true);
      }
    } catch (err) {
      console.error("❌ Error starting application:", err);
      toast.error("Something went wrong. Try again later.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const getData = (key) => {
    return programDetails?.[key] ?? university?.[key] ?? "N/A";
  };

  if (!university) return null;

  return (
    <>
      <Modal
        show={showAppPrompt}
        onHide={() => setShowAppPrompt(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Start Application</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Would you like to start the application to receive deadlines for this
          university program?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAppPrompt(false)}>
            No
          </Button>
          <Button variant="primary" onClick={handleStartApplication}>
            Yes, Start
          </Button>
        </Modal.Footer>
      </Modal>
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
          <div className="col-12 mt-3 text-end">
            <button
              className={`btn ${
                applicationStarted ? "btn-outline-success" : "btn-primary"
              }`}
              onClick={handleApply}
              title="Start application to get deadlines"
            >
              {applicationStarted ? "Started" : "Apply"}
            </button>
          </div>

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
              {Array.isArray(university?.fee) &&
              university.fee[0]?.total_tution_fee
                ? university.fee[0].total_tution_fee
                : "N/A"}
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
                      <p className="mb-1">
                        <strong>Total Fee: </strong>

                        {Array.isArray(university?.fee) &&
                        university.fee[0]?.total_tution_fee
                          ? university.fee[0].total_tution_fee
                          : "N/A"}
                      </p>
                      <p>
                        <strong>Credit Hours:</strong>{" "}
                        {getData("credit_hours") || "N/A"}
                      </p>
                      <p>
                        <strong>Duration:</strong>{" "}
                        {getData("program_duration") || "N/A"}
                      </p>
                      <p>
                        <strong>Location: </strong>
                        {getData("location") || "N/A"}
                      </p>
                      <p>
                        <strong>Additional Locations:</strong>{" "}
                        {getData("additional_locations") ||
                          "No additional locations"}
                      </p>
                      <p>
                        <strong>
                          QS Ranking: {getData("qs_ranking") || "N/A"}
                        </strong>
                      </p>
                    </Tab.Pane>
                    <Tab.Pane eventKey="courseDetails">
                      <h5 className="mt-3">Course Details</h5>
                      <ListGroup>
                        <ListGroup.Item>
                          <strong>Program Title:</strong>{" "}
                          {getData("program_title") || "N/A"}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <strong>Credit Hours:</strong>{" "}
                          {getData("credit_hours") || "N/A"}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <strong>Duration:</strong>{" "}
                          {getData("program_duration") || "N/A"}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <strong>Teaching System:</strong>{" "}
                          {getData("teaching_system") || "N/A"}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <strong>Description:</strong>{" "}
                          {getData("program_description") || "N/A"}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <strong>Course Outline:</strong>{" "}
                          {!getData("course_outline") ? (
                            "Not provided"
                          ) : (
                            <a
                              href={getData("course_outline")}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View Outline
                            </a>
                          )}
                        </ListGroup.Item>
                      </ListGroup>
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
                          <>
                            {Object.entries(getData("fee")[0]).map(
                              ([key, val]) => (
                                <ListGroup.Item key={key}>
                                  <strong>{key}:</strong> {val}
                                </ListGroup.Item>
                              )
                            )}
                            <ListGroup.Item>
                              <strong>Credit Hours:</strong>{" "}
                              {getData("credit_hours")}
                            </ListGroup.Item>
                          </>
                        ) : (
                          <ListGroup.Item>No fee info</ListGroup.Item>
                        )}
                      </ListGroup>
                    </Tab.Pane>

                    <Tab.Pane eventKey="about">
                      <h5>{getData("university_title")}</h5>
                      <p>
                        {getData("introduction") || "No information available."}
                      </p>
                      <p>
                        <strong>Location: </strong>
                        {getData("location") || "N/A"}
                      </p>
                      <p>
                        <strong>Additional Locations:</strong>{" "}
                        {getData("additional_locations") ||
                          "No additional locations"}
                      </p>
                      <p>
                        <strong>
                          QS Ranking: {getData("qs_ranking") || "N/A"}
                        </strong>
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
                      <p>
                        <strong>Social Links:</strong>
                        <br />
                        {getData("social_links")
                          ? Object.entries(getData("social_links")).map(
                              ([key, value]) => (
                                <span key={key}>
                                  <strong>
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                    :
                                  </strong>{" "}
                                  <a
                                    href={value}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {value}
                                  </a>
                                  <br />
                                </span>
                              )
                            )
                          : "No social links"}
                      </p>

                      <div className="text-break">
                        <strong>Campuses Location:</strong>
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
