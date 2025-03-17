import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./UniversityList.css";

const UniversityList = ({
  university,
  onCompare,
  isComparisonDisabled,
  isComparisonCleared,
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [rating, setRating] = useState(university.rating);
  const [isSelectedForComparison, setIsSelectedForComparison] = useState(false);
  useEffect(() => {
    if (isComparisonCleared) {
      setIsSelectedForComparison(false);
    }
  }, [isComparisonCleared]);

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleStarClick = (index) => {
    if (rating === index + 1) {
      setRating(index + 0.5);
    } else {
      setRating(index + 1);
    }
  };
  const handleComparisonClick = () => {
    if (isComparisonDisabled && !isSelectedForComparison) {
      return;
    }
    setIsSelectedForComparison((prev) => !prev);
    onCompare(university);
  };

  return (
    <div className="university-card container p-4 rounded shadow-lg bg-light">
      <div className="d-flex justify-content-between align-items-center">
        <h4 className="fw-bold">{university.name}</h4>
        <div>
          <i
            className={`bi ${
              isBookmarked ? "bi-bookmark-fill" : "bi-bookmark"
            } me-2`}
            onClick={toggleBookmark}
            style={{ cursor: "pointer", fontSize: "1.5rem" }}
          ></i>
          <i
            className={`bi bi-arrow-left-right ${
              isSelectedForComparison ? "text-primary" : "text-dark"
            } ${
              isComparisonDisabled && !isSelectedForComparison
                ? "text-muted"
                : ""
            }`}
            style={{
              cursor:
                isComparisonDisabled && !isSelectedForComparison
                  ? "not-allowed"
                  : "pointer",
              fontSize: "1.5rem",
            }}
            onClick={handleComparisonClick}
            title={
              isComparisonDisabled && !isSelectedForComparison
                ? "Only two universities can be compared at a time"
                : "Add to comparison"
            }
          ></i>
        </div>
      </div>

      <div className="row">
        <div className="col-6">
          <p className="text-muted mb-1">Degree</p>
          <h6 className="fw-bold">{university.degree}</h6>

          <p className="text-muted mb-1">Beginning</p>
          <h6 className="fw-bold">{university.beginning}</h6>
          <div className="mt-2">
            {[...Array(5)].map((_, index) => (
              <i
                key={index}
                className={`bi ${
                  index + 1 <= rating
                    ? "bi-star-fill"
                    : index + 0.5 === rating
                    ? "bi-star-half"
                    : "bi-star"
                } text-warning`}
                style={{ cursor: "pointer" }}
                onClick={() => handleStarClick(index)}
              ></i>
            ))}
          </div>
        </div>
        <div className="col-6 text-end">
          <p className="text-muted mb-1">Duration</p>
          <h6 className="fw-bold">{university.duration}</h6>

          <p className="text-muted mb-1">Tuition Fee Per Sem</p>
          <h6 className="fw-bold">{university.tuition}</h6>

          <p className="text-muted mt-2">
            <i className="bi bi-geo-alt-fill text-danger"></i>{" "}
            {university.location}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UniversityList;
