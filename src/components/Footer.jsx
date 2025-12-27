// src/components/Footer.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Divider, Typography, useMediaQuery } from "@mui/material";
import { motion, useReducedMotion } from "framer-motion";

const ORANGE = "#ff6a00";

const DOWNLOADS = [
  { label: "GRFlex TDS", href: "/GRFlex-TDS.pdf", fileName: "GRFlex-TDS.pdf" },
  { label: "GRFlex MSDS", href: "/GRFlex-MSDS.pdf", fileName: "GRFlex-MSDS.pdf" },
  { label: "Activator MSDS", href: "/GRFlex-Activator-MSDS.pdf", fileName: "GRFlex-Activator-MSDS.pdf" },
  {
    label: "Reinforcement Matting MSDS",
    href: "/GRFlex-Reinforcement-Matting-MSDS.pdf",
    fileName: "GRFlex-Reinforcement-Matting-MSDS.pdf",
  },
];

export default function Footer() {
  const reducedMotion = useReducedMotion();
  useMediaQuery("(min-width:900px)"); // kept (you may use later)

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

  const go = (href) => {
    if (!href) return;
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
      {/* SIMPLE background (no animated layer) */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(900px 520px at 18% 15%, rgba(255,106,0,0.08), rgba(0,0,0,0) 62%)," +
            "radial-gradient(800px 620px at 78% 55%, rgba(255,255,255,0.03), rgba(0,0,0,0) 65%)",
        }}
      />

      {/* Content wrapper */}
      <Box
        sx={{
          width: "min(1280px, 96%)",
          mx: "auto",
          position: "relative",
          zIndex: 2,
          pt: { xs: 6, md: 7 },
          pb: { xs: 3.2, md: 4.0 },
        }}
      >
        {/* Top grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.2fr 0.8fr 1fr" },
            gap: { xs: 2.0, md: 2.4 },
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

            <Box sx={{ lineHeight: 1 }}>
              <Typography sx={{ fontWeight: 950, letterSpacing: "-0.02em", color: ORANGE, fontSize: { xs: 28, md: 30 } }}>
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

            <Typography sx={{ mt: 1.4, color: "rgba(255,255,255,0.70)", lineHeight: 1.8, maxWidth: 520 }}>
              Premium GRP waterproofing system built for speed, durability and seamless detailing.
            </Typography>
          </Box>

          {/* Documents / Downloads block */}
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
            <Typography sx={{ fontWeight: 950, letterSpacing: "-0.02em", color: ORANGE, fontSize: 15.5, mb: 1.3 }}>
              Documents
            </Typography>

            <Box sx={{ display: "grid", gap: 0.7 }}>
              {DOWNLOADS.map((item) => (
                <DownloadLink
                  key={item.href}
                  label={item.label}
                  href={item.href}
                  fileName={item.fileName}
                  reducedMotion={reducedMotion}
                />
              ))}
            </Box>

            <Typography sx={{ mt: 1.2, color: "rgba(255,255,255,0.55)", fontSize: 12.5, lineHeight: 1.6 }}>
              PDFs will download directly from this page.
            </Typography>
          </Box>

          {/* Contact details */}
          <Box
            component={motion.div}
            {...(!reducedMotion ? baseEnter : {})}
            transition={{ duration: reducedMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
            sx={{
              border: "1px solid rgba(255,106,0,0.26)",
              bgcolor: "rgba(255,255,255,0.02)",
              borderRadius: 3,
              p: { xs: 2.2, md: 2.6 },
              boxShadow: "0 40px 120px rgba(0,0,0,0.65)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Typography sx={{ position: "relative", fontWeight: 950, color: ORANGE, letterSpacing: "-0.02em", fontSize: 15.5 }}>
              Contact details
            </Typography>
            <Typography sx={{ position: "relative", mt: 0.8, color: "rgba(255,255,255,0.68)", lineHeight: 1.75 }}>
              Use the form for most enquiries. For urgent technical advice, call us.
            </Typography>

            <Box sx={{ position: "relative", mt: 1.6, display: "grid", gap: 0.9 }}>
              <PillLine label="Technical advice" value="01948 808659" />
              <PillLine label="Email" value="info@grflex.co.uk" />
            </Box>

            <Box sx={{ mt: 1.4, display: "flex", gap: 1.0, flexWrap: "wrap" }}>
              <MiniChip label="Where to buy" onClick={() => go("/find-a-supplier")} reducedMotion={reducedMotion} />
              <MiniChip label="Contact" onClick={() => go("/contact")} reducedMotion={reducedMotion} />
            </Box>
          </Box>
        </Box>

        {/* Bottom bar */}
        <Box sx={{ mt: { xs: 2.6, md: 3.0 } }}>
          <Divider sx={{ borderColor: "rgba(255,255,255,0.10)" }} />

          <Box
            sx={{
              pt: 1.8,
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "flex-start", md: "center" },
              justifyContent: "space-between",
              gap: 1.1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.1, flexWrap: "wrap" }}>
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
              <MiniChip label="Privacy" onClick={() => go("/privacy")} reducedMotion={reducedMotion} />
              <MiniChip label="Terms" onClick={() => go("/terms")} reducedMotion={reducedMotion} />
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
          height: 110,
          pointerEvents: "none",
          background: "linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,0.82))",
          opacity: 0.6,
        }}
      />
    </Box>
  );
}

/* ----------------- Bits ----------------- */

function DownloadLink({ label, href, fileName, reducedMotion }) {
  return (
    <Box
      component={motion.a}
      href={href}
      download={fileName}
      whileHover={reducedMotion ? undefined : { x: 3 }}
      whileTap={reducedMotion ? undefined : { scale: 0.985 }}
      style={{
        width: "100%",
        textAlign: "left",
        background: "transparent",
        border: 0,
        padding: 0,
        cursor: "pointer",
        textDecoration: "none",
      }}
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
            borderColor: "rgba(255,106,0,0.32)",
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
            border: "1px solid rgba(255,106,0,0.30)",
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

function MiniChip({ label, onClick, reducedMotion }) {
  return (
    <Box
      component={motion.button}
      onClick={onClick}
      whileHover={reducedMotion ? undefined : { y: -1 }}
      whileTap={reducedMotion ? undefined : { scale: 0.98 }}
      style={{ background: "transparent", border: 0, padding: 0, cursor: "pointer" }}
    >
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
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
      </Box>
    </Box>
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
