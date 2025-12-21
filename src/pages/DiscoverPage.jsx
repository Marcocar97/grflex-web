// src/pages/DiscoverPage.jsx
import React from "react";
import { Box, Typography, Button, Divider } from "@mui/material";
import { motion, useReducedMotion } from "framer-motion";

const ORANGE = "#ff6a00";

// Edita aquí tus URLs finales
const LINKS = [
  { label: "GRFlex website", sub: "grflex.co.uk", href: "https://grflex.co.uk", kind: "primary" },
  { label: "Application video", sub: "Watch how to apply", href: "https://grflex.co.uk", kind: "primary" }, // pon URL real
  { label: "YouTube channel", sub: "GRFlex on YouTube", href: "https://www.youtube.com", kind: "secondary" }, // pon URL real
  { label: "Instagram", sub: "@grflex", href: "https://www.instagram.com", kind: "secondary" }, // pon URL real
  { label: "Facebook", sub: "GRFlex on Facebook", href: "https://www.facebook.com", kind: "secondary" }, // pon URL real
  { label: "Find a Supplier", sub: "Locate installers near you", href: "/find-a-supplier", kind: "route" },
  { label: "Contact", sub: "Send an enquiry", href: "/contact", kind: "route" },
];

export default function DiscoverPage() {
  const reducedMotion = useReducedMotion();

  const openLink = (href) => {
    if (!href) return;

    // internal route
    if (href.startsWith("/")) {
      window.location.href = href;
      return;
    }

    // external
    window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <Box
      component="section"
      sx={{
        bgcolor: "#000",
        color: "#fff",
        minHeight: "100svh",
        py: { xs: 5.5, md: 7 },
      }}
    >
      <Box sx={{ width: "min(860px, 92%)", mx: "auto" }}>
   {/* Header (NOT fixed, centered) */}
<Box
  sx={{
    mb: 2.6,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  }}
>
  <Box
    component="img"
    src="/glogo1.png"
    alt="GRFlex"
    sx={{ height: 74, width: "auto", display: "block" }}
  />

  <Typography
    sx={{
      mt: 1.4,
      fontWeight: 950,
      letterSpacing: "-0.02em",
      fontSize: { xs: 22, sm: 26 },
    }}
  >
    Fully Flexible Fibre Glass
  </Typography>
</Box>


        {/* Intro text (no logo) */}
        <Typography sx={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.85, maxWidth: 760 }}>
          Quick links for GRFlex. Open the website, watch the application video, or find a supplier
          near you.
        </Typography>

        {/* Contact details (simple) */}
        <Box sx={{ mt: 2.4, display: "grid", gap: 1.0, maxWidth: 640 }}>
          <InfoLine label="Technical advice" value="01948 808659" />
          <InfoLine label="Email" value="info@grflex.co.uk" />
        </Box>

        {/* Links */}
        <Box sx={{ mt: 2.6, display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.1 }}>
          {LINKS.map((l, idx) => (
            <LinkCard key={l.label} item={l} index={idx} reducedMotion={reducedMotion} onClick={() => openLink(l.href)} />
          ))}
        </Box>

        {/* Small bottom note */}
        <Typography sx={{ mt: 2.4, color: "rgba(255,255,255,0.45)", fontSize: 13.5, lineHeight: 1.7 }}>
          If you scanned a QR code and something looks wrong, contact us and we’ll update the destination.
        </Typography>
      </Box>
    </Box>
  );
}

function InfoLine({ label, value }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        gap: 2,
        border: "1px solid rgba(255,255,255,0.10)",
        bgcolor: "rgba(255,255,255,0.02)",
        borderRadius: 3,
        px: 1.6,
        py: 1.2,
      }}
    >
      <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        {label}
      </Typography>
      <Typography sx={{ color: "rgba(255,255,255,0.88)", fontWeight: 900, textAlign: "right" }}>{value}</Typography>
    </Box>
  );
}

function LinkCard({ item, index, reducedMotion, onClick }) {
  const isPrimary = item.kind === "primary";

  return (
    <Box
      component={motion.button}
      onClick={onClick}
      whileHover={reducedMotion ? undefined : { y: -2 }}
      whileTap={reducedMotion ? undefined : { scale: 0.985 }}
      initial={reducedMotion ? undefined : { opacity: 0, y: 10 }}
      animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      transition={reducedMotion ? undefined : { duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: 0.04 + index * 0.03 }}
      style={{
        width: "100%",
        textAlign: "left",
        background: "transparent",
        border: 0,
        padding: 0,
        cursor: "pointer",
      }}
    >
      <Box
        sx={{
          borderRadius: 3,
          border: isPrimary ? "1px solid rgba(255,106,0,0.40)" : "1px solid rgba(255,255,255,0.10)",
          bgcolor: "rgba(255,255,255,0.02)",
          p: { xs: 2.0, md: 2.1 },
          "&:hover": {
            borderColor: isPrimary ? "rgba(255,106,0,0.65)" : "rgba(255,106,0,0.25)",
            bgcolor: "rgba(255,255,255,0.03)",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
          <Box>
            <Typography sx={{ fontWeight: 950, letterSpacing: "-0.01em", color: "rgba(255,255,255,0.90)" }}>
              {item.label}
            </Typography>
            <Typography sx={{ mt: 0.45, color: "rgba(255,255,255,0.62)", lineHeight: 1.6, fontSize: 13.5 }}>
              {item.sub}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: 999,
              border: isPrimary ? "1px solid rgba(255,106,0,0.55)" : "1px solid rgba(255,255,255,0.14)",
              bgcolor: "rgba(0,0,0,0.22)",
              display: "grid",
              placeItems: "center",
              flex: "0 0 auto",
            }}
          >
            <ArrowMini color={isPrimary ? ORANGE : "rgba(255,255,255,0.78)"} />
          </Box>
        </Box>

        {isPrimary ? (
          <Box sx={{ mt: 1.1 }}>
            <Tag text="Recommended" />
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}

function Tag({ text }) {
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: 999,
        px: 1.05,
        py: 0.35,
        fontSize: 12,
        fontWeight: 900,
        letterSpacing: "0.02em",
        border: "1px solid rgba(255,106,0,0.45)",
        bgcolor: "rgba(255,106,0,0.08)",
        color: "rgba(255,255,255,0.86)",
      }}
    >
      {text}
    </Box>
  );
}

function ArrowMini({ color }) {
  return (
    <Box
      sx={{
        width: 10,
        height: 10,
        borderRight: `2px solid ${color}`,
        borderTop: `2px solid ${color}`,
        transform: "rotate(45deg)",
        mr: 0.2,
      }}
    />
  );
}
