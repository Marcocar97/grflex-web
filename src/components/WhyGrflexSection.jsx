import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

export default function WhyGrflexSection() {
  const isMdUp = useMediaQuery("(min-width:900px)");
  const reducedMotion = useReducedMotion();

  const wrapRef = useRef(null);
  const indexRef = useRef(0);
  const [index, setIndex] = useState(0);

  const PANELS = useMemo(
    () => [
      {
        eyebrow: "FLEXIBILITY",
        title: "Fully Flexible",
        body:
          "Roofs aren't rigid, they move GRFlex is fully flexible meaning its designed to move with the roofs , accommodating both expansion contraction and bending.",
        visualType: "flex",
        bullets: [
          "Moves with the roof",
          "Maintains integrity under thermal expansion and vibration",
          "Designed with full flexibility",
        ],
        chips: ["Fully reinforced", "Crack resistant", "Built for movement"],
      },
      {
        eyebrow: "SYSTEM ARCHITECTURE",
        title: "One continuous roofing system",
        body: "One continuous waterproofing system. No weak points. No overlaps. No joints. A single skin across the roof.",
        visualType: "seamless",
        bullets: [
          "Continuous waterproof layer across details and transitions",
          "Eliminates joint-related failure points",
          "Designed to keep performance consistent across the roof",
        ],
        chips: ["One system", "No joints", "Continuous membrane"],
      },
      {
        eyebrow: "REAL WORLD CONDITIONS",
        title: "Designed for the real world",
        body:
          "Buildings move. Temperature shifts, expansion, vibration, settlement. GRFLEX is built for controlled movement from day one.",
        visualType: "movement",
        bullets: [
          "Handles thermal cycling and seasonal expansion",
          "Built to perform under vibration and day-to-day building movement",
          "Supports long-term durability under real site conditions",
        ],
        chips: ["Thermal cycling", "Vibration", "Long-term durability"],
      },
    ],
    []
  );

  const panelsCount = PANELS.length;

  // ----- MOBILE: stack normal -----
  if (!isMdUp) {
    return (
      <Box id="why-grflex" sx={{ bgcolor: "#000", color: "#fff", py: { xs: 8, sm: 10 } }}>
        <Box sx={{ px: { xs: 2, sm: 3 } }}>
          {PANELS.map((p, idx) => (
            <Box
              key={p.title}
              sx={{
                py: { xs: 6, sm: 7 },
                borderTop: idx === 0 ? "none" : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Typography
                sx={{
                  color: ORANGE,
                  fontSize: { xs: 12, sm: 12.5 },
                  letterSpacing: { xs: "0.18em", sm: "0.2em" },
                  textTransform: "uppercase",
                  mb: 1.5,
                  opacity: 0.95,
                }}
              >
                {p.eyebrow}
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: 32, sm: 36 },
                  lineHeight: 1.05,
                  fontWeight: 900,
                  letterSpacing: "-0.02em",
                  mb: 1.5,
                }}
              >
                {p.title}
              </Typography>

              <Typography
                sx={{
                  color: "rgba(255,255,255,0.78)",
                  fontSize: { xs: 16, sm: 16.5 },
                  lineHeight: 1.75,
                  maxWidth: 620,
                  mb: 2.5,
                }}
              >
                {p.body}
              </Typography>

              <Box sx={{ display: "grid", gap: 1.1, mb: 2.5 }}>
                {(p.bullets || []).map((b) => (
                  <Box key={b} sx={{ display: "flex", gap: 1.2, alignItems: "flex-start" }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        mt: "8px",
                        bgcolor: ORANGE,
                        borderRadius: 99,
                        opacity: 0.85,
                      }}
                    />
                    <Typography sx={{ color: "rgba(255,255,255,0.72)", fontSize: 15.5, lineHeight: 1.65 }}>
                      {b}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {(p.chips || []).map((c) => (
                  <Box
                    key={c}
                    sx={{
                      px: 1.4,
                      py: 0.8,
                      borderRadius: 999,
                      border: "1px solid rgba(255,255,255,0.14)",
                      bgcolor: "rgba(255,255,255,0.03)",
                    }}
                  >
                    <Typography sx={{ fontSize: 12.5, color: "rgba(255,255,255,0.68)", letterSpacing: "0.02em" }}>
                      {c}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box sx={{ mt: 3.5, height: { xs: 260, sm: 300 } }}>
                <ConceptVisual type={p.visualType} />
              </Box>

              <Typography sx={{ mt: 2, fontSize: 12, color: "rgba(255,255,255,0.55)" }}>
                0{idx + 1} / 03
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  // ----- DESKTOP: ScrollTrigger pinned -----
  useEffect(() => {
    if (reducedMotion) return;

    const el = wrapRef.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);

    const setIdx = (i) => {
      const clamped = Math.max(0, Math.min(panelsCount - 1, i));
      if (clamped === indexRef.current) return;
      indexRef.current = clamped;
      setIndex(clamped);
    };

    // SPEED CONTROL:
    // "scrollPerPanel" = cuánto scroll necesitas para pasar al siguiente panel.
    // Menor = más rápido (necesitas menos scroll).
    const scrollPerPanel = Math.max(260, Math.round(window.innerHeight * 0.45)); // <--- más rápido que 1 pantalla
    const total = scrollPerPanel * panelsCount;

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: () => `+=${total}`,
      pin: true,
      pinSpacing: true,
      scrub: 0.15, // respuesta más rápida
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const raw = self.progress * panelsCount;
        const i = Math.min(panelsCount - 1, Math.floor(raw));
        setIdx(i);
      },
    });

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      st.kill();
    };
  }, [reducedMotion, panelsCount]);

  const current = PANELS[index];

  return (
    <Box
      id="why-grflex"
      ref={wrapRef}
      component="section"
      sx={{
        position: "relative",
        height: "100vh",
        bgcolor: "#000",
        color: "#fff",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(900px 520px at 20% 30%, rgba(255,106,0,0.12), rgba(0,0,0,0) 60%), radial-gradient(1100px 700px at 85% 60%, rgba(255,255,255,0.04), rgba(0,0,0,0) 65%)",
          pointerEvents: "none",
        }}
      />

      {/* Header fijo (estilo resto de secciones) */}
      <Box
        sx={{
          position: "absolute",
          left: { xs: 16, md: 36 },
          top: { xs: 16, md: 28 },
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: 1.6,
          pointerEvents: "none",
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
          WHY GRFLEX
        </Typography>
        <Typography sx={{ fontSize: 12, color: "rgba(255,255,255,0.45)", whiteSpace: "nowrap" }}>
          0{index + 1} / 03
        </Typography>
      </Box>

      {/* Content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          height: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "95%",
            mx: "auto",
            height: "100%",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.05fr 1fr" },
            alignItems: "center",
            gap: { xs: 4, md: 7 },
            px: { xs: 2, md: 0 },
          }}
        >
          {/* Left text - animate per panel */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.title}
              initial={reducedMotion ? false : { opacity: 0, y: 10 }}
              animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: "100%" }}
            >
              <Box sx={{ maxWidth: 820 }}>
                <Typography
                  sx={{
                    color: ORANGE,
                    fontSize: { xs: 12, sm: 13, md: 13 },
                    letterSpacing: { xs: "0.22em", md: "0.28em" },
                    textTransform: "uppercase",
                    mb: { xs: 1.5, md: 2 },
                    opacity: 0.95,
                  }}
                >
                  {current.eyebrow}
                </Typography>

                <Typography
                  sx={{
                    fontSize: { xs: "clamp(34px, 4.2vw, 56px)", md: "clamp(44px, 4.6vw, 72px)" },
                    lineHeight: 1.02,
                    fontWeight: 900,
                    letterSpacing: "-0.03em",
                    mb: { xs: 1.5, md: 2 },
                  }}
                >
                  {current.title}
                </Typography>

                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.78)",
                    fontSize: { xs: 16, sm: 17, md: 18 },
                    lineHeight: { xs: 1.75, md: 1.85 },
                    maxWidth: 820,
                    mb: { xs: 2.5, md: 3 },
                  }}
                >
                  {current.body}
                </Typography>

                <Box sx={{ display: "grid", gap: 1.1, mb: { xs: 2.5, md: 3 } }}>
                  {(current.bullets || []).map((b) => (
                    <Box key={b} sx={{ display: "flex", gap: 1.2, alignItems: "flex-start" }}>
                      <Box sx={{ width: 8, height: 8, mt: "9px", bgcolor: ORANGE, borderRadius: 99, opacity: 0.9 }} />
                      <Typography
                        sx={{
                          color: "rgba(255,255,255,0.72)",
                          fontSize: { xs: 15.5, sm: 16, md: 16.5 },
                          lineHeight: 1.7,
                        }}
                      >
                        {b}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {(current.chips || []).map((c) => (
                    <Box
                      key={c}
                      sx={{
                        px: { xs: 1.4, md: 1.6 },
                        py: { xs: 0.75, md: 0.85 },
                        borderRadius: 999,
                        border: "1px solid rgba(255,255,255,0.14)",
                        bgcolor: "rgba(255,255,255,0.03)",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: { xs: 12, md: 12.5 },
                          color: "rgba(255,255,255,0.68)",
                          letterSpacing: "0.04em",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {c}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Box
                  sx={{
                    mt: 3,
                    height: 1,
                    width: { xs: 240, sm: 320, md: 420 },
                    background: "rgba(255,255,255,0.10)",
                  }}
                />
              </Box>
            </motion.div>
          </AnimatePresence>

          {/* Right visual */}
          <Box sx={{ height: { xs: 420, md: 640 }, width: "100%", ml: "auto" }}>
            <ConceptVisual type={current.visualType} />
          </Box>
        </Box>
      </Box>

      {/* Dots */}
      <Box
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: { xs: 18, md: 26 },
          display: "flex",
          justifyContent: "center",
          gap: 1.2,
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        {PANELS.map((_, i) => (
          <Box
            key={i}
            sx={{
              width: i === index ? 26 : 10,
              height: 10,
              borderRadius: 999,
              background: i === index ? `rgba(255,106,0,0.85)` : "rgba(255,255,255,0.18)",
              transition: "width 220ms ease",
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

/* ---------------- VISUALS (igual que lo tuyo) ---------------- */

function ConceptVisual({ type }) {
  const reducedMotion = useReducedMotion();

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: 3,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.12)",
        bgcolor: "rgba(255,255,255,0.02)",
        boxShadow: "0 40px 120px rgba(0,0,0,0.65)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(900px 520px at 25% 20%, rgba(255,106,0,0.14), rgba(0,0,0,0) 60%), radial-gradient(900px 520px at 80% 70%, rgba(255,255,255,0.05), rgba(0,0,0,0) 65%)",
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "84px 84px",
          opacity: 0.06,
          pointerEvents: "none",
        }}
      />

      <Box sx={{ position: "absolute", inset: 18, borderRadius: 2.5, border: "1px solid rgba(255,255,255,0.10)" }} />

      {type === "flex" && <TechFlex reducedMotion={reducedMotion} />}
      {type === "seamless" && <TechSeamless reducedMotion={reducedMotion} />}
      {type === "movement" && <TechMovement reducedMotion={reducedMotion} />}

      <Box
        sx={{
          position: "absolute",
          left: 18,
          bottom: 18,
          width: 10,
          height: 10,
          border: `1px solid ${ORANGE}`,
          opacity: 0.9,
        }}
      />
    </Box>
  );
}

function TechFlex({ reducedMotion }) {
  return (
    <Box sx={{ position: "absolute", inset: 0 }}>
      <Box
        component={motion.div}
        animate={reducedMotion ? {} : { y: [0, -10, 0] }}
        transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1], repeat: Infinity }}
        sx={{
          position: "absolute",
          left: "10%",
          right: "10%",
          top: "22%",
          bottom: "22%",
          borderRadius: 2.5,
          border: "1px solid rgba(255,255,255,0.14)",
          background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
        }}
      />
      <Box
        component={motion.div}
        animate={reducedMotion ? {} : { opacity: [0.25, 0.8, 0.25] }}
        transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity }}
        sx={{
          position: "absolute",
          left: "12%",
          right: "12%",
          top: "50%",
          height: 2,
          background: `linear-gradient(90deg, rgba(255,106,0,0), rgba(255,106,0,0.7), rgba(255,106,0,0))`,
        }}
      />
    </Box>
  );
}

function TechSeamless({ reducedMotion }) {
  return (
    <Box sx={{ position: "absolute", inset: 0 }}>
      <Box
        component={motion.div}
        animate={reducedMotion ? {} : { x: ["-6%", "6%", "-6%"] }}
        transition={{ duration: 3.2, ease: [0.22, 1, 0.36, 1], repeat: Infinity }}
        sx={{
          position: "absolute",
          top: "34%",
          left: "-20%",
          right: "-20%",
          height: "28%",
          borderRadius: 2.5,
          border: "1px solid rgba(255,255,255,0.14)",
          background:
            "radial-gradient(55% 120% at 20% 50%, rgba(255,106,0,0.22), rgba(255,106,0,0) 55%), linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
          transform: "skewX(-10deg)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          left: "12%",
          right: "12%",
          top: "50%",
          height: 1,
          background: "rgba(255,255,255,0.16)",
          opacity: 0.35,
        }}
      />
    </Box>
  );
}

function TechMovement({ reducedMotion }) {
  return (
    <Box sx={{ position: "absolute", inset: 0 }}>
      <Box
        sx={{
          position: "absolute",
          left: "10%",
          right: "10%",
          top: "20%",
          height: "40%",
          borderRadius: 2.5,
          border: "1px solid rgba(255,255,255,0.14)",
          background: "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
        }}
      />
      <Box
        component={motion.div}
        animate={reducedMotion ? {} : { x: [0, 14, 0] }}
        transition={{ duration: 2.6, ease: [0.22, 1, 0.36, 1], repeat: Infinity }}
        sx={{
          position: "absolute",
          left: "12%",
          right: "12%",
          bottom: "20%",
          height: "26%",
          borderRadius: 2.5,
          border: "1px solid rgba(255,255,255,0.14)",
          background:
            "repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0 20px, rgba(255,255,255,0.02) 20px 40px)",
          opacity: 0.95,
        }}
      />
    </Box>
  );
}
