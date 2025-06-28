import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { ThemeContext } from "../../ThemeContext";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);
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
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

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
      if (!token) {
        toast.error("Please login to view your profile");
        return navigate("/login");
      }

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
        toast.success("Profile loaded successfully");
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Unable to load profile. You can still edit.");
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

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setEditForm((prev) => ({ ...prev, profilephoto: reader.result }));
      setIsUploading(false);
      toast.success("Profile picture updated");
    };
    reader.onerror = () => {
      toast.error("Error reading image file");
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview("blueprint.png");
    setEditForm((prev) => ({ ...prev, profilephoto: "blueprint.png" }));
    toast.info("Profile picture removed");
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Session expired. Please login again.");
      return navigate("/login");
    }

    try {
      const updateData = {
        fullname: editForm.fullname,
        email: editForm.email,
        gender: editForm.gender,
        birthdate: editForm.birthdate,
        aboutme: editForm.aboutme,
      };

      const updateToast = toast.loading("Updating profile...");

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

      toast.update(updateToast, {
        render: "Profile updated successfully!",
        type: "success",
        isLoading: false,
      });
    } catch (err) {
      console.error("Save error:", err);
      toast.error(err.response?.data?.error || "Profile update failed.");
    }
  };

  const handleCancel = () => {
    if (!profile) return;
    setEditForm(profile);
    setImagePreview(profile.profilephoto);
    setIsEditing(false);
    toast.info("Changes discarded");
  };

  const handleLogoutClick = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };
  const age = calculateAge(profile?.birthdate);

  if (loading) {
    return (
      <div
        className={`d-flex justify-content-center align-items-center vh-100 bg-${theme}`}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-vh-100 bg-${theme === "dark" ? "dark" : "light"} text-${
        theme === "dark" ? "light" : "dark"
      }`}
    >
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div
              className={`card shadow-lg border-${
                theme === "dark" ? "secondary" : "light"
              }`}
            >
              <div
                className={`card-body p-4 bg-${
                  theme === "dark" ? "dark" : "light"
                }`}
              >
                {/* Theme Toggle Button */}
                <div className="d-flex justify-content-end mb-3">
                  <button
                    className={`btn btn-sm btn-${
                      theme === "dark" ? "light" : "dark"
                    }`}
                    onClick={toggleTheme}
                  >
                    <i
                      className={`bi bi-${theme === "dark" ? "sun" : "moon"}`}
                    ></i>{" "}
                    {theme === "dark" ? "Light" : "Dark"} Mode
                  </button>
                </div>

                {/* Profile Header */}
                <div className="text-center mb-4">
                  <div className="position-relative d-inline-block">
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className={`rounded-circle shadow border border-${
                        theme === "dark" ? "light" : "dark"
                      }`}
                      style={{
                        width: "150px",
                        height: "150px",
                        objectFit: "cover",
                      }}
                      onError={(e) => (e.target.src = "blueprint.png")}
                    />
                    {isEditing && (
                      <div className="position-absolute bottom-0 end-0">
                        <label
                          className={`btn btn-primary btn-sm rounded-circle ${
                            isUploading ? "disabled" : ""
                          }`}
                        >
                          <i className="bi bi-pencil"></i>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="d-none"
                            disabled={isUploading}
                          />
                        </label>
                        <button
                          className={`btn btn-danger btn-sm rounded-circle ms-1 ${
                            isUploading ? "disabled" : ""
                          }`}
                          onClick={handleRemoveImage}
                          disabled={isUploading}
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
                      className={`form-control text-center mt-3 fw-bold fs-3 border-0 border-bottom bg-${
                        theme === "dark" ? "dark" : "light"
                      } text-${theme === "dark" ? "light" : "dark"}`}
                      placeholder="Enter your name"
                    />
                  ) : (
                    <h2
                      className={`mt-3 fw-bold text-${
                        theme === "dark" ? "light" : "dark"
                      }`}
                    >
                      {profile.fullname}
                    </h2>
                  )}
                </div>

                {/* Profile Details */}
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label
                      className={`form-label text-${
                        theme === "dark" ? "light" : "dark"
                      }`}
                    >
                      Email
                    </label>
                    <div className="input-group">
                      <span
                        className={`input-group-text bg-${
                          theme === "dark" ? "secondary" : "light"
                        } text-${theme === "dark" ? "light" : "dark"}`}
                      >
                        <i className="bi bi-envelope"></i>
                      </span>
                      <input
                        type="email"
                        name="email"
                        className={`form-control bg-${
                          theme === "dark" ? "dark" : "light"
                        } text-${theme === "dark" ? "light" : "dark"}`}
                        value={editForm.email}
                        disabled // Always disabled (removed the conditional)
                        readOnly // Optional - makes it look more like static text
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label
                      className={`form-label text-${
                        theme === "dark" ? "light" : "dark"
                      }`}
                    >
                      Gender
                    </label>
                    <div className="input-group">
                      <span
                        className={`input-group-text bg-${
                          theme === "dark" ? "secondary" : "light"
                        } text-${theme === "dark" ? "light" : "dark"}`}
                      >
                        <i className="bi bi-gender-ambiguous"></i>
                      </span>
                      <select
                        name="gender"
                        className={`form-select bg-${
                          theme === "dark" ? "dark" : "light"
                        } text-${theme === "dark" ? "light" : "dark"}`}
                        disabled={!isEditing}
                        value={editForm.gender}
                        onChange={handleInputChange}
                      >
                        <option>Not specified</option>
                        <option>Female</option>
                        <option>Male</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label
                      className={`form-label text-${
                        theme === "dark" ? "light" : "dark"
                      }`}
                    >
                      Birthdate
                    </label>
                    <div className="input-group">
                      <span
                        className={`input-group-text bg-${
                          theme === "dark" ? "secondary" : "light"
                        } text-${theme === "dark" ? "light" : "dark"}`}
                      >
                        <i className="bi bi-calendar"></i>
                      </span>
                      <input
                        type="date"
                        name="birthdate"
                        className={`form-control bg-${
                          theme === "dark" ? "dark" : "light"
                        } text-${theme === "dark" ? "light" : "dark"}`}
                        value={editForm.birthdate?.slice(0, 10)}
                        disabled={!isEditing}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label
                      className={`form-label text-${
                        theme === "dark" ? "light" : "dark"
                      }`}
                    >
                      Age
                    </label>
                    <div className="input-group">
                      <span
                        className={`input-group-text bg-${
                          theme === "dark" ? "secondary" : "light"
                        } text-${theme === "dark" ? "light" : "dark"}`}
                      >
                        <i className="bi bi-person"></i>
                      </span>
                      <input
                        type="text"
                        className={`form-control bg-${
                          theme === "dark" ? "dark" : "light"
                        } text-${theme === "dark" ? "light" : "dark"}`}
                        value={age ? `${age} years` : "Not specified"}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <label
                      className={`form-label text-${
                        theme === "dark" ? "light" : "dark"
                      }`}
                    >
                      About Me
                    </label>
                    <div className="input-group">
                      <span
                        className={`input-group-text bg-${
                          theme === "dark" ? "secondary" : "light"
                        } text-${theme === "dark" ? "light" : "dark"}`}
                      >
                        <i className="bi bi-info-circle"></i>
                      </span>
                      <textarea
                        name="aboutme"
                        className={`form-control bg-${
                          theme === "dark" ? "dark" : "light"
                        } text-${theme === "dark" ? "light" : "dark"}`}
                        rows="3"
                        value={editForm.aboutme}
                        disabled={!isEditing}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-flex justify-content-center gap-3">
                  {isEditing ? (
                    <>
                      <button
                        className={`btn btn-success ${
                          isUploading ? "disabled" : ""
                        }`}
                        onClick={handleSave}
                        disabled={isUploading}
                      >
                        <i className="bi bi-check-circle me-2"></i>Save
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={handleCancel}
                      >
                        <i className="bi bi-x-circle me-2"></i>Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-primary"
                        onClick={() => setIsEditing(true)}
                      >
                        <i className="bi bi-pencil-square me-2"></i>Edit Profile
                      </button>
                      <button
                        className="btn btn-outline-danger"
                        onClick={handleLogoutClick}
                      >
                        <i className="bi bi-box-arrow-right me-2"></i>Logout
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
