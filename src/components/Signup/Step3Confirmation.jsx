import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
} from "@mui/material";
import Lottie from "lottie-react";
import success from "../../assets/animations/confirm.json";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Step3Confirmation({ formData = {}, onBack, onFinish }) {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleBack = () => {
    if (typeof onBack === "function") return onBack();
    if (window && window.history && window.history.length > 1) window.history.back();
  };

  const handleFinish = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      if (typeof onFinish === "function") {
        await Promise.resolve(onFinish(formData));
      }

      navigate("/post-sign");
    } catch (err) {
      console.error("Error during finish:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const SummaryRow = ({ label, value }) => {
    if (!value) return null;
    return (
      <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
        <Typography sx={{ color: "#6b7280", fontSize: 13 }}>{label}:</Typography>
        <Typography sx={{ fontWeight: 700, color: "#111827", fontSize: 13 }}>{value}</Typography>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        alignItems: "center",
        textAlign: "center",
        width: "100%",
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 800, color: "#0b1220" }}>
        You're all set{formData.name ? `, ${formData.name}` : ""}!
      </Typography>

      <Typography variant="body1" sx={{ color: "#374151", maxWidth: 760 }}>
         In this step, you have created your account with basic details and interests. Professional info will be added in the next step.
      </Typography>

      {/* summary */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
        <SummaryRow label="Company" value={formData.companyName} />
        <SummaryRow label="Role" value={formData.role} />
        <SummaryRow label="Company size" value={formData.companySize} />
        <SummaryRow
          label="Primary goal"
          value={
            formData.primaryGoal ||
            (formData.selectedGoals && formData.selectedGoals.length ? formData.selectedGoals[0] : "")
          }
        />
      </Box>

      <Box sx={{ width: 300, maxWidth: "90%" }} aria-hidden>
        <Lottie animationData={success} loop />
      </Box>

      <Box sx={{ display: "flex", gap: 2, width: "100%", maxWidth: 720 }}>
        <Button
          variant="outlined"
          onClick={handleBack}
          aria-label="Back to preferences"
          disabled={submitting}
          sx={{
            flex: 1,
            py: 1.5,
            borderRadius: 3,
            borderColor: "rgba(15,23,42,0.08)",
            color: "#0b1220",
            background: "#fff",
            "&:hover": { borderColor: "rgba(15,23,42,0.12)" },
            textTransform: "none",
            fontWeight: 700,
          }}
        >
          Back
        </Button>

        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} style={{ flex: 1 }}>
          <Button
            variant="contained"
            onClick={handleFinish}
            aria-label="Go to dashboard"
            disabled={submitting}
            sx={{
              width: "100%",
              py: 1.5,
              borderRadius: 3,
              background: "linear-gradient(90deg,#2563eb,#0ea5e9)",
              boxShadow: "0px 8px 28px rgba(37,99,235,0.12)",
              color: "white",
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            {submitting ? "Preparing your workspace…" : "Go to Dashboard"}
          </Button>
        </motion.div>
      </Box>
    </Box>
  );
}
