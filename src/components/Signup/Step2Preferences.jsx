import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Chip,
  Button,
  Link,
  Autocomplete,
  TextField,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";

const categories = [
  "Technology",
  "Health",
  "Finance",
  "Travel",
  "Education",
  "Music",
  "Fitness",
  "Art",
];

const commonGoals = [
  "Boost productivity",
  "Centralize tasks",
  "Automate reporting",
  "Improve team collaboration",
  "Better visibility into work",
];

const commonIntegrations = [
  "Slack",
  "Google Calendar",
  "Google Drive",
  "Figma",
  "GitHub",
  "Jira",
  "Zapier",
];

export default function Step2Preferences({ nextStep, formData, setFormData }) {
  const [selected, setSelected] = useState(formData.preferences || []);
  const [selectedGoals, setSelectedGoals] = useState(formData.selectedGoals || []);
  const [integrations, setIntegrations] = useState(formData.integrations || []);
  const [announce, setAnnounce] = useState("");

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      preferences: selected,
      selectedGoals,
      integrations,
    }));

    const total = selected.length + selectedGoals.length;
    setAnnounce(`${total} selections`);
    const t = setTimeout(() => setAnnounce(""), 900);
    return () => clearTimeout(t);
  }, [selected, selectedGoals, integrations]);

  const toggleCategory = (cat) => {
    setSelected((s) => (s.includes(cat) ? s.filter((c) => c !== cat) : [...s, cat]));
  };

  const toggleGoal = (goal) => {
    setSelectedGoals((g) => (g.includes(goal) ? g.filter((x) => x !== goal) : [...g, goal]));
  };

  const handleNext = () => {
    nextStep();
  };

  const handleSkip = () => {
    setSelected([]);
    setSelectedGoals([]);
    setIntegrations([]);
    setFormData({ ...formData, preferences: [], selectedGoals: [], integrations: [] });
    nextStep();
  };

  const minRequiredMet = selected.length + selectedGoals.length >= 1;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, position: "relative" }}>
      <Typography variant="h6" sx={{ textAlign: "center", color: "#444" }}>
        Pick your interests
      </Typography>

      <Typography
        variant="body2"
        sx={{ textAlign: "center", color: "#777", fontSize: { xs: 12, sm: 13 } }}
      >
        Help us personalise your experience — choose topics and goals. You can change these later.
      </Typography>

      <Box
        sx={{
          position: "absolute",
          left: -9999,
          top: "auto",
          width: 1,
          height: 1,
          overflow: "hidden",
        }}
        aria-live="polite"
        aria-atomic="true"
      >
        {announce}
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: "center",
          mt: 1,
        }}
      >
        {categories.map((cat) => {
          const active = selected.includes(cat);
          return (
            <motion.div key={cat} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}>
              <Chip
                label={cat}
                clickable
                onClick={() => toggleCategory(cat)}
                color={active ? "primary" : "default"}
                variant={active ? "filled" : "outlined"}
                aria-pressed={active}
                aria-label={`${cat} ${active ? "selected" : "not selected"}`}
                sx={{
                  px: 2,
                  py: 1,
                  fontWeight: 700,
                  borderRadius: 2,
                  fontSize: 14,
                  boxShadow: active
                    ? "0 6px 18px rgba(99,73,255,0.12)"
                    : "0 2px 6px rgba(0,0,0,0.06)",
                }}
              />
            </motion.div>
          );
        })}
      </Box>

      <Divider sx={{ my: 1.5 }} />

      <Typography sx={{ color: "#444", fontWeight: 700 }}>Top work goals</Typography>
      <Typography variant="body2" sx={{ color: "#666", fontSize: 13 }}>
        Choose one or more goals — this helps tailor tips and templates.
      </Typography>

      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
        {commonGoals.map((g) => {
          const active = selectedGoals.includes(g);
          return (
            <motion.div key={g} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}>
              <Chip
                label={g}
                clickable
                onClick={() => toggleGoal(g)}
                color={active ? "primary" : "default"}
                variant={active ? "filled" : "outlined"}
                aria-pressed={active}
                aria-label={`${g} ${active ? "selected" : "not selected"}`}
                sx={{
                  px: 2,
                  py: 0.8,
                  fontWeight: 700,
                  borderRadius: 2,
                  fontSize: 13,
                  boxShadow: active
                    ? "0 6px 18px rgba(99,73,255,0.12)"
                    : "0 2px 6px rgba(0,0,0,0.06)",
                }}
              />
            </motion.div>
          );
        })}
      </Box>

      <Divider sx={{ my: 1.5 }} />

      <Typography sx={{ color: "#444", fontWeight: 700 }}>Preferred tool integrations (optional)</Typography>
      <Typography variant="body2" sx={{ color: "#666", fontSize: 13 }}>
        Select tools you use — we’ll suggest relevant integrations.
      </Typography>

      <Autocomplete
        multiple
        freeSolo
        options={commonIntegrations}
        value={integrations}
        onChange={(e, v) => setIntegrations(v)}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="e.g., Slack, Google Drive"
            sx={{ mt: 1 }}
            inputProps={{
              ...params.inputProps,
              "aria-label": "Preferred integrations",
            }}
          />
        )}
      />

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
        <Typography variant="body2" sx={{ color: "#666" }}>
          {selected.length} interests • {selectedGoals.length} goals
        </Typography>

        <Box>
          <Link
            component="button"
            underline="hover"
            sx={{ fontSize: 14, color: "#666", mr: 2 }}
            onClick={handleSkip}
            aria-label="Skip and continue"
          >
            Skip for now
          </Link>
        </Box>
      </Box>

      <motion.div
        whileHover={{ scale: minRequiredMet ? 1.03 : 1 }}
        whileTap={{ scale: minRequiredMet ? 0.98 : 1 }}
      >
        <Button
          variant="contained"
          size="large"
          onClick={handleNext}
          disabled={!minRequiredMet}
          sx={{
            width: "100%",
            bgcolor: minRequiredMet ? "linear-gradient(to right, #6a11cb, #2575fc)" : "#e6e6ea",
            color: minRequiredMet ? "white" : "#999",
            py: 1.5,
            fontWeight: "bold",
            fontSize: "16px",
            borderRadius: 3,
            boxShadow: minRequiredMet ? "0px 5px 15px rgba(0,0,0,0.12)" : "none",
            textTransform: "none",
          }}
          aria-disabled={!minRequiredMet}
        >
          Continue
        </Button>
      </motion.div>
    </Box>
  );
}
