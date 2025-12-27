import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useDrag } from "@use-gesture/react";

const ORANGE = "#ff6a00";

export default function HeroSection() {
  const isMdUp = useMediaQuery("(min-width:900px)");
  const reducedMotion = useReducedMotion();

  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);

  const isHoveringRef = useRef(false);
  const timerRef = useRef(null);

  const SLIDES = useMemo(
    () => [
      {
        eyebrowLeft: "GRFlex",
        eyebrowRight: "Simplicity",
        titleA: "One tin",
        titleB: "does it all",
        sub: "Simple range, fast application",
        image: "/TIN2.png",
        imageAlt: "GRFlex tin",
      },
      {
        eyebrowLeft: "GRFlex",
        eyebrowRight: "No primer",
        titleA: "No primer",
        titleB: "required.",
        sub: "Fewer Steps. Less Fuss",
        image: "/FEL2.png",
        imageAlt: "GRFlex product range",
      },
      {
        eyebrowLeft: "GRFlex",
        eyebrowRight: "One kit",
        titleA: "3 parts",
        titleB: "1 system.",
        sub: "Waterproof, activator and matting.",
        image: "/KIT.png",
        imageAlt: "GRFlex kit",
      },
      {
        eyebrowLeft: "GRFlex",
        eyebrowRight: "Performance",
        titleA: "Fully",
        titleB: "Flexible.",
        sub: "Tough and flexible moving with the roof",
        image: "/FLEX.png",
        imageAlt: "GRFlex performance",
      },
    ],
    []
  );

  const count = SLIDES.length;

  const clampIndex = useCallback((n) => ((n % count) + count) % count, [count]);

  const goTo = useCallback(
    (n) => {
      const next = clampIndex(n);
      indexRef.current = next;
      setIndex(next);
    },
    [clampIndex]
  );

  const next = useCallback(() => goTo(indexRef.current + 1), [goTo]);
  const prev = useCallback(() => goTo(indexRef.current - 1), [goTo]);

  // Auto-advance (pause on hover)
  useEffect(() => {
    if (reducedMotion) return;
    if (timerRef.current) window.clearInterval(timerRef.current);

    timerRef.current = window.setInterval(() => {
      if (isHoveringRef.current) return;
      next();
    }, 5200);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [next, reducedMotion]);

  // Keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // Drag / swipe
  const bind = useDrag(
    ({ last, movement: [mx], velocity: [vx], direction: [dx] }) => {
      if (!last) return;
      const swipe = Math.abs(mx) > 60 || vx > 0.35;
      if (!swipe) return;
      if (dx < 0) next();
      else prev();
    },
    { axis: "x", filterTaps: true }
  );

  const slide = SLIDES[index];

  return (
    <Box
      id="hero"
      component="section"
      onMouseEnter={() => (isHoveringRef.current = true)}
      onMouseLeave={() => (isHoveringRef.current = false)}
      sx={{
        position: "relative",
        bgcolor: "#000",
        color: "#fff",
        overflow: "hidden",
        // Reduced overall height to remove extra top/bottom air
        height: { xs: "76svh", md: "82svh" },
        minHeight: { xs: 460, md: 520 },
        display: "flex",
      }}
    >
      {/* Background */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(1100px 620px at 18% 45%, rgba(255,106,0,0.16), rgba(0,0,0,0) 62%), radial-gradient(1000px 820px at 78% 50%, rgba(255,255,255,0.045), rgba(0,0,0,0) 65%)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "170px 170px",
          opacity: 0.02,
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(90% 80% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.62) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <Box
        {...bind()}
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: 1280,
          mx: "auto",
          px: { xs: 2, sm: 3, md: 6 },
          // Less padding top/bottom to reduce empty space
          py: { xs: 1.2, md: 0.8 },
          display: "grid",
          gridTemplateRows: "auto 1fr auto",
          gap: { xs: 1.0, md: 1.2 },
          zIndex: 2,
          touchAction: "pan-y",
          userSelect: "none",
        }}
      >

        {/* Stage */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            display: "grid",
            // Slightly rebalance columns so image sits closer without resizing
            gridTemplateColumns: { xs: "1fr", md: "1.05fr 0.95fr" },
            alignItems: "center",
            // Reduce gap between text and image
            columnGap: { xs: 0, md: 1.2 },
            rowGap: { xs: 2.0, md: 0 },
            height: "100%",
            // Reduce stage height to remove empty space top/bottom
            minHeight: { xs: 360, md: 430 },
          }}
        >
          {/* Subtle baseline */}
          <Box
            sx={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: { xs: 8, md: 12 },
              height: 1,
              background:
                "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.12), rgba(255,255,255,0))",
              opacity: 0.55,
              pointerEvents: "none",
            }}
          />

          {/* Text */}
          <Box sx={{ position: "relative", zIndex: 2, maxWidth: 780 }}>
            <AnimatePresence mode="wait" initial={false}>
              <Box
                key={`t-${index}`}
                component={motion.div}
                initial={{ opacity: 0, x: 28, filter: "blur(10px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -28, filter: "blur(10px)" }}
                transition={{
                  duration: reducedMotion ? 0 : 0.55,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Typography
  sx={{
    fontWeight: 900,
    letterSpacing: "-0.03em",
    lineHeight: 0.98,
    fontSize: {
      xs: "clamp(38px, 9.2vw, 70px)",
      md: "clamp(50px, 5.0vw, 76px)",
    },
    mb: { xs: 1.15, md: 1.35 },
    maxWidth: 760,
  }}
>
  {slide.titleA}
  <Box
    component="span"
    sx={{
      display: "block", // ⬅️ fuerza nueva línea
      color: ORANGE,
    }}
  >
    {slide.titleB}
  </Box>
</Typography>


                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.78)",
                    fontSize: { xs: 16.0, sm: 16.75, md: 17.75 },
                    lineHeight: 1.75,
                    maxWidth: 560,
                    mb: { xs: 1.9, md: 2.0 },
                  }}
                >
                  {slide.sub}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Button
  component="a"
  href="/find-a-supplier"
  variant="contained"
  disableElevation
  sx={{
    bgcolor: ORANGE,
    color: "#000",
    fontWeight: 900,
    px: 3.0,
    py: 1.15,
    borderRadius: 999,
    textTransform: "none",
    "&:hover": { bgcolor: ORANGE, filter: "brightness(1.05)" },
  }}
>
  Get GRFlex
</Button>


                  <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: 13.25 }}>
                    Trusted system. Straightforward on site.
                  </Typography>
                </Box>
              </Box>
            </AnimatePresence>
          </Box>

          {/* Image */}
          <Box
            sx={{
              position: "relative",
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              // Keep it near the text (no size change), reduce empty middle space
              justifyContent: { xs: "center", md: "flex-start" },
              // Pull image slightly left on desktop to close the gap
              pl: { xs: 0, md: 0.5 },
              ml: { xs: 0, md: -2.0 },
              height: "100%",
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <Box
                key={`img-${index}`}
                component={motion.div}
                initial={{ opacity: 0, x: 14, scale: 0.99, filter: "blur(10px)" }}
                animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -14, scale: 0.99, filter: "blur(10px)" }}
                transition={{
                  duration: reducedMotion ? 0 : 0.55,
                  ease: [0.22, 1, 0.36, 1],
                }}
                sx={{
                  position: "relative",
                  height: { xs: 240, sm: 270, md: 330, lg: 360 }, // unchanged
                  width: "auto",
                  display: "block",
                  pointerEvents: "none",
                  filter: "drop-shadow(0 18px 46px rgba(0,0,0,0.75))",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    inset: "-28%",
                    background: "radial-gradient(closest-side, rgba(255,106,0,0.12), rgba(0,0,0,0) 72%)",
                    pointerEvents: "none",
                  }}
                />
                <Box
                  component="img"
                  src={slide.image}
                  alt={slide.imageAlt || "GRFlex"}
                  draggable={false}
                  style={{ height: "100%", width: "auto", display: "block", position: "relative" }}
                />
              </Box>
            </AnimatePresence>
          </Box>
        </Box>


          {/* Controls */}
