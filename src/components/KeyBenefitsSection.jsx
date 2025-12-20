import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Container, Typography, useMediaQuery } from "@mui/material";

const ORANGE = "#ff6a00";

const KeyBenefitsSection = () => {
  const rootRef = useRef(null);
  const [inView, setInView] = useState(false);

  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const isMdUp = useMediaQuery("(min-width:900px)");

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.25 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const baseCardSx = useMemo(
    () => ({
      position: "relative",
      borderRadius: 3,
      overflow: "hidden",

      // Orange contour (base)
      border: `1px solid rgba(255,106,0,0.45)`,

      bgcolor: "rgba(255,255,255,0.02)",
      backdropFilter: "blur(6px)",
      p: { xs: 3, sm: 4, md: 4.5 },
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: { xs: 2, md: 2.5 },
      minHeight: { xs: 180, sm: 200, md: 220 },

      transition: prefersReducedMotion
        ? "none"
        : "transform .25s ease, box-shadow .25s ease, border-color .25s ease",
      boxShadow: "0 0 0 rgba(0,0,0,0)",

      "&:hover": prefersReducedMotion
        ? {}
        : {
            transform: "translateY(-4px)",
            boxShadow: "0 16px 40px rgba(0,0,0,0.45)",
            borderColor: "rgba(255,106,0,0.75)",
          },

      // Subtle rotating border effect
      "&::before": prefersReducedMotion
        ? { content: '""', display: "none" }
        : {
            content: '""',
            position: "absolute",
            inset: -2,
            borderRadius: "inherit",
            padding: "1px", // thickness of the animated contour
            background:
              "conic-gradient(from 0deg, rgba(255,106,0,0.05), rgba(255,106,0,0.55), rgba(255,106,0,0.05))",
            WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            opacity: inView ? 0.9 : 0,
            transition: "opacity 600ms ease",
            animation: inView ? "grflexBorderSpin 14s linear infinite" : "none", // slower & smooth
            pointerEvents: "none",
          },

      ...(prefersReducedMotion
        ? {}
        : {
            "@keyframes grflexBorderSpin": {
              "0%": { transform: "rotate(0deg)" },
              "100%": { transform: "rotate(360deg)" },
            },
          }),
    }),
    [prefersReducedMotion, inView]
  );

  const revealSx = (delayMs) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(12px)",
    transition: prefersReducedMotion
      ? "none"
      : `opacity 600ms ease ${delayMs}ms, transform 600ms ease ${delayMs}ms`,
  });

  const titleSx = {
    color: "#fff",
    textAlign: "center",
    fontWeight: 700,
    letterSpacing: "0.2px",
    fontSize: { xs: "1.125rem", sm: "1.125rem", md: "1.25rem" }, // 18 / 18 / 20
    lineHeight: 1.3,
  };

  const iconBoxSx = { width: { xs: 52, sm: 56 }, height: { xs: 52, sm: 56 } };

  return (
    <Box
      ref={rootRef}
      id="benefits"
      component="section"
      sx={{
        bgcolor: "#000",
        pt: { xs: 4, md: 6 }, // removed top
        pb: { xs: 4, md: 10 },  // ⬅️ padding SOLO abajo
      }}
    >
      <Container maxWidth={false} disableGutters sx={{ px: { xs: 2, sm: 3, md: 6 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "repeat(4, 1fr)",
            },
            gap: { xs: 2, sm: 3, md: 4 },
            alignItems: "stretch",
          }}
        >
          {/* 1 - Cures within an hour */}
          <Box
            sx={{
              ...baseCardSx,
              ...revealSx(80),
              "&:hover .clockHand": prefersReducedMotion
                ? {}
                : {
                    transform: "rotate(140deg)",
                    transition: "transform 650ms cubic-bezier(.2,.9,.2,1)",
                  },
              "& .clockHand": prefersReducedMotion
                ? {}
                : {
                    transformOrigin: "50px 50px",
                    transition: "transform 650ms cubic-bezier(.2,.9,.2,1)",
                  },
            }}
          >
            <ClockIcon animate={inView && !prefersReducedMotion} boxSx={iconBoxSx} />
            <Typography sx={titleSx}>Cures within an hour</Typography>
          </Box>

          {/* 2 - 20 year guarantee */}
          <Box
            sx={{
              ...baseCardSx,
              ...revealSx(160),
              "&:hover .shieldPulse": prefersReducedMotion
                ? {}
                : {
                    opacity: 1,
                    transform: "scale(1.15)",
                    transition: "opacity 400ms ease, transform 600ms ease",
                  },
              "& .shieldPulse": prefersReducedMotion
                ? {}
                : {
                    opacity: 0,
                    transform: "scale(0.9)",
                    transition: "opacity 400ms ease, transform 600ms ease",
                  },
            }}
          >
            <Box
              className="shieldPulse"
              sx={{
                position: "absolute",
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: `radial-gradient(circle, rgba(255,106,0,0.18) 0%, rgba(255,106,0,0) 65%)`,
                pointerEvents: "none",
              }}
            />
            <ShieldIcon animate={inView && !prefersReducedMotion} boxSx={iconBoxSx} />
            <Typography sx={titleSx}>20 year guarantee</Typography>
          </Box>

          {/* 3 - Cures down to -5°C */}
          <Box
            sx={{
              ...baseCardSx,
              ...revealSx(240),
              "&:hover .coldGlow": prefersReducedMotion
                ? {}
                : {
                    opacity: 1,
                    filter: "blur(8px)",
                    transition: "opacity 350ms ease, filter 350ms ease",
                  },
              "& .coldGlow": prefersReducedMotion
                ? {}
                : {
                    opacity: 0,
                    filter: "blur(14px)",
                    transition: "opacity 350ms ease, filter 350ms ease",
                  },
            }}
          >
            <Box
              className="coldGlow"
              sx={{
                position: "absolute",
                width: 140,
                height: 140,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(70,165,255,0.22) 0%, rgba(70,165,255,0) 65%)",
                pointerEvents: "none",
              }}
            />
            <ThermoIcon animate={inView && !prefersReducedMotion} boxSx={iconBoxSx} />
            <Typography sx={titleSx}>Cures down to -5°C</Typography>
          </Box>

          {/* 4 - No primer required */}
          <Box
            sx={{
              ...baseCardSx,
              ...revealSx(320),
              "&:hover": prefersReducedMotion
                ? {}
                : {
                    transform: "translateY(-6px)",
                    boxShadow: "0 18px 46px rgba(0,0,0,0.5)",
                    borderColor: "rgba(255,106,0,0.8)",
                  },
            }}
          >
            <NoPrimerIcon animate={inView && !prefersReducedMotion} boxSx={iconBoxSx} />
            <Typography sx={titleSx}>No primer required</Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default KeyBenefitsSection;

