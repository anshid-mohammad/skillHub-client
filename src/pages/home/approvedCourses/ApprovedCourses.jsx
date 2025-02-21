import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "./ApprovedCourses.module.css";
import { checkAuthStatus } from "../../../redux/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../../config/config";

function ApprovedCourses() {
  const [application, setApplication] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loggedIn, user, userId,username } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  useEffect(() => {
    if (!loggedIn || !user) {
      navigate("/login");
    }
  }, [loggedIn, user, navigate]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/auth/get-course`);
        setApplication(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching applications:", error);
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);
  const handleBack =()=>{
    navigate("/learners")
  }
  const handleviewclick=(id)=>{
    navigate(`/view-course/${id}`)
  }
  const getProgress = (status) => {
    switch (status) {
      case "pending":
        return 33; // 33% progress
      case "under-review":
        return 66; // 66% progress
      case "approved":
        return 100; // 100% progress
      default:
        return 0; // No progress
    }
  };

  const getColor = (status) => {
    switch (status) {
      case "pending":
        return "rgb(77, 124, 180)"; // Amber for pending
      case "under-review":
        return "#365dbe"; // Red for under-review
      case "approved":
        return " #0056b3"; // Green for approved
      default:
        return "#E0E0E0"; // Grey for unknown
    }
  };

  if (loading) return <p>Loading...</p>;
const handleChatclick=()=>{
  navigate("/chat")
}
  return (
    <div className={styles.progressContainer}>
              <button onClick={handleBack} className={styles.backButton}>←</button>
        
      <h2>My Course Progress</h2>
      {application.filter((item)=>item.status==="approved")
      .map((item) =>
        userId === item.teacherId ? (
          <div key={item._id} className={styles.progressItem}>
            {/* Status shown outside */}
            <div className={styles.statusWrapper}>
              <span className={styles.status}>{item.status}</span>
            </div>

            {/* Progress bar */}
            <div className={styles.progressBarWrapper}>
              <div className={styles.dotsWrapper}>
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className={styles.dot}></div>
                ))}
              </div>
              <div
                className={styles.progressBar}
                style={{
                  width: `${getProgress(item.status)}%`,
                  backgroundColor: getColor(item.status),
                }}
              >
                {/* Progress percentage displayed */}
                <span className={styles.progressText}>
                  {getProgress(item.status)}%
                </span>
              </div>
            </div>

            {/* Description */}
            <div className={styles.description}>
              <strong>Course Name : {item.courseName}</strong>,{" "} <br />
            Teacher Name :  {username || "No address provided."}
            </div>

            {/* Buttons for approved status */}
            {item.status === "approved" && (
              <div className={styles.actionButtons}>
                <button onClick={()=>handleviewclick(item._id)} className={styles.paymentButton}>View More</button>
                <button onClick={handleChatclick} className={styles.paymentButton}>Chat</button>

              </div>
            )}
          </div>
        ) : null
      )}
    </div>
  );
}

export default ApprovedCourses;
