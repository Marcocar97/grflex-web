// src/pages/FindSupplierPage.jsx
import React, { useEffect, useMemo, useRef, useState, useLayoutEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Collapse,
  Alert,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// IMPORTANT (Vite): you must import marker assets explicitly (see instructions below).
import markerIcon2xUrl from "leaflet/dist/images/marker-icon-2x.png";
import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";

const ORANGE = "#ff6a00";

// Fix Leaflet default markers in bundlers (Vite/Webpack)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2xUrl,
  iconUrl: markerIconUrl,
  shadowUrl: markerShadowUrl,
});

/* ---------------- PAGE ---------------- */

export default function FindSupplierPage() {
  const [query, setQuery] = useState("SY1 1AA");
  const [searching, setSearching] = useState(false);
  const [geoError, setGeoError] = useState("");
  const [clientPoint, setClientPoint] = useState(null); // { lat, lng, label }
  const [results, setResults] = useState([]); // suppliers sorted by distance with .distanceMi
  const [page, setPage] = useState(0);

  const [openBecome, setOpenBecome] = useState(false);

  const pageSize = 2;

  const suppliers = useMemo(() => EXAMPLE_SUPPLIERS, []);

  const pageCount = useMemo(() => {
    if (!results.length) return 0;
    return Math.ceil(results.length / pageSize);
  }, [results.length]);

  const visibleResults = useMemo(() => {
    const start = page * pageSize;
    return results.slice(start, start + pageSize);
  }, [results, page]);

  // Compute bounds-ish center: prefer client, else first supplier.
  const mapCenter = useMemo(() => {
    if (clientPoint) return [clientPoint.lat, clientPoint.lng];
    if (suppliers.length) return [suppliers[0].lat, suppliers[0].lng];
    return [52.4862, -1.8904]; // Birmingham fallback
  }, [clientPoint, suppliers]);

  const onSearch = async () => {
    setGeoError("");
    setSearching(true);
    setPage(0);

    try {
      const q = String(query || "").trim();
      if (!q) {
        setGeoError("Please enter a UK postcode, town, or address.");
        setSearching(false);
        return;
      }

      const client = await geocodeUK(q);
      if (!client) {
        setGeoError("No location found. Try a postcode, town, or a more specific address.");
        setSearching(false);
        return;
      }

      const scored = suppliers
        .map((s) => {
          const dKm = haversineKm(client.lat, client.lng, s.lat, s.lng);
          const dMi = dKm * 0.621371;
          return { ...s, distanceMi: dMi };
        })
        .sort((a, b) => a.distanceMi - b.distanceMi);

      setClientPoint({ lat: client.lat, lng: client.lng, label: client.label });
      setResults(scored);
    } catch (e) {
      setGeoError("Geocoding failed. Please try again in a moment.");
    } finally {
      setSearching(false);
    }
  };

  const onUseMyLocation = () => {
    setGeoError("");
    setSearching(true);
    setPage(0);

    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported in this browser.");
      setSearching(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        const scored = suppliers
          .map((s) => {
            const dKm = haversineKm(lat, lng, s.lat, s.lng);
            const dMi = dKm * 0.621371;
            return { ...s, distanceMi: dMi };
          })
          .sort((a, b) => a.distanceMi - b.distanceMi);

        setClientPoint({ lat, lng, label: "Your location" });
        setResults(scored);
        setSearching(false);
      },
      () => {
        setGeoError("Location access was denied. Please enter a postcode instead.");
        setSearching(false);
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 }
    );
  };

  // Auto-search once so page isn't empty (optional)
  useEffect(() => {
    onSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showingText = useMemo(() => {
    if (!results.length) return "";
    const start = page * pageSize + 1;
    const end = Math.min((page + 1) * pageSize, results.length);
    return `Showing ${start}-${end} of ${results.length}`;
  }, [page, pageSize, results.length]);

  // ---------------- TOP BAR PIN (normal at load, fixed when scrolling down) ----------------
  // If you have a fixed global navbar at the top, set this to its height (px).
  // If not, keep it at 0.
  const NAVBAR_OFFSET = 0;

  const topBarRef = useRef(null);
  const topBarSentinelRef = useRef(null);
  const [isPinned, setIsPinned] = useState(false);
  const [topBarHeight, setTopBarHeight] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      const el = topBarRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setTopBarHeight(Math.ceil(rect.height));
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const getTriggerY = () => {
      const s = topBarSentinelRef.current;
      if (!s) return 0;
      const rect = s.getBoundingClientRect();
      return rect.top + window.scrollY;
    };

    const onScroll = () => {
      const triggerY = getTriggerY();
      const shouldPin = window.scrollY >= triggerY - NAVBAR_OFFSET;
      setIsPinned(shouldPin);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [NAVBAR_OFFSET]);
  // ---------------------------------------------------------------------------------------

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        bgcolor: "#000",
        color: "#fff",
        minHeight: "100svh",
        overflow: "hidden",
        py: { xs: 3, sm: 3, md: 4 },
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
          width: "min(1280px, 96%)",
          mx: "auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Sentinel: when it reaches the top, we pin the bar */}
        <Box ref={topBarSentinelRef} sx={{ height: 1 }} />

        {/* Placeholder to avoid layout jump when the bar becomes fixed */}
        {isPinned ? <Box sx={{ height: topBarHeight, mb: { xs: 3, md: 3.5 } }} /> : null}

        {/* Top bar */}
        <Box
          ref={topBarRef}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            justifyContent: "space-between",
            mb: isPinned ? 0 : { xs: 3, md: 3.5 },

            position: isPinned ? "fixed" : "relative",
            top: isPinned ? `${NAVBAR_OFFSET}px` : "auto",
            left: isPinned ? 0 : "auto",
            right: isPinned ? 0 : "auto",
            zIndex: isPinned ? 1200 : "auto",

            px: isPinned ? { xs: "max(12px, 2vw)", md: "max(18px, 3vw)" } : 0,
            py: isPinned ? 2 : 0,

            background: isPinned ? "rgba(0,0,0,0.70)" : "transparent",
            backdropFilter: isPinned ? "blur(10px)" : "none",
            borderBottom: isPinned ? "1px solid rgba(255,255,255,0.08)" : "none",
          }}
        >
         <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
  {isPinned ? (
    <>
      <Box
        component="img"
        src="/glogo1.png"
        alt="GRFlex"
        sx={{ height: 26, width: "auto", display: "block", opacity: 0.95 }}
      />
      <Divider orientation="vertical" flexItem sx={{ borderColor: "rgba(255,255,255,0.10)", mx: 0.5 }} />
    </>
  ) : null}

  <Typography
    sx={{
      fontWeight: 900,
      letterSpacing: "-0.02em",
      fontSize: { xs: 18, sm: 20 },
    }}
  >
    Where to buy GRFlex Waterproof
  </Typography>
