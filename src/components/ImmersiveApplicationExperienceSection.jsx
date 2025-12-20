import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import { motion, useMotionValue, useReducedMotion, useTransform, animate } from "framer-motion";

const ORANGE = "#ff6a00";

/**
 * IMMERSIVE APPLICATION EXPERIENCE
 * - Only the CENTER arrows control the flex (press-and-hold).
 * - No dragging.
 * - 100% flex = BOTH ENDS MEET (touch) at the center.
 * - Release arrows = returns smoothly to flat.
 *
 * Force range:
 *   -1 .. 1
 *   sign = direction (up/down)
 *   magnitude = flex amount (0..1)
 */
export default function ImmersiveApplicationExperienceSection() {
  const reducedMotion = useReducedMotion();
  const isMdUp = useMediaQuery("(min-width:900px)");

  const force = useMotionValue(0); // -1..1
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const unsub = force.on("change", (v) => setPct(Math.round(Math.min(1, Math.abs(v)) * 100)));
    return () => unsub?.();
  }, [force]);

  return (
    <Box
      id="immersive-application"
      component="section"
      sx={{
        position: "relative",
        minHeight: "100svh",
        bgcolor: "#000",
        color: "#fff",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        py: { xs: 7, sm: 8, md: 9 },
      }}
    >
      {/* Background */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(900px 520px at 18% 30%, rgba(255,106,0,0.12), rgba(0,0,0,0) 60%), radial-gradient(1100px 700px at 85% 60%, rgba(255,255,255,0.04), rgba(0,0,0,0) 65%)",
          pointerEvents: "none",
        }}
      />

      <Box sx={{ width: "min(1280px, 94%)", mx: "auto", position: "relative", zIndex: 2 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 2,
            mb: { xs: 2.25, md: 2.75 },
          }}
        >
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
              IMMERSIVE APPLICATION EXPERIENCE
            </Typography>
          </Box>

          <Typography sx={{ fontSize: { xs: 12, sm: 13, md: 13 }, color: "rgba(255,255,255,0.65)" }}>
            {reducedMotion ? " " : `${pct}%`}
          </Typography>
        </Box>

        {/* Card */}
        <Box
          sx={{
            border: "1px solid rgba(255,255,255,0.10)",
            bgcolor: "rgba(255,255,255,0.02)",
            backdropFilter: "blur(6px)",
            borderRadius: 3,
            boxShadow: "0 40px 120px rgba(0,0,0,0.65)",
            overflow: "hidden",
            position: "relative",
            px: { xs: 2.2, sm: 3, md: 4 },
            py: { xs: 2.5, sm: 3, md: 3.5 },
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: -2,
              background:
                "radial-gradient(700px 380px at 18% 30%, rgba(255,106,0,0.16), rgba(0,0,0,0) 55%), radial-gradient(650px 420px at 85% 70%, rgba(255,255,255,0.05), rgba(0,0,0,0) 60%)",
              pointerEvents: "none",
            }}
          />

          <Box sx={{ position: "relative", zIndex: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: 2,
                mb: { xs: 2, md: 2.25 },
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: { xs: 22, sm: 26, md: 30 },
                    fontWeight: 900,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                    mb: 0.75,
                  }}
                >
                  Flex the sample
                </Typography>

                <Typography
                  sx={{
                    fontSize: { xs: 14, sm: 15, md: 16 },
                    color: "rgba(255,255,255,0.74)",
                    lineHeight: 1.6,
                    maxWidth: 860,
                  }}
                >
                  Use the centre controls to apply force up or down. Release to return to a flat, controlled membrane.
                </Typography>
              </Box>

              <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
                <MiniTag text="Controlled flexibility" />
                <MiniTag text="One continuous system" />
              </Box>
            </Box>

            <FlexBeamStageArrowsOnly force={force} />

            <Box
              sx={{
                mt: { xs: 1.5, md: 1.75 },
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Typography sx={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>
                Hold the arrows to flex. 100% is fully folded with ends touching.
              </Typography>

              <Typography sx={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>
                Release to reset.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

/* ---------------- Stage (ARROWS ONLY) ---------------- */

function FlexBeamStageArrowsOnly({ force }) {
  const reducedMotion = useReducedMotion();

  // magnitude 0..1
  const mag = useTransform(force, (v) => Math.min(1, Math.abs(v)));

  // Endpoints move towards the center as it folds:
  // at 0%: xL=60, xR=840
  // at 100%: xL=450, xR=450 (touch)
  const xL = useTransform(mag, (m) => lerp(60, 450, easeInOutCubic(m)));
  const xR = useTransform(mag, (m) => lerp(840, 450, easeInOutCubic(m)));

  // Control point Y: bend up or down based on sign.
  // At 0%: cpY=130
  // At 100%: big bend. Clamp keeps it inside viewbox.
  const cpY = useTransform(force, (v) => {
    const m = Math.min(1, Math.abs(v));
    const dir = v >= 0 ? -1 : 1; // + => up, - => down (SVG y+ is down)
    const amp = lerp(0, 110, easeInOutCubic(m));
    return clamp(130 + dir * amp, 28, 232);
  });

  // Slight thickness change to sell the fold
  const thick = useTransform(mag, (m) => lerp(54, 62, easeInOutCubic(m)));
  const innerThick = useTransform(mag, (m) => lerp(10, 12, easeInOutCubic(m)));

  // sheen
  const sheenPos = useTransform(force, [-1, 0, 1], [70, 50, 30]);
  const sheenOpacity = useTransform(mag, [0, 1], [0.10, 0.42]);
  const glowOpacity = useTransform(mag, [0, 1], [0.06, 0.22]);

  // Press-and-hold arrows
  const holdRef = useRef({ raf: 0, dir: 0 });

  const startHold = (dir) => {
    stopHold();
    holdRef.current.dir = dir;

    const tick = () => {
      const current = force.get();
      const next = clamp(current + dir * 0.02, -1, 1);
      force.set(next);
      holdRef.current.raf = requestAnimationFrame(tick);
    };

    holdRef.current.raf = requestAnimationFrame(tick);
  };

  const stopHold = () => {
    if (holdRef.current.raf) cancelAnimationFrame(holdRef.current.raf);
    holdRef.current.raf = 0;
    holdRef.current.dir = 0;
    animate(force, 0, { type: "spring", stiffness: 240, damping: 26, mass: 0.7 });
  };

  useEffect(() => {
    return () => {
      if (holdRef.current.raf) cancelAnimationFrame(holdRef.current.raf);
    };
  }, []);

  // Build dynamic paths
  const d = useTransform([xL, xR, cpY], ([xl, xr, cpy]) => `M${xl} 130 Q450 ${cpy} ${xr} 130`);
  const innerD = useTransform([xL, xR, cpY], ([xl, xr, cpy]) => {
    const inset = 22;
    const xl2 = Math.min(450, xl + inset);
    const xr2 = Math.max(450, xr - inset);
    const cpy2 = clamp(130 + (cpy - 130) * 0.86, 40, 220);
    return `M${xl2} 130 Q450 ${cpy2} ${xr2} 130`;
  });

  return (
    <Box
      sx={{
        position: "relative",
        height: { xs: 300, sm: 340, md: 360 },
        borderRadius: 3,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.10)",
        bgcolor: "rgba(0,0,0,0.28)",
        display: "grid",
        placeItems: "center",
        userSelect: "none",
      }}
    >
      {/* subtle grid */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "84px 84px",
          opacity: 0.05,
          pointerEvents: "none",
        }}
      />

      {/* CENTER ARROWS (ONLY CONTROL) */}
      <Box
        sx={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          zIndex: 5,
          pointerEvents: "auto",
        }}
      >
        <ArrowButton
          direction="up"
          onDown={() => startHold(+1)} // up bend
          onUp={stopHold}
        />
        <ArrowButton
          direction="down"
          onDown={() => startHold(-1)} // down bend
          onUp={stopHold}
        />
      </Box>

      {/* Drawing */}
      <Box
        sx={{
          position: "relative",
          width: "min(860px, 88%)",
          height: { xs: 190, sm: 210, md: 220 },
          display: "grid",
          placeItems: "center",
          pointerEvents: "none",
        }}
      >
        {/* supports (fixed) */}
        <Box
          sx={{
            position: "absolute",
            left: 0,
            top: "50%",
            width: 26,
            height: 26,
            transform: "translate(-35%, -50%)",
            borderRadius: 1.5,
            border: "1px solid rgba(255,255,255,0.16)",
            bgcolor: "rgba(255,255,255,0.02)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            right: 0,
            top: "50%",
            width: 26,
            height: 26,
            transform: "translate(35%, -50%)",
            borderRadius: 1.5,
            border: "1px solid rgba(255,255,255,0.16)",
            bgcolor: "rgba(255,255,255,0.02)",
          }}
        />

        <svg width="100%" height="100%" viewBox="0 0 900 260" fill="none" aria-hidden="true">
          {/* baseline */}
          <line x1="60" y1="130" x2="840" y2="130" stroke="rgba(255,255,255,0.10)" strokeWidth="2" />
          {/* glow behind */}
          <motion.path
            d={d}
            stroke={ORANGE}
            strokeWidth="18"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              opacity: reducedMotion ? 0.08 : glowOpacity,
              filter: "blur(10px)",
            }}
          />
          {/* main membrane */}
          <motion.path
            d={d}
            stroke="rgba(255,255,255,0.18)"
            strokeWidth={thick}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              filter: "drop-shadow(0px 18px 40px rgba(0,0,0,0.55))",
            }}
          />
          {/* inner highlight */}
          <motion.path
            d={innerD}
            stroke="rgba(255,255,255,0.18)"
            strokeWidth={innerThick}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              opacity: reducedMotion ? 0.18 : 0.22,
            }}
          />
          {/* moving sheen */}
          <motion.path
            d={innerD}
            stroke="rgba(255,255,255,0.42)"
            strokeWidth={useTransform(innerThick, (t) => t + 2)}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="90 900"
            style={{
              opacity: reducedMotion ? 0.18 : sheenOpacity,
              strokeDashoffset: useTransform(sheenPos, (p) => 900 - p * 10),
              filter: "blur(0.4px)",
            }}
          />
          {/* subtle orange contour */}
          <motion.path
            d={d}
            stroke="rgba(255,106,0,0.14)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ opacity: reducedMotion ? 0.10 : 0.14 }}
          />
        </svg>
      </Box>

      {/* corner marker */}
      <Box
        sx={{
          position: "absolute",
          left: 16,
          bottom: 16,
          width: 10,
          height: 10,
          border: `1px solid ${ORANGE}`,
          opacity: 0.85,
          pointerEvents: "none",
        }}
      />
    </Box>
  );
}

