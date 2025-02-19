import React, { useState, useEffect } from 'react';
import styles from './Profile.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { checkAuthStatus, updateProfile, logout } from '../../../redux/UserSlice';
import axios from 'axios';
import { FaCamera, FaUser, FaEnvelope, FaMapMarkerAlt, FaPhone, FaInfoCircle, FaVenusMars, FaBirthdayCake, FaUserTie, FaGlobe } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Default Profile Image
const defaultProfileImage = 'https://www.shutterstock.com/image-vector/image-icon-600nw-211642900.jpg';

function Profile() {
  const dispatch = useDispatch();
  const [profileDetails, setProfileDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null); // Modal image state
  
  const { user,loggedIn, userId } = useSelector((state) => state.auth);

  const navigate=useNavigate()
useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if ( !loggedIn && !user) {
      navigate("/login");
    }
  }, [loggedIn, user, navigate]);
  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/auth/get-user');
        const filteredUser = response.data;
        setProfileDetails(filteredUser);
      } catch (err) {
        setError('Failed to fetch user data');
      }
    };
    fetchUserData();
  }, [userId]);

  if (profileDetails.length === 0) {
    return <p>Loading...</p>;
  }
const handleEditButton=()=>{
  navigate("/edit-profile")

}

const handleImageClick = (imageUrl) => {
  setSelectedImage(imageUrl); // Show the clicked image in modal
};

const closeModal = () => {
  setSelectedImage(null); // Close modal by clearing selected image
};
const handleGoEdit=()=>{
  alert("Go to the edit section")
}
  return (
    <div className={styles.container}>
      <div className={styles.profileSection}>
        {profileDetails.map((details) => (
        userId===details._id ? (
           <div key={details.id}>
            {/* Profile Photo */}
            <div className={styles.photoSection}>
              <div className={styles.photoWrapper}>
                <img                           onClick={() => handleImageClick(details.photo || '/default-avatar.png')} // Handle image click

                src={details.photo || defaultProfileImage} alt="Profile" className={styles.profilePhoto} />
                <label htmlFor="photoUpload" className={styles.cameraIcon}>
                  <FaCamera onClick={handleGoEdit} />
                </label>
              </div>
            </div>

            {/* User Information */}
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
            </div>
          </div>
        ):null
         
        
        ))}

        {/* Actions */}
        <div className={styles.actions}>
          <button onClick={handleEditButton} className={styles.editButton}>Edit</button>
          <button onClick={() => dispatch(logout())} className={styles.logoutButton}>Logout</button>
        </div>
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

        {/* Error Message */}
        {error && <p className={styles.error}>{error}</p>}
        
      </div>
      
    </div>
    
  );
}

export default Profile;
