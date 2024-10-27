import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();


  useEffect(()=>{
    const token = localStorage.getItem('token')
    {token && navigate ('/')}
  },[navigate])

//  email validation
  const validateEmail = (email) => {
    const emailrequired = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailrequired.test(email);
  };

  // password validation
  const validatePassword = (password) => {
    const passwordrequird = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordrequird.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setUsernameError("");
    setEmailError("");
    setPasswordError("");
    
    // Validate Fields
    if (username.length < 3) {
      setUsernameError("Username must be at least 3 characters long.");
      return;
    }
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    if (!validatePassword(password)) {
      setPasswordError(
        "Password must be at least 8 characters long, contain one uppercase letter, one number, one special character, and one small letter."
      );
      return;
    }

    try {
      const res = await axios.post("https://job-protal-4.onrender.com/api/auth/signup", {
        username,
        email,
        password,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      alert("Something went wrong");
      console.log(error);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>


        <div className="form_input">
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter Username"
            required
          />
          {usernameError &&
           <p style={{ color: 'red' }}>{usernameError}</p>
          }
        </div>

      
        <div className="form_input">
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          {emailError && 
          <p style={{ color: 'red' }}>{emailError}</p>
          }
        </div>

   
        <div className="form_input">
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your Password"
            required
          />
          {passwordError && 
          <p style={{ color: 'red' }}>{passwordError}</p>
          }
        </div>

        <button className="submit-btn">Sign Up</button>

        <p>or</p>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;





