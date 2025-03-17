import Footer from "../../components/Footer/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import "./FindUniversity.css";
import React, { useState } from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import UniversityList from "../../components/UniversityList/UniversityList";
import ComparisonModal from "../../components/Comparison/ComparisonModal";
import { useNavigate } from "react-router-dom";
const universities = [
  {
    name: "UCP",
    degree: "BSSE",
    duration: "8 Semesters",
    beginning: "Summer 2025",
    tuition: "180000 PKR",
    location: "Islamabad",
    rating: 4.5,
  },
  {
    name: "LUMS",
    degree: "BBA",
    duration: "8 Semester",
    beginning: "Fall 2025",
    tuition: "300000 PKR",
    location: "Lahore",
    rating: 5,
  },
  {
    name: "UCP",
    degree: "BSSE",
    duration: "10 Semesters",
    beginning: "Summer 2025",
    tuition: "180000 PKR",
    location: "Lahore",
    rating: 4.5,
  },
  {
    name: "LUMS",
    degree: "BBA",
    duration: "8 Semester",
    beginning: "Fall 2025",
    tuition: "300000 PKR",
    location: "Lahore",
    rating: 5,
  },
  {
    name: "UCP",
    degree: "BSSE",
    duration: "8 Semesters",
    beginning: "Summer 2025",
    tuition: "180000 PKR",
    location: "Lahore",
    rating: 4.5,
  },
  {
    name: "UCP",
    degree: "BSSE",
    duration: "10 Semesters",
    beginning: "Summer 2025",
    tuition: "180000 PKR",
    location: "Lahore",
    rating: 4.5,
  },
  {
    name: "UCP",
    degree: "BSSE",
    duration: "8 Semesters",
    beginning: "Summer 2025",
    tuition: "180000 PKR",
    location: "Lahore",
    rating: 4.5,
  },
  {
    name: "UCP",
    degree: "BSSE",
    duration: "8 Semesters",
    beginning: "Summer 2025",
    tuition: "180000 PKR",
    location: "Islamabad",
    rating: 4.5,
  },
  {
    name: "LUMS",
    degree: "BBA",
    duration: "8 Semester",
    beginning: "Fall 2025",
    tuition: "300000 PKR",
    location: "Lahore",
    rating: 5,
  },
  {
    name: "UCP",
    degree: "BSSE",
    duration: "8 Semesters",
    beginning: "Summer 2025",
    tuition: "180000 PKR",
    location: "Lahore",
    rating: 4.5,
  },
  {
    name: "LUMS",
    degree: "BBA",
    duration: "8 Semester",
    beginning: "Fall 2025",
    tuition: "300000 PKR",
    location: "Lahore",
    rating: 5,
  },
];