/* ---------------- ICONS ---------------- */

function ClockIcon({ animate, boxSx }) {
  const dash = 240;
  return (
    <Box sx={boxSx}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
        <circle
          cx="50"
          cy="50"
          r="38"
          stroke={ORANGE}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={dash}
          strokeDashoffset={animate ? 0 : dash}
          style={{
            transition: animate ? "stroke-dashoffset 1000ms ease" : "none",
          }}
        />
        <line className="clockHand" x1="50" y1="50" x2="50" y2="28" stroke={ORANGE} strokeWidth="2" strokeLinecap="round" />
      </svg>
    </Box>
  );
}

function ShieldIcon({ animate, boxSx }) {
  const dash = 320;
  const checkDash = 42;
  return (
    <Box sx={boxSx}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
        <path
          d="M50 12 L80 24 V50 C80 68 50 86 50 86 C50 86 20 68 20 50 V24 Z"
          stroke={ORANGE}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={dash}
          strokeDashoffset={animate ? 0 : dash}
          style={{ transition: animate ? "stroke-dashoffset 1000ms ease" : "none" }}
        />
        <polyline
          points="42,52 48,58 60,44"
          stroke={ORANGE}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={checkDash}
          strokeDashoffset={animate ? 0 : checkDash}
          style={{ transition: animate ? "stroke-dashoffset 600ms ease 500ms" : "none" }}
        />
      </svg>
    </Box>
  );
}

function ThermoIcon({ animate, boxSx }) {
  const dash = 30;
  return (
    <Box sx={boxSx}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
        <line x1="50" y1="18" x2="50" y2="62" stroke={ORANGE} strokeWidth="2" strokeLinecap="round" />
        <circle cx="50" cy="72" r="10" stroke={ORANGE} strokeWidth="2" />
        <line
          x1="50"
          y1="62"
          x2="50"
          y2="38"
          stroke={ORANGE}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={dash}
          strokeDashoffset={animate ? 0 : dash}
          style={{ transition: animate ? "stroke-dashoffset 800ms ease" : "none" }}
        />
      </svg>
    </Box>
  );
}

function NoPrimerIcon({ animate, boxSx }) {
  const dash = 60;
  return (
    <Box sx={boxSx}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
        <rect x="28" y="28" width="44" height="44" rx="4" stroke={ORANGE} strokeWidth="2" />
        <line
          x1="30"
          y1="70"
          x2="70"
          y2="30"
          stroke={ORANGE}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={dash}
          strokeDashoffset={animate ? 0 : dash}
          style={{ transition: animate ? "stroke-dashoffset 800ms ease" : "none" }}
        />
      </svg>
    </Box>
  );
}
