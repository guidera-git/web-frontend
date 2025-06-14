import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const ComparisonModal = ({ university1, university2, onClose }) => {
  return (
    <div className="modal fade show d-block" tabIndex="-1">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content bg-dark text-white">
          {/* Modal Header */}
          <div className="modal-header border-1">
            <h5 className="modal-title text-white text-center w-100">
              University Comparison
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>

          {/* Modal Body */}
          <div className="modal-body">
            <div className="table-responsive">
              <table
                className="table table-dark table-bordered text-white border-white"
                style={{ backgroundColor: "#222222" }}
              >
                <thead>
                  <tr>
                    <th className="bg-primary">Criteria</th>
                    <th>{university1.university_title || "N/A"}</th>
                    <th>{university2.university_title || "N/A"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="bg-primary text-white">
                      <strong>Degree</strong>
                    </td>
                    <td>{university1.program_title || "N/A"}</td>
                    <td>{university2.program_title || "N/A"}</td>
                  </tr>
                  <tr>
                    <td className="bg-primary text-white">
                      <strong>Duration</strong>
                    </td>
                    <td>{university1.program_duration || "N/A"}</td>
                    <td>{university2.program_duration || "N/A"}</td>
                  </tr>
                  <tr>
                    <td className="bg-primary text-white">
                      <strong>Tuition Fee</strong>
                    </td>
                    <td>{university1.fee[0]?.total_tution_fee || "N/A"}</td>
                    <td>{university2.fee[0]?.total_tution_fee || "N/A"}</td>
                  </tr>
                  <tr>
                    <td className="bg-primary text-white">
                      <strong>Beginning</strong>
                    </td>
                    <td>
                      {university1.important_dates[0].commencement_of_classes ||
                        "N/A"}
                    </td>
                    <td>
                      {university2.important_dates[0].commencement_of_classes ||
                        "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="bg-primary text-white">
                      <strong>Location</strong>
                    </td>
                    <td>{university1.location || "N/A"}</td>
                    <td>{university2.location || "N/A"}</td>
                  </tr>
                  <tr>
                    <td className="bg-primary text-white">
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
              className="btn btn-primary text-white"
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
