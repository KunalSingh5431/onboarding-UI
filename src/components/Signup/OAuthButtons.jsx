// src/components/OAuthButtons.jsx
import React from "react";
import { Button, Box } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import { motion } from "framer-motion";

export default function OAuthButtons() {
  const buttonStyles = {
    flex: 1,
    py: 1,
    fontWeight: 600,
    borderRadius: 2,
    fontSize: "14px",
    textTransform: "none",
    boxShadow: "0px 3px 10px rgba(0,0,0,0.1)",
    color: "white",
    minHeight: "40px",
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "row", gap: 2, mt: 1 }}>
      {/* Google */}
      <motion.div style={{ flex: 1 }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <Button
          fullWidth
          startIcon={<GoogleIcon />}
          sx={{
            ...buttonStyles,
            bgcolor: "#DB4437",
            "&:hover": { bgcolor: "#C1351D" },
          }}
        >
          Google
        </Button>
      </motion.div>

      {/* GitHub */}
      <motion.div style={{ flex: 1 }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <Button
          fullWidth
          startIcon={<GitHubIcon />}
          sx={{
            ...buttonStyles,
            bgcolor: "#333333",
            "&:hover": { bgcolor: "#000000" },
          }}
        >
          GitHub
        </Button>
      </motion.div>
    </Box>
  );
}
