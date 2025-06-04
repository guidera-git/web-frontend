import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullname: "",
    email: "",
    gender: "",
    birthdate: "",
    aboutme: "",
    profilephoto: "blueprint.png",
  });
  const [imagePreview, setImagePreview] = useState("blueprint.png");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const calculateAge = (birthdate) => {
    if (!birthdate) return null;
    const birth = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      try {
        const response = await axios.get(
          "http://localhost:3000/api/user/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const apiData = response.data || {};
        const safeProfile = {
          fullname: apiData.fullname || "New User",
          email: apiData.email || "No email",
          gender: apiData.gender || "Not specified",
          birthdate: apiData.birthdate || "",
          aboutme: apiData.aboutme || "",
          profilephoto: apiData.profilephoto || "blueprint.png",
        };

        setProfile(safeProfile);
        setEditForm(safeProfile);
        setImagePreview(safeProfile.profilephoto);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Unable to load profile. You can still edit.");
        const fallbackProfile = {
          fullname: "User",
          email: localStorage.getItem("userEmail") || "No email",
          gender: "Not specified",
          birthdate: "",
          aboutme: "",
          profilephoto: "blueprint.png",
        };
        setProfile(fallbackProfile);
        setEditForm(fallbackProfile);
        setImagePreview(fallbackProfile.profilephoto);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setEditForm((prev) => ({ ...prev, profilephoto: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview("blueprint.png");
    setEditForm((prev) => ({ ...prev, profilephoto: "blueprint.png" }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const updateData = {
        fullname: editForm.fullname,
        email: editForm.email,
        gender: editForm.gender,
        birthdate: editForm.birthdate,
        aboutme: editForm.aboutme,
      };

      await axios.patch("http://localhost:3000/api/user/profile", updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (editForm.profilephoto.startsWith("data:")) {
        const formData = new FormData();
        const blob = await fetch(editForm.profilephoto).then((r) => r.blob());
        formData.append("profilephoto", blob, "profile.jpg");

        await axios.patch(
          "http://localhost:3000/api/user/profile/photo",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      const { data } = await axios.get(
        "http://localhost:3000/api/user/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProfile(data);
      setEditForm(data);
      setImagePreview(data.profilephoto);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      console.error("Save error:", err);
      setError(err.response?.data?.error || "Profile update failed.");
    }
  };

  const handleCancel = () => {
    if (!profile) return;
    setEditForm(profile);
    setImagePreview(profile.profilephoto);
    setIsEditing(false);
    setError(null);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const age = calculateAge(profile?.birthdate);

  return (
    <div className="container py-5">
      {/* Logout Modal */}
      {showLogoutModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header text-danger">
                <h5 className="modal-title">Confirm Logout</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowLogoutModal(false)}
                ></button>
              </div>
              <div className="modal-body text-dark">
                <p>Are you sure you want to logout?</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowLogoutModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={confirmLogout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger alert-dismissible fade show mb-4">
          {error}
          <button className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-body p-4" style={{ background: "#F8F8F8" }}>
              <div className="text-center mb-4">
                <div className="position-relative d-inline-block">
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="rounded-circle shadow"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                    }}
                    onError={(e) => (e.target.src = "blueprint.png")}
                  />
                  {isEditing && (
                    <div className="position-absolute bottom-0 end-0">
                      <label className="btn btn-primary btn-sm rounded-circle">
                        <i className="bi bi-camera"></i>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="d-none"
                        />
                      </label>
                      <button
                        className="btn btn-danger btn-sm rounded-circle ms-1"
                        onClick={handleRemoveImage}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  )}
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    name="fullname"
                    value={editForm.fullname}
                    onChange={handleInputChange}
                    className="form-control text-center mt-3 fw-bold fs-3 border-0 border-bottom"
                    placeholder="Enter your name"
                  />
                ) : (
                  <h2 className="mt-3 fw-bold">{profile.fullname}</h2>
                )}
              </div>

              {/* Profile details */}
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={editForm.email}
                    disabled={!isEditing}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-6">
                  <label>Gender</label>
                  <select
                    name="gender"
                    className="form-select"
                    disabled={!isEditing}
                    value={editForm.gender}
                    onChange={handleInputChange}
                  >
                    <option>Other</option>
                    <option>Female</option>
                    <option>Male</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label>Birthdate</label>
                  <input
                    type="date"
                    name="birthdate"
                    className="form-control"
                    value={editForm.birthdate?.slice(0, 10)}
                    disabled={!isEditing}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-6">
                  <label>Age</label>
                  <input
                    type="text"
                    className="form-control"
                    value={age ? `${age} years` : "N/A"}
                    disabled
                  />
                </div>
                <div className="col-12">
                  <label>About Me</label>
                  <textarea
                    name="aboutme"
                    className="form-control"
                    rows="3"
                    value={editForm.aboutme}
                    disabled={!isEditing}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="text-end">
                {isEditing ? (
                  <>
                    <button
                      className="btn btn-success me-2"
                      onClick={handleSave}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-primary me-2"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </button>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => setShowLogoutModal(true)}
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