</Box>


          <Button
            variant="outlined"
            onClick={() => setOpenBecome((v) => !v)}
            sx={{
              borderRadius: 999,
              textTransform: "none",
              px: 2.2,
              py: 1,
              color: "rgba(255,255,255,0.85)",
              borderColor: "rgba(255,106,0,0.55)",
              bgcolor: "rgba(255,255,255,0.02)",
              "&:hover": { borderColor: "rgba(255,106,0,0.75)", bgcolor: "rgba(255,255,255,0.04)" },
            }}
          >
            Become a supplier
          </Button>
        </Box>

        {/* Intro */}
        <Typography
          sx={{
            color: "rgba(255,255,255,0.78)",
            fontSize: { xs: 15.5, sm: 16.5 },
            lineHeight: 1.75,
            maxWidth: 860,
            mb: { xs: 2.5, md: 3 },
          }}
        >
          Enter a UK postcode, town, or address to see nearby distribuitors. Results are ordered by proximity.
        </Typography>

        {/* Become supplier form (collapse) */}
        <Collapse in={openBecome} timeout={280}>
          <Box
            sx={{
              border: "1px solid rgba(255,106,0,0.35)",
              bgcolor: "rgba(255,255,255,0.02)",
              backdropFilter: "blur(8px)",
              borderRadius: 3,
              p: { xs: 2.5, sm: 3, md: 3.5 },
              boxShadow: "0 40px 120px rgba(0,0,0,0.65)",
              mb: { xs: 2.5, md: 3 },
            }}
          >
            <Typography sx={{ fontWeight: 900, fontSize: 18, mb: 0.75 }}>Become a supplier</Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.7, mb: 2 }}>
              Submit your details and we’ll review your request. Suppliers are added only after approval.
            </Typography>

            <BecomeSupplierForm onDone={() => setOpenBecome(false)} />
          </Box>
        </Collapse>

        {/* Search bar */}
        <Box
          sx={{
            border: "1px solid rgba(255,106,0,0.35)",
            bgcolor: "rgba(255,255,255,0.02)",
            backdropFilter: "blur(8px)",
            borderRadius: 3,
            p: { xs: 2.25, sm: 2.5, md: 2.75 },
            boxShadow: "0 40px 120px rgba(0,0,0,0.65)",
            mb: { xs: 2.5, md: 3 },
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr auto auto" },
              gap: 1.4,
              alignItems: "center",
            }}
          >
            <TextField
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              label="Postcode / Town / Address"
              placeholder="e.g. SY1 1AA, Shrewsbury, Manchester"
              fullWidth
              variant="outlined"
              InputLabelProps={{ style: { color: "rgba(255,255,255,0.70)", fontSize: 13 } }}
              inputProps={{ style: { color: "#fff", fontSize: 16 } }}
              sx={fieldSx}
            />

            <Button
              onClick={onSearch}
              disabled={searching}
              variant="contained"
              disableElevation
              sx={{
                bgcolor: ORANGE,
                color: "#000",
                fontWeight: 900,
                borderRadius: 999,
                px: 2.6,
                py: 1.15,
                textTransform: "none",
                "&:hover": { bgcolor: ORANGE, filter: "brightness(1.05)" },
                minHeight: 44,
              }}
            >
              {searching ? <CircularProgress size={18} /> : "Search"}
            </Button>

            <Button
              onClick={onUseMyLocation}
              disabled={searching}
              variant="outlined"
              sx={{
                borderRadius: 999,
                textTransform: "none",
                px: 2.2,
                py: 1.15,
                color: "rgba(255,255,255,0.85)",
                borderColor: "rgba(255,255,255,0.18)",
                bgcolor: "rgba(255,255,255,0.02)",
                "&:hover": { borderColor: "rgba(255,255,255,0.28)", bgcolor: "rgba(255,255,255,0.04)" },
                minHeight: 44,
              }}
            >
              Use my location
            </Button>
          </Box>

          {geoError ? (
            <Box sx={{ mt: 1.6 }}>
              <Alert
                severity="warning"
                sx={{
                  bgcolor: "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.86)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  "& .MuiAlert-icon": { color: ORANGE },
                }}
              >
                {geoError}
              </Alert>
            </Box>
          ) : null}
        </Box>

        {/* Main 2-column layout */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.15fr 0.85fr" },
            gap: { xs: 2, md: 2 },
            alignItems: "stretch",
          }}
        >
          {/* MAP */}
          <Box
            sx={{
              border: "1px solid rgba(255,255,255,0.10)",
              bgcolor: "rgba(255,255,255,0.02)",
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: "0 40px 120px rgba(0,0,0,0.65)",
              height: { xs: 360, md: 480 },
              position: "relative",
            }}
          >
            <Box sx={{ position: "absolute", inset: 0 }}>
              <MapContainer
                center={mapCenter}
                zoom={clientPoint ? 10 : 6}
                scrollWheelZoom={false}
                style={{ width: "100%", height: "100%" }}
              >
                <MapAutoCenter target={clientPoint ? [clientPoint.lat, clientPoint.lng] : mapCenter} />

                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {clientPoint ? (
                  <Marker position={[clientPoint.lat, clientPoint.lng]}>
                    <Popup>
                      <strong>Customer location</strong>
                      <br />
                      {clientPoint.label}
                    </Popup>
                  </Marker>
                ) : null}

                {(visibleResults.length ? visibleResults : results.slice(0, 5)).map((s) => (
                  <Marker key={s.id} position={[s.lat, s.lng]}>
                    <Popup>
                      <strong>{s.name}</strong>
                      <br />
                      {s.city}, {s.postcode}
                      <br />
                      {s.phone}
                      <br />
                      <a href={googleDirectionsUrl(s.lat, s.lng, s.name)} target="_blank" rel="noreferrer">
                        Directions
                      </a>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </Box>

            {/* Small overlay label */}
            <Box
              sx={{
                position: "absolute",
                left: 14,
                top: 14,
                display: "flex",
                alignItems: "center",
                gap: 1.2,
                bgcolor: "rgba(0,0,0,0.45)",
                border: "1px solid rgba(255,255,255,0.14)",
                borderRadius: 999,
                px: 1.4,
                py: 0.8,
                backdropFilter: "blur(6px)",
              }}
            >
              <Box sx={{ width: 10, height: 10, border: `1px solid ${ORANGE}`, opacity: 0.9 }} />
              <Typography sx={{ fontSize: 12.5, color: "rgba(255,255,255,0.82)", letterSpacing: "0.08em" }}>
                MAP
              </Typography>
            </Box>
          </Box>

          {/* LIST */}
          <Box
            sx={{
              border: "1px solid rgba(255,255,255,0.10)",
              bgcolor: "rgba(255,255,255,0.02)",
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: "0 40px 120px rgba(0,0,0,0.65)",
              height: { xs: "auto", md: 480 },
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box sx={{ p: 2.2, pb: 1.6 }}>
              <Typography
                sx={{
                  color: ORANGE,
                  textTransform: "uppercase",
                  fontWeight: 700,
                  letterSpacing: { xs: "0.18em", md: "0.22em" },
                  fontSize: { xs: 12, md: 13 },
                  opacity: 0.95,
                  mb: 0.8,
                }}
              >
                SUPPLIERS NEAR YOU
              </Typography>

              <Typography sx={{ color: "rgba(255,255,255,0.72)", fontSize: 13.5 }}>
                {results.length ? showingText : "Search to see suppliers near you."}
              </Typography>
            </Box>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.10)" }} />

            <Box
              sx={{
                p: 2.2,
                pt: 2,
                display: "grid",
                gap: 1.2,
                flex: "1 1 auto",
                overflow: { md: "hidden" },
              }}
            >
              {!results.length ? (
                <Box
                  sx={{
                    border: "1px dashed rgba(255,255,255,0.18)",
                    borderRadius: 2.5,
                    p: 2,
                    bgcolor: "rgba(0,0,0,0.15)",
                  }}
                >
                  <Typography sx={{ fontWeight: 900, mb: 0.6 }}>No results yet</Typography>
                  <Typography sx={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.7 }}>
                    Enter a postcode or town to find suppliers. If none are available in your area yet, you can contact us
                    or submit a supplier request.
                  </Typography>

                  <Box sx={{ display: "flex", gap: 1.2, mt: 2 }}>
                    <Button
                      href="/contact"
                      variant="contained"
                      disableElevation
                      sx={{
                        bgcolor: ORANGE,
                        color: "#000",
                        fontWeight: 900,
                        borderRadius: 999,
                        px: 2.2,
                        textTransform: "none",
                        "&:hover": { bgcolor: ORANGE, filter: "brightness(1.05)" },
                      }}
                    >
                      Contact us
                    </Button>

                    <Button
                      onClick={() => setOpenBecome(true)}
                      variant="outlined"
                      sx={{
                        borderRadius: 999,
                        textTransform: "none",
                        px: 2.2,
                        color: "rgba(255,255,255,0.85)",
                        borderColor: "rgba(255,106,0,0.55)",
                        "&:hover": { borderColor: "rgba(255,106,0,0.75)" },
                      }}
                    >
                      Become a supplier
                    </Button>
                  </Box>
                </Box>
              ) : (
                visibleResults.map((s) => <SupplierCard key={s.id} supplier={s} />)
              )}
            </Box>

            {results.length ? (
              <Box sx={{ p: 2.2, pt: 0, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
                <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: 12.5 }}>
                  {clientPoint ? `From: ${clientPoint.label}` : ""}
                </Typography>

                <Box sx={{ display: "flex", gap: 1.2 }}>
                  <Button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    variant="outlined"
                    sx={pagerBtnSx}
                  >
                    Prev
                  </Button>

                  <Button
                    onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                    disabled={pageCount <= 1 || page >= pageCount - 1}
                    variant="outlined"
                    sx={pagerBtnSx}
                  >
                    Next
                  </Button>
                </Box>
              </Box>
            ) : null}
          </Box>
        </Box>

        {/* Bottom note */}
        <Box sx={{ mt: 3 }}>
          <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: 13.5, lineHeight: 1.7 }}>
            Supplier availability may vary. If you’re unsure which supplier to use, visit the contact page and we’ll point
            you in the right direction.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

/* ---------------- COMPONENTS ---------------- */

function SupplierCard({ supplier }) {
  const isMobile = useMediaQuery("(max-width:599px)");

  return (
    <Box
      sx={{
        border: "1px solid rgba(255,255,255,0.10)",
        bgcolor: "rgba(0,0,0,0.20)",
        borderRadius: 2.6,
        p: 2,
        boxShadow: "0 24px 70px rgba(0,0,0,0.45)",
        transition: "border-color 220ms ease, transform 220ms ease",
        "&:hover": { borderColor: "rgba(255,106,0,0.45)", transform: "translateY(-2px)" },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1.5 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 900, fontSize: 16.5, color: "rgba(255,255,255,0.92)", mb: 0.2 }}>
            {supplier.name}
          </Typography>

          <Typography sx={{ color: "rgba(255,255,255,0.65)", fontSize: 13.5, lineHeight: 1.5 }}>
            {supplier.type} · {supplier.city}, {supplier.postcode}
          </Typography>

          <Typography sx={{ color: "rgba(255,255,255,0.70)", fontSize: 13.5, mt: 0.8 }}>
            {supplier.phone}
          </Typography>
        </Box>

        <Box
          sx={{
            flex: "0 0 auto",
            px: 1.2,
            py: 0.75,
            borderRadius: 999,
            border: `1px solid rgba(255,106,0,0.55)`,
            color: ORANGE,
            fontWeight: 900,
            fontSize: 12.5,
            letterSpacing: "0.04em",
            height: "fit-content",
            opacity: 0.95,
          }}
        >
          {Number.isFinite(supplier.distanceMi) ? `${supplier.distanceMi.toFixed(1)} mi` : "—"}
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 1.2, mt: 1.6 }}>
        <Button
          component="a"
          href={googleDirectionsUrl(supplier.lat, supplier.lng, supplier.name)}
          target="_blank"
          rel="noreferrer"
          variant="contained"
          disableElevation
          sx={{
            bgcolor: ORANGE,
            color: "#000",
            fontWeight: 900,
            borderRadius: 999,
            px: 2.0,
            textTransform: "none",
            "&:hover": { bgcolor: ORANGE, filter: "brightness(1.05)" },
          }}
        >
          Directions
        </Button>

        {isMobile ? (
          <Button
            component="a"
            href={`tel:${supplier.phone.replace(/\s+/g, "")}`}
            variant="outlined"
            sx={{
              borderRadius: 999,
              textTransform: "none",
              px: 2.0,
              color: "rgba(255,255,255,0.85)",
              borderColor: "rgba(255,255,255,0.18)",
              bgcolor: "rgba(255,255,255,0.02)",
              "&:hover": { borderColor: "rgba(255,255,255,0.28)", bgcolor: "rgba(255,255,255,0.04)" },
            }}
          >
            Call
          </Button>
        ) : null}
      </Box>
    </Box>
  );
}

