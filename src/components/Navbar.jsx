import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const ORANGE = "#ff6a00";

const navItems = [
  { label: "Why GRFlex", href: "#why-grflex" },
  { label: "Estimator", href: "#calculator" },
  { label: "Application Guide", href: "#application-guide" },
  { label: "Find a Supplier", href: "/find-a-supplier" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const isMdUp = useMediaQuery("(min-width:900px)");
  const reducedMotion = useReducedMotion();

  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(true);

  const lastYRef = useRef(0);
  const tickingRef = useRef(false);

  const glowAnim = useMemo(() => {
    if (reducedMotion) return {};
    return {
      rotate: [0, 6, 0, -6, 0],
      y: [0, -1, 0, 1, 0],
      transition: { duration: 6.5, repeat: Infinity, ease: "easeInOut" },
    };
  }, [reducedMotion]);

  useEffect(() => {
    lastYRef.current = window.scrollY || 0;

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      window.requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        const last = lastYRef.current;

        const goingDown = y > last;
        const delta = Math.abs(y - last);

        if (y <= 8) {
          setShow(true);
        } else if (delta > 8) {
          setShow(!goingDown);
        }

        lastYRef.current = y;
        tickingRef.current = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  useEffect(() => {
    const isHome =
      window.location.pathname === "/" ||
      window.location.pathname === "" ||
      window.location.pathname === "/index.html";
  
    if (!isHome) return;
  
    const pending = sessionStorage.getItem("pending_hash_scroll");
    const hash = pending || window.location.hash;
  
    if (!hash || !hash.startsWith("#")) return;
  
    sessionStorage.removeItem("pending_hash_scroll");
  
    const NAV_OFFSET = 86; // ajusta si hace falta (navbar + margen)
  
    let tries = 0;
    const maxTries = 60;
  
    const tryScroll = () => {
      const el = document.querySelector(hash);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
  
        // scroll manual (mejor que scrollIntoView cuando hay scroll-snap)
        window.scrollTo({ top: Math.max(0, y), behavior: reducedMotion ? "auto" : "smooth" });
  
        // reintento para “ganarle” al snap del hero
        tries += 1;
        if (tries < 8) requestAnimationFrame(tryScroll);
        return;
      }
  
      tries += 1;
      if (tries < maxTries) requestAnimationFrame(tryScroll);
    };
  
    requestAnimationFrame(tryScroll);
  }, [reducedMotion]);
  

  const handleNav = (href) => {
    setOpen(false);
  
    const isHash = href?.startsWith("#");
    const isHome =
      window.location.pathname === "/" ||
      window.location.pathname === "" ||
      window.location.pathname === "/index.html";
  
    // Links a otras páginas (no hash)
    if (!isHash) {
      window.location.href = href;
      return;
    }
  
    // Si NO estamos en el home: guardamos hash y navegamos al home
    if (!isHome) {
      sessionStorage.setItem("pending_hash_scroll", href);
      window.location.href = `/${href}`;
      return;
    }
  
    // Estamos en home: scroll directo (manual + offset)
const el = document.querySelector(href);
if (el) {
  const NAV_OFFSET = 86; // mismo valor que arriba
  const y = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
  window.scrollTo({ top: Math.max(0, y), behavior: reducedMotion ? "auto" : "smooth" });

  // reintento corto por si hay snap
  requestAnimationFrame(() => {
    const y2 = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo({ top: Math.max(0, y2), behavior: "auto" });
  });
} else {
  window.location.hash = href;
}

  };
  
  

  return (
    <>
      <AnimatePresence initial={false}>
        {show && (
          <AppBar
            component={motion.header}
            initial={{ y: -26, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -26, opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
            elevation={0}
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bgcolor: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(12px)",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              zIndex: 1200,
              overflow: "hidden",
            }}
          >
            {/* Cloudy / mist layer */}
            <Box
              sx={{
                position: "absolute",
                inset: -40,
                pointerEvents: "none",
                opacity: 0.9,
                filter: "blur(18px)",
                transform: "translateZ(0)",
                "&::before, &::after": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(520px 140px at 12% 40%, rgba(255,106,0,0.18), rgba(0,0,0,0) 60%)," +
                    "radial-gradient(480px 160px at 46% 30%, rgba(255,255,255,0.09), rgba(0,0,0,0) 62%)," +
                    "radial-gradient(560px 180px at 78% 48%, rgba(255,106,0,0.10), rgba(0,0,0,0) 64%)",
                },
                "&::before": {
                  animation: reducedMotion ? "none" : "navMistA 14s ease-in-out infinite",
                },
                "&::after": {
                  opacity: 0.7,
                  animation: reducedMotion ? "none" : "navMistB 18s ease-in-out infinite",
                },
                "@keyframes navMistA": {
                  "0%": { transform: "translate3d(0px,0px,0) scale(1)" },
                  "50%": { transform: "translate3d(22px,6px,0) scale(1.02)" },
                  "100%": { transform: "translate3d(0px,0px,0) scale(1)" },
                },
                "@keyframes navMistB": {
                  "0%": { transform: "translate3d(0px,0px,0) scale(1.02)" },
                  "50%": { transform: "translate3d(-18px,4px,0) scale(1)" },
                  "100%": { transform: "translate3d(0px,0px,0) scale(1.02)" },
                },
              }}
            />

            <Toolbar disableGutters sx={{ py: 1.15 }}>
              <Container
                maxWidth="lg"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                {/* Left: logo */}
<Box
  onClick={() => handleNav("/")}
  role="button"
  tabIndex={0}
  sx={{
    display: "flex",
    alignItems: "center",
    gap: 1.6,
    cursor: "pointer",
    userSelect: "none",
    position: "relative",
  }}
>
  {/* Logo + halo */}
  <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
    {/* halo (más limpio) */}
    <Box
      sx={{
        position: "absolute",
        inset: -16,
        borderRadius: 999,
        background:
          "radial-gradient(closest-side, rgba(255,106,0,0.18), rgba(0,0,0,0) 70%)",
        pointerEvents: "none",
        opacity: 0.9,
      }}
    />

    <Box
      component={motion.img}
      src="/glogo1.png"
      alt="GRFlex"
      draggable={false}
      animate={
        reducedMotion
          ? {}
          : {
              // “flex squeeze” (contraer/expandir)
              scaleX: [1, 1.035, 0.99, 1.02, 1],
              scaleY: [1, 0.985, 1.02, 0.995, 1],
            }
      }
      transition={
        reducedMotion
          ? {}
          : { duration: 4.8, repeat: Infinity, ease: "easeInOut" }
      }
      sx={{
        height: { xs: 40, md: 48 }, // más grande
        width: "auto",
        display: "block",
        transformOrigin: "50% 50%",
        filter: "drop-shadow(0 10px 26px rgba(0,0,0,0.55))",
      }}
    />
  </Box>

  {/* Tagline (siempre en la misma línea, nunca debajo del logo) */}
  <Box sx={{ display: { xs: "none", sm: "block" }, lineHeight: 1 }}>
    <Typography
      sx={{
        fontSize: 12,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.68)",
        whiteSpace: "nowrap",
        mt: 0.2,
      }}
    >
      Fully Flexible Fibre Glass
    </Typography>
                  </Box>
                </Box>

                {/* Right: nav */}
                {isMdUp ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                    {navItems.map((item) => (
                      <NavButton key={item.href} onClick={() => handleNav(item.href)}>
                        {item.label}
                      </NavButton>
                    ))}

                    <Button
                      onClick={() => handleNav("#get-grflex")}
                      variant="contained"
                      disableElevation
                      sx={{
                        ml: 0.6,
                        bgcolor: ORANGE,
                        color: "#000",
                        fontWeight: 900,
                        px: 2.1,
                        py: 1.05,
                        borderRadius: 999,
                        textTransform: "none",
                        boxShadow: "0 18px 36px rgba(0,0,0,0.35)",
                        "&:hover": { bgcolor: ORANGE, filter: "brightness(1.05)" },
                      }}
                    >
                      Get GRFlex
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Button
                      onClick={() => handleNav("#get-grflex")}
                      variant="contained"
                      disableElevation
                      sx={{
                        bgcolor: ORANGE,
                        color: "#000",
                        fontWeight: 900,
                        px: 1.6,
                        py: 0.9,
                        borderRadius: 999,
                        textTransform: "none",
                        "&:hover": { bgcolor: ORANGE, filter: "brightness(1.05)" },
                      }}
                    >
                      Get
                    </Button>

                    <IconButton
                      onClick={() => setOpen(true)}
                      aria-label="Open menu"
                      sx={{
                        borderRadius: 999,
                        border: "1px solid rgba(255,255,255,0.14)",
                        bgcolor: "rgba(255,255,255,0.03)",
                        "&:hover": { bgcolor: "rgba(255,255,255,0.06)" },
                      }}
                    >
                      <Hamburger />
                    </IconButton>
                  </Box>
                )}
              </Container>
            </Toolbar>
          </AppBar>
        )}
      </AnimatePresence>

      {/* Spacer so content doesn't sit behind fixed navbar */}
      <Box sx={{ height: { xs: 72, md: 78 } }} />

      {/* Mobile drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: "min(86vw, 360px)",
            bgcolor: "#060606",
            color: "#fff",
            borderLeft: "1px solid rgba(255,255,255,0.10)",
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            borderBottom: "1px solid rgba(255,255,255,0.10)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: -30,
              pointerEvents: "none",
              filter: "blur(18px)",
              opacity: 0.9,
              background:
                "radial-gradient(420px 160px at 20% 40%, rgba(255,106,0,0.18), rgba(0,0,0,0) 62%)," +
                "radial-gradient(380px 140px at 75% 60%, rgba(255,255,255,0.08), rgba(0,0,0,0) 62%)",
            }}
          />
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.1 }}>
              <Box
                component="img"
                src="/glogo.png"
                alt="GRFlex"
                draggable={false}
                style={{ width: 34, height: 34, objectFit: "contain", display: "block" }}
              />
              <Box>
                <Typography sx={{ fontWeight: 900, lineHeight: 1 }}>GRFlex</Typography>
                <Typography sx={{ fontSize: 12, color: "rgba(255,255,255,0.62)" }}>Navigation</Typography>
              </Box>
            </Box>

            <IconButton
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              sx={{
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.14)",
                bgcolor: "rgba(255,255,255,0.03)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.06)" },
              }}
            >
              <CloseX />
            </IconButton>
          </Box>
        </Box>

        <List sx={{ p: 1.2 }}>
          {navItems.map((item) => (
            <ListItemButton
              key={item.href}
              onClick={() => handleNav(item.href)}
              sx={{
                borderRadius: 2,
                mb: 0.6,
                border: "1px solid rgba(255,255,255,0.10)",
                bgcolor: "rgba(255,255,255,0.02)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.05)" },
              }}
            >
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  sx: { fontWeight: 700, letterSpacing: "-0.01em" },
                }}
              />
            </ListItemButton>
          ))}

          <Box sx={{ mt: 1.1, px: 0.5 }}>
            <Button
              onClick={() => handleNav("#get-grflex")}
              variant="contained"
              fullWidth
              disableElevation
              sx={{
                bgcolor: ORANGE,
                color: "#000",
                fontWeight: 900,
                py: 1.15,
                borderRadius: 2.5,
                textTransform: "none",
                "&:hover": { bgcolor: ORANGE, filter: "brightness(1.05)" },
              }}
            >
              Get GRFlex
            </Button>
          </Box>
        </List>
      </Drawer>
    </>
  );
}

function NavButton({ children, onClick }) {
  return (
    <Button
      onClick={onClick}
      variant="text"
      disableElevation
      sx={{
        textTransform: "none",
        fontWeight: 700,
        color: "rgba(255,255,255,0.82)",
        px: 1.25,
        py: 0.95,
        borderRadius: 999,
        position: "relative",
        overflow: "hidden",
        "&:hover": {
          bgcolor: "rgba(255,255,255,0.06)",
          color: "rgba(255,255,255,0.92)",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          left: "18%",
          right: "18%",
          bottom: 8,
          height: 2,
          borderRadius: 999,
          background: `linear-gradient(90deg, rgba(255,106,0,0), rgba(255,106,0,0.85), rgba(255,106,0,0))`,
          opacity: 0,
          transform: "translateY(6px)",
          transition: "opacity 220ms ease, transform 220ms ease",
        },
        "&:hover::after": {
          opacity: 1,
          transform: "translateY(0px)",
        },
      }}
    >
      {children}
    </Button>
  );
}

function Hamburger() {
  return (
    <Box sx={{ width: 22, height: 18, position: "relative" }}>
      <Box
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 2,
          height: 2,
          borderRadius: 999,
          bgcolor: "rgba(255,255,255,0.82)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 8,
          height: 2,
          borderRadius: 999,
          bgcolor: "rgba(255,255,255,0.62)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 14,
          height: 2,
          borderRadius: 999,
          bgcolor: "rgba(255,255,255,0.82)",
        }}
      />
    </Box>
  );
}

function CloseX() {
  return (
    <Box sx={{ width: 18, height: 18, position: "relative" }}>
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          transform: "rotate(45deg)",
          "&::before, &::after": {
            content: '""',
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 2,
            height: 18,
            borderRadius: 999,
            bgcolor: "rgba(255,255,255,0.78)",
            transform: "translate(-50%, -50%)",
          },
          "&::after": {
            width: 18,
            height: 2,
          },
        }}
      />
    </Box>
  );
}
