// import React, { useState,useEffect } from 'react';
// import styles from './Login.module.css';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { loginSuccess } from '../../redux/UserSlice';
// import { ToastContainer, toast } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';

// function Login() {
//   const dispatch = useDispatch();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('/api/auth/login', {
//         email,
//         password,
//       });

//       if (response.data && response.data.token) {
//         const { token, username, userRole,userId } = response.data;

//         // Dispatch the loginSuccess action to update Redux state
//         dispatch(loginSuccess({ token }));
//         // Store in localStorage

//         localStorage.setItem('token', token);
//         localStorage.setItem('username', username);
//         localStorage.setItem('userRole', userRole);
//         localStorage.setItem('userid', userId);


//         // Show success toast
//         toast.success('Login successful! Redirecting...', {
//           position: "top-right", // 
//         });

//         // Navigate based on role
//         setTimeout(() => {
//           if (userRole === 'admin') {
//             navigate('/admin');
//           } else {
//             navigate('/learners');
//           }
//         }, 1000); // Redirect after 2 seconds
//       } else {
//         toast.error('Unexpected response. Please try again.', {
//           position: 'top-right',
//         });
//       }
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message || 'Invalid credentials! Please try again.',
//         { position: 'top-right' }
//       );
//     }
//   };
//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const token = urlParams.get('token');
//     const username = urlParams.get('username');
//     const userRole = urlParams.get('userRole');
//     const userId = urlParams.get('userid');
//     if (token && username && userRole && userId) {
//         console.log("tokenyuhgyuh",token)

//       // Update Redux and Local Storage
//       dispatch(loginSuccess({ token }));
//       localStorage.setItem('token', token);
//       localStorage.setItem('username', username);
//       localStorage.setItem('userRole', userRole);
//       localStorage.setItem('userid', userId);

//       toast.success('Auto-login successful!', { position: "top-right" });

//       // Redirect based on role
//       navigate(userRole === 'admin' ? '/admin' : '/learners');
//     } else {
//       console.log('No token found in the URL');
      
//     }
//   }, [dispatch, navigate]);

//   const googleAuth = (e) => {
//     e.preventDefault();
//     toast.success('Waiting for your authentication! Redirecting...', {
//       position: "top-right", // 
//     }); 
//     window.open('http://localhost:5000/auth/google/callback', '_self');
//       // Show success toast
    
      
//   };

//   return (
//     <div className={styles.container}>
//       {/* Left Section */}
//       <div className={styles.leftDiv}>
//         <img
//           className={styles.signupImg}
//           src="../../../images/signup.png"
//           alt="Learning"
//         />
//         <h1 className={styles.headertext}>
//           Join Skill Hub and <br />
//           Learn with Us
//         </h1>
//         <h4 className={styles.subtext}>Sign up to Skill Hub to get started!</h4>
//         <p className={styles.terms}>
//           By signing up for Skill Hub, you agree to our <br />
//           <a href="#" className={styles.link}>
//             Terms of Use
//           </a>{' '}
//           and{' '}
//           <a href="#" className={styles.link}>
//             Privacy Policy
//           </a>
//           .
//         </p>
//       </div>

//       {/* Right Section */}
//       <div className={styles.rightDiv}>
//         <h1 className={styles.title}>Login</h1>
//           <p className={styles.subtitle}>for Learners</p>        <form className={styles.form} onSubmit={handleLogin}>
//           <div className={styles.inputGroup}>
//             <label className={styles.label}>Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className={styles.input}
//               placeholder="contact000@gmail.com"
//               required
//             />
//           </div>
//           <div className={styles.inputGroup}>
//             <label className={styles.label}>Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className={styles.input}
//               placeholder="***************"
//               required
//             />
//           </div>

//           <button className={styles.signInButton} type="submit">
//             LOGIN 
//           </button>

