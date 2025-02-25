import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './TeacherList.module.css';
import axios from 'axios';
import { FaUser, FaCalendarAlt, FaVenusMars, FaPhone, FaEnvelope, FaHome, FaGraduationCap, FaUserTie, FaIdCard, FaCommentDots } from 'react-icons/fa';
import { IoArrowBack } from 'react-icons/io5'; // Import back icon
import API_BASE_URL from "../../../../config/config";


function TeacherList() {
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();
console.log(id)
  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/auth/get-mentorbyid/${id}`);
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
            src={studentDetails.photo || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6xKMudVFtik4Lw_hXqz_VD2tZtPlBDezD0w&s'}
            alt="Student"
            className={styles.photo}
            onClick={() => handleImageClick(studentDetails.photo || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6xKMudVFtik4Lw_hXqz_VD2tZtPlBDezD0w&s')}
          />
          <div className={styles.detailsGroup}>
            <p><FaUser className={styles.icon} /> <strong>Teacher Name:</strong> {studentDetails.name}</p>
            <p><FaUserTie className={styles.icon} /> <strong>E-mail:</strong> {studentDetails.Email}</p>

            <p><FaCalendarAlt className={styles.icon} /> <strong>Phone Number:</strong> {studentDetails.phoneNumber}</p>
            <p><FaVenusMars className={styles.icon} /> <strong>Address:</strong> {studentDetails.address}</p>
            <p><FaPhone className={styles.icon} /> <strong>certifications:</strong> {studentDetails.certifications}</p>
            <p><FaEnvelope className={styles.icon} /> <strong>Bio:</strong> {studentDetails.bio}</p>
            <p><FaHome className={styles.icon} /> <strong>           work Experience:</strong> {studentDetails.workExperience}</p>
            <p><FaGraduationCap className={styles.icon} /> <strong>Skills:</strong> {studentDetails.skills}</p>

          </div>
          <div className={styles.actionButtons}>
        <p> join,Right Now</p>
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

export default TeacherList;