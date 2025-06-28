import React, { useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ThemeContext } from "../../ThemeContext";

const ComparisonModal = ({ university1, university2, onClose }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div
          className={`modal-content ${
            theme === "dark" ? "bg-dark text-white" : ""
          }`}
        >
          {/* Modal Header */}
          <div
            className={`modal-header ${
              theme === "dark" ? "border-secondary" : ""
            }`}
          >
            <h5 className="modal-title text-center w-100">
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
                  theme === "dark" ? "table-dark border-secondary" : ""
                }`}
              >
                <thead>
                  <tr>
                    <th className="bg-primary text-white">Criteria</th>
                    <th className="bg-primary text-white">
                      {university1.university_title || "N/A"}
                    </th>
                    <th className="bg-primary text-white">
                      {university2.university_title || "N/A"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      className={`fw-bold ${
                        theme === "dark" ? "bg-secondary" : "bg-light"
                      }`}
                    >
                      Degree
                    </td>
                    <td>{university1.program_title || "N/A"}</td>
                    <td>{university2.program_title || "N/A"}</td>
                  </tr>
                  <tr>
                    <td
                      className={`fw-bold ${
                        theme === "dark" ? "bg-secondary" : "bg-light"
                      }`}
                    >
                      Duration
                    </td>
                    <td>{university1.program_duration || "N/A"}</td>
                    <td>{university2.program_duration || "N/A"}</td>
                  </tr>
                  <tr>
                    <td
                      className={`fw-bold ${
                        theme === "dark" ? "bg-secondary" : "bg-light"
                      }`}
                    >
                      Tuition Fee
                    </td>
                    <td>{university1.fee[0]?.total_tution_fee || "N/A"}</td>
                    <td>{university2.fee[0]?.total_tution_fee || "N/A"}</td>
                  </tr>
                  <tr>
                    <td
                      className={`fw-bold ${
                        theme === "dark" ? "bg-secondary" : "bg-light"
                      }`}
                    >
                      Beginning
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
                    <td
                      className={`fw-bold ${
                        theme === "dark" ? "bg-secondary" : "bg-light"
                      }`}
                    >
                      Location
                    </td>
                    <td>{university1.location || "N/A"}</td>
                    <td>{university2.location || "N/A"}</td>
                  </tr>
                  <tr>
                    <td
                      className={`fw-bold ${
                        theme === "dark" ? "bg-secondary" : "bg-light"
                      }`}
                    >
                      Rating
                    </td>
                    <td>{university1.qs_ranking || "N/A"}</td>
                    <td>{university2.qs_ranking || "N/A"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal Footer */}
          <div
            className={`modal-footer ${
              theme === "dark" ? "border-secondary" : ""
            }`}
          >
            <button
              type="button"
              className={`btn ${
                theme === "dark" ? "btn-light" : "btn-primary"
              }`}
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
