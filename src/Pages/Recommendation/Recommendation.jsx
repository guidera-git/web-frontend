import Footer from "../../components/Footer/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Recommendation.css";
import React, { useState, useContext } from "react";
import { ThemeContext } from "../../ThemeContext";
import UniversityList from "../../components/UniversityList/UniversityList";
import ComparisonModal from "../../components/Comparison/ComparisonModal";

function Recommendation() {
    const { theme } = useContext(ThemeContext);
    const [selectedUniversities, setSelectedUniversities] = useState([]);
    const [isComparisonCleared, setIsComparisonCleared] = useState(false);

    const universities = [
        {
            name: "Harvard University",
            degree: "Bachelor's in Computer Science",
            beginning: "Fall 2025",
            duration: "4 Years",
            tuition: "$50,000 per semester",
            location: "Cambridge, MA",
            rating: 4.5
        }, {
            name: "Comsats University",
            degree: "Bachelor's in Computer Science",
            beginning: "Fall 2025",
            duration: "4 Years",
            tuition: "$50,000 per semester",
            location: "Cambridge, MA",
            rating: 4.5
        }, {
            name: "UMT University",
            degree: "Bachelor's in Computer Science",
            beginning: "Fall 2025",
            duration: "4 Years",
            tuition: "$50,000 per semester",
            location: "Cambridge, MA",
            rating: 4.5
        },
        {
            name: "MIT",
            degree: "Bachelor's in Computer Science",
            beginning: "Spring 2025",
            duration: "4 Years",
            tuition: "$55,000 per semester",
            location: "Cambridge, MA",
            rating: 4.8
        }
    ];

    const handleCompare = (university) => {
        setSelectedUniversities((prev) => {
            if (prev.includes(university)) {
                return prev.filter((u) => u !== university);
            }
            if (prev.length < 2) {
                return [...prev, university];
            }
            return prev;
        });
    };

    const clearComparison = () => {
        setSelectedUniversities([]);
        setIsComparisonCleared(true);
        setTimeout(() => setIsComparisonCleared(false), 100);
    };


    return (
        <div className={`home-page ${theme}`}>
            <div className="custom-container"> {/* Applied custom class */}
                <h2 className="text-center text-white my-4">Recommended Degree For You</h2>
                <h2 className="text-center text-primary my-4">Bachelor's in Computer Science</h2>
                <div className="container">
                    {universities.map((university, index) => (
                        <div key={index} className="university-list-item"> {/* Added class here */}
                            <UniversityList
                                university={university}
                                onCompare={handleCompare}
                                isComparisonDisabled={selectedUniversities.length >= 2}
                                isComparisonCleared={isComparisonCleared}
                            />
                        </div>
                    ))}
                </div>


                <button
                    className="btn btn-danger my-3"
                    onClick={clearComparison}
                    disabled={selectedUniversities.length === 0}
                >
                    Clear Comparison
                </button>

                {selectedUniversities.length === 2 && (
                    <ComparisonModal universities={selectedUniversities} />
                )}

                <Footer />
            </div>
        </div>
    );
}

export default Recommendation;
