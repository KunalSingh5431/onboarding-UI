import React, { useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  ListItemButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderIcon from '@mui/icons-material/Folder';
import ChatIcon from '@mui/icons-material/Chat';
import PeopleIcon from '@mui/icons-material/People';
import GridViewIcon from '@mui/icons-material/GridView';
import Lottie from 'lottie-react';
import spark from '../../assets/animations/spark.json';
import { motion } from 'framer-motion';

function TooltipPortal({ children }) {
  return typeof document !== 'undefined' ? ReactDOM.createPortal(children, document.body) : null;
}

function Tooltip({ title, desc, x, y, placement = 'right', onNext, onSkip, stepIndex = 0, total = 3, onClose }) {
  const arrowStyle = {
    position: 'absolute',
    width: 12,
    height: 12,
    transform: 'rotate(45deg)',
    background: 'white',
    boxShadow: '0 6px 18px rgba(8,18,35,0.08)',
    borderLeft: '1px solid rgba(15,23,42,0.04)',
    borderTop: '1px solid rgba(15,23,42,0.04)'
  };

  const arrowPos = {
    right: { left: -6, top: '50%', transform: 'translateY(-50%) rotate(45deg)' },
    left: { right: -6, top: '50%', transform: 'translateY(-50%) rotate(45deg)' },
    top: { left: '50%', bottom: -6, transform: 'translateX(-50%) rotate(45deg)' },
    bottom: { left: '50%', top: -6, transform: 'translateX(-50%) rotate(45deg)' }
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose && onClose();
      if (e.key === 'Enter') onNext && onNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onNext, onClose]);

  return (
    <TooltipPortal>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        style={{ position: 'absolute', left: x, top: y, zIndex: 9999 }}
        role="dialog"
        aria-labelledby={`tt-${stepIndex}`}
        aria-describedby={`tt-desc-${stepIndex}`}
      >
        <div style={{ position: 'relative' }}>
          <div
            style={{
              background: 'white',
              padding: 18,
              borderRadius: 12,
              maxWidth: 420,
              minWidth: 300,
              boxShadow: '0 14px 40px rgba(8,18,35,0.14)',
              fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div
                id={`tt-${stepIndex}`}
                style={{
                  fontWeight: 800,
                  fontSize: 16,
                  color: '#0f172a',
                  letterSpacing: 0.1,
                }}
              >
                {title}
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>{stepIndex + 1}/{total}</div>
            </div>

            <div
              id={`tt-desc-${stepIndex}`}
              style={{
                color: '#334155',
                fontSize: 14,
                lineHeight: 1.45,
                marginBottom: 12,
              }}
            >
              {desc}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                onClick={onSkip}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(99,102,241,0.08)',
                  color: '#475569',
                  padding: '7px 12px',
                  borderRadius: 10,
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'transform .12s ease, box-shadow .12s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                Skip
              </button>

              <button
                onClick={onNext}
                style={{
                  background: 'linear-gradient(90deg,#10b981,#059669)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 14px',
                  borderRadius: 10,
                  cursor: 'pointer',
                  fontWeight: 800,
                  boxShadow: '0 8px 26px rgba(6,95,70,0.12)',
                  transition: 'transform .12s ease, box-shadow .12s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 12px 36px rgba(6,95,70,0.18)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 26px rgba(6,95,70,0.12)';
                }}
              >
                Next
              </button>
            </div>
          </div>

          <div style={{ ...arrowStyle, ...(arrowPos[placement] || arrowPos.right) }} />
        </div>
      </motion.div>
    </TooltipPortal>
  );
}

export default function DashboardWithTooltip({ initial = {}, guided = false }) {
  const targets = [
    { id: 'aiWorkflow', title: 'AI Workflow', desc: 'Automate tasks, generate summaries and run jobs.', actionLabel: 'Open Workflow' },
    { id: 'projects', title: 'Projects', desc: 'Create and manage projects & tasks.', actionLabel: 'Open Projects' },
    { id: 'chat', title: 'Team Chat', desc: 'Message teammates in real-time.', actionLabel: 'Open Chat' }
  ];

  const refs = {
    aiWorkflow: useRef(null),
    projects: useRef(null),
    chat: useRef(null)
  };

  const [tipIndex, setTipIndex] = useState(0);
  const [tooltip, setTooltip] = useState({ x: 40, y: 120, placement: 'right', visible: false });
  const [isGuided, setIsGuided] = useState(guided);
  const [completed, setCompleted] = useState(0);
  const [query, setQuery] = useState('');

  const SIDEBAR_WIDTH = 220;

  const ensureInViewIfNeeded = (el) => {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const padding = 80;
    if (rect.top < padding || rect.bottom > window.innerHeight - padding) {
      try {
        el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      } catch (e) {}
    }
  };

  const computeTooltip = (index) => {
    const id = targets[index]?.id;
    const el = refs[id]?.current;
    const margin = 12;
    const w = 360;
    const h = 140;

    if (!el) {
      const fallbackX = Math.min(window.innerWidth - w - margin, Math.max(margin, window.scrollX + window.innerWidth - w - 48));
      const fallbackY = Math.max(margin, window.scrollY + 120 + index * 40);
      setTooltip({ x: fallbackX, y: fallbackY, placement: 'right', visible: true });
      return;
    }

    ensureInViewIfNeeded(el);

    const rect = el.getBoundingClientRect();
    const winW = window.innerWidth;
    const winH = window.innerHeight;

    const rightX = rect.right + margin + window.scrollX;
    const rightY = rect.top + (rect.height - h) / 2 + window.scrollY;
    const leftX = rect.left - w - margin + window.scrollX;
    const leftY = rect.top + (rect.height - h) / 2 + window.scrollY;
    const topX = rect.left + (rect.width - w) / 2 + window.scrollX;
    const topY = rect.top - h - margin + window.scrollY;
    const bottomX = rect.left + (rect.width - w) / 2 + window.scrollX;
    const bottomY = rect.bottom + margin + window.scrollY;

    const fits = (absX, absY) => {
      const relX = absX - window.scrollX;
      const relY = absY - window.scrollY;
      return relX >= margin && relX + w <= (winW - margin) && relY >= margin && relY + h <= (winH - margin);
    };

    let coords = { x: rightX, y: rightY, placement: 'right' };
    if (!fits(rightX, rightY)) {
      if (fits(leftX, leftY)) coords = { x: leftX, y: leftY, placement: 'left' };
      else if (fits(bottomX, bottomY)) coords = { x: bottomX, y: bottomY, placement: 'bottom' };
      else if (fits(topX, topY)) coords = { x: topX, y: topY, placement: 'top' };
      else {
        const clampX = Math.min(Math.max(rightX, margin + window.scrollX), window.scrollX + winW - w - margin);
        const clampY = Math.min(Math.max(rightY, margin + window.scrollY), window.scrollY + winH - h - margin);
        coords = { x: clampX, y: clampY, placement: 'right' };
      }
    }

    const finalX = Math.min(Math.max(coords.x, margin + window.scrollX), window.scrollX + winW - w - margin);
    const finalY = Math.min(Math.max(coords.y, margin + window.scrollY), window.scrollY + winH - h - margin);

    setTimeout(() => setTooltip({ x: finalX, y: finalY, placement: coords.placement, visible: true }), 120);
  };

  // start / end helpers
  const startTour = () => {
    setCompleted(0);
    setTipIndex(0);
    setIsGuided(true);
    setTooltip((t) => ({ ...t, visible: true }));
    setTimeout(() => computeTooltip(0), 100);
  };

  const endTour = () => {
    setIsGuided(false);
    setTooltip((t) => ({ ...t, visible: false }));
    setTipIndex(0);
  };

  useEffect(() => {
    setIsGuided(guided);
    if (guided) {
      setTipIndex(0);
      computeTooltip(0);
    } else {
      setTooltip((t) => ({ ...t, visible: false }));
    }
  }, [guided]);

  useEffect(() => {
    if (!isGuided) return;
    computeTooltip(tipIndex);
    const onResize = () => computeTooltip(tipIndex);
    const onScroll = () => computeTooltip(tipIndex);
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
    };
  }, [tipIndex, isGuided]);

  const handleActionClick = (index) => {
    if (!isGuided) {
      alert(`Open: ${targets[index].title}`);
      return;
    }

    if (index === tipIndex) {
      setCompleted((c) => Math.max(c, index + 1));
      const next = Math.min(targets.length - 1, tipIndex + 1);
      setTipIndex(next);
      computeTooltip(next);

      if (next === targets.length - 1) {
        setTimeout(() => endTour(), 900);
      }
    }
  };

  const nextTip = () => {
    const next = Math.min(targets.length - 1, tipIndex + 1);
    setTipIndex(next);
    computeTooltip(next);
    if (next === targets.length - 1) setTimeout(() => endTour(), 900);
  };

  const skipTour = () => {
    endTour();
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', height: '100vh', width: '100%', bgcolor: '#f6f9ff', overflow: 'hidden' }}>
      <Box
        sx={{
          width: SIDEBAR_WIDTH,
          position: 'fixed',
          left: 0,
          top: 0,
          height: '100vh',
          bgcolor: '#0b1220',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          py: 3,
          px: 2,
          boxShadow: '2px 0 18px rgba(6,10,35,0.06)',
          zIndex: 40,
          boxSizing: 'border-box'
        }}
      >
        <Box sx={{ mb: 2, px: 1 }}>
          <Typography sx={{ fontSize: 22, fontWeight: 900, letterSpacing: 0.3 }}>WorkElate</Typography>
          <Typography sx={{ fontSize: 12, color: '#8fb7ff' }}>Product Suite</Typography>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.04)', mb: 2 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar sx={{ width: 56, height: 56, bgcolor: 'linear-gradient(90deg,#6a11cb,#2575fc)' }}>{(initial.teamName || 'W')[0]}</Avatar>
          <Box>
            <Typography sx={{ fontWeight: 800 }}>Kunal Singh</Typography>
            <Typography sx={{ fontSize: 12, color: '#9aa4b2' }}>Developer</Typography>
          </Box>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.04)', mb: 2 }} />

        <List sx={{ flex: 1, overflow: 'auto', px: 0 }}>
          {[
            { id: 'overview', icon: <DashboardIcon />, label: 'Overview' },
            { id: 'projects', icon: <FolderIcon />, label: 'Projects' },
            { id: 'chat', icon: <ChatIcon />, label: 'Chat' },
            { id: 'team', icon: <PeopleIcon />, label: 'Team' },
            { id: 'apps', icon: <GridViewIcon />, label: 'Apps' }
          ].map((n) => (
            <ListItemButton key={n.id} sx={{ py: 1.25, px: 1.5, borderRadius: 1, '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
              <ListItemIcon sx={{ color: '#93c5fd', minWidth: 36 }}>{n.icon}</ListItemIcon>
              <ListItemText primary={<Typography sx={{ color: '#e6eefb', fontWeight: 700 }}>{n.label}</Typography>} />
            </ListItemButton>
          ))}
        </List>
      </Box>

      <Box sx={{ flex: 1, ml: `${SIDEBAR_WIDTH}px`, p: 4, overflowY: 'auto', maxHeight: '100vh', boxSizing: 'border-box' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 3 }}>
          <Paper sx={{ display: 'flex', alignItems: 'center', px: 1, py: 0.5, borderRadius: 3, width: { xs: '100%', sm: 420, md: 520 }, boxShadow: '0 6px 24px rgba(11,22,55,0.04)' }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search projects, files or AI workflows..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#64748b' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => alert(`Search for: ${query}`)} size="small">
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
                disableUnderline: true
              }}
              variant="standard"
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); alert(`Search for: ${query}`); } }}
              sx={{ background: '#fff', borderRadius: 2, px: 1 }}
            />
          </Paper>

          <Box>
            <Button variant="contained" onClick={() => (isGuided ? startTour() : startTour())} sx={{ textTransform: 'none' }}>
              {isGuided ? 'Restart tour' : 'Start guided tour'}
            </Button>
          </Box>
        </Box>

        <Card ref={refs.aiWorkflow} sx={{ mb: 3, p: 2, display: 'flex', gap: 2, alignItems: 'center', background: 'linear-gradient(90deg,rgba(106,17,203,0.04), rgba(37,117,252,0.02))' }}>
          <Box sx={{ width: 110, height: 86 }}>
            <Lottie animationData={spark} loop={true} style={{ width: '100%', height: '100%' }} />
          </Box>
          <CardContent sx={{ flex: 1, p: 0 }}>
            <Typography sx={{ fontWeight: 800 }}>AI Workflow</Typography>
            <Typography sx={{ color: '#6b7280', mt: 0.5 }}>Automate task routing, insights and summaries with one click.</Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <Button size="small" variant="contained" onClick={() => handleActionClick(0)} sx={{ textTransform: 'none', background: 'linear-gradient(90deg,#ff7a18,#af002d)' }}>Open Workflow</Button>
              <Button size="small" variant="outlined" onClick={() => alert('Configure')} sx={{ textTransform: 'none' }}>Configure</Button>
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
          <Card ref={refs.projects} sx={{ borderRadius: 2, p: 2, background: 'linear-gradient(180deg,#e6f0ff,#ffffff)', boxShadow: '0 10px 30px rgba(6,12,30,0.04)', transition: 'transform .18s ease', '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 20px 40px rgba(6,12,30,0.06)' } }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Projects</Typography>
              <Typography sx={{ color: '#475569', mt: 1 }}>Organize work with projects, tasks and boards.</Typography>

              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button size="small" variant="contained" onClick={() => handleActionClick(1)} sx={{ background: 'linear-gradient(90deg,#4f46e5,#06b6d4)', textTransform: 'none' }}>Open Projects</Button>
                <Button size="small" variant="outlined" onClick={() => alert('New project')}>New Project</Button>
              </Box>
            </CardContent>
          </Card>

          <Card ref={refs.chat} sx={{ borderRadius: 2, p: 2, background: 'linear-gradient(180deg,#fff7ed,#fff)', boxShadow: '0 10px 30px rgba(6,12,30,0.04)', transition: 'transform .18s ease', '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 20px 40px rgba(6,12,30,0.06)' } }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Team Chat</Typography>
              <Typography sx={{ color: '#475569', mt: 1 }}>Collaborate with your team instantly.</Typography>

              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button size="small" variant="contained" onClick={() => handleActionClick(2)} sx={{ background: 'linear-gradient(90deg,#06b6d4,#3b82f6)', textTransform: 'none' }}>Open Chat</Button>
                <Button size="small" variant="outlined" onClick={() => alert('Start call')}>Start Call</Button>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography sx={{ fontWeight: 800, mb: 1 }}>Recent activity</Typography>
          <List sx={{ background: '#fff', borderRadius: 2, boxShadow: '0 8px 24px rgba(11,22,55,0.04)', p: 1 }}>
            {[
              { id: 1, text: 'AI Workflow ran: Summary for Project X', time: '2h ago' },
              { id: 2, text: 'Assigned to Project: Website Redesign', time: 'Yesterday' },
              { id: 3, text: 'New message in #general', time: '2 days ago' },
              { id: 4, text: 'Template created: Sprint plan', time: '3 days ago' }
            ].map((item) => (
              <ListItem key={item.id} sx={{ borderBottom: '1px solid rgba(6,12,30,0.04)' }}>
                <ListItemText primary={<Typography sx={{ fontWeight: 700 }}>{item.text}</Typography>} secondary={<Typography sx={{ fontSize: 12, color: '#64748b' }}>{item.time}</Typography>} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>

      {isGuided && tooltip.visible && (
        <Tooltip
          title={targets[tipIndex].title}
          desc={`${targets[tipIndex].desc} — Please click "${targets[tipIndex].actionLabel}" to continue.`}
          x={tooltip.x}
          y={tooltip.y}
          placement={tooltip.placement}
          onNext={nextTip}
          onSkip={skipTour}
          stepIndex={tipIndex}
          total={targets.length}
          onClose={endTour}
        />
      )}
    </Box>
  );
}
