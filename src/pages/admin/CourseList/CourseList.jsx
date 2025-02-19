import React, { useEffect, useState } from "react";
import styles from "./CourseList.module.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function CourseList() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDataById = async () => {
      try {
        const response = await axios.get(`/api/auth/get-courseid/${id}`);
        setCourseDetails(response.data);
        console.log(response.data)

        setLoading(false);
      } catch (error) {
        console.error("Error fetching course data:", error);
        setLoading(false);
      }
    };

    fetchCourseDataById();
  }, [id]);

  const handleApprove = async () => {
    try {
      const response = await axios.put(`/api/auth/update-status/${id}`, {
        status: "approved",
      });

      if (response.status === 200) {
        setCourseDetails((prevDetails) => ({
          ...prevDetails,
          status: "approved",
        }));
        alert("Course status updated to Approved!");
        navigate("/admin");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  const handleDecline= async()=>{
    try{

const response= await axios.delete("/api/auth/delete-course")
alert(response.data.message)

navigate("/admin")
    }catch(error){
      console.error("error decline coures",error)
    }
  }

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!courseDetails) {
    return <div className={styles.error}>Course not found</div>;
  }

  return (
    <div className={styles.courseDetails}>
      <h1 className={styles.title}>{courseDetails.courseName}</h1>
      <p className={styles.description}>{courseDetails.description}</p>

      <div className={styles.courseInfo}>
        <h3>Course Information</h3>
        <ul>
          <li>
            <strong>Category:</strong> {courseDetails.category}
          </li>
          <li>
            <strong>Level:</strong> {courseDetails.level}
          </li>
          <li>
            <strong>Duration:</strong> {courseDetails.duration}
          </li>
          <li>
            <strong>Schedule:</strong> {courseDetails.schedule}
          </li>
          <li>
            <strong>Start Date:</strong>{" "}
            {new Date(courseDetails.startDate).toLocaleDateString()}
          </li>
          <li>
            <strong>End Date:</strong>{" "}
            {new Date(courseDetails.endDate).toLocaleDateString()}
          </li>
          <li>
            <strong>Frequency:</strong> {courseDetails.frequency}
          </li>
          <li>
            <strong>Price:</strong> ${courseDetails.price}
          </li>
          <li>
            <strong>Discount:</strong> {courseDetails.discount || "N/A"}
          </li>
          
        </ul>
      </div>

      <div className={styles.teacherInfo}>
        <h3>Teacher Information</h3>
        <ul>
          <li>
            <strong>Teacher's Name:</strong> {courseDetails.teacherName}
          </li>
          <li>
            <strong>Teacher's Contact:</strong> {courseDetails.teacherContact}
          </li>
        </ul>
      </div>

      <div className={styles.institutionInfo}>
        <h3>Institution Information</h3>
        <ul>
          <li>
            <strong>Name:</strong> {courseDetails.institutionName}
          </li>
          <li>
            <strong>Address:</strong> {courseDetails.institutionAddress}
          </li>
          <li>
            <strong>status:</strong> ${courseDetails.status}
          </li>
        </ul>
        {courseDetails.photo ? ( // Use `imgurl` to display the image
    <div className={styles.institutionImage}>
      <img
        src={courseDetails.photo} // Updated to use `imgurl` from API response
        alt={`${courseDetails.institutionName} Logo`}
        className={styles.photo}
      />
    </div>
  ) : (
    <p>No image available</p>
  )}

      </div>

      <button className={styles.approveButton} onClick={handleApprove}>
        Approve Course
      </button>
      <button className={styles.declineButton} onClick={handleDecline}>
        Decline course
      </button>



    </div>
  );
}



export default CourseList;