function BecomeSupplierForm({ onDone }) {
  const [form, setForm] = useState({
    company: "",
    address: "",
    phone: "",
    contactFirst: "",
    contactLast: "",
    email: "",
    email2: "",
  });

  const [touched, setTouched] = useState({});
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState({ ok: false, msg: "" });

  const setField = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const emailMatch = form.email.trim().toLowerCase() === form.email2.trim().toLowerCase();

  const errors = useMemo(() => {
    const e = {};
    if (!form.company.trim()) e.company = "Company name is required.";
    if (!form.address.trim()) e.address = "Address is required.";
    if (!form.phone.trim()) e.phone = "Phone is required.";
    if (!form.contactFirst.trim()) e.contactFirst = "First name is required.";
    if (!form.contactLast.trim()) e.contactLast = "Last name is required.";
    if (!isEmail(form.email)) e.email = "Enter a valid email.";
    if (!isEmail(form.email2)) e.email2 = "Confirm your email.";
    if (isEmail(form.email) && isEmail(form.email2) && !emailMatch) e.email2 = "Emails do not match.";
    return e;
  }, [form, emailMatch]);

  const canSubmit = Object.keys(errors).length === 0;

  const onSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      company: true,
      address: true,
      phone: true,
      contactFirst: true,
      contactLast: true,
      email: true,
      email2: true,
    });

    if (!canSubmit) return;

    setSending(true);
    setStatus({ ok: false, msg: "" });

    try {
      // TODO: Integrate EmailJS here (same as your site).
      // For now, we simulate success and you can wire EmailJS after.
      await new Promise((r) => setTimeout(r, 600));

      setStatus({ ok: true, msg: "Thanks. Your request has been received and will be reviewed." });
      setForm({
        company: "",
        address: "",
        phone: "",
        contactFirst: "",
        contactLast: "",
        email: "",
        email2: "",
      });
      setTouched({});
      if (onDone) onDone();
    } catch {
      setStatus({ ok: false, msg: "Something went wrong. Please try again." });
    } finally {
      setSending(false);
    }
  };

  return (
    <Box component="form" onSubmit={onSubmit}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 1.4,
        }}
      >
        <TextField
          value={form.company}
          onChange={(e) => setField("company", e.target.value)}
          onBlur={() => setTouched((p) => ({ ...p, company: true }))}
          label="Company name"
          fullWidth
          InputLabelProps={{ style: { color: "rgba(255,255,255,0.70)", fontSize: 13 } }}
          inputProps={{ style: { color: "#fff", fontSize: 16 } }}
          sx={fieldSx}
          error={!!touched.company && !!errors.company}
          helperText={touched.company ? errors.company || " " : " "}
        />

        <TextField
          value={form.phone}
          onChange={(e) => setField("phone", e.target.value)}
          onBlur={() => setTouched((p) => ({ ...p, phone: true }))}
          label="Phone"
          fullWidth
          InputLabelProps={{ style: { color: "rgba(255,255,255,0.70)", fontSize: 13 } }}
          inputProps={{ style: { color: "#fff", fontSize: 16 } }}
          sx={fieldSx}
          error={!!touched.phone && !!errors.phone}
          helperText={touched.phone ? errors.phone || " " : " "}
        />

        <TextField
          value={form.address}
          onChange={(e) => setField("address", e.target.value)}
          onBlur={() => setTouched((p) => ({ ...p, address: true }))}
          label="Address"
          fullWidth
          InputLabelProps={{ style: { color: "rgba(255,255,255,0.70)", fontSize: 13 } }}
          inputProps={{ style: { color: "#fff", fontSize: 16 } }}
          sx={fieldSx}
          error={!!touched.address && !!errors.address}
          helperText={touched.address ? errors.address || " " : " "}
        />

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.4 }}>
          <TextField
            value={form.contactFirst}
            onChange={(e) => setField("contactFirst", e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, contactFirst: true }))}
            label="Contact first name"
            fullWidth
            InputLabelProps={{ style: { color: "rgba(255,255,255,0.70)", fontSize: 13 } }}
            inputProps={{ style: { color: "#fff", fontSize: 16 } }}
            sx={fieldSx}
            error={!!touched.contactFirst && !!errors.contactFirst}
            helperText={touched.contactFirst ? errors.contactFirst || " " : " "}
          />
          <TextField
            value={form.contactLast}
            onChange={(e) => setField("contactLast", e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, contactLast: true }))}
            label="Contact last name"
            fullWidth
            InputLabelProps={{ style: { color: "rgba(255,255,255,0.70)", fontSize: 13 } }}
            inputProps={{ style: { color: "#fff", fontSize: 16 } }}
            sx={fieldSx}
            error={!!touched.contactLast && !!errors.contactLast}
            helperText={touched.contactLast ? errors.contactLast || " " : " "}
          />
        </Box>

        <TextField
          value={form.email}
          onChange={(e) => setField("email", e.target.value)}
          onBlur={() => setTouched((p) => ({ ...p, email: true }))}
          label="Email"
          fullWidth
          InputLabelProps={{ style: { color: "rgba(255,255,255,0.70)", fontSize: 13 } }}
          inputProps={{ style: { color: "#fff", fontSize: 16 } }}
          sx={fieldSx}
          error={!!touched.email && !!errors.email}
          helperText={touched.email ? errors.email || " " : " "}
        />

        <TextField
          value={form.email2}
          onChange={(e) => setField("email2", e.target.value)}
          onBlur={() => setTouched((p) => ({ ...p, email2: true }))}
          label="Confirm email"
          fullWidth
          InputLabelProps={{ style: { color: "rgba(255,255,255,0.70)", fontSize: 13 } }}
          inputProps={{ style: { color: "#fff", fontSize: 16 } }}
          sx={fieldSx}
          error={!!touched.email2 && !!errors.email2}
          helperText={touched.email2 ? errors.email2 || " " : " "}
        />
      </Box>

      <Box sx={{ display: "flex", gap: 1.2, mt: 2 }}>
        <Button
          type="submit"
          disabled={sending || !canSubmit}
          variant="contained"
          disableElevation
          sx={{
            bgcolor: ORANGE,
            color: "#000",
            fontWeight: 900,
            borderRadius: 999,
            px: 2.4,
            py: 1.1,
            textTransform: "none",
            "&:hover": { bgcolor: ORANGE, filter: "brightness(1.05)" },
          }}
        >
          {sending ? <CircularProgress size={18} /> : "Submit request"}
        </Button>

        <Button
          type="button"
          onClick={onDone}
          variant="outlined"
          sx={{
            borderRadius: 999,
            textTransform: "none",
            px: 2.2,
            color: "rgba(255,255,255,0.85)",
            borderColor: "rgba(255,255,255,0.18)",
            bgcolor: "rgba(255,255,255,0.02)",
            "&:hover": { borderColor: "rgba(255,255,255,0.28)", bgcolor: "rgba(255,255,255,0.04)" },
          }}
        >
          Close
        </Button>
      </Box>

      {status.msg ? (
        <Box sx={{ mt: 1.6 }}>
          <Alert
            severity={status.ok ? "success" : "error"}
            sx={{
              bgcolor: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.86)",
              border: "1px solid rgba(255,255,255,0.10)",
              "& .MuiAlert-icon": { color: status.ok ? "rgba(120,255,170,0.9)" : ORANGE },
            }}
          >
            {status.msg}
          </Alert>
        </Box>
      ) : null}
    </Box>
  );
}

