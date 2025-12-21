// src/pages/ContactPage.jsx
import React, { useMemo, useRef, useLayoutEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  MenuItem,
  Divider,
  useMediaQuery,
} from "@mui/material";

const ORANGE = "#ff6a00";

export default function ContactPage() {
  const isMdUp = useMediaQuery("(min-width:900px)");

  // ---- FORM STATE ----
  const [form, setForm] = useState({
    enquiryType: "sales", // motivo
    customerType: "company", // particular/empresa
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    postcode: "",
    message: "",
  });

  const [touched, setTouched] = useState({});
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState({ ok: false, msg: "" });

  const setField = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const enquiryOptions = useMemo(
    () => [
      { value: "sales", label: "Sales enquiry" },
      { value: "technical", label: "Technical support" },
      { value: "training", label: "Training booking" },
      { value: "supplier", label: "Become a supplier" },
      { value: "other", label: "Other" },
    ],
    []
  );

  const customerOptions = useMemo(
    () => [
      { value: "individual", label: "Individual" },
      { value: "company", label: "Company" },
    ],
    []
  );

  const errors = useMemo(() => {
    const e = {};
    if (!form.enquiryType) e.enquiryType = "Select a reason for your enquiry.";
    if (!form.customerType) e.customerType = "Select if you are an individual or company.";
    if (!form.firstName.trim()) e.firstName = "First name is required.";
    if (!form.lastName.trim()) e.lastName = "Last name is required.";
    if (!form.phone.trim()) e.phone = "Phone is required.";
    if (!isEmail(form.email)) e.email = "Enter a valid email.";
    if (!form.message.trim()) e.message = "Message is required.";
    // postcode optional, but if provided, validate lightly
    if (form.postcode.trim() && form.postcode.trim().length < 3) e.postcode = "Enter a valid postcode.";
    return e;
  }, [form]);

  const canSubmit = Object.keys(errors).length === 0;

  const onSubmit = async (e) => {
    e.preventDefault();

    setTouched({
      enquiryType: true,
      customerType: true,
      firstName: true,
      lastName: true,
      phone: true,
      email: true,
      postcode: true,
      message: true,
    });

    if (!canSubmit) return;

    setSending(true);
    setStatus({ ok: false, msg: "" });

    try {
      // TODO: Integrate EmailJS (same pattern as your site)
      await new Promise((r) => setTimeout(r, 700));

      setStatus({ ok: true, msg: "Thanks. We’ve received your message and will get back to you shortly." });
      setForm({
        enquiryType: "sales",
        customerType: "company",
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        postcode: "",
        message: "",
      });
      setTouched({});
    } catch {
      setStatus({ ok: false, msg: "Something went wrong. Please try again." });
    } finally {
      setSending(false);
    }
  };

  // ---- MATCH HEIGHT: info card = form height (desktop only) ----
  const formCardRef = useRef(null);
  const infoCardRef = useRef(null);

  useLayoutEffect(() => {
    const formEl = formCardRef.current;
    const infoEl = infoCardRef.current;
    if (!formEl || !infoEl) return;

    const apply = () => {
      // resetea para medir altura real
      infoEl.style.minHeight = "0px";

      if (!isMdUp) {
        // en móvil no hace falta igualar (stack)
        infoEl.style.minHeight = "0px";
        return;
      }

      const h = Math.ceil(formEl.getBoundingClientRect().height);
      if (Number.isFinite(h) && h > 0) infoEl.style.minHeight = `${h}px`;
    };

    apply();

    // Observa cambios en el form (errores, helperText, etc.)
    const ro = new ResizeObserver(() => apply());
    ro.observe(formEl);

    // También cuando cambia el viewport
    window.addEventListener("resize", apply);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", apply);
    };
  }, [isMdUp, form, touched, sending, status.msg]);

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
        {/* Header (page) */}
        <Box sx={{ mb: { xs: 3, md: 4 } }}>
          <Typography sx={{ fontWeight: 950, letterSpacing: "-0.03em", fontSize: { xs: 30, sm: 34, md: 40 } }}>
            Contact
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.8, maxWidth: 820, mt: 1 }}>
            Send us a message and we’ll get back to you. For urgent technical advice, call{" "}
            <Box component="span" sx={{ color: "rgba(255,255,255,0.92)", fontWeight: 800 }}>
              01948 808659
            </Box>
            .
          </Typography>
        </Box>

        {/* 2-column layout */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.1fr 0.9fr" },
            gap: { xs: 2, md: 2.2 },
            alignItems: "start",
          }}
        >
          {/* FORM */}
          <Box
            ref={formCardRef}
            sx={{
              border: "1px solid rgba(255,106,0,0.35)",
              bgcolor: "rgba(255,255,255,0.02)",
              backdropFilter: "blur(8px)",
              borderRadius: 3,
              p: { xs: 2.25, sm: 2.75, md: 3.25 },
              boxShadow: "0 40px 120px rgba(0,0,0,0.65)",
            }}
          >
            <Typography sx={{ fontWeight: 900, fontSize: 18, mb: 0.75 }}>Send a message</Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.70)", lineHeight: 1.7, mb: 2 }}>
              Please fill in the form below. Fields marked are required.
            </Typography>

            <Box component="form" onSubmit={onSubmit}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 1.4,
                }}
              >
                {/* Motivo (dropdown) */}
                <TextField
                  select
                  value={form.enquiryType}
                  onChange={(e) => setField("enquiryType", e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, enquiryType: true }))}
                  label="Reason for enquiry"
                  fullWidth
                  InputLabelProps={{ style: { color: "rgba(255,255,255,0.70)", fontSize: 13 } }}
                  sx={fieldSx}
                  error={!!touched.enquiryType && !!errors.enquiryType}
                  helperText={touched.enquiryType ? errors.enquiryType || " " : " "}
                >
                  {enquiryOptions.map((o) => (
                    <MenuItem key={o.value} value={o.value}>
                      {o.label}
                    </MenuItem>
                  ))}
                </TextField>

                {/* Particular / Empresa (dropdown) */}
                <TextField
                  select
                  value={form.customerType}
                  onChange={(e) => setField("customerType", e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, customerType: true }))}
                  label="You are a"
                  fullWidth
                  InputLabelProps={{ style: { color: "rgba(255,255,255,0.70)", fontSize: 13 } }}
                  sx={fieldSx}
                  error={!!touched.customerType && !!errors.customerType}
                  helperText={touched.customerType ? errors.customerType || " " : " "}
                >
                  {customerOptions.map((o) => (
                    <MenuItem key={o.value} value={o.value}>
                      {o.label}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  value={form.firstName}
                  onChange={(e) => setField("firstName", e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, firstName: true }))}
                  label="First name"
                  fullWidth
                  InputLabelProps={{ style: { color: "rgba(255,255,255,0.70)", fontSize: 13 } }}
                  sx={fieldSx}
                  error={!!touched.firstName && !!errors.firstName}
                  helperText={touched.firstName ? errors.firstName || " " : " "}
                />

                <TextField
                  value={form.lastName}
                  onChange={(e) => setField("lastName", e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, lastName: true }))}
                  label="Last name"
                  fullWidth
                  InputLabelProps={{ style: { color: "rgba(255,255,255,0.70)", fontSize: 13 } }}
                  sx={fieldSx}
                  error={!!touched.lastName && !!errors.lastName}
                  helperText={touched.lastName ? errors.lastName || " " : " "}
                />

                <TextField
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, phone: true }))}
                  label="Phone"
                  fullWidth
                  InputLabelProps={{ style: { color: "rgba(255,255,255,0.70)", fontSize: 13 } }}
                  sx={fieldSx}
                  error={!!touched.phone && !!errors.phone}
                  helperText={touched.phone ? errors.phone || " " : " "}
                />

                <TextField
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                  label="Email"
                  fullWidth
                  InputLabelProps={{ style: { color: "rgba(255,255,255,0.70)", fontSize: 13 } }}
                  sx={fieldSx}
                  error={!!touched.email && !!errors.email}
                  helperText={touched.email ? errors.email || " " : " "}
                />

                <TextField
                  value={form.postcode}
                  onChange={(e) => setField("postcode", e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, postcode: true }))}
                  label="Postcode (optional)"
                  fullWidth
                  InputLabelProps={{ style: { color: "rgba(255,255,255,0.70)", fontSize: 13 } }}
                  sx={fieldSx}
                  error={!!touched.postcode && !!errors.postcode}
                  helperText={touched.postcode ? errors.postcode || " " : " "}
                />

                <Box sx={{ display: { xs: "none", md: "block" } }} />
              </Box>

              <TextField
                value={form.message}
                onChange={(e) => setField("message", e.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, message: true }))}
                label="Message"
                fullWidth
                multiline
                // baja un poco la altura
                minRows={isMdUp ? 5 : 5}
                InputLabelProps={{ style: { color: "rgba(255,255,255,0.70)", fontSize: 13 } }}
                sx={{ ...fieldSx, mt: 1.4 }}
                error={!!touched.message && !!errors.message}
                helperText={touched.message ? errors.message || " " : " "}
              />

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
                    px: 2.6,
                    py: 1.1,
                    textTransform: "none",
                    "&:hover": { bgcolor: ORANGE, filter: "brightness(1.05)" },
                  }}
                >
                  {sending ? <CircularProgress size={18} /> : "Send message"}
                </Button>

                <Button
                  type="button"
                  onClick={() => {
                    setForm({
                      enquiryType: "sales",
                      customerType: "company",
                      firstName: "",
                      lastName: "",
                      phone: "",
                      email: "",
                      postcode: "",
                      message: "",
                    });
                    setTouched({});
                    setStatus({ ok: false, msg: "" });
                  }}
                  variant="outlined"
                  sx={{
                    borderRadius: 999,
                    textTransform: "none",
                    px: 2.4,
                    color: "rgba(255,255,255,0.85)",
                    borderColor: "rgba(255,255,255,0.18)",
                    bgcolor: "rgba(255,255,255,0.02)",
                    "&:hover": { borderColor: "rgba(255,255,255,0.28)", bgcolor: "rgba(255,255,255,0.04)" },
                  }}
                >
                  Reset
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
          </Box>

          {/* INFO CARD */}
          <Box
            ref={infoCardRef}
            sx={{
              border: "1px solid rgba(255,255,255,0.10)",
              bgcolor: "rgba(255,255,255,0.02)",
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: "0 40px 120px rgba(0,0,0,0.65)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box sx={{ p: 2.25 }}>
              <Typography sx={{ fontWeight: 900, fontSize: 16.5, mb: 0.75 }}>Contact details</Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.8 }}>
                Use the form for most enquiries. If you need immediate technical advice, call us.
              </Typography>
            </Box>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.10)" }} />

            <Box sx={{ p: 2.25, display: "grid", gap: 1.2 }}>
              <InfoRow label="Phone" value="01948 808659" />
              <InfoRow label="Email" value="info@grflex.co.uk" />
              <InfoRow label="Hours" value="Mon–Fri, 9:00–17:00" />
              <InfoRow label="Location" value="United Kingdom" />
            </Box>

            {/* Extra blocks to fill height nicely */}
            <Divider sx={{ borderColor: "rgba(255,255,255,0.10)" }} />

            <Box sx={{ p: 2.25 }}>
              <Typography sx={{ fontWeight: 900, mb: 0.7 }}>What to include</Typography>
              <Box sx={{ display: "grid", gap: 0.9 }}>
                <MiniLine title="Technical support" text="Roof type, photos, and brief issue summary." />
                <MiniLine title="Sales enquiry" text="Approx. roof size and location for a quick estimate." />
                <MiniLine title="Training" text="Preferred date and number of attendees." />
              </Box>
            </Box>

            <Box sx={{ flex: 1 }} />

            <Box sx={{ p: 2.25, pt: 0 }}>
              <Box
                sx={{
                  borderRadius: 3,
                  border: "1px solid rgba(255,106,0,0.25)",
                  bgcolor: "rgba(0,0,0,0.18)",
                  p: 2,
                }}
              >
                <Typography sx={{ fontWeight: 900, mb: 0.6 }}>Tip</Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.75 }}>
                  If you’re looking for a supplier, use the Find a Supplier page first. If you can’t find one nearby,
                  message us and we’ll advise.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Bottom note */}
        <Box sx={{ mt: 3 }}>
          <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: 13.5, lineHeight: 1.7 }}>
            By submitting this form you agree that we may contact you in relation to your enquiry.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

