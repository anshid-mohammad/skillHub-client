import React, { useState, useEffect } from "react";
import styles from "./Favorite.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaBookmark, FaMapMarkerAlt, FaTag } from "react-icons/fa";
import API_BASE_URL from "../../../config/config";

function Favorite() {
  const navigate = useNavigate();
  const { loggedIn, userId } = useSelector((state) => state.auth);
  const [courses, setCourses] = useState([]);
  const [favoriteCourses, setFavoriteCourses] = useState([]);

  useEffect(() => {
    if (!loggedIn) {
      navigate("/login");
    }
  }, [loggedIn, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesResponse = await axios.get(`${API_BASE_URL}/api/auth/get-course`);
        setCourses(coursesResponse.data);

        const favoritesResponse = await axios.get(`${API_BASE_URL}/api/auth/get-all-favorites`);
        setFavoriteCourses(favoritesResponse.data || []);
      } catch (error) {
        console.error("Error fetching courses or favorites:", error);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  const removeFavorite = async (courseId) => {
    try {
        await axios.post(`${API_BASE_URL}/api/auth/remove-favorite`, { userId, courseId });

        // Remove the course from local state
        setFavoriteCourses((prevFavorites) =>
            prevFavorites.filter((fav) => fav.courseId !== courseId)
        );

    } catch (error) {
        console.error("Error removing favorite:", error);
    }
};
const filteredCourses = courses.filter(course =>
  favoriteCourses.some(fav => fav.courseId === course._id && fav.userId === userId)
);

const handleClickData = (courseId) => {
  navigate(`/course-details/${courseId}`);
};
  return (
    <div>
      <h3 className={styles.favoriteHeading}>My Favorite Courses</h3>
      <div className={styles.courseContainer}>
        {filteredCourses.length === 0 ? (
          <p>No favorite courses yet.</p>
        ) : (
          filteredCourses.map((course) => (
            <div className={styles.courseCard} key={course._id} onClick={()=>handleClickData(course._id) }>

              <div className={styles.imageContainer}>
                <img
                onClick={()=>handleClickData(course._id) }
                  src={course.photo}
                  alt={course.courseName}
                  className={styles.courseImage}
                />
              </div>
              <div className={styles.cardBody}>
                <h5 className={styles.courseName}>{course.courseName}</h5>
                <div className={styles.location}>
                  <FaMapMarkerAlt className={styles.icon} />
                  <span>{course.institutionAddress}</span>
                </div>
                <div className={styles.pricing}>
                  <span className={styles.originalPrice}>
                    {course.discount ? `$${course.price}` : null}
                  </span>
                  <span className={styles.discountedPrice}>
                    ${(
                      course.price -
                      (course.price * course.discount) / 100
                    ).toFixed(2)}
                  </span>
                </div>
                {course.discount && (
                  <div className={styles.discount}>
                    <FaTag className={styles.icon} />
                    <span>{course.discount}% OFF</span>
                  </div>
                )}
                <button
                  className={styles.unsaveButton}
                  onClick={() => removeFavorite(course._id)}
                  >
                  <FaBookmark /> Unsave
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Favorite;
