import React, { useState, useEffect } from 'react';
import styles from "./Courses.module.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { checkAuthStatus } from '../../../redux/UserSlice';
import { useDispatch, useSelector } from 'react-redux';
import { FaRegHeart, FaHeart, FaMapMarkerAlt, FaTag } from 'react-icons/fa'; 
import API_BASE_URL from "../../../config/config";

function Courses() {
  const dispatch = useDispatch();
  const [courseData, setCourseData] = useState([]);
  const [favorites, setFavorites] = useState([]);  // Stores only logged-in user's favorites

  const navigate = useNavigate();
  const { loggedIn, user, loading, userId } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!loading && (!loggedIn || !user)) {
      navigate('/login');
    }
  }, [loggedIn, user, loading, navigate]);

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/auth/get-course`);
        setCourseData(response.data);
      } catch (error) {
        console.error('Error fetching course data:', error);
      }
    };
    fetchCourse();
  }, []);

  const handleClickData = async (course) => {
    try {
      const discountedPrice = calculateDiscountedPrice(course.price, course.discount);
      console.log(discountedPrice);
  
      const response = await axios.post(`${API_BASE_URL}/api/auth/update-price`, {
        courseId: course._id,
        price: discountedPrice,
      });
  
      if (response.data.success) {
        navigate(`/course-details/${course._id}`);
      } else {
        console.error('Enrollment failed:', response.data.message);
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  // Fetch only logged-in user's favorites
  const fetchFavorites = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/auth/get-all-favorites`); 
      const userFavorites = response.data.filter((fav) => fav.userId === userId); // Filter only for logged-in user
      setFavorites(userFavorites.map((fav) => fav.courseId));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  useEffect(() => {
    if (loggedIn) {
      fetchFavorites();
    }
  }, [loggedIn]);

  const toggleFavorite = async (courseId) => {
    try {
      if (favorites.includes(courseId)) {
        await axios.post(`${API_BASE_URL}/api/auth/remove-favorite`, { courseId, userId });
        setFavorites((prevFavorites) => prevFavorites.filter((id) => id !== courseId));
      } else {
        await axios.post(`${API_BASE_URL}/api/auth/add-favorite`, { courseId, userId });
        setFavorites((prevFavorites) => [...prevFavorites, courseId]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const calculateDiscountedPrice = (price, discount) => {
    if (!discount || discount <= 0) return price;
    return (price - (price * discount) / 100).toFixed(2);
  };

  return (
    <div>
      <h3 className={styles.coursesheading}>Available Courses</h3>

      <div className={styles.courseavailable}>
        {courseData
          .filter((course) => course.status === "approved")
          .map((course) => (
            <div className={styles.coursecard} key={course._id}>
              <div className={styles.imagecontainer}>
                <img src={course.photo} alt={course.title} className={styles.courseimage} />
                {course.offer && <div className={styles.offerTag}>Offer</div>}
              </div>

              <div className={styles.cardbody}>
                <h5 className={styles.coursename}>{course.courseName}</h5>

                <div className={styles.location}>
                  <FaMapMarkerAlt style={{ fontSize: '1rem', color: 'gray', marginRight: '5px' }} />
                  <span>{course.institutionAddress}</span>
                </div>

                {/* Price and Discount Section */}
                <div className={styles.pricing}>
                  {course.discount && <span className={styles.originalPrice}>₹{course.price}</span>}
                  <span className={styles.discountedPrice}>
                    ${calculateDiscountedPrice(course.price, course.discount)}
                  </span>
                </div>

                {course.discount && (
                  <div className={styles.discount}>
                    <FaTag style={{ fontSize: '1rem', color: 'gray', marginRight: '5px' }} />
                    <span>{course.discount}% OFF</span>
                  </div>
                )}

                {/* Favorite Button */}
                <button
                  className={styles.favoriteButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(course._id);
                  }}
                  style={{ fontSize: '1.5rem' }}
                >
                  {favorites.includes(course._id) ? (
                    <FaHeart style={{ color: 'red' }} />
                  ) : (
                    <FaRegHeart />
                  )}
                </button>

                <button
                  className={styles.enrollButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClickData(course);
                  }}
                >
                  Enroll
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Courses;
