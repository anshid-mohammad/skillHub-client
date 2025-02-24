import React, { useState, useEffect } from 'react';
import styles from './TeacherProfile.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { checkAuthStatus, logout } from '../../../redux/UserSlice';
import axios from 'axios';
import { FaCamera, FaUser, FaEnvelope, FaMapMarkerAlt, FaPhone, FaInfoCircle, FaVenusMars, FaBirthdayCake, FaUserTie, FaGlobe, FaBrain, FaHeart, FaCertificate, FaChalkboardTeacher } from 'react-icons/fa';import { useNavigate } from 'react-router-dom';
import API_BASE_URL from "../../../config/config";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const defaultProfileImage = 'https://www.shutterstock.com/image-vector/image-icon-600nw-211642900.jpg';

function TeacherProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [profileDetails, setProfileDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const { user, loggedIn, userId } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  useEffect(() => {
    if (!loggedIn || !user) {
      navigate('/login');
    }
  }, [loggedIn, user, navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/auth/get-ventor`);
        const currentUser = response.data.find((u) => u._id === userId);
        if (currentUser) {
          setProfileDetails(currentUser);
        } else {
          setError('User not found');
        }
      } catch (err) {
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  const handleEditButton = () => {
    navigate('/edit-teacher-profile');
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };
  const handleGoEdit = () => {
    toast.info('Go to the edit section', {
      position: 'top-center',
      autoClose: 2000, // Closes after 2 seconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'colored',
    });
  };
  return (
    <div className={styles.container}>
      <div className={styles.profileSection}>
        {profileDetails && (
          <div key={profileDetails._id}>
            <div className={styles.photoSection}>
              <div className={styles.photoWrapper}>
                <img
                  src={profileDetails.photo || defaultProfileImage}
                  alt="Profile"
                  className={styles.profilePhoto}
                  onClick={() => handleImageClick(profileDetails.photo || defaultProfileImage)}
                />
                <label htmlFor="photoUpload" className={styles.cameraIcon}>
                  <FaCamera onClick={handleGoEdit} />
                </label>
              </div>
            </div>

            <div className={styles.detailsSection}>
              <div className={styles.field}><FaUser /> <label>Name</label><p>{profileDetails.name || 'N/A'}</p></div>
              <div className={styles.field}><FaEnvelope /> <label>Email</label><p>{profileDetails.email || 'N/A'}</p></div>
              <div className={styles.field}><FaMapMarkerAlt /> <label>Address</label><p>{profileDetails.address || 'No address added'}</p></div>
              <div className={styles.field}><FaPhone /> <label>Phone</label><p>{profileDetails.phoneNumber || 'No phone number added'}</p></div>
              <div className={styles.field}><FaInfoCircle /> <label>Bio</label><p>{profileDetails.bio || 'No bio added'}</p></div>
              <div className={styles.field}><FaVenusMars /> <label>Gender</label><p>{profileDetails.gender || 'N/A'}</p></div>
              <div className={styles.field}><FaBirthdayCake /> <label>Date of Birth</label><p>{profileDetails.dob || 'N/A'}</p></div>
              <div className={styles.field}><FaUserTie /> <label>Role</label><p>{profileDetails.role || 'N/A'}</p></div>
              <div className={styles.field}><FaGlobe /> <label>Nation</label><p>{profileDetails.nation || 'N/A'}</p></div>
              <div className={styles.field}><FaBrain /> <label>Skills</label><p>{profileDetails.skills || 'N/A'}</p></div>
              <div className={styles.field}><FaHeart /> <label>Hobbies</label><p>{profileDetails.hobbies || 'N/A'}</p></div>
              <div className={styles.field}><FaCertificate /> <label>Certifications</label><p>{profileDetails.certifications || 'N/A'}</p></div>
              <div className={styles.field}><FaChalkboardTeacher /> <label>Teaching Experience/year</label><p>{profileDetails.workExperience || 'N/A'} years</p></div>
            </div>
          </div>
        )}

        <div className={styles.actions}>
          <button onClick={handleEditButton} className={styles.editButton}>Edit</button>
          <button onClick={() => dispatch(logout())} className={styles.logoutButton}>Logout</button>
        </div>
      </div>

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
            <ToastContainer />

    </div>
  );
}

export default TeacherProfile;