function FindUniversity() {
  const [selectedForComparison, setSelectedForComparison] = useState([]);
  const [isComparisonCleared, setIsComparisonCleared] = useState(false);
  const handleCompare = (university) => {
    setSelectedForComparison((prev) => {
      if (prev.some((uni) => uni.name === university.name)) {
        return prev.filter((uni) => uni.name !== university.name);
      } else {
        return prev.length < 2 ? [...prev, university] : prev;
      }
    });
  };

  const resetComparison = () => {
    setSelectedForComparison([]);
    setIsComparisonCleared(true);
    setTimeout(() => setIsComparisonCleared(false), 0);
  };

  return (
    <>
      <Section1 />
      <Section2
        onCompare={handleCompare}
        isComparisonDisabled={selectedForComparison.length >= 2}
        isComparisonCleared={isComparisonCleared}
      />

      {selectedForComparison.length === 2 && (
        <ComparisonModal
          university1={selectedForComparison[0]}
          university2={selectedForComparison[1]}
          onClose={resetComparison}
        />
      )}
    </>
  );
}
function Section1() {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <div className="custom-container text-white container border-bottom border-2 border-primary">
      <div className="row min-vh-20">
        <div className="col-md-8 d-flex flex-column justify-content-center align-items-center p-5">
          <h2>
            Find Your Future at the{" "}
            <span className="text-primary">Perfect University!</span>
          </h2>
          <p className="mt-2 mb-3">
            Discover universities tailored to your preferences, location, and aspirations.
          </p>
          <div className="d-flex gap-3">
            <button className="btn btn-primary">Start Your Search</button>
            <button
              className="btn sign-up btn-outline-secondary"
              onClick={() => navigate("/recommendation")} // Navigate to recommendation page
            >
              Explore Recommendation
            </button>
          </div>
        </div>

        <div className="col-md-4 d-flex justify-content-center align-items-center p-0">
          <img
            src="/universityimage.png"
            alt="University Image"
            width={220}
            height={220}
          />
        </div>
      </div>
    </div>
  );
}
const FilterModal = ({ show, onClose, onApply, filters, setFilters }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay text-white">
      <div className="modal-content p-4 rounded shadow-lg">
        <h5 className="fw-bold text-center" style={{ fontSize: "1.4rem" }}>
          Filters
        </h5>

        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label fw-semibold">Location</label>
            <select
              className="form-select"
              value={filters.location}
              onChange={(e) =>
                setFilters({ ...filters, location: e.target.value })
              }
            >
              <option value="all">All</option>
              <option value="Lahore">Lahore</option>
              <option value="Karachi">Karachi</option>
              <option value="Faisalabad">Faisalabad</option>
              <option value="Rawalpindi">Rawalpindi</option>
              <option value="Islamabad">Islamabad</option>
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label fw-semibold">Program Offered</label>
            <select
              className="form-select"
              value={filters.program}
              onChange={(e) =>
                setFilters({ ...filters, program: e.target.value })
              }
            >
              <option value="all">All</option>
              <option value="Medical">Medical</option>
              <option value="Engineering">Engineering</option>
              <option value="Business">Business</option>
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label fw-semibold">Scholarships</label>
            <select
              className="form-select"
              value={filters.scholarship}
              onChange={(e) =>
                setFilters({ ...filters, scholarship: e.target.value })
              }
            >
              <option value="all">None</option>
              <option value="Merit Based">Merit Based</option>
              <option value="Kinship">Kinship</option>
              <option value="Sports Based">Sports Based</option>
              <option value="Need Based">Need Based</option>
            </select>
          </div>
        </div>
        <div className="d-flex gap-4 mt-3">
          <div className="w-50">
            <label className="form-label">Fee Range (PKR)</label>
            <div className="d-flex justify-content-between">
              <span>0</span>
              <span>300,000</span>
            </div>
            <input
              type="range"
              className="form-range"
              min="0"
              max="300000"
              step="5000"
              value={filters.fee}
              onChange={(e) => setFilters({ ...filters, fee: e.target.value })}
            />
            <div className="text-center mt-1">{filters.fee} PKR</div>
          </div>
          <div className="w-50">
            <label className="form-label">Duration (Semesters)</label>
            <div className="d-flex justify-content-between">
              <span>1</span>
              <span>10 Semesters</span>
            </div>
            <input
              type="range"
              className="form-range"
              min="1"
              max="10"
              value={filters.duration}
              onChange={(e) =>
                setFilters({ ...filters, duration: e.target.value })
              }
            />
            <div className="text-center mt-1">{filters.duration} Semesters</div>
          </div>
        </div>
        <div className="mt-3 text-center">
          <label className="form-label fw-bold">Minimum Rating</label>
          <div className="d-flex justify-content-center">
            {[...Array(5)].map((_, index) => {
              const fullStarValue = index + 1;
              const halfStarValue = index + 0.5;
              return (
                <span
                  key={index}
                  className="position-relative"
                  style={{ width: "1.5rem", display: "inline-block" }}
                >
                  <i
                    className={`bi ${filters.rating >= halfStarValue
                      ? "bi-star-half text-warning"
                      : "bi-star text-secondary"
                      } position-absolute`}
                    style={{
                      cursor: "pointer",
                      fontSize: "1.5rem",
                      clipPath: "inset(0 50% 0 0)",
                    }}
                    onClick={() =>
                      setFilters({ ...filters, rating: halfStarValue })
                    }
                  ></i>
                  <i
                    className={`bi ${filters.rating >= fullStarValue
                      ? "bi-star-fill text-warning"
                      : "bi-star text-secondary"
                      }`}
                    style={{ cursor: "pointer", fontSize: "1.5rem" }}
                    onClick={() =>
                      setFilters({ ...filters, rating: fullStarValue })
                    }
                  ></i>
                </span>
              );
            })}
          </div>
        </div>
        <div className="d-flex justify-content-center mt-4">
          <button className="btn btn-primary me-4" onClick={onApply}>
            Apply Filters
          </button>
          <button className="btn btn-secondary me-4" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-secondary"
            onClick={() =>
              setFilters({
                location: "all",
                program: "all",
                rating: 0,
                duration: 8,
                fee: 300000,
                scholarship: "none",
              })
            }
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};

