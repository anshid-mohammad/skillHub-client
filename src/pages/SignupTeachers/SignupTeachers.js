import React, { useState } from "react";
import styles from "./SignupTeachers.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons
import API_BASE_URL from "../../config/config";

function SignupTeachers() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setphoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);  // New state to manage loading
  const [showPassword, setShowPassword] = useState(false); // Password visibility toggle
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!name || !email || !password) {
      setMessage("All fields are required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage("Please enter a valid email address");
      return;
    }

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/mentor-signup`, {
        name,
        email,
        phoneNumber,
        password,
      });

      setMessage(response.data.message);
      setName('');
      setEmail('');
      setPassword('');
      navigate("/teacher-login");
    } catch (error) {
      setMessage(error.response?.data?.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);  // Reset loading state
    }
  };

  return (
    <div className={styles.container}>
      {/* Left Section */}
      <div className={styles.leftDiv}>
        <img className={styles.signupImg} src="../../../images/me.png" alt="Learning" />
        <h1 className={styles.headertext}>
          Join Skill Hub and <br />
          Improve your skills
        </h1>
        <h4 className={styles.subtext}>for Teachers <br />
          Sign up to Skill Hub to get started!</h4>
        <p className={styles.terms}>
          By signing up for Skill Hub, you agree to our <br />
          <a href="#" className={styles.link}>Terms of Use</a> and{" "}
          <a href="#" className={styles.link}>Privacy Policy</a>.
        </p>
      </div>

      {/* Right Section */}
      <div className={styles.rightDiv}>
        <h1 className={styles.title}>Sign Up</h1>
        <p className={styles.subtitle}>for Teachers</p>
        <form className={styles.form} onSubmit={handleSignup}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              placeholder="Your name here"
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="contact000@gmail.com"
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Phone Number</label>
            <input
              type="number"
              value={phoneNumber}
              onChange={(e) => setphoneNumber(e.target.value)}
              className={styles.input}
              placeholder="Your number here"
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'} // Toggle input type
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                placeholder="***************"
              />
              <span
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />} {/* Display corresponding icon */}
              </span>
            </div>
          </div>

          <button className={styles.signInButton} type="submit" disabled={loading}>
            {loading ? "Signing up..." : "SIGN UP"}
          </button>

          {message && <p className={styles.message}>{message}</p>}

          <div className={styles.divider}>
            <span className={styles.line}></span>
            <span className={styles.orText}>Or sign up with</span>
            <span className={styles.line}></span>
          </div>
          <div className={styles.socialButtons}>
            {/* <button className={styles.googleButton} onClick={googleAuth}>
              <img src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA" alt="Google Logo" className={styles.googleLogo} />
              Sign Up with Google
            </button> */}
          </div>
          <p className={styles.footerText}>
            Already have an account? <a href="/teacher-login" className={styles.signUpLink}>Login here</a>
          </p>
        </form>
      </div>
    </div>
  )
}

export default SignupTeachers;
