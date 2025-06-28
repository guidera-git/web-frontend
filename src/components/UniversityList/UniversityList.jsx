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
  const [showAppPrompt, setShowAppPrompt] = useState(false);

  const universityId =
    university?.university_id || university?.id || university?.uid;
  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };
  const programId = university.program_id;

  useEffect(() => {
    if (isComparisonCleared) {
      setIsSelectedForComparison(false);
    }
  }, [isComparisonCleared]);

  useEffect(() => {
    if (programId && token) {
      checkIfProgramIsSaved();
      checkAndSetApplicationStatus(); // 👈 ensure status reflects bookmark toggle
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

  // ✨ Updated toggleBookmark with smart prompt condition
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

          // ✨ Show prompt only if not already started
          if (!applicationStarted) {
            setShowAppPrompt(true);
          }
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

  // ✨ New: Enhanced handler that checks deadline before starting application
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
      // 🔒 Check deadline
      const deadlineCheck = await axios.get(
        `http://localhost:3000/api/programs/${programId}/${universityId}/deadline-check`,
        authHeader
      );

      if (!deadlineCheck.data.canApply) {
        toast.error(deadlineCheck.data.reason);
        setShowAppPrompt(false);
        return;
      }

      // 🔄 Proceed only if not already started
      const checkRes = await axios.get(
        `http://localhost:3000/api/applications/check/${programId}/${universityId}`,
        authHeader
      );

      if (!checkRes.data.exists) {
        const appPayload = {
          program_id: programId,
          university_id: universityId,
        };

        const createRes = await axios.post(
          "http://localhost:3000/api/applications",
          appPayload,
          authHeader
        );

        if (createRes.status === 201) {
          toast.success(
            "✅ Application started successfully. Deadlines will be tracked."
          );
          setApplicationStarted(true); // ✨ Trigger state update
        } else {
          toast.error("Unexpected response from server.");
        }
      } else {
        toast.info("You already have an application for this program.");
        setApplicationStarted(true);
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
  const handleComparisonClick = () => {
    if (isComparisonDisabled && !isSelectedForComparison) return;
    const newSelectedState = !isSelectedForComparison;
    setIsSelectedForComparison(newSelectedState);
    onCompare(university, newSelectedState);
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
      const backendMessage =
        err?.response?.data?.error || err?.response?.data?.message;

      if (backendMessage) {
        toast.error(`🚫 ${backendMessage}`);
      } else {
        toast.error("❌ Something went wrong. Please try again later.");
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const getData = (key) => {
    return programDetails?.[key] ?? university?.[key] ?? "N/A";
  };

  // Helper function to safely get fee data
  const getFeeData = (feeKey) => {
    if (Array.isArray(university?.fee) && university.fee.length > 0) {
      return university.fee[0][feeKey] || "N/A";
    }
    return "N/A";
  };

  // Helper function to format fee display
  const formatFee = (fee) => {
    if (!fee || fee === "N/A") return "N/A";
    if (typeof fee === "string" && fee.includes("PKR")) return fee;
    return ` ${fee}`;
  };

  if (!university) return null;

  return (
    <>
      {/* ✨ Modal shown only if app not started */}
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
            {/* Comparison & Info icons */}
            <i
              className={`bi bi-arrow-left-right ${
                isSelectedForComparison ? "text-primary" : ""
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

          {/* Program Info */}
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
              {formatFee(getFeeData("per_credit_hour_fee"))}
            </h6>
            <p className="mb-1">Total Fee</p>
            <h6 className="fw-bold mt-1">
              {formatFee(getFeeData("total_tution_fee")) !== "N/A"
                ? formatFee(getFeeData("total_tution_fee"))
                : formatFee(university?.calculated_total_fee)}
            </h6>
          </div>
        </div>
      </div>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        size="lg"
        centered
        className={theme === "dark" ? "dark-modal" : ""}
      >
        <Modal.Header
          closeButton
          className={`bg-primary text-white ${
            theme === "dark" ? "border-secondary" : ""
          }`}
        >
          <Modal.Title>
            {getData("university_title") || "University Details"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body
          className={theme === "dark" ? "bg-dark text-white" : "bg-white"}
        >
          {loading ? (
            <div className="text-center py-4">
              <Spinner
                animation="border"
                variant={theme === "dark" ? "light" : "primary"}
              />
              <p className={theme === "dark" ? "text-light" : ""}>
                Loading program details...
              </p>
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
                        <Nav.Link
                          eventKey={key}
                          className={theme === "dark" ? "text-white" : ""}
                        >
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </Nav.Link>
                      </Nav.Item>
                    ))}
                  </Nav>
                </Col>

                <Col sm={9}>
                  <Tab.Content>
                    {/* Overview Tab */}
                    <Tab.Pane eventKey="overview">
                      <h5>Overview</h5>
                      <p>
                        {getData("program_description") ||
                          getData("overview") ||
                          "No overview available."}
                      </p>
                      <ListGroup>
                        {[
                          {
                            label: "Total Fee",
                            value:
                              formatFee(getFeeData("total_tution_fee")) !==
                              "N/A"
                                ? formatFee(getFeeData("total_tution_fee"))
                                : formatFee(getData("calculated_total_fee")),
                          },
                          {
                            label: "Credit Hours",
                            value: getData("credit_hours") || "N/A",
                          },
                          {
                            label: "Duration",
                            value: getData("program_duration") || "N/A",
                          },
                          {
                            label: "Location",
                            value: getData("location") || "N/A",
                          },
                          {
                            label: "Additional Locations",
                            value:
                              getData("additional_locations") ||
                              "No additional locations",
                          },
                          {
                            label: "QS Ranking",
                            value: getData("qs_ranking") || "N/A",
                          },
                        ].map((item, index) => (
                          <ListGroup.Item
                            key={index}
                            className={
                              theme === "dark" ? "bg-secondary text-white" : ""
                            }
                          >
                            <strong>{item.label}:</strong> {item.value}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </Tab.Pane>

                    {/* Course Details Tab */}
                    <Tab.Pane eventKey="courseDetails">
                      <h5 className="mt-3">Course Details</h5>
                      <ListGroup>
                        {[
                          {
                            label: "Program Title",
                            value: getData("program_title") || "N/A",
                          },
                          {
                            label: "Credit Hours",
                            value: getData("credit_hours") || "N/A",
                          },
                          {
                            label: "Duration",
                            value: getData("program_duration") || "N/A",
                          },
                          {
                            label: "Teaching System",
                            value: getData("teaching_system") || "N/A",
                          },
                          {
                            label: "Description",
                            value: getData("program_description") || "N/A",
                          },
                          {
                            label: "Course Outline",
                            value: !getData("course_outline") ? (
                              "Not provided"
                            ) : (
                              <a
                                href={getData("course_outline")}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={
                                  theme === "dark"
                                    ? "text-info"
                                    : "text-primary"
                                }
                              >
                                View Outline
                              </a>
                            ),
                          },
                        ].map((item, index) => (
                          <ListGroup.Item
                            key={index}
                            className={
                              theme === "dark" ? "bg-secondary text-white" : ""
                            }
                          >
                            <strong>{item.label}:</strong> {item.value}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </Tab.Pane>

                    {/* Requirements Tab */}
                    <Tab.Pane eventKey="requirements">
                      <h5>Admission Requirements</h5>
                      <ListGroup>
                        {Array.isArray(getData("admission_criteria")) &&
                        getData("admission_criteria").length > 0 ? (
                          getData("admission_criteria").map((item, i) => (
                            <ListGroup.Item
                              key={i}
                              className={
                                theme === "dark"
                                  ? "bg-secondary text-white"
                                  : ""
                              }
                            >
                              {typeof item === "object"
                                ? item.criteria ||
                                  item["s.no"] ||
                                  JSON.stringify(item)
                                : item}
                            </ListGroup.Item>
                          ))
                        ) : (
                          <ListGroup.Item
                            className={
                              theme === "dark" ? "bg-secondary text-white" : ""
                            }
                          >
                            No criteria available
                          </ListGroup.Item>
                        )}
                      </ListGroup>
                    </Tab.Pane>

                    {/* Registration Tab */}
                    <Tab.Pane eventKey="registration">
                      <h5>Important Dates</h5>
                      <ListGroup>
                        {Array.isArray(getData("important_dates")) &&
                        getData("important_dates").length > 0 ? (
                          getData("important_dates").map((item, i) => (
                            <ListGroup.Item
                              key={i}
                              className={
                                theme === "dark"
                                  ? "bg-secondary text-white"
                                  : ""
                              }
                            >
                              {typeof item === "object" &&
                              item.criteria &&
                              item.date ? (
                                <>
                                  <strong>{item.criteria}</strong>:{" "}
                                  {new Date(item.date).toLocaleDateString()}
                                </>
                              ) : typeof item === "object" ? (
                                Object.entries(item).map(([key, value]) => (
                                  <div key={key}>
                                    <strong>{key}</strong>: {String(value)}
                                  </div>
                                ))
                              ) : (
                                String(item)
                              )}
                            </ListGroup.Item>
                          ))
                        ) : (
                          <ListGroup.Item
                            className={
                              theme === "dark" ? "bg-secondary text-white" : ""
                            }
                          >
                            No important dates available
                          </ListGroup.Item>
                        )}
                      </ListGroup>

                      <h5 className="mt-3">Teaching System</h5>
                      <ListGroup>
                        <ListGroup.Item
                          className={
                            theme === "dark" ? "bg-secondary text-white" : ""
                          }
                        >
                          {getData("teaching_system") ||
                            "No registration info."}
                        </ListGroup.Item>
                      </ListGroup>
                    </Tab.Pane>

                    {/* Fee Tab */}
                    <Tab.Pane eventKey="fee">
                      <h5>Fee Details</h5>
                      <ListGroup>
                        {getData("fee") &&
                        Array.isArray(getData("fee")) &&
                        getData("fee").length > 0 ? (
                          <>
                            {Object.entries(getData("fee")[0]).map(
                              ([key, val]) => (
                                <ListGroup.Item
                                  key={key}
                                  className={
                                    theme === "dark"
                                      ? "bg-secondary text-white"
                                      : ""
                                  }
                                >
                                  <strong>{key}:</strong> {val}
                                </ListGroup.Item>
                              )
                            )}
                            <ListGroup.Item
                              className={
                                theme === "dark"
                                  ? "bg-secondary text-white"
                                  : ""
                              }
                            >
                              <strong>Credit Hours:</strong>{" "}
                              {getData("credit_hours")}
                            </ListGroup.Item>
                          </>
                        ) : (
                          <ListGroup.Item
                            className={
                              theme === "dark" ? "bg-secondary text-white" : ""
                            }
                          >
                            No fee information available
                          </ListGroup.Item>
                        )}
                      </ListGroup>
                    </Tab.Pane>

                    {/* About Tab */}
                    <Tab.Pane eventKey="about">
                      <h5>{getData("university_title")}</h5>
                      <ListGroup className="mb-3">
                        <ListGroup.Item
                          className={
                            theme === "dark" ? "bg-secondary text-white" : ""
                          }
                        >
                          {getData("introduction") ||
                            "No information available."}
                        </ListGroup.Item>
                      </ListGroup>

                      <h5>Contact Information</h5>
                      <ListGroup>
                        <ListGroup.Item
                          className={
                            theme === "dark" ? "bg-secondary text-white" : ""
                          }
                        >
                          <strong>Phone:</strong>{" "}
                          {getData("contact_details")?.call ||
                            getData("contact")?.phone ||
                            "N/A"}
                        </ListGroup.Item>
                        <ListGroup.Item
                          className={
                            theme === "dark" ? "bg-secondary text-white" : ""
                          }
                        >
                          <strong>Email:</strong>{" "}
                          {getData("contact_details")?.info_email ||
                            getData("contact")?.email ||
                            "N/A"}
                        </ListGroup.Item>
                      </ListGroup>

                      {getData("social_links") && (
                        <>
                          <h5 className="mt-3">Social Links</h5>
                          <ListGroup>
                            {Object.entries(getData("social_links")).map(
                              ([key, value]) => (
                                <ListGroup.Item
                                  key={key}
                                  className={
                                    theme === "dark"
                                      ? "bg-secondary text-white"
                                      : ""
                                  }
                                >
                                  <strong>
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                    :
                                  </strong>{" "}
                                  <a
                                    href={value}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={
                                      theme === "dark"
                                        ? "text-info"
                                        : "text-primary"
                                    }
                                  >
                                    {value}
                                  </a>
                                </ListGroup.Item>
                              )
                            )}
                          </ListGroup>
                        </>
                      )}

                      {getData("campuses") &&
                        typeof getData("campuses") === "object" && (
                          <>
                            <h5 className="mt-3">Campuses Location</h5>
                            <ListGroup>
                              {Object.entries(getData("campuses")).map(
                                ([campusName, link]) => (
                                  <ListGroup.Item
                                    key={campusName}
                                    className={
                                      theme === "dark"
                                        ? "bg-secondary text-white"
                                        : ""
                                    }
                                  >
                                    <strong>
                                      {campusName
                                        .replace(/_/g, " ")
                                        .replace(/\b\w/g, (l) =>
                                          l.toUpperCase()
                                        )}
                                      :
                                    </strong>{" "}
                                    <a
                                      href={link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={
                                        theme === "dark"
                                          ? "text-info"
                                          : "text-primary"
                                      }
                                    >
                                      {link}
                                    </a>
                                  </ListGroup.Item>
                                )
                              )}
                            </ListGroup>
                          </>
                        )}

                      <h5 className="mt-3">Main Link</h5>
                      <ListGroup>
                        <ListGroup.Item
                          className={
                            theme === "dark" ? "bg-secondary text-white" : ""
                          }
                        >
                          {getData("main_link") || getData("link") ? (
                            <a
                              href={getData("main_link") || getData("link")}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={
                                theme === "dark" ? "text-info" : "text-primary"
                              }
                            >
                              {getData("main_link") || getData("link")}
                            </a>
                          ) : (
                            "N/A"
                          )}
                        </ListGroup.Item>
                      </ListGroup>
                    </Tab.Pane>
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
          )}
        </Modal.Body>

        <Modal.Footer
          className={`${theme === "dark" ? "bg-dark border-secondary" : ""}`}
        >
          <Button
            variant={theme === "dark" ? "outline-light" : "primary"}
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
