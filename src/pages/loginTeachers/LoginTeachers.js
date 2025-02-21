// import React, { useState } from 'react';
// import styles from './LoginTeachers.module.css';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { loginSuccess } from '../../redux/UserSlice';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons

// function LoginTeachers() {
//   const dispatch = useDispatch();
//   const [email, setEmail] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [password, setPassword] = useState('');
//   const [errors, setErrors] = useState({});
//   const navigate = useNavigate();
//   const [showPassword, setShowPassword] = useState(false); // Password visibility toggle

//   const validateForm = () => {
//     const newErrors = {};

//     // Email Validation
//     if (!email.trim()) {
//       newErrors.email = 'Email is required.';
//     } else if (!/\S+@\S+\.\S+/.test(email)) {
//       newErrors.email = 'Invalid email format.';
//     }

//     // Phone Number Validation
//     if (!phoneNumber.trim()) {
//       newErrors.phoneNumber = 'Phone number is required.';
//     } else if (!/^\d{10}$/.test(phoneNumber)) {
//       newErrors.phoneNumber = 'Phone number must be 10 digits.';
//     }

//     // Password Validation
//     if (!password.trim()) {
//       newErrors.password = 'Password is required.';
//     } else if (password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters.';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0; // Return true if no errors
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return; // Stop submission if form is invalid

//     try {
//       const response = await axios.post('/api/auth/mentor-login', {
//         email,
//         password,
//       });

//       if (!response.data || !response.data.token) {
//         throw new Error('Login failed: No token received');
//       }

//       const { token, username, userRole, userId } = response.data;

//       // Dispatch the loginSuccess action to update Redux state
//       dispatch(loginSuccess({ token }));

//       // Store in localStorage
//       localStorage.setItem('token', token);
//       localStorage.setItem('username', username);
//       localStorage.setItem('userrole', userRole);
//       localStorage.setItem('userId', userId);

//       // Show success toast
//       toast.success('Login successful! Redirecting...');

//       // Navigate based on role
//       const roleRoutes = {
//         admin: '/admin',
//         mentor: '/teachers',
//       };
//       const route = roleRoutes[userRole] || '/';
//       navigate(route);
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message || 'Invalid credentials! Please try again.'
//       );
//     }
//   };

//   return (
//     <div className={styles.container}>
//       {/* Left Section */}
//       <div className={styles.leftDiv}>
//         <img
//           className={styles.signupImg}
//           src="../../../images/me.png"
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
//         <p className={styles.subtitle}>for Teachers</p>
//         <form className={styles.form} onSubmit={handleLogin}>
//           <div className={styles.inputGroup}>
//             <label className={styles.label}>Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className={styles.input}
//               placeholder="contact000@gmail.com"
//               required
//               aria-label="Email Address"
//             />
//             {errors.email && <small className={styles.error}>{errors.email}</small>}

//             <label className={styles.label}>Phone Number</label>
//             <input
//               type="text"
//               value={phoneNumber}
//               onChange={(e) => setPhoneNumber(e.target.value)}
//               className={styles.input}
//               placeholder="Enter your number"
//               required
//               aria-label="Phone Number"
//             />
//             {errors.phoneNumber && (
//               <small className={styles.error}>{errors.phoneNumber}</small>
//             )}
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
//               aria-label="Password"
//             />
//              <span
//                             className={styles.passwordToggle}
//                             onClick={() => setShowPassword(!showPassword)}
//                           >
//                             {showPassword ? <FaEye />: <FaEyeSlash />}
//                           </span>
//             {errors.password && (
//               <small className={styles.error}>{errors.password}</small>
//             )}
//           </div>

//           <button  className={styles.signInButton} type="submit">
//             LOGIN
//           </button>

//           <p className={styles.footerText}>
//             Don’t have an account?{' '}
//             <a href="/teacher-signup" className={styles.signUpLink}>
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

// export default LoginTeachers;
import React, { useState } from 'react';
import styles from './LoginTeachers.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/UserSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons
import API_BASE_URL from "../../config/config";

function LoginTeachers() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false); // Password visibility toggle

  const validateForm = () => {
    const newErrors = {};

    // Email Validation
    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format.';
    }

    // Phone Number Validation
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required.';
    } else if (!/^\d{10}$/.test(phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be 10 digits.';
    }

    // Password Validation
    if (!password.trim()) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Stop submission if form is invalid

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/mentor-login`, {
        email,
        password,
        phoneNumber
      });

      if (!response.data || !response.data.token) {
        throw new Error('Login failed: No token received');
      }

      const { token, username, userRole, userId } = response.data;

      // Dispatch the loginSuccess action to update Redux state
      dispatch(loginSuccess({ token }));

      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      localStorage.setItem('userrole', userRole);
      localStorage.setItem('userId', userId);

      // Show success toast
      toast.success('Login successful! Redirecting...');

      // Navigate based on role
      const roleRoutes = {
        admin: '/admin',
        mentor: '/teachers',
      };
      const route = roleRoutes[userRole] || '/';
      navigate(route);
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Invalid credentials! Please try again.'
      );
    }
  };

  return (
    <div className={styles.container}>
      {/* Left Section */}
      <div className={styles.leftDiv}>
        <img
          className={styles.signupImg}
          src="../../../images/me.png"
          alt="Learning"
        />
        <h1 className={styles.headertext}>
          Join Skill Hub and <br />
          Learn with Us
        </h1>
        <h4 className={styles.subtext}>Sign up to Skill Hub to get started!</h4>
        <p className={styles.terms}>
          By signing up for Skill Hub, you agree to our <br />
          <a href="#" className={styles.link}>
            Terms of Use
          </a>{' '}
          and{' '}
          <a href="#" className={styles.link}>
            Privacy Policy
          </a>
          .
        </p>
      </div>

      {/* Right Section */}
      <div className={styles.rightDiv}>
        <h1 className={styles.title}>Login</h1>
        <p className={styles.subtitle}>for Teachers</p>
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
              aria-label="Email Address"
            />
            {errors.email && <small className={styles.error}>{errors.email}</small>}

            <label className={styles.label}>Phone Number</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={styles.input}
              placeholder="Enter your number"
              required
              aria-label="Phone Number"
            />
            {errors.phoneNumber && (
              <small className={styles.error}>{errors.phoneNumber}</small>
            )}
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'} // Conditionally toggle input type
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                placeholder="***************"
                required
                aria-label="Password"
              />
              <span
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />} {/* Display corresponding icon */}
              </span>
            </div>
            {errors.password && (
              <small className={styles.error}>{errors.password}</small>
            )}
          </div>

          <button className={styles.signInButton} type="submit">
            LOGIN
          </button>

          <p className={styles.footerText}>
            Don’t have an account?{' '}
            <a href="/teacher-signup" className={styles.signUpLink}>
              Signup here
            </a>
          </p>
        </form>
      </div>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}

export default LoginTeachers;
