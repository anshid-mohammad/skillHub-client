







import React, { useState, useEffect } from 'react';
import styles from "./TeachersHome.module.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { checkAuthStatus } from "../../../redux/UserSlice";
import { useSelector, useDispatch } from 'react-redux';
import StudentDetails from '../StudentDetails/StudentDetails';
import ProgressBar from '../addmisionProcess/ProgressBar';
import Chat from '../../chat/Chat';
import TeacherProfile from '../teacherProfile/TeacherProfile';
import ApprovedCourses from '../approvedCourses/ApprovedCourses';
import YourCourses from '../yourCourses/YourCourses';
import PaymentDetails from '../PaymentCompletedDetails/PaymentDetails';
import API_BASE_URL from "../../../config/config";

function TeachersHome() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [courseData, setCourseData] = useState([]);

  const { loggedIn, user, loading,userId } = useSelector((state) => state.auth);

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

  // Fetch course data
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/auth/get-course`);
        setCourseData(response.data);
      } catch (error) {
        console.error("Data fetching failed:", error);
      }
    };
    if (loggedIn) {
      fetchCourseData();
    }
  }, [loggedIn]);

  const handleCourseButton = () => {
    navigate("/teachers-form");
  };

  // Section content depending on login status
  const sectionContent = {
    home: loggedIn ? (
      <div className={styles.courseCard}>
        <h2>Add Your Courses</h2>
        <p className={styles.subheadind}>
          "Education is the key to success in life, and teachers make a <br />
          lasting impact in the lives of their students."
        </p>
        <button onClick={handleCourseButton} className={styles.addCourseButton}>
          Add Course
        </button>
        <div className={styles.cardImage}>
          <img src="../../../images/addcourse.png" alt="Add Course Illustration" />
        </div>
      </div>
    ) : (
      <div>Please login to view content</div>
    ),
   
    NewStudents: (
      <StudentDetails></StudentDetails>
    ),
    addmissionProgress: (
      <ProgressBar></ProgressBar>
    ),
    ApprovedCourses: loggedIn ? (
    
      <ApprovedCourses/>
  ) : (
    <div>Please login to view your approved courses.</div>
  ),
    PaymentSection: <PaymentDetails/>,
    // teachers: <Section title="Teachers" text="Manage students here..." />,
    myProfile: (
      <TeacherProfile/>


    ),
    yourCourses:  loggedIn ? (
    
      <YourCourses/>
  ) : (
    <div>Please login to view your approved courses.</div>
  ),
    chat: (
      <Chat/>
    ),
  };

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const handleSectionClick = (section) => {
    setActiveSection(section);
    setIsSidebarOpen(false);
  };

  return (
    <div className={styles.learnerHomePage}>
      <header className={styles.header}>
        <button
          className={styles.toggleSidebarButton}
          onClick={toggleSidebar}
        >
          ☰ Tool Kit
        </button>
      </header>

      <nav className={`${styles.sidebar} ${isSidebarOpen ? styles.show : styles.hidden}`}>
        <h3 className={styles.logo}>Skill Hub</h3>
        <button className={styles.closeSidebarButton} onClick={toggleSidebar}>
          ✖
        </button>
        <ul className={styles.navLinks}>
          {Object.keys(sectionContent).map((key) => (
            <li key={key}>
              <button
                onClick={() => handleSectionClick(key)}
                className={activeSection === key ? styles.active : ''}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <main className={styles.content}>
        {sectionContent[activeSection]}
      </main>
    </div>
  );
}

function Section({ title, text }) {
  return (
    <div className={styles.section}>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

export default TeachersHome;
