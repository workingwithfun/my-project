import React, { useState } from "react";
import { FaGoogle, FaLinkedin, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";


import "./style.css";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";


const LoginPage = () => {
  
  const { login } = useContext(AuthContext);
  const [isSignup, setIsSignup] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

const validateForm = () => {
  const newErrors = {};

  if (!formData.email.trim()) {
    newErrors.email = isSignup ? "Please enter your email" : "Please enter your email or phone number";
    toast.warning(newErrors.email);
  }

  if (!isForgotPassword && !formData.password.trim()) {
    newErrors.password = "Please enter your password";
    toast.warning(newErrors.password);
  }

  if (isSignup) {
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
      toast.warning(newErrors.confirmPassword);
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      toast.warning(newErrors.confirmPassword);
    }
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    toast.warn("Please fill all required fields.");
    return;
  }

  const endpoint = isSignup
    ? `${API_URL}/signup/`
    : `${API_URL}/login/`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });

    const text = await res.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("Server returned an invalid response:\n" + text);
    }

    if (res.ok) {
      toast.success(data.message || "Success!");

      // On successful login, navigate to dashboard
if (!isSignup) {
  login(data.access); // save token to auth context
localStorage.setItem("access_token", data.access);   // ✅ Fix here
localStorage.setItem("refresh_token", data.refresh); // ✅ Fix here

  
  const userType = data.user_type;
  const role = data.role;

  if (userType === "client") {
    navigate("/mybook");
  } else if (userType === "employee") {
    switch (role) {
      case "admin":
        navigate("/admin-dashboard");
        break;
      case "social media manager":
        navigate("/smm-dashboard");
        break;
      case "photographer":
        navigate("/employee");
        break;
      case "videographer":
        navigate("/employee");
        break;
      case "photo_editor":
        navigate("/employee");
        break;
      case "video_editor":
        navigate("/employee");
        break;
      case "graphic_designer":
        navigate("/employee");
        break;
      case "finance_manager":
        navigate("/finance-dashboard");
        break;
      default:
        toast.error("Unknown employee role.");
    }
  }
}

 else {
        // On successful signup, switch to login mode
        setIsSignup(false);
      }
    } else {
      const errorMsg = (data.message || data.error || "").toLowerCase();

      if (errorMsg.includes("user not found")) {
        toast.info("No account found for this email. Please sign up first.");
      } else if (errorMsg.includes("incorrect password")) {
        toast.error("Incorrect email or password.");
      } else if (errorMsg.includes("verify")) {
        toast.warning("Please verify your email first.");
      } else if (errorMsg.includes("already exists")) {
        toast.info("Account already exists. Please log in.");
      } else {
        toast.error(data.message || "Unexpected error occurred.");
      }
    }
  } catch (error) {
    console.error("Login error:", error.message);
    toast.error("Something went wrong. Please try again.");
  }
};



  return (
    <div className="auth-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="auth-image">
        <img
          src="https://img.freepik.com/premium-vector/girl-with-laptop-is-working-office-girl-is-browsing-internet-conversations_647843-112.jpg"
          alt="Login"
        />
      </div>

      <div className="auth-box">
        <h2>
          {isForgotPassword ? "Reset Password" : isSignup ? "Sign Up" : "Login"}
        </h2>

        <button className="auth-google-btn">
          <FaGoogle /> {isSignup ? "Sign up" : "Sign in"} with Google
        </button>
        <button className="auth-linkedin-btn">
          <FaLinkedin /> {isSignup ? "Sign up" : "Sign in"} with LinkedIn
        </button>

        <p>OR</p>

        <form onSubmit={handleSubmit}>
        <input
  type="email"
  name="email"
  placeholder="Email"
  value={formData.email}
  onChange={(e) => {
    setFormData({ ...formData, email: e.target.value });
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  }}
  className="auth-input"
/>
{errors.email && <p className="error-text">{errors.email}</p>}

         

          {!isForgotPassword && (
            <>
              <div className="password-container">
               <input
  type={showPassword ? "text" : "password"}
  name="password"
  placeholder="Password"
  value={formData.password}
  onChange={(e) => {
    setFormData({ ...formData, password: e.target.value });
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  }}
  className="auth-input"
/>


                <span
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
              {errors.password && <p className="error-text">{errors.password}</p>}
            </>
          )}

          {isSignup && (
            <>
              <div className="password-container">
                <input
  type={showConfirmPassword ? "text" : "password"}
  name="confirmPassword"
  placeholder="Confirm Password"
  value={formData.confirmPassword}
  onChange={(e) => {
    setFormData({ ...formData, confirmPassword: e.target.value });
    if (errors.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  }}
  className="auth-input"
/>
{errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}

              
                <span
                  className="eye-icon"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
              {errors.confirmPassword && (
                <p className="error-text">{errors.confirmPassword}</p>
              )}
            </>
          )}

          <button type="submit" className="auth-login-btn">
            {isForgotPassword
              ? "Send Reset Link"
              : isSignup
              ? "Create Account"
              : "Login"}
          </button>
        </form>

        {!isForgotPassword && (
          <p className="auth-toggle-text">
            <span
              onClick={() => setIsForgotPassword(true)}
              className="auth-toggle-link"
            >
              Forgot Password?
            </span>
          </p>
        )}

        {!isForgotPassword && (
          <p className="auth-toggle-text">
            {isSignup
              ? "Already have an account?"
              : "Don't have an account?"}{" "}
            <span
              onClick={() => setIsSignup(!isSignup)}
              className="auth-toggle-link"
            >
              {isSignup ? "Login" : "Sign up"}
            </span>
          </p>
        )}

        {isForgotPassword && (
          <p className="auth-toggle-text">
            Remembered your password?{" "}
            <span
              onClick={() => setIsForgotPassword(false)}
              className="auth-toggle-link"
            >
              Login
            </span>
          </p>
        )}
      </div>
   <ToastContainer position="top-right" autoClose={3000} />
    </div>
    
  );
};

export default LoginPage;
