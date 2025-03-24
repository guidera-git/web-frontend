import "bootstrap/dist/css/bootstrap.min.css";
import "./TrackingAnalysis.css";
import React, { useState } from "react";

const applications = [
  {
    id: "APP202401",
    percentage: 25,
    status: "In Progress",
    startDate: "2025-08-10",
    university: "UCP",
    degree: "BSSE",
    fee: "180,000 PKR",
    admissionOpen: true,
    checklist: {
      applicationSubmitted: false,
      testScheduled: false,
      testTaken: false,
      admissionDecision: false,
    },
  },
  {
    id: "APP202402",
    percentage: 50,
    status: "Completed",
    startDate: "2025-09-15",
    university: "LUMS",
    degree: "BBA",
    fee: "300,000 PKR",
    admissionOpen: false,
    checklist: {
      applicationSubmitted: true,
      testScheduled: true,
      testTaken: true,
      admissionDecision: true,
    },
  },
  {
    id: "APP202403",
    percentage: 75,
    status: "Completed",
    startDate: "2025-09-15",
    university: "LUMS",
    degree: "BBA",
    fee: "300,000 PKR",
    admissionOpen: false,
    checklist: {
      applicationSubmitted: true,
      testScheduled: true,
      testTaken: true,
      admissionDecision: true,
    },
  },
  {
    id: "APP202404",
    percentage: 50,
    status: "Completed",
    startDate: "2025-09-15",
    university: "LUMS",
    degree: "BBA",
    fee: "300,000 PKR",
    admissionOpen: false,
    checklist: {
      applicationSubmitted: true,
      testScheduled: true,
      testTaken: true,
      admissionDecision: true,
    },
  },
];

function TrackingAnalysis() {
  return <Section1 />;
}

function Section1() {
  const [selectedApp, setSelectedApp] = useState(null);
  const [apps, setApps] = useState(applications);

  // Function to handle checklist update & progress bar calculation
  const handleChecklistChange = (appIndex, field) => {
    const updatedApps = [...apps];
    updatedApps[appIndex].checklist[field] =
      !updatedApps[appIndex].checklist[field];

    // Calculate progress based on completed checklist items
    const completedTasks = Object.values(
      updatedApps[appIndex].checklist
    ).filter(Boolean).length;
    updatedApps[appIndex].percentage = (completedTasks / 4) * 100;
    updatedApps[appIndex].status =
      completedTasks === 4 ? "Completed" : "In Progress";

    setApps(updatedApps);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">
        Analytics <span className="text-primary">&</span> Tracking
      </h2>
      <p className="text-center">Track and keep in check of you progress</p>

      {/* Application Progress Cards */}
      <div className="row">
        {apps.map((app, index) => (
          <div key={index} className="col-md-6">
            <div className="card progress-card">
              <div className="card-body">
                <h4>Application ID: {app.id}</h4>
                <p>Status: {app.status}</p>
                <div className="progress">
                  <div
                    className="progress-bar bg-success"
                    style={{ width: `${app.percentage}%` }}
                  >
                    {Math.round(app.percentage)}%
                  </div>
                </div>
                <button
                  className="btn btn-primary mt-2"
                  onClick={() => setSelectedApp(app)}
                >
                  <i className="bi bi-eye"></i> View Progress
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* List of Applications */}
      <h4 className="mt-4">📌 All Applications</h4>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Application ID</th>
            <th>Status</th>
            <th>Start Date</th>
          </tr>
        </thead>
        <tbody>
          {apps.map((app, index) => (
            <tr key={index}>
              <td>{app.id}</td>
              <td>{app.status}</td>
              <td>{app.startDate}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Saved Universities */}
      <h4 className="mt-4">📌 Saved Programs</h4>
      <div className="row">
        {apps.map((app, index) => (
          <div key={index} className="col-md-6">
            <div className="card uni-card">
              <div className="card-body">
                <h4>{app.university}</h4>
                <p>{app.degree}</p>
                <p>
                  📅 {app.startDate} | 💰 {app.fee}
                </p>
                <p>
                  Admission:{" "}
                  {app.admissionOpen ? (
                    <i className="bi bi-check-circle text-success"></i>
                  ) : (
                    <i className="bi bi-x-circle text-danger"></i>
                  )}
                </p>
                <button
                  className="btn btn-success"
                  onClick={() => setSelectedApp(app)}
                >
                  <i className="bi bi-pencil-square"></i> Start Application
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Application Tracking Page */}
      {selectedApp && (
        <div className="tracking-modal">
          <h4 className="text-dark">
            📊 Application Progress - {selectedApp.university}
          </h4>
          <p className="text-dark">Degree: {selectedApp.degree}</p>
          <p className="text-dark">
            Completion: {Math.round(selectedApp.percentage)}%
          </p>

          <div className="progress">
            <div
              className="progress-bar bg-success"
              style={{ width: `${selectedApp.percentage}%` }}
            >
              {Math.round(selectedApp.percentage)}%
            </div>
          </div>

          <h5 className="mt-4 text-dark">📌 Application Checklist</h5>
          <ul className="list-group">
            {Object.keys(selectedApp.checklist).map((field, idx) => (
              <li key={idx} className="list-group-item">
                <input
                  type="checkbox"
                  checked={selectedApp.checklist[field]}
                  onChange={() =>
                    handleChecklistChange(apps.indexOf(selectedApp), field)
                  }
                  className="mr-2"
                />{" "}
                {field.replace(/([A-Z])/g, " $1").trim()}
              </li>
            ))}
          </ul>

          {/* Submit & Back Buttons */}
          <button
            className="btn btn-success mt-3"
            onClick={() => setSelectedApp(null)}
          >
            <i className="bi bi-check-circle"></i> Submit
          </button>

          <button
            className="btn btn-secondary mt-3 ml-2"
            onClick={() => setSelectedApp(null)}
          >
            <i className="bi bi-arrow-left"></i> Back
          </button>
        </div>
      )}
    </div>
  );
}

export default TrackingAnalysis;
