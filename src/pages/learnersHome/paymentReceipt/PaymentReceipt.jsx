import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './PaymentReceipt.module.css';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthStatus } from '../../../redux/UserSlice';
import { IoArrowBack } from 'react-icons/io5';
import { FaUniversity, FaChalkboardTeacher, FaRupeeSign } from 'react-icons/fa';
import { AiOutlineCalendar } from 'react-icons/ai';
import { MdOutlineLibraryBooks } from 'react-icons/md';
import API_BASE_URL from '../../../config/config';

function PaymentReceipt() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { loggedIn, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

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
        const response = await axios.get(`${API_BASE_URL}/api/auth/get-courseid/${id}`);
        setCourseDetails(response.data);
      } catch (err) {
        setError('Failed to fetch course details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  const handleBack = () => navigate('/learners');
  const handleImageClick = (imageUrl) => setSelectedImage(imageUrl);
  const closeModal = () => setSelectedImage(null);
  
  if (loading) return <p>Loading course details...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.headerOne}>Course Details</h1>

      {courseDetails ? (
        <div className={styles.detailsCard}>
          <button className={styles.mainBackButton} onClick={handleBack}>
            <IoArrowBack /> Back
          </button>
          <img
            src={courseDetails.photo || 'https://media.istockphoto.com/id/1354776457/vector/default-image-icon-vector-missing-picture-page-for-website-design-or-mobile-app-no-photo.jpg?s=612x612&w=0&k=20&c=w3OW0wX3LyiFRuDHo9A32Q0IUMtD4yjXEvQlqyYk9O4='}
            alt="Course"
            className={styles.photo}
            // onClick={() => handleImageClick(courseDetails.photo || '/images/default-avatar.png')}
          />
          <div className={styles.detailsGroup}>
            <p><strong>📖 Course Name:</strong> {courseDetails.courseName}</p>
            <p><strong>📜 Description:</strong> {courseDetails.description}</p>
            <p><strong>🗂️ Category:</strong> {courseDetails.category}</p>
            <p><strong>⚡ Level:</strong> {courseDetails.level}</p>
            <p><strong><FaChalkboardTeacher /> Teacher:</strong> {courseDetails.teacherName} (Contact: {courseDetails.teacherContact})</p>
            <p><strong><FaUniversity /> Institution:</strong> {courseDetails.institutionName}, {courseDetails.institutionAddress}</p>
            <p><strong>⏳ Course Duration:</strong> {courseDetails.courseDuration}</p>
            <p><strong>📅 Schedule:</strong> {courseDetails.schedule}</p>
            <p><strong><AiOutlineCalendar /> Start Date:</strong> {new Date(courseDetails.startDate).toLocaleDateString()}</p>
            <p><strong><AiOutlineCalendar /> End Date:</strong> {new Date(courseDetails.endDate).toLocaleDateString()}</p>
            <p><strong>🔁 Frequency:</strong> {courseDetails.frequency}</p>
            <p><strong><FaRupeeSign /> Price:</strong> ₹{courseDetails.price}</p>
            {courseDetails.discount && <p><strong>🔥 Discount:</strong> {courseDetails.discount}%</p>}
<ul>
<h3><MdOutlineLibraryBooks /> Lessons</h3>

  {courseDetails.lessons.map((lesson, index) => (
    <li key={index}><strong>{lesson.title}:</strong> {lesson.description}</li>
  ))}
</ul>
          </div>
          <div className={styles.actionButtons}>
            <p>Join Now</p>
          </div>
        </div>
      ) : (
        <p>No details available for this course.</p>
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

export default PaymentReceipt;






