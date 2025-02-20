// import React, { useState, useEffect } from 'react';
// import styles from './CourseDetails.module.css';
// import axios from 'axios';
// import { checkAuthStatus } from "../../redux/UserSlice";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from 'react-router-dom';
// function CourseDetails() {
//   const [showAll, setShowAll] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
//   const [courseData, setCourseData] = useState([]);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { loggedIn, userId,userRole } = useSelector((state) => state.auth);
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth <= 480);
//     };

//     window.addEventListener('resize', handleResize);

//     // Cleanup event listener on unmount
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);
//   useEffect(() => {
//     dispatch(checkAuthStatus());
//   }, [dispatch]);

 

//   useEffect(() => {
//     const fetchCourse = async () => {
//       try {
//         const response = await axios.get('/api/auth/get-course');
//         setCourseData(response.data);
//       } catch (error) {
//         console.error('Error fetching course data:', error);
//       }
//     };
//     fetchCourse();
//   }, []);

//   // Determine the number of cards to display
//   const displayedCourses = showAll
//     ? courseData
//     : isMobile
//     ? courseData.slice(0, 3) // Show 3 cards on mobile screens
//     : courseData.slice(0, 4); // Show 4 cards on larger screens
//     const handleCourseClick = (courseId) => {
//       if (userRole === 'learner') {
//         navigate("/learners");
//       } else {
//         navigate("/");
//       }
//     };
//   return (
//     <div>
//       <h3 className={styles.coursesheading}>Available Courses</h3>

//       <div  className={styles.courseavailable}>
//         {displayedCourses.map((course, index) => (
//           <div 
//             className={styles.coursecard}
//             key={index}
//             onClick={handleCourseClick}
//           >
//             <div className={styles.imagecontainer}>
//               <img
//                 src={course.photo}
//                 alt={course.title}
//                 className={styles.courseimage}
//               />
//             </div>
//             <div className={styles.cardbody}>
//               <h5 className={styles.coursename}>{course.courseName}</h5>
//               <p className={styles.coursedescription}>{course.description}</p>
//               {/* <button className={styles.enrollbutton}>Enroll Now</button> */}
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className={styles.buttoncontainer}>
//         {!showAll ? (
//           <button
//             className={styles.actionbutton}
//             onClick={() => setShowAll(true)}
//           >
//             See More
//           </button>
//         ) : (
//           <button
//             className={styles.actionbutton}
//             onClick={() => setShowAll(false)}
//           >
//             Hide Courses
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

// export default CourseDetails;




import React, { useState, useEffect } from 'react';
import styles from './CourseDetails.module.css';
import axios from 'axios';
import { checkAuthStatus } from "../../redux/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from "../../config/config";


function CourseDetails() {
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  const [courseData, setCourseData] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userRole } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/auth/get-course`);
        if (Array.isArray(response.data)) {
          setCourseData(response.data);
        } else {
          console.error('Unexpected API response:', response.data);
          setCourseData([]);
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
        setCourseData([]);
      }
    };

    fetchCourse();
  }, []);

  const displayedCourses = showAll
    ? courseData
    : isMobile
    ? courseData.slice(0, 3)
    : courseData.slice(0, 4);

  const handleCourseClick = (courseId) => {
    if (userRole === 'learner') {
      navigate(`/learners/${courseId}`);
    } else {
      navigate(`/courses/${courseId}`);
    }
  };

  return (
    <div>
      <h3 className={styles.coursesheading}>Available Courses</h3>

      <div className={styles.courseavailable}>
        {Array.isArray(displayedCourses) && displayedCourses.length > 0 ? (
          displayedCourses.map((course) => (
            <div
              className={styles.coursecard}
              key={course.id}
              onClick={() => handleCourseClick(course.id)}
            >
              <div className={styles.imagecontainer}>
                <img
                  src={course.photo || '/placeholder.png'} // Fallback for missing image
                  alt={course.title || 'Course Image'}
                  className={styles.courseimage}
                />
              </div>
              <div className={styles.cardbody}>
                <h5 className={styles.coursename}>{course.courseName}</h5>
                <p className={styles.coursedescription}>{course.description}</p>
              </div>
            </div>
          ))
        ) : (
          <div>No courses available</div>
        )}
      </div>

      <div className={styles.buttoncontainer}>
        {!showAll ? (
          <button
            className={styles.actionbutton}
            onClick={() => setShowAll(true)}
          >
            See More
          </button>
        ) : (
          <button
            className={styles.actionbutton}
            onClick={() => setShowAll(false)}
          >
            Hide Courses
          </button>
        )}
      </div>
    </div>
  );
}

export default CourseDetails;