<Box
  sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center", // CENTER EVERYTHING
    gap: 3,                   // space between eyebrow / bar / dots
    width: "100%",
  }}
>
  {/* Eyebrow */}
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.35 }}>
    <Box sx={{ width: 10, height: 10, border: `1px solid ${ORANGE}`, opacity: 0.9 }} />
    <Typography
      sx={{
        color: ORANGE,
        textTransform: "uppercase",
        fontWeight: 700,
        letterSpacing: { xs: "0.18em", md: "0.22em" },
        fontSize: { xs: 12, md: 13 },
        whiteSpace: "nowrap",
      }}
    >
      {slide.eyebrowLeft}
    </Typography>
    <Typography
      sx={{
        color: "rgba(255,255,255,0.55)",
        textTransform: "uppercase",
        letterSpacing: { xs: "0.18em", md: "0.22em" },
        fontSize: { xs: 12, md: 13 },
        whiteSpace: "nowrap",
      }}
    >
      {slide.eyebrowRight}
    </Typography>
  </Box>

  {/* Progress bar */}
  <Box
    sx={{
      width: 190,
      height: 2,
      bgcolor: "rgba(255,255,255,0.10)",
      borderRadius: 999,
      overflow: "hidden",
    }}
  >
    <Box
      component={motion.div}
      key={`bar-${index}`}
      initial={{ width: `${(index / count) * 100}%` }}
      animate={{ width: `${((index + 1) / count) * 100}%` }}
      transition={{ duration: reducedMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
      sx={{ height: "100%", bgcolor: "rgba(255,106,0,0.85)" }}
    />
  </Box>

  {/* Dots */}
  <Box sx={{ display: "flex", gap: 1.0 }}>
    {SLIDES.map((_, i) => (
      <Box
        key={i}
        onClick={() => goTo(i)}
        role="button"
        tabIndex={0}
        sx={{
          width: i === index ? 18 : 8,
          height: 8,
          borderRadius: 999,
          background: i === index ? "rgba(255,106,0,0.85)" : "rgba(255,255,255,0.16)",
          transition: "width 240ms ease, background 240ms ease",
          cursor: "pointer",
        }}
      />
    ))}
  </Box>

        </Box>
      </Box>
    </Box>
  );
}

function GhostNav({ label, onClick }) {
  return (
    <Button
      onClick={onClick}
      variant="outlined"
      disableElevation
      sx={{
        borderRadius: 999,
        textTransform: "none",
        minWidth: 86,
        px: 2.0,
        py: 0.9,
        color: "rgba(255,255,255,0.78)",
        borderColor: "rgba(255,255,255,0.18)",
        bgcolor: "rgba(255,255,255,0.03)",
        "&:hover": {
          borderColor: "rgba(255,255,255,0.28)",
          bgcolor: "rgba(255,255,255,0.06)",
        },
      }}
    >
      <Typography sx={{ fontSize: 12.5, letterSpacing: "0.02em" }}>{label}</Typography>
    </Button>
  );
}
