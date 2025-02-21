import React, { useState, useEffect } from "react";
import styles from "./CourseDetailsPage.module.css";
import { checkAuthStatus } from "../../../redux/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FaBook, FaTags, FaClock, FaUser, FaCertificate, FaMoneyBillWave, FaPhone } from "react-icons/fa";
import API_BASE_URL from "../../../config/config";

function CourseDetailsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [courseData, setCourseData] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { loggedIn, user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);


  const handleTeacherList=(id)=>{
    navigate(`/teacher-list/${id}`)
  }
  useEffect(() => {
    if (!loading && (!loggedIn || !user)) {
      navigate("/login");
    }
  }, [loggedIn, user, loading, navigate]);

  useEffect(() => {
    const fetchCourseDataById = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/auth/get-courseid/${id}`);
        setCourseData(response.data);
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };
    fetchCourseDataById();
  }, [id]);

  const handleEnroll = (courseId, teacherId) => {
    navigate(`/student-form/?courseId=${courseId}&teacherId=${teacherId}`);
  };


  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className={styles.tabContent}>
            <h2>{courseData?.courseName || "Course Name"}</h2>
            <p><FaUser className={styles.icon} /> By {courseData?.teacherName || "Instructor Name"}</p>
            <div className={styles.rating}>
              <span>⭐ {courseData?.rating || "4.5"}</span>
            </div>
            <p className={styles.price}><FaMoneyBillWave className={styles.icon} /> Price: {courseData?.price || "$95"}</p>
            <p className={styles.description}><FaBook className={styles.icon} /> Description: {courseData?.description}</p>
            <p className={styles.category}><FaTags className={styles.icon} /> Category: {courseData?.category}</p>
            <p className={styles.contact}><FaPhone className={styles.icon} /> Contact: {courseData?.teacherContact}</p>
            
            <a   style={{ textDecoration: 'underline', color: "black", cursor: 'pointer' }}
  onClick={()=>handleTeacherList(courseData.teacherId)} className={styles.readMore}>Teacher Details</a>
          </div>
        );

      case "lessons":
        return (
          <div className={styles.tabContent}>
            <h2 className={styles.lessonHeading}><FaBook className={styles.icon} /> Lessons</h2>
            {courseData?.lessons?.length > 0 ? (
              <ul className={styles.lessonList}>
                {courseData.lessons.map((lesson, index) => (
                  <li key={index} className={styles.lessonItem}>
                    <div className={styles.lessonDetails}>
                      <h3 className={styles.lessonTitle}>{lesson.title}</h3>
                      <p className={styles.lessonDescription}>{lesson.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.noLessonsText}>No lessons available.</p>
            )}
          </div>
        );

      case "reviews":
        return (
          <div className={styles.tabContent}>
            <h2><FaCertificate className={styles.icon} /> Reviews</h2>
            {courseData?.reviews?.length > 0 ? (
              courseData.reviews.map((review, index) => (
                <p key={index}>
                  {review.rating} ⭐ - "{review.comment}" - {review.user}
                </p>
              ))
            ) : (
              <p>No reviews available.</p>
            )}
          </div>
        );

      default:
        return <div>Content not found</div>;
    }
  };

  if (!courseData) {
    return <p>Loading course details...</p>;
  }

  return (
    <div className={styles.courseDetailsContainer}>
      {loggedIn ? (
        <div className={styles.leftSection}>
          <div className={styles.videoContainer}>
            {courseData.status === "approved" ? (
              <img
                src={courseData.photo || "/default-image.jpg"}
                alt={courseData.institutionName || "Course Image"}
                className={styles.videoImage}
              />
            ) : (
              <p>Course is not approved or unavailable.</p>
            )}
          </div>

          <div className={styles.tagContainer}>
            <h3>{courseData.institutionName || "Institution Name"}</h3>
            <h5>📍 Location: {courseData.institutionAddress || "Not Available"}</h5>
            <div className={styles.tags}>
              <span className={styles.tag}><FaClock className={styles.icon} /> {courseData.schedule}</span>
              <span className={styles.tag}><FaTags className={styles.icon} /> {courseData.category}</span>
            </div>
          </div>

          <button className={styles.enrollButton} onClick={() => handleEnroll(courseData._id, courseData.teacherId)}>
            GET ENROLL
          </button>
        </div>
      ) : (
        <h1>Please log in</h1>
      )}

      <div className={styles.rightSection}>
        <div className={styles.courseInfo}>
          <div className={styles.tabs}>
            <button className={`${styles.tab} ${activeTab === "overview" ? styles.activeTab : ""}`} onClick={() => setActiveTab("overview")}>
              Overview
            </button>
            <button className={`${styles.tab} ${activeTab === "lessons" ? styles.activeTab : ""}`} onClick={() => setActiveTab("lessons")}>
              Lessons
            </button>
            <button className={`${styles.tab} ${activeTab === "reviews" ? styles.activeTab : ""}`} onClick={() => setActiveTab("reviews")}>
              Reviews
            </button>
          </div>

          {renderContent()}
        </div>

        <div className={styles.courseHighlights}>
          <ul>
            <li><FaBook className={styles.icon} /> 100+ Lessons</li>
            <li><FaClock className={styles.icon} /> {courseData.frequency}</li>
            <li><FaMoneyBillWave className={styles.icon} /> {courseData.discount}% Off</li>
            <li><FaCertificate className={styles.icon} /> Certificate</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CourseDetailsPage;
