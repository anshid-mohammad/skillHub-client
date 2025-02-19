import React ,{useEffect} from 'react';
import styles from './Learners.module.css';
import { useNavigate } from 'react-router-dom';
import { checkAuthStatus } from "../../redux/UserSlice";
import { useDispatch, useSelector } from "react-redux";

function Learners() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loggedIn, userId,userRole } = useSelector((state) => state.auth);
   useEffect(() => {
      dispatch(checkAuthStatus());
    }, [dispatch]);
  
  
    const handlelerners=(e)=>{
      e.preventDefault();
      if (loggedIn && userRole==="learner"){
        navigate("/learners")
      }else{
        navigate("/signup")
  
      }
      
    }
   
  return (
    <div className={styles.container}>
      {/* Left Section (Image) */}
      <div className={styles.teacherLeft}>
        <img className={styles.teacherImage} src="../../../images/learners.png" alt="learners" />
      </div>

      {/* Right Section (Text) */}
      <div className={styles.teacherRight}>
        <h1 className={styles.headerText}>
          Curious learner exploring technology, communication,<br />
          and leadership to grow both personally and professionally.
        </h1>
        <p className={styles.subtextHeader}>STUDENTS AND LEARNERS</p>
        <div className={styles.ctaButtons}>
          <button  className={styles.learnersBtn} onClick={handlelerners}>Learners, Start Here</button>
        </div>
      </div>
    </div>
  );
}

export default Learners;
