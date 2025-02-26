import React, { useEffect, useState } from "react";
import styles from "./Notification.module.css";
import axios from "axios";
import { FaBell, FaCheckCircle, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthStatus } from "../../redux/UserSlice";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/config";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const { loggedIn, userId, userRole } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      if (!userId) return;

      const response = await axios.get(`${API_BASE_URL}/api/auth/get-notification`, {
        params: userRole === "learner" ? { studentId: userId } : { teacherId: userId },
      });

      setNotifications(response.data);
      setNotificationCount(response.data.length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const clearNotifications = async () => {
    try {
      if (!userId) return;

      await axios.delete(`${API_BASE_URL}/api/auth/clear-notifications`, {
        data: userRole === "learner" ? { studentId: userId } : { teacherId: userId },
      });

      setNotifications([]);
      setNotificationCount(0);
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className={styles.container}>
      <div className={styles.notificationBox}>
        <div className={styles.header}>
          <h2>Notifications</h2>
          <div className={styles.actions}>
            <div className={styles.bellContainer} >
              <FaBell className={styles.bellIcon} />
              {notificationCount > 0 && (
                <span className={styles.notificationCount}>{notificationCount}</span>
              )}
            </div>
            {notificationCount > 0 && (
              <button className={styles.clearButton} onClick={clearNotifications}>
                <FaTrash /> Clear All
              </button>
            )}
          </div>
        </div>

        {notifications.length === 0 ? (
          <p className={styles.noNotifications}>No new notifications</p>
        ) : (
          <ul className={styles.notificationList} onClick={() => navigate(userRole === "learner" ? "/student-Progress" :  "/student-Details")}>
            {notifications.map((notification) => (
              <li key={notification._id} className={styles.notificationItem}>
                <div>
                  <p className={styles.notificationMessage}>{notification.message}</p>
                  <p className={styles.timestamp}>{formatTime(notification.createdAt)}</p>
                </div>
                <FaCheckCircle className={styles.checkIcon} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notification;
