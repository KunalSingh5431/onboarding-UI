import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, TextField, Button, LinearProgress, Paper, IconButton, Avatar, Chip, MenuItem } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; 
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';


const steps = [
  { id: 1, key: "companyName", title: "Your company", hint: "What's the name of the company or organisation?" },
  { id: 2, key: "companySize", title: "Company size", hint: "How large is your company?" },
  { id: 3, key: "role", title: "Your role", hint: "What's your role in the company?" },
  { id: 4, key: "teamName", title: "Create your team", hint: "Name your workspace (visible to teammates)." },
  { id: 5, key: "projectName", title: "Create a project", hint: "Start a project to add tasks & notes." },
  { id: 6, key: "inviteEmail", title: "Invite teammates", hint: "Optional: invite collaborators now." },
];

const COMPANY_SIZES = [
  "Just me",
  "2-10",
  "11-50",
  "51-200",
  "201-1000",
  "1000+",
];

const ROLES = [
  "Founder",
  "Admin",
  "Engineer / Tech",
  "Product",
  "Design",
  "Non-technical",
  "Other",
];

export default function QuickStartWizard({ initial = {}, onBack, onComplete, guided = false }) {
  const navigate = useNavigate();

  const [index, setIndex] = useState(0);
  const [data, setData] = useState({
    companyName: initial.companyName || "",
    companySize: initial.companySize || "",
    role: initial.role || "",
    teamName: initial.teamName || "",
    projectName: initial.projectName || "",
    inviteEmail: "",
  });

  const inputRefs = {
    companyName: useRef(null),
    companySize: useRef(null),
    role: useRef(null),
    teamName: useRef(null),
    projectName: useRef(null),
    inviteEmail: useRef(null),
  };

  const autoTimer = useRef(null);
  const step = steps[index];
  const progressVal = Math.round(((index + 1) / steps.length) * 100);

  const isFieldValid = (key, value) => {
    if (key === "inviteEmail") {
      if (!value) return true;
      return /\S+@\S+\.\S+/.test(value);
    }
    return value && value.toString().trim().length > 0;
  };

  useEffect(() => {
    if (guided) {
      const key = step.key;
      const ref = inputRefs[key];
      setTimeout(() => {
        if (ref?.current) ref.current.focus?.();
      }, 120);
    }

    return () => {
      if (autoTimer.current) {
        clearTimeout(autoTimer.current);
        autoTimer.current = null;
      }
    };

  }, [index, guided]);

  useEffect(() => {
    if (!guided) return;
    const key = step.key;
    const val = data[key];

    if (isFieldValid(key, val)) {
      if (key === "inviteEmail" && !val) {
        return;
      }
      if (autoTimer.current) clearTimeout(autoTimer.current);
      autoTimer.current = setTimeout(() => {
        if (index < steps.length - 1) setIndex((i) => i + 1);
        else handleFinishFlow();
        autoTimer.current = null;
      }, 850);
    } else {
      if (autoTimer.current) {
        clearTimeout(autoTimer.current);
        autoTimer.current = null;
      }
    }
    return () => {
      if (autoTimer.current) {
        clearTimeout(autoTimer.current);
        autoTimer.current = null;
      }
    };
  }, [data[step.key], guided, index]);

  const handleFinishFlow = async () => {
    try {
      const maybePromise = onComplete && onComplete(data);
      if (maybePromise && typeof maybePromise.then === "function") {
        await maybePromise;
      }
    } catch (err) {
      console.error("onComplete failed:", err);
      return; 
    }
    navigate("/dashboard");
  };

  const handleNext = async () => {
    if (index < steps.length - 1) {
      setIndex((i) => i + 1);
    } else {
      await handleFinishFlow();
    }
  };

  const handleBack = () => {
    if (index === 0) onBack && onBack();
    else setIndex((i) => i - 1);
  };

  const onChange = (key, value) => {
    setData((d) => ({ ...d, [key]: value }));
  };

  const Helper = ({ text }) => (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.22 }}>
      <Box
        sx={{
          position: "absolute",
          left: "102%",
          top: "50%",
          transform: "translateY(-50%)",
          minWidth: 260,
          p: 1.5,
          pr: 2,
          bgcolor: "rgba(255,255,255,0.92)",
          borderRadius: 2,
          border: "1px solid rgba(15,23,42,0.06)",
          boxShadow: "0 8px 30px rgba(11,22,55,0.06)",
          color: "#0f172a",
          fontSize: 13,
          fontWeight: 600,
          zIndex: 20,
        }}
      >
        {text}
        <Box
          sx={{
            position: "absolute",
            left: -7,
            top: "50%",
            transform: "translateY(-50%) rotate(45deg)",
            width: 12,
            height: 12,
            bgcolor: "rgba(255,255,255,0.92)",
            borderLeft: "1px solid rgba(15,23,42,0.04)",
            borderBottom: "1px solid rgba(15,23,42,0.04)",
          }}
        />
      </Box>
    </motion.div>
  );

  return (
    <Paper elevation={6} sx={{ overflow: "hidden", borderRadius: 3 }}>
      <Box sx={{ display: "flex", gap: 0 }}>
        <Box sx={{ flex: 1, p: { xs: 3, md: 6 }, position: "relative", background: "linear-gradient(180deg, #ffffff, #f7fbff)" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Avatar sx={{ bgcolor: "transparent", width: 46, height: 46, border: "2px solid transparent", backgroundImage: "linear-gradient(90deg,#6a11cb,#2575fc)", boxShadow: "0 6px 20px rgba(37,117,252,0.12)" }}>
              <CheckCircleIcon sx={{ color: "#fff" }} />
            </Avatar>

            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 800, fontSize: { xs: 18, md: 22 } }}>{step.title}</Typography>
              <Typography sx={{ color: "#606f7b", fontSize: 13 }}>{step.hint}</Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Chip label={`${index + 1}/${steps.length}`} size="small" sx={{ fontWeight: 700, bgcolor: "#f1f5ff" }} />
              <IconButton onClick={handleBack} aria-label="back" sx={{ ml: 1, bgcolor: "transparent" }}>
                <ArrowBackIcon />
              </IconButton>
            </Box>
          </Box>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
            <Box sx={{ mt: 1 }}>
              {step.id === 1 && (
                <Box sx={{ position: "relative" }}>
                  {guided && <Helper text="Enter your company name" />}

                  <TextField
                    inputRef={inputRefs.companyName}
                    fullWidth
                    label="Company name"
                    placeholder="ABC Company"
                    value={data.companyName}
                    onChange={(e) => onChange("companyName", e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        if (isFieldValid("companyName", data.companyName)) handleNext();
                      }
                    }}
                    sx={{ mt: 1 }}
                  />

                  <Typography sx={{ mt: 1, color: "#64748b", fontSize: 12 }}>This helps personalise your workspace.</Typography>
                </Box>
              )}

              {step.id === 2 && (
                <Box sx={{ position: "relative" }}>
                  {guided && <Helper text="Select your company size" />}

                  <TextField
                    inputRef={inputRefs.companySize}
                    select
                    fullWidth
                    label="Company size"
                    value={data.companySize}
                    onChange={(e) => onChange("companySize", e.target.value)}
                    sx={{ mt: 1 }}
                  >
                    {COMPANY_SIZES.map((s) => (
                      <MenuItem key={s} value={s}>
                        {s}
                      </MenuItem>
                    ))}
                  </TextField>

                  <Typography sx={{ mt: 1, color: "#64748b", fontSize: 12 }}>Choose the range that best fits your organisation.</Typography>
                </Box>
              )}

              {step.id === 3 && (
                <Box sx={{ position: "relative" }}>
                  {guided && <Helper text="Tell us your role" />}

                  <TextField
                    inputRef={inputRefs.role}
                    select
                    fullWidth
                    label="Your role"
                    value={data.role}
                    onChange={(e) => onChange("role", e.target.value)}
                    sx={{ mt: 1 }}
                  >
                    {ROLES.map((r) => (
                      <MenuItem key={r} value={r}>
                        {r}
                      </MenuItem>
                    ))}
                  </TextField>

                  <Typography sx={{ mt: 1, color: "#64748b", fontSize: 12 }}>This helps us recommend the right defaults.</Typography>
                </Box>
              )}

              {step.id === 4 && (
                <Box sx={{ position: "relative" }}>
                  {guided && <Helper text="Type a team name to continue" />}

                  <TextField
                    inputRef={inputRefs.teamName}
                    fullWidth
                    label="Team name"
                    placeholder="My Design Team"
                    value={data.teamName}
                    onChange={(e) => onChange("teamName", e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        if (isFieldValid("teamName", data.teamName)) handleNext();
                      }
                    }}
                    sx={{ mt: 1 }}
                  />

                  <Typography sx={{ mt: 1, color: "#64748b", fontSize: 12 }}>Pro tip: Keep the name short and memorable.</Typography>
                </Box>
              )}

              {step.id === 5 && (
                <Box sx={{ position: "relative" }}>
                  {guided && <Helper text="Add a project name (press Enter to continue)" />}

                  <TextField
                    inputRef={inputRefs.projectName}
                    fullWidth
                    label="Project name"
                    placeholder="Website Redesign"
                    value={data.projectName}
                    onChange={(e) => onChange("projectName", e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        if (isFieldValid("projectName", data.projectName)) handleNext();
                      }
                    }}
                    sx={{ mt: 1 }}
                  />

                  <Typography sx={{ mt: 1, color: "#64748b", fontSize: 12 }}>Example: "Q4 Landing Refresh" or "Mobile App v2"</Typography>
                </Box>
              )}

              {step.id === 6 && (
                <Box sx={{ position: "relative" }}>
                  {guided && <Helper text="Invite someone or leave blank to finish" />}

                  <TextField
                    inputRef={inputRefs.inviteEmail}
                    fullWidth
                    label="Invite a teammate (email)"
                    placeholder="name@email.com"
                    value={data.inviteEmail}
                    onChange={(e) => onChange("inviteEmail", e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        if (isFieldValid("inviteEmail", data.inviteEmail)) handleNext();
                      }
                    }}
                    sx={{ mt: 1 }}
                  />

                  <Typography sx={{ mt: 1, color: "#64748b", fontSize: 12 }}>You can always invite people later from workspace settings.</Typography>
                </Box>
              )}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 4 }}>
              <Box sx={{ flex: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={progressVal}
                  sx={{
                    height: 10,
                    borderRadius: 99,
                    backgroundColor: "#eef4ff",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 99,
                      background: "linear-gradient(90deg,#6a11cb,#2575fc)",
                      transition: "width 400ms ease",
                    },
                  }}
                />
              </Box>

              <motion.div whileHover={{ scale: 1.03 }}>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{
                    background: "linear-gradient(90deg,#6a11cb,#2575fc)",
                    color: "#fff !important",
                    textTransform: "none",
                    fontWeight: 700,
                    px: 3,
                    boxShadow: "0 8px 30px rgba(106,17,203,0.18)",
                    "&:hover": { boxShadow: "0 10px 40px rgba(106,17,203,0.24)" },
                    "&:disabled": { background: "#dcdff6", color: "#9aa0d6 !important", boxShadow: "none" },
                  }}
                  disabled={!isFieldValid(step.key, data[step.key])}
                >
                  {index === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              </motion.div>
            </Box>
          </motion.div>
        </Box>

        <Box sx={{ width: 360, display: { xs: "none", md: "block" }, p: 4, bgcolor: "linear-gradient(180deg, #f8fbff, #ffffff)", borderLeft: "1px solid rgba(15,23,42,0.03)" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography sx={{ fontWeight: 800 }}>Why this helps</Typography>
            <Chip icon={<WorkspacePremiumIcon />} label="Quick" size="small" sx={{ bgcolor: "#eef2ff", fontWeight: 700 }} />
          </Box>

          <Typography sx={{ color: "#6b7280", mt: 1, fontSize: 13 }}>
            These quick settings populate sample content, create a starter project and make it easy to onboard teammates.
          </Typography>

          {guided && (
            <Box sx={{ mt: 12, p: 2.25, borderRadius: 2, bgcolor: "#ffffff", boxShadow: "0 6px 30px rgba(11,22,55,0.04)", border: "1px solid rgba(37,99,235,0.06)" }}>
              <Typography sx={{ fontSize: 13, fontWeight: 800 }}>Guided mode</Typography>
              <Typography sx={{ fontSize: 12, color: "#525967" }}>
                Auto-focus helpers and enter-to-continue improve speed. Fill fields or press Enter to advance.
              </Typography>

              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar sx={{ width: 34, height: 34, bgcolor: "#eef2ff" }}>
                    <AccountTreeIcon sx={{ color: "#4f46e5" }} />
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontSize: 12, fontWeight: 700 }}>Starter project</Typography>
                    <Typography sx={{ fontSize: 11, color: "#64748b" }}>Tasks, boards & a sample doc</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        
        </Box>
      </Box>
    </Paper>
  );
}