/* ---------------- UI helpers ---------------- */

function MiniTag({ text }) {
  return (
    <Box
      sx={{
        px: 1.3,
        py: 0.7,
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.14)",
        bgcolor: "rgba(255,255,255,0.03)",
      }}
    >
      <Typography sx={{ fontSize: 12, color: "rgba(255,255,255,0.70)", letterSpacing: "0.02em" }}>
        {text}
      </Typography>
    </Box>
  );
}

function ArrowButton({ direction, onDown, onUp }) {
  const isUp = direction === "up";
  return (
    <Box
      role="button"
      tabIndex={0}
      onMouseDown={(e) => {
        e.preventDefault();
        onDown?.();
      }}
      onMouseUp={(e) => {
        e.preventDefault();
        onUp?.();
      }}
      onMouseLeave={() => onUp?.()}
      onTouchStart={(e) => {
        e.preventDefault();
        onDown?.();
      }}
      onTouchEnd={(e) => {
        e.preventDefault();
        onUp?.();
      }}
      onTouchCancel={() => onUp?.()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onDown?.();
        }
      }}
      onKeyUp={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onUp?.();
        }
      }}
      sx={{
        width: { xs: 44, md: 48 },
        height: { xs: 44, md: 48 },
        borderRadius: 2,
        border: "1px solid rgba(255,255,255,0.14)",
        bgcolor: "rgba(255,255,255,0.03)",
        display: "grid",
        placeItems: "center",
        cursor: "pointer",
        transition: "transform 180ms ease, border-color 180ms ease, background 180ms ease",
        "&:hover": {
          transform: "translateY(-1px)",
          borderColor: "rgba(255,106,0,0.35)",
          bgcolor: "rgba(255,255,255,0.05)",
        },
        "&:active": {
          transform: "translateY(0px) scale(0.98)",
          borderColor: "rgba(255,106,0,0.55)",
          bgcolor: "rgba(255,106,0,0.08)",
        },
      }}
      aria-label={isUp ? "Lift sample" : "Press sample"}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d={
            isUp
              ? "M12 5l7 7-1.4 1.4L12 7.8 6.4 13.4 5 12l7-7z"
              : "M12 19l-7-7 1.4-1.4L12 16.2l5.6-5.6L19 12l-7 7z"
          }
          stroke="rgba(255,255,255,0.78)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Box>
  );
}

/* ---------------- Utils ---------------- */

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
