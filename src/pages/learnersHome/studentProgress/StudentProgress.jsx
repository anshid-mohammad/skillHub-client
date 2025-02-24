import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "./StudentProgress.module.css";
import { checkAuthStatus } from "../../../redux/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";
import API_BASE_URL from "../../../config/config";

import {
  FaUser,
  FaUsers,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaCreditCard,
  FaCommentDots,
  FaCheckCircle,
} from "react-icons/fa";
import { MdCelebration } from "react-icons/md";

function StudentProgress() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [payments, setPayments] = useState([]);

  const [application, setApplication] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loggedIn, userId } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  useEffect(() => {
    if (!loggedIn) {
      navigate("/login");
    }
  }, [loggedIn, navigate]);
  const handleImageClick = (imageUrl) => setSelectedImage(imageUrl);
  const closeModal = () => setSelectedImage(null);
  useEffect(() => {
    if (userId) {
      const fetchApplications = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/api/auth/get-student`);
          setApplication(response.data);
        } catch (error) {
          console.error("Error fetching applications:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchApplications();
    }
  }, [userId]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/auth/get-payments`)
      .then(response => setPayments(response.data))
      .catch(error => console.error("Error fetching payments:", error));
  }, []);
  const handleChatButton = () => {
    navigate("/chat");
  };

  const handleViewMore = (id) => {
    navigate(`/view-more/${id}`);
  };

  const handlePayment = (id,teacherId) => {
    navigate(`/view-payment/${id}?teacherId=${teacherId}`);
  };

  if (loading) return <p className={styles.loading}>Loading...</p>;

  return (
    <div className={styles.scrollableContainer}>
      {application.map((item) =>
        userId === item.studentId ? (
          <div key={item._id} className={styles.progressContainer}>
            <div className={styles.contentWrapper}>
              <div className={styles.progressSidebar}>
                {[
 {
  detail: item.name,
  icon: (
    <img
    onClick={() => handleImageClick(item.photo || 'https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg')}
    src={item.photo || "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"} // Replace with actual photo field or default image
      alt="User Photo"
      className={styles.userPhoto}
    />
  ),
},                  { title: "Step 1", detail: "Pending Review", icon: <FaUsers />, active: item.status === "pending" },
                  { title: "Step 2", detail: "Under Review", icon: <MdCelebration />, active: item.status === "under-review" },
                  { title: "Step 3", detail: "Approved", icon: <FaCalendarAlt />, active: item.status === "approved" },
                  { title: "Location", detail: item.address, icon: <FaMapMarkerAlt />, disabled: true },
                ].map((step, index) => (
                  <div
                    key={index}
                    className={`${styles.step} ${step.active ? styles.activeStep : ""} ${step.disabled ? styles.stepDisabled : ""}`}
                  >
                    <div className={styles.icon}>{step.icon}</div>
                    <div>
                      <p className={styles.stepTitle}>{step.title}</p>
                      <p className={styles.stepDetail}>{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.mainContent}>
                <p className={styles.stepIndicator}>Current Step</p>
                <h2 className={styles.question}>Current Status: {item.status}</h2>
                <p className={styles.detail}>
                  <FaEnvelope /> {item.email || "No email provided."}
                </p>
                <p className={styles.detail}>
                  <FaPhone /> {item.phone || "No phone provided."}
                </p>

                <div className={styles.actionButtons}>
                  <div className={styles.buttonContainer}>
                    <p className={styles.buttonDescription}>View more details</p>
                    <button onClick={() => handleViewMore(item._id)} className={styles.viewButton}>
                      View More
                    </button>
                  </div>
                  {item.status==="approved" ? (
                    <>
                     <div className={styles.buttonContainer}>
                    <p className={styles.buttonDescription}>Chat with the student</p>
                    <button onClick={handleChatButton} className={styles.chatButton}>
                      <FaCommentDots /> Chat
                    </button>
                  </div>
                  {payments.some(payment => payment.userId === userId) ? (
                      <p className={styles.paymentCompleted}>
      <FaCheckCircle className={styles.paymentCompletedIcon} /> Payment Completed
    </p>                    ) : (
                      <div className={styles.buttonContainer}>
                        <p className={styles.buttonDescription}>Make  payment</p>
                        <button onClick={() => handlePayment(item.courseId, item.teacherId)} className={styles.paymentButton}>
                          <FaCreditCard /> Payment
                        </button>
                      </div>
                    )}
                    </>
                  ):(
                    <p className={styles.infoMessage}><FaExclamationTriangle/>
    You can only communicate with teachers when your application is approved.
  </p>
                  )
                  }
                </div>
              </div>
            </div>
          </div>
        ) : null
      )}
      
            {selectedImage && (
              <div className={styles.modal} onClick={closeModal}>
                <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                  <img src={selectedImage} alt="Selected" className={styles.modalImage} />
                  <button className={styles.closeButton} onClick={closeModal}>&times;</button>
                </div>
              </div>
            )}
    </div>
  );
}

export default StudentProgress;