function InfoRow({ label, value }) {
  return (
    <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 2 }}>
      <Typography
        sx={{
          color: "rgba(255,255,255,0.55)",
          fontSize: 12.5,
          letterSpacing: "0.10em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </Typography>
      <Typography sx={{ color: "rgba(255,255,255,0.86)", fontWeight: 800, textAlign: "right" }}>{value}</Typography>
    </Box>
  );
}

function MiniLine({ title, text }) {
  return (
    <Box
      sx={{
        border: "1px solid rgba(255,255,255,0.10)",
        bgcolor: "rgba(0,0,0,0.14)",
        borderRadius: 2.5,
        p: 1.25,
      }}
    >
      <Typography sx={{ fontWeight: 900, fontSize: 13.5, color: "rgba(255,255,255,0.88)" }}>{title}</Typography>
      <Typography sx={{ color: "rgba(255,255,255,0.62)", fontSize: 13.5, lineHeight: 1.7, mt: 0.35 }}>
        {text}
      </Typography>
    </Box>
  );
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
  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.70)" },
  "& .MuiFormHelperText-root": { color: "rgba(255,255,255,0.45)" },
  "& .MuiSelect-icon": { color: "rgba(255,255,255,0.65)" },
  "& input::placeholder": { color: "rgba(255,255,255,0.35)" },
  "& textarea::placeholder": { color: "rgba(255,255,255,0.35)" },
  "& .MuiMenuItem-root": { color: "#000" },
};

/* ---------------- UTILS ---------------- */

function isEmail(v) {
  const s = String(v || "").trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}
