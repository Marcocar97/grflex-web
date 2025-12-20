import React from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";

const ORANGE = "#ff6a00";

export default function ApplicationGuideSection() {
  useMediaQuery("(min-width:900px)");

  return (
    <Box
      id="application-guide"
      component="section"
      sx={{
        position: "relative",
        bgcolor: "#000",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        py: { xs: 6, sm: 8, md: 6 },
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

      {/* Wrapper */}
      <Box
        sx={{
          width: "100%",
          mx: "auto",
          px: { xs: 2, sm: 3, md: 6 },
          maxWidth: 1280,
          zIndex: 2,
        }}
      >
        {/* SECTION LABEL — ahora anclado a la sección */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.6,
            mb: { xs: 3, md: 4 },
          }}
        >
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
            APPLICATION GUIDE
          </Typography>
        </Box>

        {/* GRID */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.35fr 1fr" },
            alignItems: { xs: "start", md: "center" },
            gap: { xs: 3, sm: 4, md: 6 },
          }}
        >
          {/* VIDEO */}
          <Box
            sx={{
              width: "100%",
              borderRadius: { xs: 2, md: 3 },
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 40px 120px rgba(0,0,0,0.65)",
              bgcolor: "#000",
              aspectRatio: "16 / 9",
            }}
          >
            <video
              src="/GRFLEX-GUIDE.mp4"
              controls
              muted
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                backgroundColor: "#000",
                display: "block",
              }}
            />
          </Box>

          {/* TEXT */}
          <Box sx={{ maxWidth: { xs: "100%", md: 560 }, pr: { md: 2 } }}>
            <Typography
              sx={{
                fontWeight: 900,
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                mb: { xs: 1.5, md: 2 },
              }}
            >
              Simple application
            </Typography>

            <Typography
              sx={{
                color: "rgba(255,255,255,0.78)",
                fontSize: { xs: "1rem", sm: "1.0625rem", md: "1.125rem" },
                lineHeight: { xs: 1.7, md: 1.8 },
                mb: { xs: 2.5, md: 3 },
                maxWidth: { xs: "100%", md: "52ch" },
              }}
            >
              A short, clear overview of how GRFLEX is applied on site. Built for speed and consistency.
            </Typography>

            {/* STEPS */}
            <Box sx={{ display: "grid", gap: { xs: 1.5, md: 2 }, mt: 0.5 }}>
              {[
                "Surface cleaned, repaired and prepared",
                "GRFLEX mixed with activator",
                "First coat applied with reinforcement",
                "Second coat applied, then allow to cure",
              ].map((step, i) => (
                <Box key={step} sx={{ display: "flex", gap: 2 }}>
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      border: `1px solid ${ORANGE}`,
                      color: ORANGE,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {i + 1}
                  </Box>
                  <Typography sx={{ color: "rgba(255,255,255,0.82)", lineHeight: 1.6 }}>
                    {step}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
