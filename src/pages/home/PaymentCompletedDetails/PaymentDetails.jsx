import React, { useEffect, useState } from "react";
import styles from "./PaymentDetails.module.css";
import { CheckCircle, CreditCard, Calendar, MapPin, FileText, Book } from "lucide-react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthStatus } from "../../../redux/UserSlice";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../../config/config";

function PaymentDetails() {
  const { loggedIn, user, loading, userPhoto, username,userId } = useSelector((state) => state.auth);
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
    const fetchData = async () => {
      try {
        const [coursesRes, paymentsRes, studentsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/auth/get-course`),
          axios.get(`${API_BASE_URL}/api/auth/get-payments`),
          axios.get(`${API_BASE_URL}/api/auth/get-user`),
        ]);

        setCourses(coursesRes.data);
        setPayments(paymentsRes.data);
        setStudents(studentsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleReceiptClick = (id) => {
    navigate(`/payment-receipt/${id}`);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.titles}>
            <h1 className={styles.title}>Payment Completed Students</h1>
            <p className={styles.subtitle}>Admission completed Students Details</p>
          </div>

          <div className={styles.profileSection}>
            <img src={userPhoto} alt="Profile" className={styles.profileImage} />
            <h4 className={styles.userName}>{username}</h4>
          </div>
        </div>
      </header>

      <div className={styles.courseList}>
        {students.map((student) => {
          const studentInCourse = payments.find((payment) => student._id === payment.userId && payment.teacherId===userId);
          const paymentForCourse = studentInCourse || {};
          const course = courses.find((c) => c._id === paymentForCourse.courseId );

          return (
            <div key={student._id} className={styles.courseCard}>
              <h3>{student.Name}</h3>

              <div className={styles.paymentStatus}>
                {studentInCourse?.status === "success" ? (
                  <>
                    <CheckCircle className={styles.successIcon} />
                    <span>Payment Completed</span>
                  </>
                ) : (
                <p>No payments Available for you</p>
                )}

                {course && (
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
                      <strong> Location:</strong> {studentInCourse?.address || "Not Provided"}
                    </p>
                    <p className={styles.paymentInfo}>
                      <FileText className={styles.icon} />
                      <strong> Payment ID:</strong> {paymentForCourse?._id || "N/A"}
                    </p>
                    {paymentForCourse._id && (
                      <a
                        onClick={() => handleReceiptClick(paymentForCourse._id)}
                        style={{ textDecoration: "underline", color: "black", cursor: "pointer" }}
                      >
                        Click here for more details
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PaymentDetails;
