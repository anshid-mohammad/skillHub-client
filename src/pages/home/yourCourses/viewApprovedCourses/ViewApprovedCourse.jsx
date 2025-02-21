import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ViewApprovedCourse.module.css';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthStatus } from '../../../../redux/UserSlice';
import { IoArrowBack } from 'react-icons/io5';
import { FaUniversity, FaChalkboardTeacher, FaRupeeSign } from 'react-icons/fa';
import { AiOutlineCalendar } from 'react-icons/ai';
import { MdOutlineLibraryBooks } from 'react-icons/md';
import API_BASE_URL from "../../../../config/config";

function ViewApprovedCourses() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [courseDetails, setCourseDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { loggedIn, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  useEffect(() => {
    if (!loggedIn || !user) {
      navigate('/login');
    }
  }, [loggedIn, user, navigate]);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/auth/get-course`);
        setCourseDetails(response.data.filter((course) => course.status === 'approved'));
      } catch (err) {
        setError('Failed to fetch course details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, []);

  const handleBack = () => navigate('/teachers');
  const handleImageClick = (imageUrl) => setSelectedImage(imageUrl);
  const closeModal = () => setSelectedImage(null);

  if (loading) return <p>Loading course details...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.headerOne}>Approved Courses</h1>

      {courseDetails.length > 0 ? (
        <div className={styles.detailsCard}>
          <button className={styles.mainBackButton} onClick={handleBack}>
            <IoArrowBack /> Back
          </button>

          {courseDetails.map((course, index) => (
            <div key={index} className={styles.detailsGroup}>
              <img
                src={course.photo || 'https://via.placeholder.com/150'}
                alt="Course"
                className={styles.photo}
                onClick={() => handleImageClick(course.photo || '/images/default-avatar.png')}
              />
              <p><strong>📖 Course Name:</strong> {course.courseName}</p>
              <p><strong>📜 Description:</strong> {course.description}</p>
              <p><strong>🗂️ Category:</strong> {course.category}</p>
              <p><strong>⚡ Level:</strong> {course.level}</p>
              <p><strong><FaChalkboardTeacher /> Teacher:</strong> {course.teacherName} (Contact: {course.teacherContact})</p>
              <p><strong><FaUniversity /> Institution:</strong> {course.institutionName}, {course.institutionAddress}</p>
              <p><strong>⏳ Course Duration:</strong> {course.frequency}</p>
              <p><strong>📅 Schedule:</strong> {course.schedule}</p>
              <p><strong><AiOutlineCalendar /> Start Date:</strong> {new Date(course.startDate).toLocaleDateString()}</p>
              <p><strong><AiOutlineCalendar /> End Date:</strong> {new Date(course.endDate).toLocaleDateString()}</p>
              <p><strong>🔁 Frequency:</strong> {course.frequency}</p>
              <p><strong><FaRupeeSign /> Price:</strong> ₹{course.price}</p>
              {course.discount && <p><strong>🔥 Discount:</strong> {course.discount}%</p>}

              <h3><MdOutlineLibraryBooks /> Lessons</h3>
              <ul>
                {course.lessons.map((lesson, lessonIndex) => (
                  <li key={lessonIndex}><strong>{lesson.title}:</strong> {lesson.description}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p>No approved courses available.</p>
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

export default ViewApprovedCourses;
