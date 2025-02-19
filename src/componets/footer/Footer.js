import React, { useEffect } from 'react'
import "./footer.css"
import { useNavigate } from 'react-router-dom'; 
import { checkAuthStatus } from '../../redux/UserSlice';
import { useDispatch,useSelector } from 'react-redux';


function Footer() {

  const mentorRole=localStorage.getItem("mentorRole")
  const navigate = useNavigate(); // Hook for navigation
  const dispatch=useDispatch()
  const { loggedIn, user, loading,userId,userRole } = useSelector((state) => state.auth);


  useEffect(()=>{
    dispatch(checkAuthStatus())
  },[dispatch])
// console.log("userrole footer",userRole)
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
    <section>
    <div className='container main-container'>
        <div className='header-left'>
            <div className="first-image">
                <img className='student-image' src="../../../images/student.png" alt="images" />
                <div class="decorative-elements">                           
        </div>
            </div>
        </div>
        <div className='header-right'>
<h1 className='header-text'>For every student,<br></br>every classroom.<br></br>Real results.</h1>
<p className='subtext-header'>
            We’re a nonprofit with the mission to provide a free, world-class education <br></br>for anyone, anywhere.
          </p>
<div className="cta-buttons">
            <button onClick={handlelerners} className="btn learners-btn">Learners</button>
            <button  onClick={handleTeachers} className="btn teachers-btn">Teachers</button>
          </div>
        </div>   
    </div>
    </section>
  )
}
export default Footer 