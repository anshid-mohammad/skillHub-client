import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './PaymentReceipt.module.css';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthStatus } from '../../../redux/UserSlice';
import { IoArrowBack } from 'react-icons/io5'; // Import back icon


function PaymentReceipt() {
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { loggedIn, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
console.log(id)
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
        const response = await axios.get(`/api/auth/get-courseid/${id}`);
        setCourseDetails(response.data);
        console.log(response.data)
      } catch (err) {
        setError('Failed to fetch course details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  const handleBack = () => navigate('/learners');

  if (loading) return <p>Loading course details...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.container}>
  
                    <h1 className={styles.headerOne}>Course Details</h1>

      {courseDetails ? (
        <div className={styles.courseCard}>
            <button className={styles.backButton} onClick={handleBack}>
                  <IoArrowBack /> Back
                </button>  
          <img
            src={courseDetails.photo || '/images/default-course.png'}
            alt="Course"
            className={styles.photo}
          />
          <p><strong>Course Name:</strong> {courseDetails.courseName}</p>
          <p><strong>Description:</strong> {courseDetails.description}</p>
          <p><strong>Category:</strong> {courseDetails.category}</p>
          <p><strong>Level:</strong> {courseDetails.level}</p>
          <p><strong>Teacher:</strong> {courseDetails.teacherName} (Contact: {courseDetails.teacherContact})</p>
          <p><strong>Institution:</strong> {courseDetails.institutionName}, {courseDetails.institutionAddress}</p>
          <p><strong>Course Duration:</strong> {courseDetails.courseDuration}</p>
          <p><strong>Schedule:</strong> {courseDetails.schedule}</p>
          <p><strong>Start Date:</strong> {new Date(courseDetails.startDate).toLocaleDateString()}</p>
          <p><strong>End Date:</strong> {new Date(courseDetails.endDate).toLocaleDateString()}</p>
          <p><strong>Frequency:</strong> {courseDetails.frequency}</p>
          <p><strong>Price:</strong> ₹{courseDetails.price}</p>
          {courseDetails.discount && <p><strong>Discount:</strong> {courseDetails.discount}</p>}

          <h3>Lessons</h3>
          <ul>
            {courseDetails.lessons.map((lesson, index) => (
              <li key={index}><strong>{lesson.title}:</strong> {lesson.description}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No course details available.</p>
      )}
    </div>
  );
}

export default PaymentReceipt;
