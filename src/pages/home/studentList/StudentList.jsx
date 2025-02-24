import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './StudentList.module.css';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthStatus } from '../../../redux/UserSlice';
import API_BASE_URL from "../../../config/config";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function StudentList() {
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const { loggedIn, user, userId } = useSelector((state) => state.auth);
const dispatch=useDispatch()
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
    const fetchStudentDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/auth/student-details/${id}`);
        setStudentDetails(response.data);
      } catch (err) {
        setError('Failed to fetch student details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [id]);

  const handleApprove = async () => {
    // if (!window.confirm('Are you sure you want to approve this student?')) return;
  
    try {
      // First API call: Assign userId to the student (store teacherId)
      const userResponse = await axios.post(`${API_BASE_URL}/api/auth/add-userId/${studentDetails.studentId}`, {
        teacherId: userId, // Store userId as teacherId
      });
  
      if (!userResponse.data.success) {
        alert('Failed to assign teacher. Please try again.');
        return;
      }
  
      // Second API call: Update student status to "approved"
      const updateResponse = await axios.put(`${API_BASE_URL}/api/auth/update-student/${id}`, { status: 'approved' });
  
      setStudentDetails((prev) => ({ ...prev, status: 'approved' }));
      alert(updateResponse.data.message || 'Student approved successfully!');

      toast.info('Go to the edit section', {
        position: 'top-center',
        autoClose: 2000, // Closes after 2 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
    
      navigate('/teachers');
    } catch (error) {
      console.error('Error approving student:', error);
      alert('An error occurred while approving. Please try again.');
    }
  };
  
  const handleDecline = async () => {
    if (!window.confirm('Are you sure you want to decline this student?')) return;

    try {
      const response = await axios.delete(`${API_BASE_URL}/api/auth/delete-student/${id}`);
      alert(response.data.message || 'Student declined successfully!');
      navigate('/teachers');
    } catch (err) {
      alert('Failed to decline student. Please try again later.');
    }
  };

  const handleImageClick = (imageUrl) => setSelectedImage(imageUrl);
  const closeModal = () => setSelectedImage(null);
  const handleBack = () => navigate('/student-details');

  if (loading) return <p>Loading student details...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.container}>
      <button onClick={handleBack} className={styles.backButton}>&times;</button>
      <h1 className={styles.headerOne}>Student Details</h1>

      {studentDetails ? (
        <div className={styles.detailsCard}>
          <img
            src={studentDetails.photo || 'https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg'}
            alt="Student"
            className={styles.photo}
            onClick={() => handleImageClick(studentDetails.photo || '/images/default-avatar.png')}
          />
          <p><strong>Full Name:</strong> {studentDetails.name}</p>
          <p><strong>Date of Birth:</strong> {new Date(studentDetails.dob).toLocaleDateString()}</p>
          <p><strong>Gender:</strong> {studentDetails.gender}</p>
          <p><strong>Phone:</strong> {studentDetails.phone}</p>
          <p><strong>Email:</strong> {studentDetails.email}</p>
          <p><strong>Address:</strong> {studentDetails.address}</p>
          <p><strong>Qualification:</strong> {studentDetails.qualification}</p>
          <p><strong>Father's Name:</strong> {studentDetails.fatherName}</p>
          <p><strong>Parent's Phone:</strong> {studentDetails.parentPhone}</p>
          <p><strong>Status:</strong> {studentDetails.status}</p>
          <p><strong>Identity Proof:</strong></p>
          {studentDetails.identityProof ? (
            <a className={styles.link} href={studentDetails.identityProof} target="_blank" rel="noopener noreferrer">
              View Identity Proof
            </a>
          ) : (
            <p>No Identity Proof Uploaded</p>
          )}
        </div>
      ) : (
        <p>No details available for this student.</p>
      )}

      {selectedImage && (
        <div className={styles.modal} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Selected" className={styles.modalImage} />
            <button className={styles.closeButton} onClick={closeModal}>&times;</button>
          </div>
        </div>
      )}

      <div className={styles.actionButtons}>
        <button onClick={handleApprove} className={styles.approveButton}>Approve</button>
        <button onClick={handleDecline} className={styles.declineButton}>Decline</button>
      </div>
      <ToastContainer />

    </div>
  );
}

export default StudentList;