const Section2 = ({ onCompare, isComparisonDisabled, isComparisonCleared }) => {
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const universitiesPerPage = 6;
  const [filters, setFilters] = useState({
    location: "all",
    program: "all",
    rating: 0,
    duration: 8,
    fee: 300000,
    scholarship: "none",
  });
  const filteredUniversities = universities.filter((uni) => {
    const searchMatch =
      !searchTerm ||
      uni.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      uni.degree?.toLowerCase().includes(searchTerm.toLowerCase());

    const locationMatch =
      filters.location === "all" || uni.location === filters.location;
    const ratingMatch = uni.rating >= filters.rating;
    const feeMatch = parseInt(uni.tuition) <= filters.fee;
    const durationMatch = parseInt(uni.duration) <= filters.duration;

    return (
      searchMatch && locationMatch && ratingMatch && feeMatch && durationMatch
    );
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUniversities.length / universitiesPerPage)
  );

  const indexOfLastUni = currentPage * universitiesPerPage;
  const indexOfFirstUni = indexOfLastUni - universitiesPerPage;
  const currentUniversities = filteredUniversities.slice(
    indexOfFirstUni,
    indexOfLastUni
  );
  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="container custom-container border-bottom border-2 border-primary text-center">
      <div className="d-flex justify-content-center my-3">
        <div
          className="input-group shadow-sm"
          style={{
            maxWidth: "900px",
            borderRadius: "30px",
            overflow: "hidden",
            backgroundColor: "#fff",
          }}
        >
          <input
            type="text"
            className="form-control border-0 ps-4"
            placeholder="Search by University Name, Degree"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              height: "50px",
              borderRadius: "30px",
              backgroundColor: "#fff",
              outline: "none",
              boxShadow: "none",
            }}
          />
          <span
            className="input-group-text bg-transparent border-0"
            style={{ cursor: "pointer" }}
            onClick={() => setShowFilter((prev) => !prev)}
          >
            <i className="bi bi-funnel"></i>
          </span>
          <button
            className="btn d-flex align-items-center shadow-sm"
            style={{
              backgroundColor: "#007bff",
              borderRadius: "30px",
              padding: "8px 20px",
              color: "white",
              fontWeight: "500",
              fontSize: "16px",
              margin: "5px",
            }}
          >
            <i className="bi bi-search me-1"></i> Search
          </button>
        </div>
      </div>
      <FilterModal
        show={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={() => setShowFilter(false)}
        filters={filters}
        setFilters={setFilters}
      />
      <div className="row ">
        {currentUniversities.map((uni, index) => (
          <div key={index} className="col-12 col-md-6 mt-3">
            <UniversityList
              university={uni}
              onCompare={onCompare}
              isComparisonDisabled={isComparisonDisabled}
              isComparisonCleared={isComparisonCleared}
            />
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <nav className="d-flex justify-content-center mt-4">
          <ul className="pagination pagination-lg border border-3 border-primary rounded-3">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => paginate(currentPage - 1)}
              >
                <i className="bi bi-chevron-left"></i> Previous
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page, idx, arr) => {
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 2 && page <= currentPage + 2)
                ) {
                  return (
                    <li
                      key={page}
                      className={`page-item ${currentPage === page ? "active" : ""
                        }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => paginate(page)}
                      >
                        {page}
                      </button>
                    </li>
                  );
                } else if (idx === 1 || idx === arr.length - 2) {
                  return (
                    <li key={page} className="page-item disabled">
                      <span className="page-link">...</span>
                    </li>
                  );
                }
                return null;
              }
            )}
            <li
              className={`page-item ${currentPage === totalPages ? "disabled" : ""
                }`}
            >
              <button
                className="page-link"
                onClick={() => paginate(currentPage + 1)}
              >
                Next <i className="bi bi-chevron-right"></i>
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};
export default FindUniversity;