//           <div className={styles.divider}>
//             <span className={styles.line}></span>
//             <span className={styles.orText}>Or sign up with</span>
//             <span className={styles.line}></span>
//           </div>
//           <div className={styles.socialButtons}>
//             <button className={styles.googleButton} onClick={googleAuth}>
//               <img
//                 src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA"
//                 alt="Google Logo"
//                 className={styles.googleLogo}
//               />
//               Login with Google
//             </button>
//           </div>
//           <p className={styles.footerText}>
//             Don’t have an account?{' '}
//             <a href="/signup" className={styles.signUpLink}>
//               Signup here
//             </a>
//           </p>
//         </form>
//       </div>

//       {/* Toast Notifications */}
//       <ToastContainer />
//     </div>
//   );
// }

// export default Login;
import React, { useState, useEffect } from 'react';
import styles from './Login.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/UserSlice';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons

function Login() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Password visibility toggle
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Basic form validation
    if (!email || !password) {
      toast.error("All fields are required!", { position: "top-right" });
      return;
    }

    try {
      const response = await axios.post('/api/auth/login', { email, password });

      if (response.data && response.data.token) {
        const { token, username, userRole, userId } = response.data;

        // Dispatch Redux action
        dispatch(loginSuccess({ token }));

        // Store in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        localStorage.setItem('userRole', userRole);
        localStorage.setItem('userid', userId);

        // Show success toast
        toast.success('Login successful! Redirecting...', { position: "top-right" });

        // Navigate based on role
        setTimeout(() => {
          navigate(userRole === 'admin' ? '/admin' : '/learners');
        }, 1000);
      } else {
        toast.error('Unexpected response. Please try again.', { position: 'top-right' });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid credentials!', { position: 'top-right' });
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const username = urlParams.get('username');
    const userRole = urlParams.get('userRole');
    const userId = urlParams.get('userid');

    if (token && username && userRole && userId) {
      dispatch(loginSuccess({ token }));
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      localStorage.setItem('userRole', userRole);
      localStorage.setItem('userid', userId);

      toast.success('Auto-login successful!', { position: "top-right" });

      // Redirect based on role
      navigate(userRole === 'admin' ? '/admin' : '/learners');
    }
  }, [dispatch, navigate]);

  const googleAuth = (e) => {
    e.preventDefault();
    toast.success('Waiting for authentication...', { position: "top-right" });
    window.open('http://localhost:5000/auth/google/callback', '_self');
  };

  return (
    <div className={styles.container}>
      {/* Left Section */}
      <div className={styles.leftDiv}>
        <img className={styles.signupImg} src="../../../images/signup.png" alt="Learning" />
        <h1 className={styles.headertext}>
          Join Skill Hub and <br />
          Learn with Us
        </h1>
        <h4 className={styles.subtext}>Sign up to Skill Hub to get started!</h4>
        <p className={styles.terms}>
          By signing up for Skill Hub, you agree to our <br />
          <a href="#" className={styles.link}>Terms of Use</a> and <a href="#" className={styles.link}>Privacy Policy</a>.
        </p>
      </div>

      {/* Right Section */}
      <div className={styles.rightDiv}>
        <h1 className={styles.title}>Login</h1>
        <p className={styles.subtitle}>for Learners</p>
        <form className={styles.form} onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="contact000@gmail.com"
              required
            />
          </div>

          {/* Password Input with Show/Hide Feature */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                placeholder="***************"
                required
              />
              <span
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye />: <FaEyeSlash />}
              </span>
            </div>
          </div>

          <button className={styles.signInButton} type="submit">
            LOGIN 
          </button>

          <div className={styles.divider}>
            <span className={styles.line}></span>
            <span className={styles.orText}>Or sign up with</span>
            <span className={styles.line}></span>
          </div>

          <div className={styles.socialButtons}>
            <button className={styles.googleButton} onClick={googleAuth}>
              <img
                src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA"
                alt="Google Logo"
                className={styles.googleLogo}
              />
              Login with Google
            </button>
          </div>

          <p className={styles.footerText}>
            Don’t have an account? <a href="/signup" className={styles.signUpLink}>Signup here</a>
          </p>
        </form>
      </div>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}

export default Login;
