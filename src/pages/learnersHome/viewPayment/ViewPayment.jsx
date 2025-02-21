import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './ViewPayment.module.css';
import axios from 'axios';
import { IoArrowBack } from 'react-icons/io5'; // Import back icon
import { IoClose } from "react-icons/io5"; // Import close icon
import { useLocation } from 'react-router-dom';
import API_BASE_URL from "../../../config/config";

import { 
  FaBook, FaClock, FaLayerGroup, FaChalkboardTeacher, FaMoneyBillWave, 
  FaUniversity, FaCalendarCheck, FaCalendarTimes, FaFileAlt, FaCommentsDollar ,
} from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { checkAuthStatus} from '../../../redux/UserSlice';
function ViewPayment() {
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false); // For success popup
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, userId,username,useremail} = useSelector((state) => state.auth);
    useEffect(() => {
      dispatch(checkAuthStatus());
    }, [dispatch]);
  
    useEffect(() => {
      if (!user) {
        navigate("/login");
      }
    }, [user, navigate]);
    const location = useLocation();
const queryParams = new URLSearchParams(location.search);
const teacherId = queryParams.get("teacherId");
  const { id } = useParams();
  console.log("teahc",teacherId)

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/auth/get-courseid/${id}`);
        setStudentDetails(response.data);
      } catch (err) {
        setError('Failed to fetch student details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [id]);

  const handleImageClick = (imageUrl) => setSelectedImage(imageUrl);
  const closeModal = () => setSelectedImage(null);

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/auth/orders`, {
        amount: studentDetails.price * 100, // Razorpay requires amount in paise
        currency: "INR",
      });
  
      console.log("Order Created:", data);
  
      const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
  
      if (!res) {
        alert("Failed to load Razorpay SDK");
        return;
      }
  
      if (!window.Razorpay) {
        alert("Razorpay SDK failed to load");
        return;
      }
  
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY || "rzp_test_dvZ4a5WOhieg51",
        amount: data.amount,
        currency: "INR",
        name: `${username}`,
        description: `Payment for ${studentDetails.courseName}`,
        image: `${studentDetails.photo}`,
        order_id: data.id,
        handler: async function (response) {
          console.log("Payment Response:", response);
  
          // Send payment details to backend
          try {
            await axios.post(`${API_BASE_URL}/api/auth/store-payment`, {
              paymentId: response.razorpay_payment_id,
              userId: userId,
              courseId: id,
              teacherId:teacherId,
            });
  
            setPaymentSuccess(true); // Show success popup
          } catch (error) {
            console.error("Error storing payment:", error);
            alert("Payment recorded failed, please contact support.");
          }
        },
        prefill: {
          name: studentDetails.teacherName,
          email: useremail,
        },
        theme: { color: "#0056b3" },
      };
  
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Error in payment:", error);
      alert("Payment failed. Please try again.");
    }
  };
  

  if (loading) return <p>Loading student details...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
 
  
  const handleback=()=>{
    navigate("/learners")
  
  }
  return (
    <div className={styles.container}>
     
      <h1 className={styles.headerOne}>Course Details</h1>

      {studentDetails ? (
        <div className={styles.detailsCard}>
                 <button className={styles.backButton} onClick={handleback}>
                          <IoArrowBack /> Back
                        </button>
          <img
            src={studentDetails.photo || 'https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg'}
            alt="Course"
            className={styles.photo}
            onClick={() => handleImageClick(studentDetails.photo || 'https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg')}
          />
          <div className={styles.detailsGroup}>
            <p><FaBook className={styles.icon} /> <strong>Course Name:</strong> {studentDetails.courseName}</p>
            <p><FaLayerGroup className={styles.icon} /> <strong>Category:</strong> {studentDetails.category} </p>
            <p><FaClock className={styles.icon} /> <strong>Level:</strong> {studentDetails.level}</p>
            <p><FaClock className={styles.icon} /> <strong>Duration:</strong> {studentDetails.frequency}</p>
            <p><FaClock className={styles.icon} /> <strong>Schedule:</strong> {studentDetails.schedule}</p>
            <p><FaUniversity className={styles.icon} /> <strong>Institution Address:</strong> {studentDetails.institutionAddress}</p>
            <p><FaCalendarCheck className={styles.icon} /> <strong>Start Date:</strong> {new Date(studentDetails.startDate).toLocaleDateString()}</p>
            <p><FaCalendarTimes className={styles.icon} /> <strong>End Date:</strong> {new Date(studentDetails.endDate).toLocaleDateString()}</p>
            <p><FaChalkboardTeacher className={styles.icon} /> <strong>Teacher Name:</strong> {studentDetails.teacherName}</p>
            <p><FaCommentsDollar className={styles.icon} /> <strong>Teacher's Contact:</strong> {studentDetails.teacherContact}</p>
            <p><FaMoneyBillWave className={styles.icon} /> <strong>Discounted Price:</strong> ₹{studentDetails.price}</p>
            <p><FaFileAlt className={styles.icon} /> <strong>Institution Name</strong>{studentDetails.institutionName}</p>
          </div>
          <div className={styles.actionButtons}>
            <button onClick={handlePayment} className={styles.payNowButton}>💳 Pay Now</button>
          </div>
        </div>
      ) : (
        <p>No details available for this course.</p>
      )}

      {selectedImage && (
        <div className={styles.modal} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Selected" className={styles.modalImage} />
            <button className={styles.closeButton} onClick={closeModal}>&times;</button>
          </div>
        </div>
      )}


{paymentSuccess && (
  <div className={styles.paymentSuccessPopup}>
    <IoClose className={styles.closeIcon} onClick={() => setPaymentSuccess(false)} />
    <span className={styles.successIcon}>✅</span>
    <h2>Payment Successful! 🎉</h2>
    <p>Your payment has been processed successfully.</p>
  </div>
)}

    </div>
  );
}

export default ViewPayment;
