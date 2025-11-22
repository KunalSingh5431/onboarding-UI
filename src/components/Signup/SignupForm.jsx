import React, { useState } from "react";
import Step1BasicInfo from "./Step1BasicInfo";
import Step2Preferences from "./Step2Preferences";
import Step3Confirmation from "./Step3Confirmation";
import { AnimatePresence, motion } from "framer-motion";
import { Box, Paper, Typography, LinearProgress } from "@mui/material";
import Lottie from "lottie-react";
import welcomeAnimation from "../../assets/animations/welcome.json";

export default function SignupForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    preferences: [],
  });

  const nextStep = () => setStep((s) => Math.min(3, s + 1));
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  const progress = step === 1 ? 33 : step === 2 ? 66 : 100;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        minwidth: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        background: "radial-gradient(circle at top left, #6a11cb, #2575fc)",
        pt: 4,
        pb: 4,
        px: 0,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: 420,
          height: 420,
          borderRadius: "50%",
          bgcolor: "rgba(255,255,255,0.10)",
          filter: "blur(120px)",
          top: -120,
          left: -120,
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: 320,
          height: 320,
          borderRadius: "50%",
          bgcolor: "rgba(255,255,255,0.05)",
          filter: "blur(80px)",
          bottom: -80,
          right: -50,
          zIndex: 0,
        }}
      />

      <Box
        sx={{
          display: { xs: "none", md: "block" },
          position: "absolute",
          right: 120,
          top: 40,
          width: 320,
          zIndex: 0,
        }}
        aria-hidden
      >
        <Lottie animationData={welcomeAnimation} loop={true} />
      </Box>

      <Paper
        elevation={12}
        sx={{
          borderRadius: 4,
          p: { xs: 3, sm: 5 },
          width: { xs: "92%", sm: "460px", md: "520px" },
          minHeight: "600px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          bgcolor: "white",
          boxShadow: "0px 20px 50px rgba(0,0,0,0.12)",
          zIndex: 1,
        }}
      >
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <motion.div
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.45 }}
          >
            <Typography
              id="signup-title"
              variant="h3"
              sx={{
                fontWeight: 700,
                lineHeight: 1,
                letterSpacing: "-0.02em",
                color: "#18202c",
                background: "linear-gradient(90deg,#1e66c8,#4aa3ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: { xs: "1.6rem", sm: "2rem", md: "2.25rem" },
                mb: 1,
              }}
            >
              Welcome to WorkElate
            </Typography>
          </motion.div>

          <motion.div
            initial={{ y: 6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.06 }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "#6b6b6b",
                fontSize: { xs: "12px", sm: "13px" },
                mt: 0.5,
              }}
            >
              Just a few details to set up your account.
            </Typography>
          </motion.div>
        </Box>

        <Box sx={{ mb: 4 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 5,
              backgroundColor: "#f0f8ff",
              "& .MuiLinearProgress-bar": {
                borderRadius: 5,
                background: "linear-gradient(90deg, #6ec6ff, #a5d8ff)",
              },
            }}
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </Box>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.45 }}
          >
            {step === 1 && (
              <Step1BasicInfo
                nextStep={nextStep}
                formData={formData}
                setFormData={setFormData}
              />
            )}
            {step === 2 && (
              <Step2Preferences
                nextStep={nextStep}
                formData={formData}
                setFormData={setFormData}
              />
            )}

            {step === 3 && (
              <Step3Confirmation
                formData={formData}
                onBack={() => setStep(2)}
                onFinish={() => {
                  console.log("Finished signup — navigate to dashboard");
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </Paper>
    </Box>
  );
}
