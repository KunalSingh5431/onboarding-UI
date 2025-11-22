import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Divider,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import OAuthButtons from "./OAuthButtons";

export default function Step1BasicInfo({ nextStep, formData, setFormData }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({ email: false, otp: false, password: false, confirmPassword: false });
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [serverOtp, setServerOtp] = useState(null);
  const [otpInput, setOtpInput] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState("");

  const togglePassword = () => setShowPassword((s) => !s);
  const toggleConfirmPassword = () => setShowConfirmPassword((s) => !s);

  const validators = {
    email: (v) => /\S+@\S+\.\S+/.test(v || ""),
    password: (v) => v && v.length >= 8,
    confirmPassword: (pw, cpw) => pw && cpw && pw === cpw,
    name: (v) => !v || v.trim().length >= 2,
  };

  useEffect(() => {
    const e = {};
    if (!validators.email(formData.email)) e.email = "Please enter a valid business email.";
    if (!validators.password(formData.password)) e.password = "Password must be at least 8 characters.";
    if (!validators.confirmPassword(formData.password, formData.confirmPassword)) e.confirmPassword = "Passwords do not match.";
    setErrors(e);
  }, [formData.email, formData.password, formData.confirmPassword]);

  const handleBlur = (field) => setTouched((t) => ({ ...t, [field]: true }));

  const showError = (field) => !!errors[field] && (touched[field] || attemptedSubmit);

  const sendOtp = async () => {
    if (!validators.email(formData.email)) {
      setTouched((t) => ({ ...t, email: true }));
      return;
    }
    setOtpLoading(true);
    setOtpError("");
    setOtpSent(false);
    setOtpVerified(false);

    setTimeout(() => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setServerOtp(code);
      setOtpSent(true);
      setOtpLoading(false);
    }, 900);
  };

  const verifyOtp = () => {
    setOtpError("");
    if (!otpInput || otpInput.trim().length === 0) {
      setOtpError("Enter the code sent to your email.");
      setTouched((t) => ({ ...t, otp: true }));
      return;
    }
    if (otpInput.trim() === serverOtp) {
      setOtpVerified(true);
      setOtpError("");
    } else {
      setOtpError("Invalid code. Please try again.");
    }
  };

  const handleNext = () => {
    setAttemptedSubmit(true);
    const pwOk = validators.password(formData.password);
    const cpwOk = validators.confirmPassword(formData.password, formData.confirmPassword);
    if (!otpVerified) {
      setOtpError("Please verify your email with the OTP before continuing.");
      setTouched((t) => ({ ...t, otp: true }));
      return;
    }
    if (!pwOk || !cpwOk) {
      const firstErr = document.querySelector('[aria-invalid="true"]');
      if (firstErr) firstErr.focus();
      return;
    }

    nextStep();
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Typography variant="h6" sx={{ textAlign: "center", color: "#444" }}>
        Create your WorkElate account
      </Typography>

      <TextField
        label="Business Email ID"
        variant="outlined"
        type="email"
        value={formData.email}
        onChange={(e) => {
          setFormData({ ...formData, email: e.target.value });
          setOtpSent(false);
          setOtpVerified(false);
          setServerOtp(null);
          setOtpInput("");
          setOtpError("");
        }}
        onBlur={() => handleBlur("email")}
        fullWidth
        error={showError("email")}
        helperText={showError("email") ? errors.email : "Use your company email for organization features."}
        aria-label="Business email"
        aria-invalid={!!errors.email && (touched.email || attemptedSubmit)}
        FormHelperTextProps={{ id: "email-error" }}
      />

      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <Button
          variant="outlined"
          onClick={sendOtp}
          disabled={otpLoading || !validators.email(formData.email)}
          sx={{ minWidth: 160, textTransform: "none" }}
        >
          {otpSent ? "Resend OTP" : "Send OTP"}
        </Button>

        <TextField
          label="Enter OTP"
          variant="outlined"
          value={otpInput}
          onChange={(e) => setOtpInput(e.target.value)}
          onBlur={() => handleBlur("otp")}
          disabled={!otpSent}
          size="small"
          sx={{ flex: 1 }}
          error={!!otpError && (touched.otp || attemptedSubmit)}
          helperText={otpError && (touched.otp || attemptedSubmit) ? otpError : ""}
          aria-label="OTP code"
        />

        <Button
          variant="contained"
          onClick={verifyOtp}
          disabled={!otpSent || otpVerified}
          sx={{ textTransform: "none" }}
        >
          {otpVerified ? "Verified" : "Verify"}
        </Button>
      </Box>

      {otpSent && serverOtp && !otpVerified && (
        <Alert severity="info" sx={{ fontSize: 13 }}>
          For testing only — verification code: <strong>{serverOtp}</strong>
        </Alert>
      )}
      <TextField
        label="Password"
        variant="outlined"
        type={showPassword ? "text" : "password"}
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        onBlur={() => handleBlur("password")}
        fullWidth
        error={showError("password")}
        helperText={showError("password") ? errors.password : "At least 8 characters."}
        aria-label="Password"
        aria-invalid={!!errors.password && (touched.password || attemptedSubmit)}
        FormHelperTextProps={{ id: "password-error" }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={togglePassword} edge="end" aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <TextField
        label="Confirm Password"
        variant="outlined"
        type={showConfirmPassword ? "text" : "password"}
        value={formData.confirmPassword || ""}
        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        onBlur={() => handleBlur("confirmPassword")}
        fullWidth
        error={showError("confirmPassword")}
        helperText={showError("confirmPassword") ? errors.confirmPassword : ""}
        aria-label="Confirm password"
        aria-invalid={!!errors.confirmPassword && (touched.confirmPassword || attemptedSubmit)}
        FormHelperTextProps={{ id: "confirm-password-error" }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={toggleConfirmPassword} edge="end" aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}>
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
        <Button
          variant="contained"
          size="large"
          onClick={() => {
            setAttemptedSubmit(true);
            handleNext();
          }}
          disabled={!otpVerified || !validators.password(formData.password) || !validators.confirmPassword(formData.password, formData.confirmPassword)}
          sx={{
            width: "100%",
            background: "linear-gradient(90deg,#6a11cb,#2575fc)",
            color: "#fff !important",
            py: 1.5,
            fontWeight: "bold",
            fontSize: "16px",
            borderRadius: 3,
            boxShadow: "0 8px 30px rgba(99,73,255,0.12)",
            textTransform: "none",
          }}
        >
          Next
        </Button>
      </motion.div>
      
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Divider sx={{ flex: 1 }} />
        <Typography variant="body2" sx={{ color: "#888" }}>
          or
        </Typography>
        <Divider sx={{ flex: 1 }} />
      </Box>

      <OAuthButtons />
    </Box>
  );
}
