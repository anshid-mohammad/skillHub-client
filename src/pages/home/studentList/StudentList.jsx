import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./StudentList.module.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthStatus } from "../../../redux/UserSlice";
import {
  FaUser,
  FaCalendarAlt,
  FaVenusMars,
  FaPhone,
  FaEnvelope,
  FaHome,
  FaGraduationCap,
  FaUserTie,
  FaIdCard,
} from "react-icons/fa";
import API_BASE_URL from "../../../config/config";
import { toast, ToastContainer } from 'react-toastify';

function StudentList() {
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const { loggedIn, user, userId } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  useEffect(() => {
    if (!loggedIn || !user) {
      navigate("/login");
    }
  }, [loggedIn, user, navigate]);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/auth/student-details/${id}`);
        setStudentDetails(response.data);
      } catch (err) {
        setError("Failed to fetch student details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [id]);

  const showPopup = (message) => {
    setPopupMessage(message);
    setTimeout(() => {
      setPopupMessage("");
    }, 3000);
  };

  const handleApprove = async () => {
    if (studentDetails.status === "approved") {
      showPopup("Student is already approved!");
      return;
    }

    try {
      // Assign userId as teacherId
      const userResponse = await axios.post(`${API_BASE_URL}/api/auth/add-userId/${studentDetails.studentId}`, {
        teacherId: userId,
      });

      if (!userResponse.data.success) {
        showPopup("Failed to assign teacher. Please try again.");
        return;
      }

      // Update student status to "approved"
      const updateResponse = await axios.put(`${API_BASE_URL}/api/auth/update-student/${id}`, { status: "approved" });

      setStudentDetails((prev) => ({ ...prev, status: "approved" }));
      toast.success('Student Details Approved successfully!');
      setTimeout(() => navigate('/teachers'), 3000);
      await axios.post(`${API_BASE_URL}/api/auth/create-notification-mentor`, {
        studentId: studentDetails.studentId,  // ✅ Now correctly storing the student's ID
        message: `Your admission form has been approved successfully! , name :${studentDetails.name}`,
      });

    } catch (error) {
      console.error("Error approving student:", error);
      toast.success('find some error!');

      showPopup("An error occurred while approving. Please try again.");
    }
  };

  const handleDecline = async () => {
    if (studentDetails.status === "declined") {
      showPopup("Student is already declined!");
      return;
    }

    if (!window.confirm("Are you sure you want to decline this student?")) return;

    try {
      const response = await axios.delete(`${API_BASE_URL}/api/auth/delete-student/${id}`);
      showPopup(response.data.message || "Student declined successfully!");
      navigate("/teachers");
    } catch (err) {
      showPopup("Failed to decline student. Please try again later.");
    }
  };

  const handleImageClick = (imageUrl) => setSelectedImage(imageUrl);
  const closeModal = () => setSelectedImage(null);
  const handleBack = () => navigate("/student-details");

  if (loading) return <p>Loading student details...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.container}>
                        <ToastContainer position="top-right" autoClose={3000} />

      <button onClick={handleBack} className={styles.backButton}>&times;</button>
      <h1 className={styles.headerOne}>Student Details</h1>

      {studentDetails ? (
        <div className={styles.detailsCard}>
          <img
            src={studentDetails.photo || "/images/default-avatar.png"}
            alt="Student"
            className={styles.photo}
            onClick={() => handleImageClick(studentDetails.photo || "/images/default-avatar.png")}
          />

          <div className={styles.detailsGroup}>
            <p>
              <FaUser className={styles.icon} /> <strong>Full Name:</strong> {studentDetails.name}
            </p>
            <p>
              <FaCalendarAlt className={styles.icon} /> <strong>Date of Birth:</strong>{" "}
              {new Date(studentDetails.dob).toLocaleDateString()}
            </p>
            <p>
              <FaVenusMars className={styles.icon} /> <strong>Gender:</strong> {studentDetails.gender}
            </p>
            <p>
              <FaPhone className={styles.icon} /> <strong>Phone:</strong> {studentDetails.phone}
            </p>
            <p>
              <FaEnvelope className={styles.icon} /> <strong>Email:</strong> {studentDetails.email}
            </p>
            <p>
              <FaHome className={styles.icon} /> <strong>Address:</strong> {studentDetails.address}
            </p>
            <p>
              <FaGraduationCap className={styles.icon} /> <strong>Qualification:</strong> {studentDetails.qualification}
            </p>
            <p>
              <FaUserTie className={styles.icon} /> <strong>Father's Name:</strong> {studentDetails.fatherName}
            </p>
            <p>
              <FaPhone className={styles.icon} /> <strong>Parent's Phone:</strong> {studentDetails.parentPhone}
            </p>
            <p>
              <FaIdCard className={styles.icon} /> <strong>Status:</strong> {studentDetails.status}
            </p>
            <p>
              <FaIdCard className={styles.icon} /> <strong>Identity Proof:</strong>
            </p>
            {studentDetails.identityProof ? (
              <a className={styles.link} href={studentDetails.identityProof} target="_blank" rel="noopener noreferrer">
                View Identity Proof
              </a>
            ) : (
              <p>No Identity Proof Uploaded</p>
            )}
          </div>
        </div>
      ) : (
        <p>No details available for this student.</p>
      )}

      {selectedImage && (
        <div className={styles.modal} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Selected" className={styles.modalImage} />
            <button className={styles.closeButton} onClick={closeModal}>&times;</button>
          </div>
        </div>
      )}

      {popupMessage && (
        <div className={styles.popup}>
          <p>{popupMessage}</p>
        </div>
      )}

      <div className={styles.actionButtons}>
        <button onClick={handleApprove} className={styles.approveButton}>
          Approve
        </button>
        <button onClick={handleDecline} className={styles.declineButton}>
          Decline
        </button>
      </div>
    </div>
  );
}

export default StudentList;