/* ---------------- MAP HELPERS ---------------- */

function MapAutoCenter({ target }) {
  const map = useMap();
  const last = useRef(null);

  useEffect(() => {
    if (!target) return;
    const key = Array.isArray(target) ? `${target[0].toFixed(6)}|${target[1].toFixed(6)}` : "";
    if (key && key !== last.current) {
      last.current = key;
      map.setView(target, 10, { animate: true });
    }
  }, [map, target]);

  return null;
}

/* ---------------- STYLES ---------------- */

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    color: "#fff",
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.02)",
    "& fieldset": { borderColor: "rgba(255,255,255,0.16)" },
    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.26)" },
    "&.Mui-focused fieldset": { borderColor: "rgba(255,106,0,0.75)" },
  },
  "& .MuiSelect-icon": { color: "rgba(255,255,255,0.65)" },
  "& input::placeholder": { color: "rgba(255,255,255,0.35)" },
};

const pagerBtnSx = {
  borderRadius: 999,
  textTransform: "none",
  px: 2.0,
  py: 0.9,
  color: "rgba(255,255,255,0.78)",
  borderColor: "rgba(255,255,255,0.18)",
  bgcolor: "rgba(255,255,255,0.03)",
  "&:hover": { borderColor: "rgba(255,255,255,0.28)", bgcolor: "rgba(255,255,255,0.06)" },
};

