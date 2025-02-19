import React ,{useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "./Teachers.module.css"; // Import CSS module
import { useNavigate } from 'react-router-dom';
import { checkAuthStatus } from "../../redux/UserSlice";
import { useDispatch, useSelector } from "react-redux";
function Teachers() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loggedIn, userId,userRole } = useSelector((state) => state.auth);
   useEffect(() => {
      dispatch(checkAuthStatus());
    }, [dispatch]);
  
   
 
    const handleTeachers=(e)=>{
      e.preventDefault();
      if ( loggedIn && userRole==="mentor"){
        navigate("/teachers")
      }else{
        navigate("/teacher-signup")
  
      }
      
    }
  return (
   <div className={styles.container}>
         {/* Left Section (Image) */}
         <div className={styles.teacherLeft}>
           <img className={styles.teacherImage} src="../../../images/teacher4.png" alt="learners" />
         </div>
   
         {/* Right Section (Text) */}
         <div className={styles.teacherRight}>
           <h1 className={styles.headerText}>
           "Passionate about creating <br /> impactful courses that inspire <br />
           and empower learners to <br /> achieve their goals."
           </h1>
           <p className={styles.subtextHeader}>STUDENTS AND LEARNERS</p>
           <div className={styles.ctaButtons}>
             <button onClick={handleTeachers} className={styles.learnersBtn}>Teachers, Start Here</button>
           </div>
         </div>
       </div>
  );
}

export default Teachers;
