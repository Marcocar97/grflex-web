import React, { useMemo } from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import { motion, useReducedMotion } from "framer-motion";

const ORANGE = "#ff6a00";

export default function ApplicationsSection() {
  const isMdUp = useMediaQuery("(min-width:900px)");
  const reduceMotion = useReducedMotion();

  // ORDER: New Roofs, Overlays, Balconies, Gutters
  const items = useMemo(
    () => [
      {
        key: "roofs",
        title: "New Roofs",
        subline: "Continuous protection across large roof areas.",
        img: "/roof.png",
      },
      {
        key: "overlays",
        title: "Overlays",
        subline: "Upgrade existing surfaces without starting again.",
        img: "/overlay.png",
      },
      {
        key: "balconies",
        title: "Balconies",
        subline: "Clean transitions at edges, corners and upstands.",
        img: "/balcony.png",
      },
      {
        key: "gutters",
        title: "Gutters",
        subline: "Adapts to complex shapes without weak points.",
        img: "/gutter.png",
      },
    ],
    []
  );

  return (
    <Box
      id="applications"
      component="section"
      sx={{
        position: "relative",
        bgcolor: "#000",
        color: "#fff",
        // full-screen section so the 2×2 grid fits without scrolling
        minHeight: { xs: "auto", md: "100svh" },
        display: { xs: "block", md: "flex" },
        alignItems: { md: "center" },
        py: { xs: 7, sm: 8, md: 8 },
        overflow: "hidden",
      }}
    >
      {/* Background */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(900px 520px at 15% 30%, rgba(255,106,0,0.10), rgba(0,0,0,0) 60%), radial-gradient(1000px 700px at 85% 65%, rgba(255,255,255,0.04), rgba(0,0,0,0) 65%)",
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          width: "min(1280px, 96%)",
          mx: "auto",
          position: "relative",
          zIndex: 2,
          // keep everything inside the viewport on desktop
          height: { md: "calc(100svh - 64px)" },
          display: "flex",
          flexDirection: "column",
          justifyContent: { md: "center" },
        }}
      >
        {/* Header (compact on desktop so grid fits) */}
        <Box sx={{ mb: { xs: 3, md: 2.2 } }}>
           <Box sx={{ display: "flex", alignItems: "center", gap: 1.6 }}>
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
                        APPLICATIONS
                      </Typography>
                    </Box>

          <Typography
            sx={{
              fontSize: {
                xs: "clamp(30px, 7vw, 40px)",
                sm: "clamp(34px, 5.8vw, 46px)",
                md: "clamp(34px, 3.2vw, 44px)",
              },
              lineHeight: 1.06,
              fontWeight: 900,
              letterSpacing: "-0.03em",
              mb: { xs: 1.2, md: 0.9 },
            }}
          >
            GRFIex is designed to be used on
          </Typography>

          <Typography
            sx={{
              color: "rgba(255,255,255,0.78)",
              fontSize: { xs: 15, sm: 16, md: 15 },
              lineHeight: 1.7,
              maxWidth: 820,
              display: { xs: "block", md: "none" }, // hide on desktop to guarantee no scroll
            }}
          >
            A visual gallery of real use cases, designed to feel clean, technical and instantly understandable.
          </Typography>
        </Box>

        {/* Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr" },
            gap: { xs: 1.6, sm: 2, md: 2 },
            // desktop: ensure the grid never exceeds viewport
            alignContent: { md: "stretch" },
          }}
        >
          {items.map((item, idx) => (
            <ApplicationCard
              key={item.key}
              item={item}
              index={idx}
              reduceMotion={!!reduceMotion}
              isMdUp={isMdUp}
              compact={true}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

function ApplicationCard({ item, index, reduceMotion, isMdUp, compact }) {
  const delay = 0.08 * index;

  return (
    <Box
      component={motion.div}
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={reduceMotion ? {} : { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
      sx={{
        position: "relative",
        borderRadius: 3,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.10)",
        bgcolor: "rgba(255,255,255,0.02)",
        backdropFilter: "blur(8px)",
        boxShadow: "0 40px 120px rgba(0,0,0,0.55)",
        transition: "transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease",
        "&:hover": {
          transform: "translateY(-4px)",
          borderColor: "rgba(255,106,0,0.55)",
          boxShadow: "0 55px 140px rgba(0,0,0,0.65)",
        },
        "&:focus-within": { borderColor: "rgba(255,106,0,0.65)" },
        "&:hover .subline, &:focus-within .subline": {
          opacity: 1,
          transform: "translateY(0)",
        },
        "&:hover .shine": {
          opacity: 1,
          transform: "translateX(18%)",
        },
      }}
      tabIndex={0}
      role="group"
      aria-label={item.title}
    >
      {/* Glow */}
      <Box
        sx={{
          position: "absolute",
          inset: -1,
          background:
            "radial-gradient(700px 260px at 18% 18%, rgba(255,106,0,0.16), rgba(0,0,0,0) 55%), radial-gradient(700px 260px at 88% 82%, rgba(255,255,255,0.06), rgba(0,0,0,0) 60%)",
          pointerEvents: "none",
          opacity: 0.9,
        }}
      />

      {/* Shine */}
      <Box
        className="shine"
        sx={{
          position: "absolute",
          top: "-25%",
          left: "-40%",
          width: "55%",
          height: "160%",
          background:
            "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.06), rgba(255,255,255,0))",
          transform: "translateX(0%) rotate(12deg)",
          opacity: 0,
          transition: "opacity 260ms ease, transform 650ms cubic-bezier(.2,.9,.2,1)",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <Box sx={{ position: "relative", zIndex: 2 }}>
        {/* Visual */}
        <Box
          sx={{
            position: "relative",
            height: compact
              ? { xs: 190, sm: 200, md: 190, lg: 200 }
              : { xs: 200, sm: 220, md: 240 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 3,
            pt: 2,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 14,
              borderRadius: 2.5,
              border: "1px solid rgba(255,255,255,0.10)",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))",
            }}
          />

          <Box
            component="img"
            src={item.img}
            alt={item.title}
            loading="lazy"
            sx={{
              position: "relative",
              zIndex: 2,
              width: "min(420px, 82%)",
              height: "auto",
              maxHeight: compact
                ? { xs: 140, sm: 145, md: 140, lg: 150 }
                : { xs: 150, sm: 165, md: 175 },
              objectFit: "contain",
              filter: "drop-shadow(0 18px 55px rgba(0,0,0,0.55))",
              opacity: 0.98,
              transform: isMdUp ? "translateY(2px)" : "none",
            }}
          />
        </Box>

        {/* Text */}
        <Box
          sx={{
            px: { xs: 2.5, sm: 3, md: 3 },
            pb: { xs: 2.2, sm: 2.4, md: 2.4 },
            pt: { xs: 1.6, sm: 1.8, md: 1.8 },
            borderTop: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontWeight: 900,
                letterSpacing: "-0.02em",
                fontSize: { xs: 18, sm: 19, md: 18 },
                lineHeight: 1.15,
                color: "rgba(255,255,255,0.94)",
              }}
            >
              {item.title}
            </Typography>

            <Typography
              className="subline"
              sx={{
                mt: 0.75,
                fontSize: { xs: 13.5, sm: 14, md: 13.5 },
                lineHeight: 1.55,
                color: "rgba(255,255,255,0.70)",
                maxWidth: 520,
                opacity: { xs: 1, md: 0 },
                transform: { xs: "none", md: "translateY(6px)" },
                transition: "opacity 220ms ease, transform 220ms ease",
              }}
            >
              {item.subline}
            </Typography>
          </Box>

          <Box
            sx={{
              flex: "0 0 auto",
              width: 32,
              height: 32,
              borderRadius: 999,
              border: `1px solid rgba(255,106,0,0.55)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: ORANGE,
              fontWeight: 900,
              fontSize: 12,
              letterSpacing: "0.08em",
              opacity: 0.95,
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </Box>
        </Box>
      </Box>

      {/* Accent line */}
      <Box
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 2,
          background: "linear-gradient(90deg, rgba(255,106,0,0), rgba(255,106,0,0.9), rgba(255,106,0,0))",
          opacity: 0.55,
        }}
      />
    </Box>
  );
}
