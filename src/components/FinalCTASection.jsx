import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import { motion } from "framer-motion";

const ORANGE = "#ff6a00";

const useReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setReduced(mq.matches);
    handler();
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);
  return reduced;
};

export default function FinalCTASection() {
  useMediaQuery("(min-width:900px)"); // kept (you may use later)
  const reducedMotion = useReducedMotion();

  // Put your tin image in /public as: /grflex-tin.png
  // If you already have a different filename, just change TIN_SRC.
  const TIN_SRC = "/grflex-tin.png";

  const actions = useMemo(
    () => [
      {
        label: "Get GRFLEX",
        href: "/contact", // change if you have a shop page
        variant: "primary",
        note: "Enquire or buy",
      },
      {
        label: "Contact",
        href: "/contact",
        variant: "secondary",
        note: "Ask a question",
      },
      {
        label: "Find distributor",
        href: "/distributors",
        variant: "secondary",
        note: "Where to get it",
      },
      {
        label: "Become installer",
        href: "/become-installer",
        variant: "secondary",
        note: "Join the network",
      },
    ],
    []
  );

  return (
    <Box
      id="final-cta"
      component="section"
      sx={{
        position: "relative",
        bgcolor: "#000",
        color: "#fff",
        overflow: "hidden",
        py: { xs: 8, sm: 10, md: 6 },
      }}
    >
      {/* Background (quiet, premium) */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(900px 520px at 20% 25%, rgba(255,106,0,0.10), rgba(0,0,0,0) 60%), radial-gradient(1100px 700px at 85% 65%, rgba(255,255,255,0.035), rgba(0,0,0,0) 65%)",
          pointerEvents: "none",
        }}
      />

      {/* Subtle grain */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          opacity: 0.06,
          pointerEvents: "none",
          backgroundImage:
            "radial-gradient(circle at 20% 25%, rgba(255,255,255,0.15) 0 1px, transparent 1px), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.10) 0 1px, transparent 1px)",
          backgroundSize: "140px 140px",
        }}
      />

      {/* Inner */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          width: "min(1280px, 92%)",
          mx: "auto",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.05fr 0.95fr" },
          alignItems: "center",
          gap: { xs: 4, md: 6 },
        }}
      >
        {/* Left: headline + CTAs */}
        <Box sx={{ maxWidth: 620 }}>
          {/* Section label (like your other sections) */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.6, mb: { xs: 1.25, md: 1.5 } }}>
            <Box sx={{ width: 10, height: 10, border: `1px solid ${ORANGE}`, opacity: 0.9 }} />
            <Typography
              sx={{
                color: ORANGE,
                textTransform: "uppercase",
                fontWeight: 700,
                letterSpacing: { xs: "0.18em", md: "0.22em" },
                fontSize: { xs: 12, sm: 13, md: 13 },
                opacity: 0.95,
                whiteSpace: "nowrap",
              }}
            >
              NEXT STEP
            </Typography>
          </Box>

          <Typography
            sx={{
              fontSize: { xs: "clamp(32px, 6.6vw, 46px)", md: "clamp(40px, 3.6vw, 56px)" },
              lineHeight: 1.05,
              fontWeight: 900,
              letterSpacing: "-0.03em",
              mb: { xs: 1.25, md: 1.5 },
            }}
          >
            Ready for your next project?
          </Typography>

          <Typography
            sx={{
              color: "rgba(255,255,255,0.76)",
              fontSize: { xs: 16, sm: 17, md: 18 },
              lineHeight: 1.75,
              maxWidth: 54 * 10,
              mb: { xs: 2.5, md: 3 },
            }}
          >
            Choose the next step that fits you. GRFLEX is built for clean, controlled application and long-term performance.
          </Typography>

          {/* CTAs */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: { xs: 1.2, md: 1.4 },
              alignItems: "stretch",
              mb: { xs: 2.25, md: 2.6 },
            }}
          >
            {actions.map((a) => (
              <CtaButton
                key={a.label}
                label={a.label}
                note={a.note}
                href={a.href}
                variant={a.variant}
                reducedMotion={reducedMotion}
              />
            ))}
          </Box>

          <Typography sx={{ fontSize: 12.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>
            If you’re not sure which route is best, choose Contact and we’ll point you in the right direction.
          </Typography>
        </Box>

        {/* Right: Tin hero */}
        <Box
          sx={{
            position: "relative",
            height: { xs: 360, sm: 420, md: 520 },
            borderRadius: 3,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.10)",
            bgcolor: "rgba(255,255,255,0.02)",
            boxShadow: "0 40px 120px rgba(0,0,0,0.65)",
          }}
        >
          {/* Lighting */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "radial-gradient(520px 380px at 45% 30%, rgba(255,106,0,0.18), rgba(0,0,0,0) 60%), radial-gradient(640px 420px at 65% 70%, rgba(255,255,255,0.06), rgba(0,0,0,0) 65%)",
            }}
          />

          {/* Frame inset */}
          <Box
            sx={{
              position: "absolute",
              inset: 18,
              borderRadius: 2.5,
              border: "1px solid rgba(255,255,255,0.10)",
              pointerEvents: "none",
            }}
          />

          {/* Tin */}
          <Box
            component={motion.div}
            aria-hidden
            animate={
              reducedMotion
                ? {}
                : {
                    y: [0, -2, 0],
                    rotate: [-0.35, 0.35, -0.35],
                  }
            }
            transition={
              reducedMotion
                ? { duration: 0 }
                : { duration: 4.6, ease: [0.22, 1, 0.36, 1], repeat: Infinity }
            }
            sx={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              pointerEvents: "none",
            }}
          >
            <Box
              component="img"
              src="/TIN2.png"
              alt="GRFLEX tin"
              draggable={false}
              sx={{
                width: { xs: "78%", sm: "72%", md: "68%" },
                maxWidth: 420,
                height: "auto",
                filter: "drop-shadow(0 26px 70px rgba(0,0,0,0.70))",
                userSelect: "none",
              }}
              onError={(e) => {
                // If image missing, show nothing (silent), so the section still looks clean
                e.currentTarget.style.display = "none";
              }}
            />
          </Box>

          {/* Quiet caption */}
          <Box
            sx={{
              position: "absolute",
              left: 18,
              right: 18,
              bottom: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Typography sx={{ fontSize: 12.5, color: "rgba(255,255,255,0.60)", letterSpacing: "0.02em" }}>
              GRFLEX Waterproof
            </Typography>
            <Box sx={{ width: 10, height: 10, border: `1px solid ${ORANGE}`, opacity: 0.9 }} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function CtaButton({ label, note, href, variant, reducedMotion }) {
  const isPrimary = variant === "primary";

  return (
    <Box
      component="a"
      href={href}
      sx={{
        textDecoration: "none",
        borderRadius: 2.4,
        border: isPrimary ? `1px solid rgba(255,106,0,0.65)` : "1px solid rgba(255,255,255,0.14)",
        bgcolor: isPrimary ? "rgba(255,106,0,0.92)" : "rgba(255,255,255,0.02)",
        color: isPrimary ? "#000" : "#fff",
        px: { xs: 2.1, md: 2.3 },
        py: { xs: 1.55, md: 1.7 },
        display: "flex",
        flexDirection: "column",
        gap: 0.45,
        boxShadow: isPrimary ? "0 24px 70px rgba(255,106,0,0.20)" : "0 24px 70px rgba(0,0,0,0.55)",
        outline: "none",
        transition: reducedMotion
          ? "none"
          : "transform 160ms ease, border-color 160ms ease, background-color 160ms ease, box-shadow 160ms ease",
        "&:hover": {
          transform: reducedMotion ? "none" : "translateY(-2px)",
          borderColor: isPrimary ? "rgba(255,106,0,0.95)" : "rgba(255,255,255,0.24)",
          bgcolor: isPrimary ? "rgba(255,106,0,1)" : "rgba(255,255,255,0.03)",
          boxShadow: isPrimary ? "0 28px 90px rgba(255,106,0,0.22)" : "0 28px 90px rgba(0,0,0,0.62)",
        },
        "&:focus-visible": {
          boxShadow: isPrimary
            ? "0 0 0 3px rgba(0,0,0,0.25), 0 0 0 6px rgba(255,106,0,0.50)"
            : "0 0 0 3px rgba(0,0,0,0.25), 0 0 0 6px rgba(255,255,255,0.18)",
        },
        "&:active": {
          transform: reducedMotion ? "none" : "translateY(0px)",
        },
      }}
    >
      <Typography
        sx={{
          fontWeight: 900,
          letterSpacing: "-0.01em",
          fontSize: { xs: 15.5, md: 16 },
          lineHeight: 1.15,
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          fontSize: 12.5,
          color: isPrimary ? "rgba(0,0,0,0.70)" : "rgba(255,255,255,0.62)",
          lineHeight: 1.35,
        }}
      >
        {note}
      </Typography>
    </Box>
  );
}
