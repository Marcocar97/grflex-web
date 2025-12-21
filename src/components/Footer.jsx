// src/components/Footer.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Divider, Typography, useMediaQuery } from "@mui/material";
import { motion, useReducedMotion } from "framer-motion";

const ORANGE = "#ff6a00";

const NAV = [
  { label: "Why GRFlex", href: "/#why-grflex" },
  { label: "Estimator", href: "/#calculator" },
  { label: "Application Guide", href: "/#application-guide" },
];

export default function Footer() {
  const reducedMotion = useReducedMotion();
  const isMdUp = useMediaQuery("(min-width:900px)");

  const rootRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.18 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const baseEnter = useMemo(() => {
    if (reducedMotion) return {};
    return { initial: { y: 14, opacity: 0 }, animate: { y: 0, opacity: 1 } };
  }, [reducedMotion]);

  const handleNav = (href) => {
    if (!href) return;

    // Always go through absolute paths so it works from any page
    window.location.href = href;
  };

  return (
    <Box
      ref={rootRef}
      component="footer"
      sx={{
        position: "relative",
        bgcolor: "#000",
        color: "#fff",
        overflow: "hidden",
        borderTop: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Ambient / mist */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(900px 520px at 18% 15%, rgba(255,106,0,0.11), rgba(0,0,0,0) 62%)," +
            "radial-gradient(800px 620px at 78% 55%, rgba(255,255,255,0.05), rgba(0,0,0,0) 65%)," +
            "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0) 40%)",
        }}
      />

      {/* Animated “fiber” lines (KEEP) */}
      <FiberLines reducedMotion={reducedMotion} />

      {/* Content wrapper */}
      <Box
        sx={{
          width: "min(1280px, 96%)",
          mx: "auto",
          position: "relative",
          zIndex: 2,
          pt: { xs: 7, md: 8 },
          pb: { xs: 3.5, md: 4.2 },
        }}
      >
        {/* Top grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.2fr 0.8fr 1fr" },
            gap: { xs: 2.2, md: 2.6 },
            alignItems: "start",
          }}
        >
          {/* Brand block */}
          <Box
            component={motion.div}
            {...(!reducedMotion ? baseEnter : {})}
            transition={{ duration: reducedMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.04 }}
            sx={{
              border: "1px solid rgba(255,255,255,0.10)",
              bgcolor: "rgba(255,255,255,0.02)",
              borderRadius: 3,
              p: { xs: 2.2, md: 2.6 },
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 40px 120px rgba(0,0,0,0.65)",
            }}
          >
            <GlowSheen reducedMotion={reducedMotion} />

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.4 }}>

              <Box sx={{ lineHeight: 1 }}>
                <Typography sx={{ fontWeight: 950, letterSpacing: "-0.02em", fontSize: { xs: 28, md: 30 } }}>
                  GRFlex
                </Typography>
                <Typography
                  sx={{
                    mt: 0.4,
                    fontSize: 12,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.62)",
                    whiteSpace: "nowrap",
                  }}
                >
                  Fully Flexible Fibre Glass
                </Typography>
              </Box>
            </Box>

            <Typography sx={{ mt: 1.6, color: "rgba(255,255,255,0.70)", lineHeight: 1.8, maxWidth: 520 }}>
              Premium PMMA waterproofing system built for speed, durability and clean detailing. If you need help
              choosing a specification or finding a supplier, we’ll point you in the right direction.
            </Typography>

          </Box>

          {/* Nav block (Quick tip REMOVED) */}
          <Box
            component={motion.div}
            {...(!reducedMotion ? baseEnter : {})}
            transition={{ duration: reducedMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
            sx={{
              border: "1px solid rgba(255,255,255,0.10)",
              bgcolor: "rgba(255,255,255,0.02)",
              borderRadius: 3,
              p: { xs: 2.2, md: 2.6 },
              boxShadow: "0 40px 120px rgba(0,0,0,0.65)",
            }}
          >
            <Typography sx={{ fontWeight: 950, letterSpacing: "-0.02em", fontSize: 15.5, mb: 1.3 }}>
              Navigation
            </Typography>

            <Box sx={{ display: "grid", gap: 0.7 }}>
              {NAV.map((item) => (
                <FooterLink
                  key={item.href}
                  label={item.label}
                  onClick={() => handleNav(item.href)}
                  reducedMotion={reducedMotion}
                />
              ))}
            </Box>
          </Box>

          {/* Third column: Contact details ONLY (replaces Send a message) */}
          <Box
            component={motion.div}
            {...(!reducedMotion ? baseEnter : {})}
            transition={{ duration: reducedMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
            sx={{
              border: "1px solid rgba(255,106,0,0.30)",
              bgcolor: "rgba(255,255,255,0.02)",
              borderRadius: 3,
              p: { xs: 2.2, md: 2.6 },
              boxShadow: "0 40px 120px rgba(0,0,0,0.65)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: -60,
                pointerEvents: "none",
                background:
                  "radial-gradient(520px 220px at 20% 18%, rgba(255,106,0,0.16), rgba(0,0,0,0) 60%)," +
                  "radial-gradient(520px 240px at 80% 70%, rgba(255,255,255,0.05), rgba(0,0,0,0) 62%)",
                filter: "blur(18px)",
                opacity: 0.9,
              }}
            />

            <Typography sx={{ position: "relative", fontWeight: 950, letterSpacing: "-0.02em", fontSize: 15.5 }}>
              Contact details
            </Typography>
            <Typography sx={{ position: "relative", mt: 0.8, color: "rgba(255,255,255,0.68)", lineHeight: 1.75 }}>
              Use the form for most enquiries. For urgent technical advice, call us.
            </Typography>

            <Box sx={{ position: "relative", mt: 1.6, display: "grid", gap: 0.9 }}>
              <PillLine label="Technical advice" value="01948 808659" />
              <PillLine label="Email" value="info@grflex.co.uk" />
            </Box>
          </Box>
        </Box>

        {/* Bottom bar */}
        <Box sx={{ mt: { xs: 3.0, md: 3.2 } }}>
          <Divider sx={{ borderColor: "rgba(255,255,255,0.10)" }} />

          <Box
            sx={{
              pt: 2.0,
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "flex-start", md: "center" },
              justifyContent: "space-between",
              gap: 1.2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, flexWrap: "wrap" }}>
              <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: 13.5 }}>
                © {new Date().getFullYear()} GRFlex. All rights reserved.
              </Typography>

              <Dot />

              <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: 13.5, lineHeight: 1.7 }}>
                For technical advice call{" "}
                <Box component="span" sx={{ color: "rgba(255,255,255,0.82)", fontWeight: 800 }}>
                  01948 808659
                </Box>
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.0, flexWrap: "wrap" }}>
              <MiniChip label="Privacy" onClick={() => handleNav("/privacy")} reducedMotion={reducedMotion} />
              <MiniChip label="Terms" onClick={() => handleNav("/terms")} reducedMotion={reducedMotion} />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Edge fade */}
      <Box
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 120,
          pointerEvents: "none",
          background: "linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,0.85))",
          opacity: 0.6,
        }}
      />
    </Box>
  );
}

