import React from "react";
import { Box } from "@mui/material";
import DashboardWithTooltip from "../components/Login/FeatureDemoPage";

export default function DashboardPage() {
  const initial = { teamName: "Acme" };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        p: 0,
        background: "linear-gradient(180deg,#f6f8ff,#eef5ff)",
        display: "flex",
        alignItems: "stretch",
        justifyContent: "stretch",
      }}
    >
      <DashboardWithTooltip initial={initial} guided={false} />
    </Box>
  );
}
