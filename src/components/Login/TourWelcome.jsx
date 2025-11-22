import React from "react";
import { Box, Typography, Button } from "@mui/material";
import Lottie from "lottie-react";
import anim from "../../assets/animations/hand.json"; 
import { motion } from "framer-motion";

export default function TourWelcome({ onStart }) {
  return (
    <Box sx={{ display: "flex", gap: 3, alignItems: "center", width: "100%" }}>
      <Box sx={{ flex: 1 }}>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: { xs: 40, sm: 42, md: 46 },
            lineHeight:  1,
            mb: 1,
            color: "#111423",
          }}
        >
          Welcome to WorkElate
        </Typography>

        <Typography sx={{ color: "#475569", mt:3, mb: 3, fontSize: 20 }}>
          We’ll walk you through a 1-minute setup to create your workspace, a sample project and invite a teammate. Choose guided for a hands-on walkthrough.
        </Typography>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <motion.div whileHover={{ scale: 1.03 }}>
            <Button
              onClick={() => onStart(true)}
              sx={{
                background: "linear-gradient(90deg,#6a11cb,#2575fc)",
                color: "#fff !important",
                px: 3,
                py: 1.15,
                borderRadius: 2,
                boxShadow: "0 10px 30px rgba(99,73,255,0.12)",
                fontWeight: 600,
                textTransform: "none",
              }}
              variant="contained"
              aria-label="Start guided tour"
            >
              Take the guided tour
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <Button
              onClick={() => onStart(false)}
              variant="outlined"
              sx={{
                px: 2.5,
                py: 1.05,
                borderRadius: 2,
                color: "#273347",
                borderColor: "rgba(39,52,67,0.12)",
                textTransform: "none",
                fontWeight: 700,
              }}
              aria-label="Skip and explore"
            >
              Skip & explore
            </Button>
          </motion.div>
        </Box>
        <Box sx={{ display: "flex", gap: 2, mt: 4, alignItems: "center", flexWrap: "wrap" }}>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#4caf50" }} />
            <Typography sx={{ fontSize: 17, color: "#334155", fontWeight: 700 }}>Setup in minutes</Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#f59e0b" }} />
            <Typography sx={{ fontSize: 17, color: "#334155", fontWeight: 700 }}>Easy team invites</Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ width: 460, display: { xs: "none", md: "block" } }}>
        <Box
          sx={{
            p: 2,
            borderRadius: 50,
            bgcolor: "rgba(250,250,255,0.9)",
            boxShadow: "0 10px 30px rgba(11,20,40,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Lottie animationData={anim} loop style={{ width: 600, height: 400 }} />
        </Box>
      </Box>
    </Box>
  );
}
