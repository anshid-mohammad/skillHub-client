import React, { useState, useEffect } from 'react';
import styles from './StudentForm.module.css';
import { checkAuthStatus } from '../../../redux/UserSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from "../../../config/config";
import { toast, ToastContainer } from 'react-toastify';


function StudentsForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loggedIn, user, loading, userId } = useSelector((state) => state.auth);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: '',
    phone: '',
    email: '',
    address: '',
    qualification: '',
    fatherName: '',
    parentPhone: '',
  });
  const [teacherId, setTeacherId] = useState(null);

  const [courseId, setCourseId] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [identityProofFile, setIdentityProofFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhotoChange = (e) => {
    setPhotoFile(e.target.files[0]);
  };

  const handleIdentityProofChange = (e) => {
    setIdentityProofFile(e.target.files[0]);
  };

  const validateForm = () => {
    setError('');

    if (
      !formData.name ||
      !formData.dob ||
      !formData.gender ||
      !formData.phone ||
      !formData.email ||
      !formData.address ||
      !formData.qualification ||
      !formData.fatherName ||
      !formData.parentPhone
    ) {
      setError('All fields are required.');
      return false;
    }

    if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      setError('Name should only contain letters and spaces.');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Invalid email format.');
      return false;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      setError('Phone number must be 10 digits.');
      return false;
    }

    if (!/^\d{10}$/.test(formData.parentPhone)) {
      setError("Parent's phone number must be 10 digits.");
      return false;
    }

    if (formData.qualification.length < 2) {
      setError('Qualification should be at least 2 characters long.');
      return false;
    }

    if (!formData.dob) {
      setError('Date of Birth is required.');
      return false;
    }

    if (!['Male', 'Female'].includes(formData.gender)) {
      setError('Please select a valid gender.');
      return false;
    }

    return true;
  };

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const teacherId = queryParams.get('teacherId');
    const courseId = queryParams.get('courseId');

    console.log("teacherid",teacherId)
    setCourseId(courseId);
    setTeacherId(teacherId)
  }, [location.search]);

  useEffect(() => {
    if (!loading && (!loggedIn || !user)) {
      navigate('/login');
    }
  }, [loggedIn, user, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setMessage('');
    setError('');
    setIsSubmitting(true);

    const dataToSubmit = new FormData();
    Object.keys(formData).forEach((key) => {
      dataToSubmit.append(key, formData[key]);
    });

    if (photoFile) {
      dataToSubmit.append('photo', photoFile);
    }
    if (identityProofFile) {
      dataToSubmit.append('identityProof', identityProofFile);
    }
    if (userId) {
      dataToSubmit.append('studentId', userId);
    }
    if (courseId) {
      dataToSubmit.append('courseId', courseId);
    }
    if (teacherId) {
        dataToSubmit.append('teacherId', teacherId);
      }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/add-student`, dataToSubmit, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
        responseType: "json", 
      });
if(response.data){
 toast.success('Course created successfully!');
      setTimeout(() => navigate('/learners'), 3000);
      console.log('Course created:', response.data);}
      setMessage(response.data.message);
      setFormData({
        name: '',
        dob: '',
        gender: '',
        phone: '',
        email: '',
        address: '',
        qualification: '',
        fatherName: '',
        parentPhone: '',
      });
      setPhotoFile(null);
      setIdentityProofFile(null);
      navigate("/student-progress")
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Something went wrong. Please try again.';
      setError(errorMessage);
      setIsSubmitting(false);

    }
  };
  const handleClosePopup = () => {
    setShowSuccessPopup(false);
    navigate('/students');
  };
  return (
    <div className={styles.container}>
                  <ToastContainer position="top-right" autoClose={3000} />

      <div className={styles.leftDiv}>
        <img className={styles.signupImg} src="../../../images/signup.png" alt="Learning" />
        <h1 className={styles.headertext}>
          Take Admission<br /> Right Now
        </h1>
        <h4 className={styles.subtext}>Log in to Skill Hub to get started!</h4>
        <p className={styles.terms}>
          By signing up for Skill Hub, you agree to our <br />
          <a href="#" className={styles.link}>Terms of Use</a> and{' '}
          <a href="#" className={styles.link}>Privacy Policy</a>.
        </p>
      </div>

      <div className={styles.formContainer}>
        <h2>Student Application Form</h2>
        {message && <p className={styles.successMessage}>{message}</p>}
        {error && <p className={styles.errorMessage}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Full Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="dob">Date of Birth:</label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="photo">Your Image:</label>
            <input
              type="file"
              id="photo"
              name="photo"
              onChange={handlePhotoChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="gender">Gender:</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone:</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="identityProof">Identity Proof:</label>
            <input
              type="file"
              id="identityProof"
              name="identityProof"
              accept="image/*"
              onChange={handleIdentityProofChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="qualification">Qualification:</label>
            <input
              type="text"
              id="qualification"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="fatherName">Father's Name:</label>
            <input
              type="text"
              id="fatherName"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="parentPhone">Parent's Phone:</label>
            <input
              type="tel"
              id="parentPhone"
              name="parentPhone"
              value={formData.parentPhone}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>

      {showSuccessPopup && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <h3>Success!</h3>
            <p>{message}</p>
            <button onClick={handleClosePopup} className={styles.popupButton}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentsForm;