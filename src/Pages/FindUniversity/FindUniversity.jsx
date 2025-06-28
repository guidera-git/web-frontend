import React, { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../../ThemeContext";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./FindUniversity.css";
import UniversityList from "../../components/UniversityList/UniversityList";
import ComparisonModal from "../../components/Comparison/ComparisonModal";
import { useLocation, useNavigate } from "react-router-dom";

function FindUniversity() {
  const [selectedForComparison, setSelectedForComparison] = useState([]);
  const [isComparisonCleared, setIsComparisonCleared] = useState(false);
  const navigate = useNavigate();

  const handleCompare = (uni) => {
    setSelectedForComparison((prev) =>
      prev.some((u) => u.program_id === uni.program_id)
        ? prev.filter((u) => u.program_id !== uni.program_id)
        : prev.length < 2
        ? [...prev, uni]
        : prev
    );
  };

  const resetComparison = () => {
    setSelectedForComparison([]);
    setIsComparisonCleared(true);
    setTimeout(() => setIsComparisonCleared(false), 0);
  };

  const { theme } = useContext(ThemeContext);

  return (
    <div className={`find-university ${theme}`}>
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
      <button
        className="bt_float btn btn-primary position-fixed rounded-pill d-flex align-items-center"
        style={{
          bottom: "20px",
          right: "20px",
          padding: "10px 20px",
          zIndex: 1000,
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        }}
        onClick={() => navigate("/Form")}
      >
        <i className="bi bi-stars"></i>
        Recommend Me
      </button>
    </div>
  );
}

function Section1() {
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { theme } = useContext(ThemeContext);

  const handleRecommendationClick = () => {
    setShowConfirmation(true);
  };

  const handleContinue = () => {
    setShowConfirmation(false);
    navigate("/Form");
  };
  const handleGoBack = () => {
    setShowConfirmation(false);
  };
  const modalStyles = {
    backdrop: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme === "dark" ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.5)",
      zIndex: 1040,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      maxWidth: "500px",
      width: "90%",
      border: `1px solid ${theme === "dark" ? "#444" : "#0d6efd"}`,
      backgroundColor: theme === "dark" ? "#333" : "#fff",
      color: theme === "dark" ? "#fff" : "#000",
    },
    text: {
      color: theme === "dark" ? "#fff" : "#000",
    },
  };

  return (
    <div
      className={`custom-container text-white container border-bottom border-2 border-primary ${theme}`}
    >
      {showConfirmation && (
        <div className="modal-backdrop" style={modalStyles.backdrop}>
          <div
            className="modal-content p-4 rounded"
            style={modalStyles.content}
          >
            <h4 className="mb-3" style={modalStyles.text}>
              Before we continue...
            </h4>
            <p style={modalStyles.text}>
              We need some information to give you the best recommendation.
            </p>
            <div className="d-flex justify-content-center gap-3 mt-4">
              <button
                className={`btn ${
                  theme === "dark"
                    ? "btn-outline-light"
                    : "btn-outline-secondary"
                }`}
                onClick={handleGoBack}
              >
                Go Back
              </button>
              <button
                className={`btn ${
                  theme === "dark" ? "btn-primary" : "btn-primary"
                }`}
                onClick={handleContinue}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="row min-vh-20">
        <div className="col-md-8 d-flex flex-column justify-content-center align-items-center p-5">
          <h2>
            Find Your Future at the{" "}
            <span className="text-primary">Perfect University!</span>
          </h2>
          <p className="mt-2 mb-3">
            Discover universities tailored to your preferences, location, and
            aspirations.
          </p>
          <div className="d-flex gap-3">
            <button className="btn btn-primary">Start Your Search</button>
            <button
              className="btn sign-up btn-outline-secondary"
              onClick={handleRecommendationClick}
            >
              Recommendation Me
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

function Section2({ onCompare, isComparisonDisabled, isComparisonCleared }) {
  const location = useLocation();
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [locations, setLocations] = useState([]);
  const [programsOffered, setProgramsOffered] = useState([]);
  const [universityNames, setUniversityNames] = useState([]);
  const [stats, setStats] = useState(null);
  const { program } = location.state || {};

  const { theme } = useContext(ThemeContext);
  const [filters, setFilters] = useState({
    location: "all",
    program_title: program || "all",
    university_title: "all",
    min_total_fee: "",
    max_total_fee: "",
  });

  const [searchTerm, setSearchTerm] = useState(program || "");
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchDropdowns();
    fetchStatistics();

    // If program comes from location, automatically search for it
    if (program) {
      handleProgramSearch(program);
    } else {
      fetchAllPrograms();
    }
  }, [program]); // Added program as dependency

  // Updated handleProgramSearch to use filter endpoint for complete data
  const handleProgramSearch = async (programName) => {
    setLoading(true);
    setErrorMessage(null);
    setNotFound(false);
    try {
      // Use the filter endpoint instead of search to get complete program data
      const params = new URLSearchParams();
      params.append("program_title", programName);

      const res = await axios.get(
        `http://localhost:3000/api/programs/filter?${params.toString()}`,
        authHeader
      );

      setUniversities(res.data);
      setCurrentPage(1);
      setNotFound(res.data.length === 0);
    } catch (err) {
      console.error(err);
      setErrorMessage("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllPrograms = async () => {
    setLoading(true);
    setErrorMessage(null);
    setNotFound(false);
    try {
      const res = await axios.get(
        "http://localhost:3000/api/programs",
        authHeader
      );
      const data = res.data;
      setUniversities(data);
    } catch {
      setErrorMessage(
        "Unable to load universities at the moment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdowns = async () => {
    try {
      const [locRes, progRes, uniRes] = await Promise.all([
        axios.get("http://localhost:3000/api/locations", authHeader),
        axios.get("http://localhost:3000/api/program-names", authHeader),
        axios.get("http://localhost:3000/api/university-names", authHeader),
      ]);
      setLocations(locRes.data);
      setProgramsOffered(progRes.data);
      setUniversityNames(uniRes.data);
    } catch (err) {
      console.error("Dropdown fetching error", err);
    }
  };

  const fetchStatistics = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/statistics",
        authHeader
      );
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats", err);
    }
  };

  // Updated handleSearch to use comprehensive search approach
  const handleSearch = async () => {
    const trimmed = searchTerm.trim();

    if (trimmed === "") {
      fetchAllPrograms();
      setErrorMessage(null);
      setNotFound(false);
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setNotFound(false);

    try {
      // Use filter endpoint for program search to get complete data
      const programParams = new URLSearchParams();
      programParams.append("program_title", trimmed);

      const universityParams = new URLSearchParams();
      universityParams.append("university_title", trimmed);

      const [progRes, uniRes] = await Promise.all([
        axios.get(
          `http://localhost:3000/api/programs/filter?${programParams.toString()}`,
          authHeader
        ),
        axios.get(
          `http://localhost:3000/api/programs/filter?${universityParams.toString()}`,
          authHeader
        ),
      ]);

      // Combine results and remove duplicates
      const combined = [...progRes.data, ...uniRes.data];
      const uniquePrograms = combined.filter(
        (program, index, self) =>
          index === self.findIndex((p) => p.program_id === program.program_id)
      );

      setUniversities(uniquePrograms);
      setCurrentPage(1);
      setNotFound(uniquePrograms.length === 0);
    } catch (err) {
      console.error(err);
      setErrorMessage("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    setLoading(true);
    setErrorMessage(null);
    setNotFound(false);

    const params = new URLSearchParams();

    if (filters.location !== "all") params.append("location", filters.location);
    if (filters.program_title !== "all")
      params.append("program_title", filters.program_title);
    if (filters.university_title !== "all")
      params.append("university_title", filters.university_title);

    const minFee = parseInt(filters.min_total_fee, 10);
    const maxFee = parseInt(filters.max_total_fee, 10);
    if (!isNaN(minFee) && minFee >= 0) {
      params.append("min_total_fee", minFee.toString());
    }

    if (!isNaN(maxFee) && maxFee >= 0) {
      params.append("max_total_fee", maxFee.toString());
    }
    if (!isNaN(minFee) && !isNaN(maxFee) && minFee > maxFee) {
      setErrorMessage("Minimum fee must be less than maximum fee");
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get(
        `http://localhost:3000/api/programs/filter?${params.toString()}`,
        authHeader
      );
      setUniversities(res.data);
      setCurrentPage(1);
      setNotFound(res.data.length === 0);
      setShowFilter(false);
    } catch (err) {
      console.error("Filter error:", err);
      if (err.response?.status === 500) {
        setErrorMessage(
          "Server error occurred while applying filters. Please try different parameters."
        );
      } else {
        setErrorMessage(
          "Could not apply filters. Please review your selections."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = async () => {
    setFilters({
      location: "all",
      program_title: "all",
      university_title: "all",
      min_total_fee: "",
      max_total_fee: "",
    });
    setSearchTerm("");
    await fetchAllPrograms();
    setCurrentPage(1);
    setShowFilter(false);
    setNotFound(false);
    setErrorMessage(null);
  };

  const totalPages = Math.ceil(universities.length / perPage);
  const displayed = universities.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  if (loading) return <div className="text-center py-5">Loading...</div>;

  return (
    <div className="container custom-container border-bottom border-primary py-4 text-center">
      {program && (
        <h3 className="mb-4">
          Showing results for: <span className="text-primary">{program}</span>
        </h3>
      )}
      {errorMessage && (
        <div className="alert alert-warning">{errorMessage}</div>
      )}
      {/* Search & filter controls */}
      <div className="d-flex justify-content-center mb-3">
        <input
          type="text"
          className="form-control me-2 border-dark border-1"
          placeholder="Search by University or Program"
          style={{ maxWidth: 700, height: "45px" }}
          value={searchTerm}
          onChange={(e) => {
            const value = e.target.value;
            setSearchTerm(value);
            if (value.trim() === "") {
              fetchAllPrograms();
              setNotFound(false);
              setErrorMessage(null);
            }
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />

        <button className="btn btn-primary me-2" onClick={handleSearch}>
          Search
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => setShowFilter((p) => !p)}
        >
          Filters
        </button>
      </div>
      {/* Filter Modal */}
      {showFilter && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            backgroundColor:
              theme === "dark"
                ? "rgba(0, 0, 0, 0.5)"
                : "rgba(255, 255, 255, 0.6)",
            backdropFilter: "blur(8px)",
            zIndex: 1055,
          }}
        >
          <div
            className={`shadow-lg rounded p-4 ${
              theme === "dark" ? "bg-dark text-light" : "bg-white text-dark"
            }`}
            style={{ width: "90%", maxWidth: "800px" }}
          >
            <h5 className="mb-3">Filters</h5>

            <div className="row mb-3">
              <div className="col">
                <label className="form-label">Location</label>
                <select
                  className="form-select"
                  value={filters.location}
                  onChange={(e) =>
                    setFilters({ ...filters, location: e.target.value })
                  }
                >
                  <option value="all">All</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col">
                <label className="form-label">Program</label>
                <select
                  className="form-select"
                  value={filters.program_title}
                  onChange={(e) =>
                    setFilters({ ...filters, program_title: e.target.value })
                  }
                >
                  <option value="all">All</option>
                  {programsOffered.map((prog) => (
                    <option key={prog} value={prog}>
                      {prog}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col">
                <label className="form-label">University</label>
                <select
                  className="form-select"
                  value={filters.university_title}
                  onChange={(e) =>
                    setFilters({ ...filters, university_title: e.target.value })
                  }
                >
                  <option value="all">All</option>
                  {universityNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Total Fee Range (PKR)</label>
              <div className="d-flex gap-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Min"
                  min="0"
                  step="1000"
                  value={filters.min_total_fee}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || /^\d+$/.test(value)) {
                      setFilters({ ...filters, min_total_fee: value });
                    }
                  }}
                />
                <input
                  type="number"
                  className="form-control"
                  placeholder="Max"
                  min="0"
                  step="1000"
                  value={filters.max_total_fee}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || /^\d+$/.test(value)) {
                      setFilters({ ...filters, max_total_fee: value });
                    }
                  }}
                />
              </div>
              {filters.min_total_fee &&
                filters.max_total_fee &&
                parseInt(filters.min_total_fee) >
                  parseInt(filters.max_total_fee) && (
                  <div className="mt-1 text-warning">
                    Minimum fee must be less than maximum fee
                  </div>
                )}
            </div>

            <div className="text-center mt-4">
              <button className="btn btn-primary me-2" onClick={handleFilter}>
                Apply Filters
              </button>
              <button
                className={`btn ${
                  theme === "dark" ? "btn-light" : "btn-secondary"
                } me-2`}
                onClick={handleResetFilters}
              >
                Reset Filters
              </button>
              <button
                className={`btn ${
                  theme === "dark" ? "btn-outline-light" : "btn-danger"
                }`}
                onClick={() => setShowFilter(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="row">
        {notFound ? (
          <div className="alert alert-info text-center mt-3 w-100">
            No universities or programs match your search.
          </div>
        ) : (
          displayed.map((uni) => (
            <div key={uni.program_id || uni.id} className="col-md-6 mb-3">
              <UniversityList
                university={uni}
                onCompare={onCompare}
                isComparisonDisabled={isComparisonDisabled}
                isComparisonCleared={isComparisonCleared}
              />
            </div>
          ))
        )}
      </div>
      {totalPages > 1 && (
        <nav className="d-flex justify-content-center mt-4">
          <ul className="pagination pagination-lg border border-3 border-primary rounded-3">
            {/* Previous Button */}
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              >
                <i className="bi bi-chevron-left"></i> Previous
              </button>
            </li>

            {/* Page Numbers */}
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
                      className={`page-item ${
                        currentPage === page ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    </li>
                  );
                } else if (
                  (page === 2 && currentPage > 4) ||
                  (page === totalPages - 1 && currentPage < totalPages - 3)
                ) {
                  return (
                    <li key={page} className="page-item disabled">
                      <span className="page-link">...</span>
                    </li>
                  );
                }
                return null;
              }
            )}

            {/* Next Button */}
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
              >
                Next <i className="bi bi-chevron-right"></i>
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}

export default FindUniversity;
