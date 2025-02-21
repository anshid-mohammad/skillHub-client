import React, { useEffect, useState } from "react";
import styles from "./PaymentCompleted.module.css";
import { CheckCircle, CreditCard, Calendar, MapPin, FileText, Book } from "lucide-react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthStatus } from "../../../redux/UserSlice";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../../config/config";

function PaymentCompleted() {
  const { loggedIn, user, loading, userPhoto, username, userId } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  useEffect(() => {
    if (!loading && (!loggedIn || !user)) {
      navigate("/login");
    }
  }, [loggedIn, user, loading, navigate]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/auth/get-course`);
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourse();
  }, []);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/auth/get-payments`);
        setPayments(response.data);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };
    fetchPayments();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/auth/get-student`);
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, []);

  const isPaymentCompleted = (courseId) => {
    return payments.some(
      (payment) =>
        payment.courseId.toString() === courseId.toString() &&
        payment.userId.toString() === userId.toString() &&
        payment.status === "success"
    );
  };

  const handleReceiptClick = (id) => {
    navigate(`/payment-receipt/${id}`);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.titles}>
            <h1 className={styles.title}>Your Course Progress</h1>
            <p className={styles.subtitle}>
              Few seats available! Make your payment now and confirm your admission.
            </p>
          </div>

          <div className={styles.profileSection}>
            <img src={userPhoto} alt="Profile" className={styles.profileImage} />
            <h4 className={styles.userName}>{username}</h4>
          </div>
        </div>
      </header>

      <div className={styles.courseList}>
        {courses.map((course) => {
          const studentInCourse = students.find((student) => student.studentId === userId && student.courseId === course._id);
          if (!studentInCourse) return null; // Skip if student is not enrolled

          const paymentForCourse = payments.find((payment) => payment.courseId === course._id && payment.userId === userId);

          return (
            <div key={course._id} className={styles.courseCard}>
              <h3>{course.courseName}</h3>
              <p>
                <strong>Status: </strong>{studentInCourse.status}
              </p>

              {paymentForCourse && paymentForCourse.status === "success" ? (
                <div className={styles.paymentStatus}>
                  <CheckCircle className={styles.successIcon} />
                  <span>Payment Completed</span>

                  <div className={styles.paymentDetails}>
  <p className={styles.paymentInfo}>
    <Book className={styles.icon} />
    <strong> Course Name:</strong> {course.courseName}
  </p>
  <p className={styles.paymentInfo}>
    <Calendar className={styles.icon} />
    <strong> Course Join Date:</strong> {new Date(course.startDate).toLocaleDateString()}
  </p>
  <p className={styles.paymentInfo}>
    <MapPin className={styles.icon} />
    <strong> Location:</strong> {studentInCourse.address || "Not Provided"}
  </p>
  <p className={styles.paymentInfo}>
    <FileText className={styles.icon} />
    <strong> Payment ID:</strong> {paymentForCourse._id}
  </p>
  <a 
  onClick={() => handleReceiptClick(course._id)} 
  style={{ textDecoration: 'underline', color: "black", cursor: 'pointer' }}
>
  Click here for More details
</a>

</div>


                  {/* <p className={styles.clickHere}>
                    <a onClick={() => handleReceiptClick(paymentForCourse._id)}>Click here for payment details</a>
                  </p> */}
                </div>
              ) : (
                <div className={styles.paymentStatusPending}>
                  <CreditCard className={styles.pendingIcon} />
                  <span>Payment Pending</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PaymentCompleted;
