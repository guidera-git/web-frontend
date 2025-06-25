import React, { useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ThemeContext } from "../../ThemeContext";

const ComparisonModal = ({ university1, university2, onClose }) => {
  const { theme } = useContext(ThemeContext);

  // Theme-based styles
  const modalStyles = {
    content: {
      backgroundColor: theme === "dark" ? "#222222" : "#ffffff",
      color: theme === "dark" ? "#ffffff" : "#000000",
    },
    table: {
      backgroundColor: theme === "dark" ? "#222222" : "#ffffff",
      color: theme === "dark" ? "#ffffff" : "#000000",
    },
    headerCell: {
      backgroundColor: theme === "dark" ? "#0d6efd" : "#0d6efd",
      color: "#ffffff",
    },
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content" style={modalStyles.content}>
          {/* Modal Header */}
          <div className="modal-header border-1">
            <h5
              className="modal-title text-center w-100"
              style={{ color: modalStyles.content.color }}
            >
              University Comparison
            </h5>
            <button
              type="button"
              className={`btn-close ${
                theme === "dark" ? "btn-close-white" : ""
              }`}
              onClick={onClose}
            ></button>
          </div>

          {/* Modal Body */}
          <div className="modal-body">
            <div className="table-responsive">
              <table
                className={`table table-bordered ${
                  theme === "dark" ? "border-white" : "border-dark"
                }`}
                style={modalStyles.table}
              >
                <thead>
                  <tr>
                    <th style={modalStyles.headerCell}>Criteria</th>
                    <th style={modalStyles.headerCell}>
                      {university1.university_title || "N/A"}
                    </th>
                    <th style={modalStyles.headerCell}>
                      {university2.university_title || "N/A"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={modalStyles.headerCell}>
                      <strong>Degree</strong>
                    </td>
                    <td>{university1.program_title || "N/A"}</td>
                    <td>{university2.program_title || "N/A"}</td>
                  </tr>
                  <tr>
                    <td style={modalStyles.headerCell}>
                      <strong>Duration</strong>
                    </td>
                    <td>{university1.program_duration || "N/A"}</td>
                    <td>{university2.program_duration || "N/A"}</td>
                  </tr>
                  <tr>
                    <td style={modalStyles.headerCell}>
                      <strong>Tuition Fee</strong>
                    </td>
                    <td>{university1.fee[0]?.total_tution_fee || "N/A"}</td>
                    <td>{university2.fee[0]?.total_tution_fee || "N/A"}</td>
                  </tr>
                  <tr>
                    <td style={modalStyles.headerCell}>
                      <strong>Beginning</strong>
                    </td>
                    <td>
                      {university1.important_dates[0]
                        ?.commencement_of_classes || "N/A"}
                    </td>
                    <td>
                      {university2.important_dates[0]
                        ?.commencement_of_classes || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td style={modalStyles.headerCell}>
                      <strong>Location</strong>
                    </td>
                    <td>{university1.location || "N/A"}</td>
                    <td>{university2.location || "N/A"}</td>
                  </tr>
                  <tr>
                    <td style={modalStyles.headerCell}>
                      <strong>Rating</strong>
                    </td>
                    <td>{university1.qs_ranking || "N/A"}</td>
                    <td>{university2.qs_ranking || "N/A"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer border-0">
            <button
              type="button"
              className={`btn btn-${
                theme === "dark" ? "light" : "primary"
              } text-${theme === "dark" ? "dark" : "white"}`}
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonModal;
