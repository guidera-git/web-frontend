import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    gender: "Male",
    birthday: "1990-05-15",
    about:
      "A passionate developer who loves building web applications with React and Bootstrap.",
    profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
  });
  const [age, setAge] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...user });
  const [imagePreview, setImagePreview] = useState(user.profileImage);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Calculate age from birthday
  useEffect(() => {
    const calculateAge = (birthday) => {
      const birthDate = new Date(birthday);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      return age;
    };

    setAge(calculateAge(user.birthday));
  }, [user.birthday]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setEditForm({ ...editForm, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview("https://via.placeholder.com/150");
    setEditForm({
      ...editForm,
      profileImage: "https://via.placeholder.com/150",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleSave = () => {
    setUser(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({ ...user });
    setImagePreview(user.profileImage);
    setIsEditing(false);
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    // Add your actual logout logic here (clear tokens, etc.)
    navigate("/login");
  };

  return (
    <div className="container py-5">
      {/* Logout Confirmation Modal */}
      <div
        className={`modal fade ${showLogoutModal ? "show d-block" : ""}`}
        tabIndex="-1"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header text-danger">
              <h5 className="modal-title">Confirm Logout</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowLogoutModal(false)}
              ></button>
            </div>
            <div className="modal-body text-dark">
              <p>Are you sure you want to logout?</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={confirmLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-body p-4" style={{ background: "#F8F8F8" }}>
              {/* Profile Header */}
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
                    name="name"
                    value={editForm.name}
                    onChange={handleInputChange}
                    className="form-control text-center mt-3 fw-bold fs-3 border-0 border-bottom"
                  />
                ) : (
                  <h2 className="mt-3 fw-bold">{user.name}</h2>
                )}
              </div>

              {/* Profile Details */}
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <div className="card h-100 border-0 shadow-sm">
                    <div
                      className="card-body"
                      style={{ background: "#F0F0F0" }}
                    >
                      <h5 className="card-title text-muted">Email</h5>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={editForm.email}
                          onChange={handleInputChange}
                          className="form-control"
                        />
                      ) : (
                        <p className="card-text fs-5">{user.email}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card h-100 border-0 shadow-sm">
                    <div
                      className="card-body"
                      style={{ background: "#F0F0F0" }}
                    >
                      <h5 className="card-title text-muted">Gender</h5>
                      {isEditing ? (
                        <select
                          name="gender"
                          value={editForm.gender}
                          onChange={handleInputChange}
                          className="form-select"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      ) : (
                        <p className="card-text fs-5">{user.gender}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card h-100 border-0 shadow-sm">
                    <div
                      className="card-body"
                      style={{ background: "#F0F0F0" }}
                    >
                      <h5 className="card-title text-muted">Birthday</h5>
                      {isEditing ? (
                        <input
                          type="date"
                          name="birthday"
                          value={editForm.birthday}
                          onChange={handleInputChange}
                          className="form-control"
                        />
                      ) : (
                        <p className="card-text fs-5">
                          {new Date(user.birthday).toLocaleDateString()} (Age:{" "}
                          {age})
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card h-100 border-0 shadow-sm">
                    <div
                      className="card-body"
                      style={{ background: "#F0F0F0" }}
                    >
                      <h5 className="card-title text-muted">Age</h5>
                      <p className="card-text fs-5">{age} years</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* About Me Section */}
              <div className="mb-4 p-3" style={{ background: "#F0F0F0" }}>
                <h4 className="text-muted mb-3">About Me</h4>
                {isEditing ? (
                  <textarea
                    name="about"
                    value={editForm.about}
                    onChange={handleInputChange}
                    className="form-control"
                    rows="4"
                  />
                ) : (
                  <p className="lead">{user.about}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="d-flex justify-content-between">
                {isEditing ? (
                  <>
                    <button
                      className="btn btn-success px-4"
                      onClick={handleSave}
                    >
                      <i className="bi bi-check-circle me-2"></i>Save Changes
                    </button>
                    <button
                      className="btn btn-outline-secondary px-4"
                      onClick={handleCancel}
                    >
                      <i className="bi bi-x-circle me-2"></i>Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-primary px-4"
                      onClick={() => setIsEditing(true)}
                    >
                      <i className="bi bi-pencil-square me-2"></i>Edit Details
                    </button>
                    <button
                      className="btn btn-outline-danger px-4"
                      onClick={handleLogoutClick}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>Log Out
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
