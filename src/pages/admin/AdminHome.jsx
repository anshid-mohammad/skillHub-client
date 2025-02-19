import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './AdminHome.module.css';
import { useNavigate } from 'react-router-dom';
import AdminStudentDetails from './studentDetails/AdminStudentDetails';
import { checkAuthStatus } from "../../redux/UserSlice";
import { useSelector, useDispatch } from 'react-redux';
import MentorDetails from './mentorDetails/MentorDetails';
import UserDetails from './userDetails/UserDetails';

function AdminHome() {
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { loggedIn, user, userId } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loggedIn || !user) {
      navigate('/login');
    }
  }, [loggedIn, user, loading, navigate]);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get('/api/auth/get-course', {
          params: { status: 'pending' }, // Add query parameter
        });
        setFormData(response.data); // Set only the filtered data
        console.log(response.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch course data.');
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, []);

  const handleViewClick = async (id) => {
    try {
      await axios.put(`/api/auth/update-status/${id}`, { status: "under-review" });

      setFormData((prevApplications) =>
        prevApplications.map((application) =>
          application._id === id ? { ...application, status: "under-review" } : application
        )
      );

      navigate(`/admin-courselist/${id}`);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Section content mapping
  const sectionContent = {
    home: (
      <div className={styles.applicantContainer}>
        <h2>New Applicant List</h2>
        {loading ? (
          <p>Loading courses...</p>
        ) : error ? (
          <p>{error}</p>
        ) : formData.length > 0 ? (
          <table className={styles.applicantTable}>
            <thead>
              <tr>
                <th>S.no</th>
                <th>Course Name</th>
                <th>Teacher Name</th>
                <th>Action</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {formData.map((form, index) => (
                <tr key={form._id}>
                  <td>{index + 1}</td>
                  <td>{form.courseName}</td>
                  <td>{form.teacherName}</td>
                  <td>
                    {form.status === "approved" ? (
                      <p>approved</p>
                    ) : (
                      <button
                        onClick={() => handleViewClick(form._id)}
                        className={styles.openBtn}
                      >
                        View
                      </button>
                    )}
                  </td>
                  <td>{form.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No courses available.</p>
        )}
      </div>
    ),
    StudentsDetails: (
      <AdminStudentDetails />
    ),
    mentorDetails: (
      <MentorDetails/>
    ),
    UserDetails: (
      <UserDetails></UserDetails>
    ),
    myProfile: (
      <p>Profile section content here...</p>
    ),
    yourCourses: (
      <p>Your courses section content here...</p>
    ),
    chat: (
      <p>Chat section content here...</p>
    ),
  };

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const handleSectionClick = (section) => {
    setActiveSection(section);
    setIsSidebarOpen(false);
  };

  return (
    <div className={styles.learnerHomePage}>
      <header className={styles.header}>
        <button
          className={styles.toggleSidebarButton}
          onClick={toggleSidebar}
        >
          ☰ Tool Kit
        </button>
      </header>

      <nav className={`${styles.sidebar} ${isSidebarOpen ? styles.show : styles.hidden}`}>
        <h3 className={styles.logo}>Skill Hub</h3>
        <button className={styles.closeSidebarButton} onClick={toggleSidebar}>
          ✖
        </button>
        <ul className={styles.navLinks}>
          {Object.keys(sectionContent).map((key) => (
            <li key={key}>
              <button
                onClick={() => handleSectionClick(key)}
                className={activeSection === key ? styles.active : ''}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <main className={styles.content}>
        {sectionContent[activeSection]}
      </main>
    </div>
  );
}

function Section({ title, text }) {
  return (
    <div className={styles.section}>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

export default AdminHome;
