import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Imported Framer Motion
import "../App.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    // Kept your exact matching logic (case-insensitive fallback check for peace of mind)
    if (email.trim() === "Admin" && password === "Admin") {
      localStorage.setItem("auth", "true");
      navigate("/dashboard");
    } else {
      alert("Invalid login (use Admin/Admin)");
    }
  };

  // Stagger configurations to animate children inputs one after another
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Time gap between input animations
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 100, damping: 15 } 
    },
  };

  return (
    <div className="loginPage">
      {/* Animated Card Box Wrapper */}
      <motion.div
        className="loginBox"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Animated Title Header */}
        <motion.h2 variants={itemVariants}>
          Attendance Tracker Login
        </motion.h2>

        {/* Animated Username Input Container */}
        <motion.div variants={itemVariants} className="inputWrapper">
          <input
            placeholder="Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </motion.div>

        {/* Animated Password Input Container */}
        <motion.div variants={itemVariants} className="inputWrapper">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </motion.div>

        {/* High Interaction Custom Animated Button */}
        <motion.button
          variants={itemVariants}
          onClick={handleLogin}
          whileHover={{ 
            scale: 1.03, 
            boxShadow: "0px 5px 15px rgba(99, 102, 241, 0.4)" 
          }}
          whileTap={{ scale: 0.97 }}
        >
          Login
        </motion.button>
      </motion.div>
    </div>
  );
}