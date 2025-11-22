import React, { useState } from "react";
import { Box, IconButton, Button, Avatar, Typography } from "@mui/material";
import TourWelcome from "./TourWelcome";
import QuickStartWizard from "./QuickStartWizard";
import Lottie from "lottie-react";
import spark from "../../assets/animations/spark.json";

export default function PostSignupTour({ onFinish }) {
  const [stage, setStage] = useState("welcome");
  const [wizardData, setWizardData] = useState({ teamName: "", projectName: "" });
  const [celebrate, setCelebrate] = useState(false);
  const [guided, setGuided] = useState(false);

  const handleStart = (wantGuided) => {
    setGuided(!!wantGuided);
    setStage("wizard");
  };

  const handleFinish = () => {
    setCelebrate(true);
    setStage("done");
    setTimeout(() => {
      setCelebrate(false);
      if (onFinish) onFinish();
    }, 1600);
  };

  return (
    <Box
      sx={{
        maxHeight: "100vh",
        maxwidth: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        background: "radial-gradient(circle at 10% 12%, rgba(39,117,252,0.12), transparent 8%), radial-gradient(circle at 90% 88%, rgba(106,17,203,0.10), transparent 12%), linear-gradient(180deg,#f6f8ff 0%, #eef5ff 100%)",
        p: { xs: 4, md: 8 },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: 720,
          height: 720,
          borderRadius: "50%",
          bgcolor: "rgba(106,17,203,0.10)",
          filter: "blur(140px)",
          top: -220,
          left: -160,
          zIndex: 0,
          opacity: 0.95,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: 540,
          height: 540,
          borderRadius: "50%",
          bgcolor: "rgba(37,117,252,0.08)",
          filter: "blur(120px)",
          bottom: -180,
          right: -120,
          zIndex: 0,
        }}
      />

      {celebrate && (
        <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, pointerEvents: "none" }}>
          <Box sx={{ width: { xs: 280, md: 520 }, height: { xs: 280, md: 520 } }}>
            <Lottie animationData={spark} loop={false} />
          </Box>
        </Box>
      )}

      <Box sx={{ position: "relative", zIndex: 10, width: "100%", maxWidth: 1400, display: "flex", flexDirection: "column", gap: 6, alignItems: "stretch" }}>

        <Box sx={{ bgcolor: "rgba(255,255,255,0.7)", borderRadius: 4, p: { xs: 4, md: 6 }, boxShadow: "0 20px 60px rgba(11,22,55,0.08)", minHeight: 520, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Box sx={{ width: "85%" }}>
            {stage === "welcome" && <TourWelcome onStart={handleStart} />}

            {stage === "wizard" && (
              <QuickStartWizard
                initial={wizardData}
                guided={guided}
                onBack={() => setStage("welcome")}
                onComplete={(data) => {
                  setWizardData(data);
                  setStage("demo");
                }}
              />
            )}

          </Box>
        </Box>

      </Box>
    </Box>
  );
}