/* ---------------- DATA (5 EXAMPLES) ---------------- */

const EXAMPLE_SUPPLIERS = [
  {
    id: "s1",
    name: "Shrewsbury Roofing Supplies",
    type: "Stockist",
    city: "Shrewsbury",
    postcode: "SY1",
    phone: "01952 000000",
    lat: 52.7073,
    lng: -2.7553,
  },
  {
    id: "s2",
    name: "Manchester Flat Roofing Centre",
    type: "Stockist",
    city: "Manchester",
    postcode: "M1",
    phone: "0161 000000",
    lat: 53.4808,
    lng: -2.2426,
  },
  {
    id: "s3",
    name: "Birmingham Roofing & Waterproofing",
    type: "Approved installer",
    city: "Birmingham",
    postcode: "B1",
    phone: "0121 000000",
    lat: 52.4862,
    lng: -1.8904,
  },
  {
    id: "s4",
    name: "Leeds Roofing Trade Counter",
    type: "Stockist",
    city: "Leeds",
    postcode: "LS1",
    phone: "0113 000000",
    lat: 53.8008,
    lng: -1.5491,
  },
  {
    id: "s5",
    name: "London Roofing Distribution",
    type: "Training centre",
    city: "London",
    postcode: "E1",
    phone: "020 0000 0000",
    lat: 51.5072,
    lng: -0.1276,
  },
];

/* ---------------- UTILS ---------------- */

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(d) {
  return d * (Math.PI / 180);
}

function isEmail(v) {
  const s = String(v || "").trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function googleDirectionsUrl(lat, lng, label) {
  const q = encodeURIComponent(label || "");
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${q}`;
}

/**
 * UK geocoding via OpenStreetMap Nominatim
 * NOTE: This is fine to start. For higher traffic, consider caching or a paid geocoding provider.
 */
async function geocodeUK(q) {
  const url =
    "https://nominatim.openstreetmap.org/search?" +
    new URLSearchParams({
      q,
      format: "json",
      addressdetails: "1",
      limit: "1",
      countrycodes: "gb",
    });

  const res = await fetch(url, {
    headers: {
      // Nominatim recommends a proper UA; browsers restrict custom UA, so keep it simple.
      Accept: "application/json",
    },
  });

  if (!res.ok) return null;
  const data = await res.json();
  if (!Array.isArray(data) || !data.length) return null;

  const hit = data[0];
  const lat = Number(hit.lat);
  const lng = Number(hit.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  return {
    lat,
    lng,
    label: hit.display_name || q,
  };
}
