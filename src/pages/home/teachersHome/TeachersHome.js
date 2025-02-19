// import React, { useState, useEffect } from 'react';
// import styles from "./TeachersHome.module.css";
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { checkAuthStatus } from "../../../redux/UserSlice";
// import { useSelector, useDispatch } from 'react-redux';

// function TeachersHome() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [activeSection, setActiveSection] = useState("home");
//   const [courseData, setCourseData] = useState([]);

//   const { loggedIn, user, loading } = useSelector((state) => state.auth);

//   // Check authentication status on mount
//   useEffect(() => {
//     dispatch(checkAuthStatus());
//   }, [dispatch]);

//   // Redirect to login if not authenticated
//   useEffect(() => {
//     if (!loading && (!loggedIn || !user)) {
//       navigate('/login');
//     }
//   }, [loggedIn, user, loading, navigate]);

//   // Fetch course data
//   useEffect(() => {
//     const fetchCourseData = async () => {
//       try {
//         const response = await axios.get("/api/auth/get-course");
//         setCourseData(response.data);
//       } catch (error) {
//         console.error("Data fetching failed:", error);
//       }
//     };
//     if (loggedIn) {
//       fetchCourseData();
//     }
//   }, [loggedIn]);

//   const handleCourseButton = () => {
//     navigate("/teachers-form");
//   };

//   const renderSectionContent = () => {
//     if (!loggedIn) {
//       return <p>Please log in to access this section.</p>;
//     }

//     switch (activeSection) {
//       case "courses":
//         return (
//           <div className={styles.courseCard}>
//             <h2>Add Your Courses</h2>
//             <p>
//               "Education is the key to success in life, and teachers make a <br /> 
//               lasting impact in the lives of their students."
//             </p>
//             <button onClick={handleCourseButton} className={styles.addCourseButton}>Add Course</button>
//             <div className={styles.cardImage}>
//               <img src="../../../images/addcourse.png" alt="Add Course Illustration" />
//             </div>
//           </div>
//         );
//       case "approvedCourses":
//         return (
//           <div className={styles.applicantContainer}>
//             <table className={styles.applicantTable}>
//               <thead>
//                 <tr>
//                   <th>S.no</th>
//                   <th>Course Name</th>
//                   <th>Teacher Name</th>
//                   <th>Action</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {courseData.length > 0 ? (
//                   courseData.map((form, index) => (
//                     <tr key={form._id}>
//                       <td>{index + 1}</td>
//                       <td>{form.courseName}</td>
//                       <td>{form.teacherName}</td>
//                       <td>
//                         {/* Add button or action handlers here */}
//                       </td>
//                       <td>{form.status}</td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="5">No approved courses available.</td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         );
//       case "myAccount":
//         return (
//           <div>
//             <h2>My Account</h2>
//             <p>Account details and settings...</p>
//           </div>
//         );
//       case "students":
//         return (
//           <div>
//             <h2>Students</h2>
//             <p>Manage students here...</p>
//           </div>
//         );
//       case "myProfile":
//         return (
//           <div>
//             <h2>My Profile</h2>
//             <p>View and edit your profile here...</p>
//           </div>
//         );
//       case "studentVerification":
//         return (
//           <div>
//             <h2>Student Verification</h2>
//             <p>Verify students here...</p>
//           </div>
//         );
//       case "chat":
//         return (
//           <div>
//             <h2>Chat</h2>
//             <p>Chat with students or teachers...</p>
//           </div>
//         );
//       default:
//         return (
//           <div className={styles.courseCard}>
//             <h2>Add Your Courses</h2>
//             <p>
//               "Education is the key to success in life, and teachers make a <br /> 
//               lasting impact in the lives of their students."
//             </p>
//             <button onClick={handleCourseButton} className={styles.addCourseButton}>Add Course</button>
//             <div className={styles.cardImage}>
//               <img src="../../../images/addcourse.png" alt="Add Course Illustration" />
//             </div>
//           </div>
//         );
//     }
//   };

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <div className={styles.learnerHomePage}>
//       {/* Sidebar */}
//       <div className={styles.sidebar}>
//         <h3 className={styles.logo}>Skill Hub</h3>
//         <ul className={styles.navLinks}>
//           <li><button onClick={() => setActiveSection("courses")}>Courses</button></li>
//           <li><button onClick={() => setActiveSection("approvedCourses")}>Approved Courses</button></li>
//           <li className={styles.disabled}><button onClick={() => setActiveSection("myAccount")} disabled>My Account</button></li>
//           <li><button onClick={() => setActiveSection("students")}>Students</button></li>
//           <li><button onClick={() => setActiveSection("myProfile")}>My Profile</button></li>
//           <li><button onClick={() => setActiveSection("studentVerification")}>Student Verification</button></li>
//           <li><button onClick={() => setActiveSection("chat")}>Chat</button></li>
//         </ul>
//       </div>

//       {/* Main Content */}
//       <div className={styles.content}>
//         {renderSectionContent()}
//       </div>
//     </div>
//   );
// }

// export default TeachersHome;









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
        const response = await axios.get("/api/auth/get-course");
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
