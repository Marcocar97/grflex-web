import React, { useEffect, useMemo, useState } from "react";
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
  useMediaQuery("(min-width:900px)");
  const reducedMotion = useReducedMotion();

  const actions = useMemo(
    () => [
      {
        label: "Get GRFLEX",
        href: "/find-a-supplier",
        variant: "primary",
        note: "Find distributor",
      },
      {
        label: "Contact",
        href: "/contact",
        variant: "secondary",
        note: "Get in touch",
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

        // Antes era enorme (8/10/6). Esto evita el efecto "pantalla completa"
        py: { xs: 5, sm: 6, md: 5 },
      }}
    >
      {/* Background */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(900px 520px at 20% 25%, rgba(255,106,0,0.10), rgba(0,0,0,0) 60%), radial-gradient(1100px 700px at 85% 65%, rgba(255,255,255,0.035), rgba(0,0,0,0) 65%)",
          pointerEvents: "none",
        }}
      />

      {/* Grain */}
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
          gap: { xs: 3, md: 5 }, // ligeramente menos
        }}
      >
        {/* Left */}
        <Box sx={{ maxWidth: 620 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.6, mb: { xs: 1.1, md: 1.3 } }}>
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
    fontSize: {
      xs: "clamp(32px, 6.6vw, 46px)",
      md: "clamp(38px, 3.2vw, 52px)",
    },
    lineHeight: 1.05,
    fontWeight: 900,
    letterSpacing: "-0.03em",

    mb: { xs: 1.1, md: 1.3 }, // margen externo
    pb: { xs: 1.6, md: 2.8 }, // padding interno abajo
  }}
>
  Ready for your next project?
</Typography>


          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: { xs: 1.1, md: 1.3 },
              mb: { xs: 2.0, md: 2.2 },
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

        {/* Right: Tin card */}
        <Box
          sx={{
            position: "relative",

            // Antes 360/420/520 (gigante). Esto evita el look de 100% viewport
            height: { xs: 300, sm: 340, md: 380 },

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
              inset: 22,
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
                width: { xs: "58%", sm: "54%", md: "50%" },
                maxWidth: 300,
                height: "auto",
                filter: "drop-shadow(0 26px 70px rgba(0,0,0,0.70))",
                userSelect: "none",
              }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </Box>

          {/* Caption */}
          <Box
            sx={{
              position: "absolute",
              left: 22,
              right: 22,
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
        py: { xs: 1.45, md: 1.6 },
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
      <Typography sx={{ fontWeight: 900, letterSpacing: "-0.01em", fontSize: { xs: 15.5, md: 16 }, lineHeight: 1.15 }}>
        {label}
      </Typography>

      <Typography sx={{ fontSize: 12.5, color: isPrimary ? "rgba(0,0,0,0.70)" : "rgba(255,255,255,0.62)", lineHeight: 1.35 }}>
        {note}
      </Typography>
    </Box>
  );
}
