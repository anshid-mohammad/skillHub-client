import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styles from './StudentDetails.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthStatus } from '../../../redux/UserSlice';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5'; // Import back icon


function StudentDetails() {
  const { loggedIn, user, userId } = useSelector((state) => state.auth);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // Modal image state
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
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/auth/get-student');
        setStudents(response.data);
      } catch (err) {
        setError('Error fetching student data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleViewClick = (id) => {
    navigate(`/student-list/${id}`);
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl); // Show the clicked image in modal
  };

  const closeModal = () => {
    setSelectedImage(null); // Close modal by clearing selected image
  };

  const filteredStudents = students.filter((student) => student.teacherId === userId);
  const handleBack = () => {
    navigate('/teachers');
  };
  const handleDetails = () => {
    navigate('/Progress-bar');
  };
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
      ) : filteredStudents.length > 0 ? (
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
              {filteredStudents.map((student) => (
                userId===student.teacherId ?(
                    <tr key={student._id}>
                    <td>
                      <div className={styles.studentName}>
                        <img
                          src={student.photo || '/default-avatar.png'}
                          alt={`${student.name}'s avatar`}
                          className={styles.avatar}
                          onClick={() => handleImageClick(student.photo || '/default-avatar.png')} // Handle image click
                        />
                        <div>
                          <p>{student.name}</p>
                          <p className={styles.email}>{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>{student.phone || 'N/A'}</td>
                    <td>
                      <span
                        className={
                          student.status === 'active'
                            ? styles.active
                            : student.status === 'inactive'
                            ? styles.inactive
                            : styles.offline
                        }
                      >
                        {student.status || 'Unknown'}
                      </span>
                    </td>
                    <td>{student.address || 'N/A'}</td>
                    <td>
                        {student.status=="under-reviw" || student.status=="pending" ?(
 <button className={styles.btnViewCLick} onClick={() => handleViewClick(student._id)}>
 Review
</button>
                        ):(
                            student.status === "approved" && (
                                <button onClick={handleDetails} className={styles.chatButton}>Details</button>
                              )                            
                        )}
                     
                    </td>
                  </tr>
                ):null
              
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No students available for you.</p>
      )}

      {/* Modal for displaying the selected image */}
      {selectedImage && (
        <div className={styles.modal} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Selected" className={styles.modalImage} />
            <button className={styles.closeButton} onClick={closeModal}>
              &times; {/* This represents the "X" symbol */}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentDetails;
