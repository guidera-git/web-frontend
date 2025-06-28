import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState, useContext } from "react"; // Added useState here
import { ThemeContext } from "../../ThemeContext"; // Adjust path as needed
import SubjectCard from "../../components/card/SubjectCard";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
function TestPreparation() {
  return (
    <>
      <Section1 />
      <Section2 />
      {/* <Section3 /> */}
      <Section4 />
    </>
  );
}

function Section1() {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={` border-bottom border-2 border-primary py-5 ${
        theme === "dark" ? "bg-dark text-white" : "bg-light text-dark"
      }`}
    >
      <div className="container">
        <div
          className={`d-flex flex-column flex-lg-row align-items-center p-4 rounded shadow-lg ${
            theme === "dark" ? "bg-secondary text-white" : "bg-light text-dark"
          }`}
        >
          <div className="text-center text-lg-start flex-grow-1 p-3">
            <h2 className="fw-bold text-primary">Test Preparation</h2>
            <h4 className="fw-bold">
              Ace Your <span className="text-primary">University</span> Entrance
              Tests with Confidence!
            </h4>
            <p className={theme === "dark" ? "text-light" : "text-muted"}>
              Access tailored resources, test strategies, and progress tracking
              to achieve your goals.
            </p>
            <button className="btn btn-primary mt-2">Explore Resources</button>
          </div>
          <div className="d-flex justify-content-center p-3">
            <img
              src="book_pen.png"
              alt="Study Materials"
              className="img-fluid rounded"
            />
          </div>
        </div>
        {/* <div className="mt-4 text-center">
          <div className="mx-auto" style={{ maxWidth: "400px" }}>
            <select
              className={`form-select mb-3 ${
                theme === "dark" ? "bg-secondary text-white" : ""
              }`}
            >
              <option>Choose the Test</option>
              <option>SAT</option>
              <option>NAT</option>
              <option>ECAT</option>
              <option>NED</option>
            </select>
            <button className="btn btn-primary">Start Now</button>
          </div>
        </div> */}
      </div>
    </div>
  );
}

function Section2() {
  return <SubjectCard />;
}

// function Section3() {
//   const { theme } = useContext(ThemeContext);
//   const categories = [
//     { title: "Past Papers", icon: "/Brain.svg" },
//     { title: "Practice Questions", icon: "/Paper.svg" },
//     { title: "Video Tutorials", icon: "/Video.svg" },
//   ];

//   return (
//     <div
//       className={`text-center py-4 border-bottom border-2 border-primary ${
//         theme === "dark" ? "bg-dark text-white" : "bg-light text-dark"
//       }`}
//     >
//       <h4 className="fw-bold mb-5">Test Material Categories</h4>

//       <div className="row g-4 px-3">
//         {categories.map((category, index) => (
//           <div
//             key={index}
//             className="col-12 col-md-4 col-lg-4 d-flex flex-column align-items-center justify-content-center"
//           >
//             <div
//               className={`category-card d-flex flex-column align-items-center justify-content-center pt-5 px-4 ${
//                 theme === "dark" ? "bg-white text-white" : "bg-light"
//               }`}
//             >
//               <img
//                 src={category.icon}
//                 alt={category.title}
//                 className="icon-img mb-3"
//               />
//               <p className="fw-semibold mt-4">{category.title}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function Section4() {
  const { theme } = useContext(ThemeContext);
  const [subjectScores, setSubjectScores] = useState([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  const expectedSubjects = [
    "Biology",
    "Physics",
    "Chemistry",
    "Math",
    "English",
    "AnalyReasoning",
  ];

  const subjectColors = {
    Biology: "#4e79a7",
    Physics: "#f28e2b",
    Chemistry: "#e15759",
    Math: "#76b7b2",
    English: "#59a14f",
    AnalyticalReasoning: "#edc948",
  };

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/test/score", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        const serverData = res.data.summary || [];

        const scoreMap = {};
        serverData.forEach((item) => {
          scoreMap[item.subject.toLowerCase()] = item.averageScore;
        });

        const finalSubjects = expectedSubjects.map((subj) => ({
          subject: subj,
          averageScore: scoreMap[subj.toLowerCase()] || 0,
        }));

        setSubjectScores(finalSubjects);

        const total = finalSubjects.reduce(
          (acc, item) => acc + item.averageScore,
          0
        );
        const avg =
          finalSubjects.length > 0
            ? Math.round(total / finalSubjects.length)
            : 0;
        setOverallProgress(avg);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch subject scores", err);
        setLoading(false);
      });
  }, []);

  const subjectBarData = {
    labels: subjectScores.map((s) => s.subject),
    datasets: [
      {
        label: "Average Score (%)",
        data: subjectScores.map((s) => s.averageScore),
        backgroundColor: subjectScores.map(
          (s) => subjectColors[s.subject] || "#0d6efd"
        ),
        borderRadius: 5,
      },
    ],
  };

  const overallBarData = {
    labels: ["Overall Progress"],
    datasets: [
      {
        label: "Progress",
        data: [overallProgress],
        backgroundColor: theme === "dark" ? "#0dcaf0" : "#198754",
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.raw}%`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { stepSize: 20 },
        grid: { color: theme === "dark" ? "#444" : "#ccc" },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  return (
    <div
      className={`text-center py-4 border-bottom border-2 border-primary ${
        theme === "dark" ? "bg-dark text-white" : "bg-light text-dark"
      }`}
    >
      <h4 className="fw-bold mb-4">Track Your Progress</h4>
      <div className="row g-4 px-3">
        <div className="col-md-6">
          <h6 className="mb-4">Subject Wise Scores</h6>
          {loading ? (
            <p>Loading chart...</p>
          ) : (
            <Bar data={subjectBarData} options={chartOptions} />
          )}
        </div>

        <div
          className={`col-md-6 d-flex flex-column align-items-center justify-content-center border-primary ${
            theme === "dark" ? "border-secondary" : ""
          } border-start`}
        >
          <h6>Overall Progress</h6>
          <div className="progress-circle mt-3 mb-4">
            <svg viewBox="0 0 100 100">
              <circle
                className={
                  theme === "dark" ? "progress-bg-dark" : "progress-bg"
                }
                cx="50"
                cy="50"
                r="45"
              ></circle>
              <circle
                className={
                  theme === "dark" ? "progress-fill-dark" : "progress-fill"
                }
                cx="50"
                cy="50"
                r="45"
                style={{
                  strokeDashoffset: 283 - (283 * overallProgress) / 100,
                }}
              ></circle>
              <text
                x="50"
                y="55"
                textAnchor="middle"
                className={
                  theme === "dark" ? "progress-text-dark" : "progress-text"
                }
              >
                {overallProgress}%
              </text>
            </svg>
          </div>
          {!loading && (
            <div className="w-75">
              <Bar data={overallBarData} options={chartOptions} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TestPreparation;