/* ----------------- Bits ----------------- */

function FooterLink({ label, onClick, reducedMotion }) {
  return (
    <Box
      component={motion.button}
      onClick={onClick}
      whileHover={reducedMotion ? undefined : { x: 3 }}
      whileTap={reducedMotion ? undefined : { scale: 0.985 }}
      style={{ width: "100%", textAlign: "left", background: "transparent", border: 0, padding: 0, cursor: "pointer" }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.2,
          borderRadius: 2.2,
          px: 1.2,
          py: 1.05,
          border: "1px solid rgba(255,255,255,0.10)",
          bgcolor: "rgba(255,255,255,0.015)",
          "&:hover": {
            bgcolor: "rgba(255,255,255,0.035)",
            borderColor: "rgba(255,106,0,0.35)",
          },
        }}
      >
        <Typography sx={{ fontWeight: 800, color: "rgba(255,255,255,0.82)", letterSpacing: "-0.01em" }}>
          {label}
        </Typography>

        <Box
          sx={{
            width: 26,
            height: 26,
            borderRadius: 999,
            border: "1px solid rgba(255,106,0,0.35)",
            bgcolor: "rgba(0,0,0,0.22)",
            display: "grid",
            placeItems: "center",
            flex: "0 0 auto",
          }}
        >
          <ArrowMini />
        </Box>
      </Box>
    </Box>
  );
}

function ActionPill({ text, onClick, reducedMotion }) {
  return (
    <Button
      onClick={onClick}
      component={motion.button}
      whileHover={reducedMotion ? undefined : { scale: 1.02 }}
      whileTap={reducedMotion ? undefined : { scale: 0.985 }}
      variant="outlined"
      sx={{
        borderRadius: 999,
        textTransform: "none",
        px: 2.0,
        py: 0.95,
        color: "rgba(255,255,255,0.86)",
        borderColor: "rgba(255,255,255,0.18)",
        bgcolor: "rgba(255,255,255,0.02)",
        "&:hover": { borderColor: "rgba(255,106,0,0.55)", bgcolor: "rgba(255,255,255,0.04)" },
      }}
    >
      {text}
    </Button>
  );
}

