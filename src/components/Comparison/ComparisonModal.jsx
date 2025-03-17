import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const ComparisonModal = ({ university1, university2, onClose }) => {
  return (
    <div className="modal fade show d-block" tabIndex="-1">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">University Comparison</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <table className="table table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>Criteria</th>
                  <th>{university1.name}</th>
                  <th>{university2.name}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Degree</strong>
                  </td>
                  <td>{university1.degree}</td>
                  <td>{university2.degree}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Duration</strong>
                  </td>
                  <td>{university1.duration}</td>
                  <td>{university2.duration}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Tuition Fee</strong>
                  </td>
                  <td>{university1.tuition}</td>
                  <td>{university2.tuition}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Beginning</strong>
                  </td>
                  <td>{university1.beginning}</td>
                  <td>{university2.beginning}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Location</strong>
                  </td>
                  <td>{university1.location}</td>
                  <td>{university2.location}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Rating</strong>
                  </td>
                  <td>{university1.rating}</td>
                  <td>{university2.rating}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
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
