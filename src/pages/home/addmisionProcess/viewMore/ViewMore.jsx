import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './ViewMore.module.css';
import axios from 'axios';
import { FaUser, FaCalendarAlt, FaVenusMars, FaPhone, FaEnvelope, FaHome, FaGraduationCap, FaUserTie, FaIdCard, FaCommentDots } from 'react-icons/fa';
import { IoArrowBack } from 'react-icons/io5'; // Import back icon
import API_BASE_URL from "../../../../config/config";


function ViewMore() {
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();

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

  const handleChat = () => navigate("/chat");
  const handleImageClick = (imageUrl) => setSelectedImage(imageUrl);
  const closeModal = () => setSelectedImage(null);
  const handleBack = () => navigate('/learners');

  if (loading) return <p>Loading student details...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.headerOne}>Student Details</h1>

      {studentDetails ? (
        <div className={styles.detailsCard}>
           <button className={styles.mainBackButton} onClick={handleBack}>
                    <IoArrowBack /> Back
                  </button>
          <img
            src={studentDetails.photo || 'https://www.shutterstock.com/image-vector/image-icon-600nw-211642900.jpg'}
            alt="Student"
            className={styles.photo}
            onClick={() => handleImageClick(studentDetails.photo || '/images/default-avatar.png')}
          />
          <div className={styles.detailsGroup}>
            <p><FaUser className={styles.icon} /> <strong>Full Name:</strong> {studentDetails.name}</p>

            <p><FaCalendarAlt className={styles.icon} /> <strong>Date of Birth:</strong> {new Date(studentDetails.dob).toLocaleDateString()}</p>
            <p><FaVenusMars className={styles.icon} /> <strong>Gender:</strong> {studentDetails.gender}</p>
            <p><FaPhone className={styles.icon} /> <strong>Phone:</strong> {studentDetails.phone}</p>
            <p><FaEnvelope className={styles.icon} /> <strong>Email:</strong> {studentDetails.email}</p>
            <p><FaHome className={styles.icon} /> <strong>Address:</strong> {studentDetails.address}</p>
            <p><FaGraduationCap className={styles.icon} /> <strong>Qualification:</strong> {studentDetails.qualification}</p>
            <p><FaUserTie className={styles.icon} /> <strong>Father's Name:</strong> {studentDetails.fatherName}</p>
            <p><FaPhone className={styles.icon} /> <strong>Parent's Phone:</strong> {studentDetails.parentPhone}</p>
            <p><FaIdCard className={styles.icon} /> <strong>Status:</strong> {studentDetails.status}</p>
            <p><FaIdCard className={styles.icon} /> <strong>Identity Proof:</strong></p>
            {studentDetails.identityProof ? (
              <a href={studentDetails.identityProof} target="_blank" rel="noopener noreferrer" className={styles.link}>
                View Identity Proof
              </a>
              
            ) : (
              <p>No Identity Proof Uploaded</p>
            )}
          </div>
          <div className={styles.actionButtons}>
        <p>You can Chat with Student, Right Now</p>
        {studentDetails.status==="approved" ?(
        <button onClick={handleChat} className={styles.chatButton}><FaCommentDots /> Chat</button>

        ):null
        }
      </div>
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

     
    </div>
  );
}

export default ViewMore;