import React, { useEffect, useState } from "react";
import styles from "./YourCourses.module.css";
import { CheckCircle, Hourglass, Clock, XCircle } from "lucide-react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthStatus } from "../../../redux/UserSlice";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../../config/config";

function YourCourses() {
  const { loggedIn, user, loading, userPhoto, username, userId } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({
    approved: 0,
    underReview: 0,
    inProgress: 0,
    rejected: 0
  });

  // Check authentication status on mount
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && (!loggedIn || !user)) {
      navigate('/login');
    }
  }, [loggedIn, user, loading, navigate]);

  // Fetch only the courses assigned to the logged-in teacher
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/auth/get-course`);
        
        // Filter courses that belong to the logged-in teacher
        const teacherCourses = response.data.filter(course => course.teacherId === userId);
        
        setCourses(teacherCourses);
        updateStats(teacherCourses); // Update stats with filtered courses
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    if (userId) fetchCourse(); // Ensure userId is available before fetching
  }, [userId]);

  const handleApprovedCourse = () => {
    navigate(`/view-approved-course`);
  };
const handleUnderReviewCourse=()=>{
  navigate(`/under-review`);

}
const handlePendingCourse=()=>{
  navigate(`/pending-courses`);

}
  // Function to update the course stats
  const updateStats = (courses) => {
    let approvedCount = 0;
    let underReviewCount = 0;
    let inProgressCount = 0;
    let rejectedCount = 0;

    courses.forEach(course => {
      switch (course.status) {
        case 'approved':
          approvedCount++;
          break;
        case 'under-review':
          underReviewCount++;
          break;
        case 'pending':
          inProgressCount++;
          break;
        case 'rejected':
          rejectedCount++;
          break;
        default:
          break;
      }
    });

    setStats({
      approved: approvedCount,
      underReview: underReviewCount,
      inProgress: inProgressCount,
      rejected: rejectedCount
    });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.titles}>
            <h1 className={styles.title}>Your Courses</h1>
            <p className={styles.subtitle}>Track your learning journey - view progress and course status</p>
          </div>
          
          <div className={styles.profileSection}>
            <img 
              src={userPhoto}
              alt="Profile" 
              className={styles.profileImage} 
            />
            <h4 className={styles.userName}>{username}</h4>
          </div>
        </div>
      </header>

      <div className={styles.statsSection}>
        {courses.length > 0 ? (
          <>
            <div onClick={handleApprovedCourse} className={`${styles.statItem} ${styles.approved}`}>
              <CheckCircle className={styles.icon} />
              <span className={styles.statNumber}>{stats.approved}</span>
              <span className={styles.statLabel}>Approved</span>
            </div>
            <div  onClick={handleUnderReviewCourse} className={`${styles.statItem} ${styles.pending}`}>
              <Hourglass className={styles.icon} />
              <span className={styles.statNumber}>{stats.underReview}</span>
              <span className={styles.statLabel}>Under Review</span>
            </div>
            <div onClick={handlePendingCourse} className={`${styles.statItem} ${styles.inProgress}`}>
              <Clock className={styles.icon} />
              <span className={styles.statNumber}>{stats.inProgress}</span>
              <span className={styles.statLabel}>Pending</span>
            </div>
            <div className={`${styles.statItem} ${styles.rejected}`}>
              <XCircle className={styles.icon} />
              <span className={styles.statNumber}>{stats.rejected}</span>
              <span className={styles.statLabel}>Rejected</span>
            </div>
          </>
        ) : (
          <p className={styles.noCourses}>No courses found.</p>
        )}
      </div>
    </div>
  );
}

export default YourCourses;
