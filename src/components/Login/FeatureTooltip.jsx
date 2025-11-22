import React, { useEffect } from "react";
import { Paper, Typography, Button, Box, IconButton, Divider } from "@mui/material";
import { motion } from "framer-motion";
import CloseIcon from '@mui/icons-material/Close';

export default function FeatureTooltip({
  title,
  desc,
  x = 0,
  y = 0,
  placement = "right",
  onNext,
  onSkip,
  stepIndex = 0,
  total = 3,
  onClose
}) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose && onClose();
      if (e.key === "Enter") onNext && onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onNext, onClose]);

  const arrowCommon = {
    position: 'absolute',
    width: 14,
    height: 14,
    transform: 'rotate(45deg)',
    bgcolor: 'background.paper',
    boxShadow: '0 6px 18px rgba(8,18,35,0.08)',
    borderLeft: '1px solid rgba(15,23,42,0.04)',
    borderTop: '1px solid rgba(15,23,42,0.04)',
    zIndex: -1,
  };

  const arrowSx = {
    right: { left: -7, top: '50%', transform: 'translateY(-50%) rotate(45deg)' },
    left: { right: -7, top: '50%', transform: 'translateY(-50%) rotate(45deg)' },
    top: { left: '50%', bottom: -7, transform: 'translateX(-50%) rotate(45deg)' },
    bottom: { left: '50%', top: -7, transform: 'translateX(-50%) rotate(45deg)' },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      style={{ position: 'absolute', left: x, top: y, zIndex: 9999 }}
      role="dialog"
      aria-labelledby={`tooltip-title-${stepIndex}`}
      aria-describedby={`tooltip-desc-${stepIndex}`}
    >
      <Paper
        sx={{
          p: 2.25,
          maxWidth: 380,
          minWidth: 280,
          borderRadius: 2.25,
          boxShadow: '0 14px 40px rgba(8,18,35,0.14)',
          bgcolor: 'background.paper',
          color: 'text.primary',
          overflow: 'visible'
        }}
        elevation={10}
      >
        <Box sx={{ position: 'relative', pb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography
              id={`tooltip-title-${stepIndex}`}
              sx={{
                fontWeight: 800,
                fontSize: 15,
                lineHeight: 1.05,
                background: 'linear-gradient(90deg,#4f46e5,#06b6d4)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                mr: 1,
              }}
            >
              {title}
            </Typography>

            <Typography sx={{ fontSize: 12, color: '#9aa4b2' }}>{stepIndex + 1}/{total}</Typography>
          </Box>

          <Typography
            id={`tooltip-desc-${stepIndex}`}
            sx={{
              color: '#556',
              mt: 0.5,
              fontSize: 13,
              mb: 2,
              whiteSpace: 'pre-wrap'
            }}
          >
            {desc}
          </Typography>

          <Divider sx={{ mb: 1 }} />

          <Box sx={{ display: 'flex', gap: 1, mt: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
            <Button
              size="small"
              onClick={onSkip}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: 1,
                px: 1.25,
                py: 0.5,
                color: '#475569',
                border: '1px solid rgba(71,85,105,0.06)',
                bgcolor: 'rgba(71,85,105,0.02)',
                '&:hover': { bgcolor: 'rgba(71,85,105,0.04)' },
                '&:focus-visible': { outline: '3px solid rgba(99,102,241,0.12)' }
              }}
            >
              Skip
            </Button>

            <Button
              size="small"
              variant="contained"
              onClick={onNext}
              sx={{
                background: 'linear-gradient(90deg,#6a11cb,#2575fc)',
                textTransform: 'none',
                fontWeight: 800,
                px: 2,
                py: 0.6,
                borderRadius: 1.25,
                boxShadow: '0 8px 26px rgba(37,17,203,0.14)',
                '&:hover': {
                  boxShadow: '0 10px 30px rgba(37,17,203,0.18)',
                  transform: 'translateY(-1px)'
                },
                '&:focus-visible': { outline: '3px solid rgba(99,102,241,0.12)' }
              }}
            >
              Next
            </Button>
          </Box>

          <IconButton
            aria-label="close tooltip"
            onClick={onClose}
            size="small"
            sx={{
              position: 'absolute',
              right: 6,
              top: 6,
              color: '#94a3b8',
              bgcolor: 'transparent',
              '&:hover': { bgcolor: 'rgba(15,23,42,0.03)', color: '#64748b' }
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>

          <Box component="span" sx={{ ...arrowCommon, ...(arrowSx[placement] || arrowSx.right) }} />
        </Box>
      </Paper>
    </motion.div>
  );
}
