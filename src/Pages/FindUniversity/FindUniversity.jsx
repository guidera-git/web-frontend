import React, { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../../ThemeContext";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./FindUniversity.css";
import UniversityList from "../../components/UniversityList/UniversityList";
import ComparisonModal from "../../components/Comparison/ComparisonModal";
import { useNavigate } from "react-router-dom";
function FindUniversity() {
  const [selectedForComparison, setSelectedForComparison] = useState([]);
  const [isComparisonCleared, setIsComparisonCleared] = useState(false);

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
      <Section1 />{" "}
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
    </div>
  );
}
function Section1() {
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);

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

  return (
    <div className="custom-container text-white container border-bottom border-2 border-primary">
      {showConfirmation && (
        <div
          className="modal-backdrop"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1040,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            className="modal-content bg-dark p-4 rounded"
            style={{
              maxWidth: "500px",
              width: "90%",
              border: "1px solid #0d6efd",
            }}
          >
            <h4 className="text-primary mb-3">Before we continue...</h4>
            <p>We need some information to give you the best recommendation.</p>
            <div className="d-flex justify-content-center gap-3 mt-4">
              <button
                className="btn btn-outline-secondary"
                onClick={handleGoBack}
              >
                Go Back
              </button>
              <button className="btn btn-primary" onClick={handleContinue}>
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
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [locations, setLocations] = useState([]);
  const [programsOffered, setProgramsOffered] = useState([]);
  const [universityNames, setUniversityNames] = useState([]);

  const [filters, setFilters] = useState({
    location: "all",
    program_title: "all",
    university_title: "all",
    qs_ranking: "all",
    min_total_fee: "",
    max_total_fee: "",
    min_credit_fee: "",
    max_credit_fee: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchAllPrograms();
  }, []);

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
      setLocations([...new Set(data.map((p) => p.location))].sort());
      setProgramsOffered([...new Set(data.map((p) => p.program_title))].sort());
      setUniversityNames(
        [...new Set(data.map((p) => p.university_title))].sort()
      );
    } catch {
      setErrorMessage(
        "Unable to load universities at the moment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    const trimmed = searchTerm.trim();

    if (trimmed === "") {
      // 👇 This block replaces the error and shows everything
      fetchAllPrograms();
      setErrorMessage(null);
      setNotFound(false);
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setNotFound(false);

    try {
      const [uniRes, progRes] = await Promise.all([
        axios.get(
          `http://localhost:3000/api/universities/search/${encodeURIComponent(
            trimmed
          )}`,
          authHeader
        ),
        axios.get(
          `http://localhost:3000/api/programs/search/${encodeURIComponent(
            trimmed
          )}`,
          authHeader
        ),
      ]);

      const programResults = progRes.data;
      const universityMatches = uniRes.data;

      const uniProgramPromises = (
        Array.isArray(universityMatches) ? universityMatches : []
      ).map((u) =>
        axios
          .get(
            `http://localhost:3000/api/programs/byUniversity/${u.id}`,
            authHeader
          )
          .then((r) => r.data)
      );

      const uniProgramsArrays = await Promise.all(uniProgramPromises);
      const uniPrograms = uniProgramsArrays.flat();

      const combined = [...programResults, ...uniPrograms];
      const normalized = combined.map((item) => ({
        ...item,
        program_id: item.program_id || item.id,
      }));
      setUniversities(normalized);
      setCurrentPage(1);
      setNotFound(combined.length === 0);
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
    if (filters.qs_ranking !== "all")
      params.append("qs_ranking", filters.qs_ranking);

    // Only include numeric min/max when complete or higher filter
    if (
      filters.min_total_fee !== "" &&
      filters.max_total_fee !== "" &&
      +filters.min_total_fee <= +filters.max_total_fee
    )
      params.append("min_total_fee", filters.min_total_fee) &&
        params.append("max_total_fee", filters.max_total_fee);

    if (
      filters.min_credit_fee !== "" &&
      filters.max_credit_fee !== "" &&
      +filters.min_credit_fee <= +filters.max_credit_fee
    )
      params.append("min_credit_fee", filters.min_credit_fee) &&
        params.append("max_credit_fee", filters.max_credit_fee);

    try {
      const res = await axios.get(
        `http://localhost:3000/api/programs/filter?${params}`,
        authHeader
      );
      setUniversities(res.data);
      setCurrentPage(1);
      setNotFound(res.data.length === 0);
      setShowFilter(false);
    } catch {
      setErrorMessage(
        "Could not apply filters. Please review your selections."
      );
    } finally {
      setLoading(false);
    }
  };
  const handleResetFilters = async () => {
    setFilters({
      location: "all",
      program_title: "all",
      university_title: "all",
      qs_ranking: "all",
      min_total_fee: "",
      max_total_fee: "",
      min_credit_fee: "",
      max_credit_fee: "",
    });
    setSearchTerm("");
    await fetchAllPrograms(); // This re-fetches all data from the database
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
              fetchAllPrograms(); // Reload everything if input is cleared
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

      {/* Filter modal */}
      {showFilter && (
        <div className="modal-overlay">
          <div className="modal-content p-4">
            <h5>Filters</h5>
            <div className="row mb-3">
              <div className="col">
                <label>Location</label>
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
                <label>Program</label>
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
                <label>University</label>
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
              <div className="col">
                <label>QS Ranking</label>
                <select
                  className="form-select"
                  value={filters.qs_ranking}
                  onChange={(e) =>
                    setFilters({ ...filters, qs_ranking: e.target.value })
                  }
                >
                  <option value="all">All</option>
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-3 text-start">
              <label>Total Fee Range (PKR)</label>
              <div className="d-flex gap-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Min"
                  min="0"
                  value={filters.min_total_fee}
                  onChange={(e) =>
                    setFilters({ ...filters, min_total_fee: e.target.value })
                  }
                />
                <input
                  type="number"
                  className="form-control"
                  placeholder="Max"
                  min="0"
                  value={filters.max_total_fee}
                  onChange={(e) =>
                    setFilters({ ...filters, max_total_fee: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="mb-3 text-start">
              <label>Credit Fee Range (PKR)</label>
              <div className="d-flex gap-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Min"
                  min="0"
                  value={filters.min_credit_fee}
                  onChange={(e) =>
                    setFilters({ ...filters, min_credit_fee: e.target.value })
                  }
                />
                <input
                  type="number"
                  className="form-control"
                  placeholder="Max"
                  min="0"
                  value={filters.max_credit_fee}
                  onChange={(e) =>
                    setFilters({ ...filters, max_credit_fee: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="text-center">
              <button className="btn btn-primary me-2" onClick={handleFilter}>
                Apply Filters
              </button>
              <button
                className="btn btn-secondary me-2"
                onClick={handleResetFilters}
              >
                Reset Filters
              </button>
              <button
                className="btn btn-danger"
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
