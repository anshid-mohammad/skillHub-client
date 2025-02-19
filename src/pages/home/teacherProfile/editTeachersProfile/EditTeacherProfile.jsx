import React, { useState, useEffect } from 'react';
import styles from './EditTeacherProfile.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { checkAuthStatus} from '../../../../redux/UserSlice';
import axios from 'axios';
import { FaCamera } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5'; // Import back icon


const defaultProfileImage = 'https://www.shutterstock.com/image-vector/image-icon-600nw-211642900.jpg';

function EditTeacherProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, userId, username, useremail, userPhoto, userAddress, userPhoneNumber, userBio, userGender, userDob, userRole, userNation,userSkills, userHobbies, userCertifications, userWorkExperience } = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const [profileData, setProfileData] = useState({
    name: username || '',
    email: useremail || '',
    address: userAddress || '',
    phoneNumber: userPhoneNumber || '',
    photo: userPhoto || defaultProfileImage,
    bio: userBio || '',
    gender: userGender || '',
    dob: userDob || '',
    role: userRole || '',
    nation: userNation || '',
    skills: userSkills || "",
    hobbies: userHobbies || "",
    certifications : userCertifications  || '',
    workExperience: userWorkExperience || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setProfileData({
      name: username || '',
      email: useremail || '',
      address: userAddress || '',
      phoneNumber: userPhoneNumber || '',
      photo: userPhoto || defaultProfileImage,
      bio: userBio || '',
      gender: userGender || '',
      dob: userDob || '',
      role: userRole || '',
      nation: userNation || '',
      skills: userSkills || "",
    hobbies: userHobbies || "",
    certifications : userCertifications  || '',
    workExperience: userWorkExperience || '',
    });
  }, [username, useremail, userPhoto, userAddress, userPhoneNumber, userBio, userGender, userDob, userRole, userNation,userSkills,userCertifications,userHobbies,userWorkExperience]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post('/api/auth/update-profile-ventor', { userId, ...profileData });
    //   dispatch(updateProfile(response.data.user));
      navigate("/teachers")
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);
    formData.append('userId', userId);

    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('/api/auth/add-imageUrl-ventor', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setProfileData((prev) => ({ ...prev, photo: response.data.user.photo || defaultProfileImage }));
    //   dispatch(updateProfile(response.data.user));
    } catch (error) {
      setError('Failed to upload photo.');
    } finally {
      setLoading(false);
    }
  };
  const handleback=()=>{
      navigate("/teachers")
    
  }
  return (
    <div className={styles.container}>
         {/* Back Button */}
               
      <div className={styles.profileSection}>
      <button className={styles.backButton} onClick={handleback}>
                  <IoArrowBack /> Back
                </button>
        <div className={styles.photoSection}>
          <div className={styles.photoWrapper}>
            <img src={profileData.photo} alt="Profile" className={styles.profilePhoto} />
            <label htmlFor="photoUpload" className={styles.cameraIcon}>
              <FaCamera />
            </label>
            <input type="file" id="photoUpload" accept="image/*" onChange={handlePhotoUpload} className={styles.photoInput} disabled={loading} />
          </div>
        </div>

        <div className={styles.detailsSection}>
          {Object.entries(profileData).map(([key, value]) => (
            key !== 'photo' && key !== 'email' && (
              <div className={styles.field} key={key}>
                <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                {key === 'gender' ? (
                  <select name={key} value={value || ''} onChange={handleChange} disabled={loading}>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : key === 'dob' ? (
                  <input
                    type="date"
                    name={key}
                    value={value ? new Date(value).toISOString().split('T')[0] : ''}
                    onChange={handleChange}
                    disabled={loading}
                  />
                ) : (
                  <input type="text" name={key} value={value} onChange={handleChange} disabled={loading} />
                )}
              </div>
            )
          ))}

          <div className={styles.field}>
            <label>Email</label>
            <p>{profileData.email}</p>
          </div>
        </div>

        <div className={styles.actions}>
          <button onClick={handleSaveChanges} className={styles.saveButton} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>

        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

export default EditTeacherProfile;