function PillLine({ label, value }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        gap: 2,
        border: "1px solid rgba(255,255,255,0.10)",
        bgcolor: "rgba(0,0,0,0.16)",
        borderRadius: 2.4,
        px: 1.2,
        py: 0.95,
      }}
    >
      <Typography
        sx={{
          color: "rgba(255,255,255,0.55)",
          fontSize: 12,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </Typography>
      <Typography sx={{ color: "rgba(255,255,255,0.86)", fontWeight: 900, textAlign: "right" }}>{value}</Typography>
    </Box>
  );
}

function MicroMeta({ left, right }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.2 }}>
      <Typography sx={{ color: "rgba(255,255,255,0.50)", fontSize: 13.0 }}>{left}</Typography>
      <Typography sx={{ color: "rgba(255,255,255,0.50)", fontSize: 13.0 }}>{right}</Typography>
    </Box>
  );
}

function MiniChip({ label, onClick, reducedMotion }) {
  return (
    <Button
      onClick={onClick}
      component={motion.button}
      whileHover={reducedMotion ? undefined : { y: -1 }}
      whileTap={reducedMotion ? undefined : { scale: 0.98 }}
      variant="text"
      sx={{
        textTransform: "none",
        fontWeight: 800,
        color: "rgba(255,255,255,0.65)",
        px: 1.2,
        py: 0.7,
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.10)",
        bgcolor: "rgba(255,255,255,0.02)",
        "&:hover": { bgcolor: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.80)" },
      }}
    >
      {label}
    </Button>
  );
}

function Dot() {
  return <Box sx={{ width: 5, height: 5, borderRadius: 999, bgcolor: "rgba(255,255,255,0.25)" }} />;
}

function ArrowMini() {
  return (
    <Box
      sx={{
        width: 10,
        height: 10,
        borderRight: "2px solid rgba(255,255,255,0.75)",
        borderTop: "2px solid rgba(255,255,255,0.75)",
        transform: "rotate(45deg)",
        mr: 0.2,
      }}
    />
  );
}

function GlowSheen({ reducedMotion }) {
  return (
    <Box
      component={motion.div}
      animate={
        reducedMotion
          ? {}
          : {
              x: ["-30%", "130%"],
              opacity: [0, 0.9, 0],
            }
      }
      transition={reducedMotion ? {} : { duration: 4.6, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.6 }}
      sx={{
        position: "absolute",
        top: -40,
        bottom: -40,
        width: 200,
        background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.10), rgba(255,255,255,0))",
        filter: "blur(1px)",
        transform: "rotate(12deg)",
        pointerEvents: "none",
        opacity: 0,
      }}
    />
  );
}

function FiberLines({ reducedMotion }) {
  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        opacity: 0.85,
      }}
    >
      <Box
        component={motion.div}
        animate={
          reducedMotion
            ? {}
            : {
                x: [0, 18, 0, -12, 0],
                y: [0, -8, 0, 10, 0],
              }
        }
        transition={reducedMotion ? {} : { duration: 14, repeat: Infinity, ease: "easeInOut" }}
        sx={{
          position: "absolute",
          inset: -120,
          filter: "blur(20px)",
          opacity: 0.8,
          background:
            "linear-gradient(110deg, rgba(255,106,0,0) 0%, rgba(255,106,0,0.18) 16%, rgba(255,255,255,0.06) 38%, rgba(255,106,0,0.10) 60%, rgba(255,106,0,0) 78%)",
          maskImage: "repeating-linear-gradient(90deg, rgba(0,0,0,0) 0 10px, rgba(0,0,0,1) 10px 11px)",
          WebkitMaskImage: "repeating-linear-gradient(90deg, rgba(0,0,0,0) 0 10px, rgba(0,0,0,1) 10px 11px)",
        }}
      />

      <Box
        component={motion.div}
        animate={reducedMotion ? {} : { rotate: [0, 2.6, 0, -2.2, 0], opacity: [0.35, 0.55, 0.35] }}
        transition={reducedMotion ? {} : { duration: 10.5, repeat: Infinity, ease: "easeInOut" }}
        sx={{
          position: "absolute",
          left: "-20%",
          right: "-20%",
          top: "22%",
          height: 2,
          background: "linear-gradient(90deg, rgba(255,106,0,0), rgba(255,106,0,0.85), rgba(255,106,0,0))",
          opacity: 0.35,
          filter: "blur(0.2px)",
        }}
      />

      <Box
        component={motion.div}
        animate={reducedMotion ? {} : { x: ["-10%", "110%"], opacity: [0, 0.55, 0] }}
        transition={reducedMotion ? {} : { duration: 7.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 2.2 }}
        sx={{
          position: "absolute",
          top: "64%",
          width: "38%",
          height: 1,
          background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.28), rgba(255,255,255,0))",
          filter: "blur(0.5px)",
          opacity: 0,
        }}
      />
    </Box>
  );
}
