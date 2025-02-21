import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styles from './AdminStudentDetails.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthStatus } from '../../../redux/UserSlice';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import API_BASE_URL from "../../../config/config";


function AdminStudentDetails() {
  const { loggedIn, user } = useSelector((state) => state.auth);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
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
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/auth/get-student`);
        setStudents(response.data);
      } catch (err) {
        setError('Error fetching student data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleBack = () => {
    navigate('/admin');
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };
const handleViewClick=(id)=>{
  navigate(`/view-more/${id}`);
}
  return (
    <div className={styles.applicantContainer}>
      <button className={styles.mainBackButton} onClick={handleBack}>
        <IoArrowBack /> Back
      </button>
      <h2>Student Details</h2>

      {loading ? (
        <p>Loading students...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : students.length > 0 ? (
        <div className={styles.tableWrapper}>
          <table className={styles.applicantTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Address</th>
                <th>Action</th>

              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td>
                    <div className={styles.studentName}>
                      <img
                        src={student.photo || '/default-avatar.png'}
                        alt={`${student.name}'s avatar`}
                        className={styles.avatar}
                        onClick={() => handleImageClick(student.photo || '/default-avatar.png')}
                      />
                      <div>
                        <p>{student.name}</p>
                        <p className={styles.email}>{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>{student.phone || 'N/A'}</td>
                  <td>{student.status || 'Unknown'}</td>
                  <td>{student.address || 'N/A'}</td>
                  <td>
  <button onClick={() => handleViewClick(student._id)} className={styles.moreDetailsBtn}>
    More Details
  </button>
</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No students available.</p>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div className={styles.modal} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Selected" className={styles.modalImage} />
            <button className={styles.closeButton} onClick={closeModal}>
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminStudentDetails;
