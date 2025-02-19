import React ,{useEffect} from 'react';
import styles from "./join.module.css";
import { checkAuthStatus } from "../../redux/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
function Join() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {userRole, loggedIn, userId } = useSelector((state) => state.auth);
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
      <h1 className={styles.headerText}>Join Skill Hub Today</h1>
      <div className={styles.buttons}>
        <button onClick={handlelerners} className={styles.btn}>Learners</button>
        <button onClick={handleTeachers} className={styles.btn}>Teachers</button>
        <button className={styles.btn}>Contact Us</button>
      </div>
    </div>
  );
}

export default Join;
