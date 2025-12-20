import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  useMediaQuery,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  MenuItem,
  Divider,
} from "@mui/material";

const ORANGE = "#ff6a00";

export default function CalculatorSection() {
  useMediaQuery("(min-width:900px)"); // kept (you may use later)

  // ---------- CONFIG ----------
  const TIN_KG = 15;
  const ACTIVATOR_PER_TIN_SUMMER = 1;
  const ACTIVATOR_PER_TIN_WINTER = 2;

  const ROLL_LONG_M2 = 1 * 180;
  const ROLL_SHORT_M2 = 1 * 25;

  const ASSUMED_TOTAL_COATS_KG_PER_M2 = 2.0;
  const ASSUMED_MATTING_FACTOR = 1.05;

  // ---------- STATE ----------
  const [roofUnit, setRoofUnit] = useState("m2");
  const [roofAreaInput, setRoofAreaInput] = useState("40");
  const [season, setSeason] = useState("summer"); // summer | winter

  const [mode, setMode] = useState("area"); // "area" | "dims"
  const [lengthInput, setLengthInput] = useState("8");
  const [widthInput, setWidthInput] = useState("5");

  // ---------- HELPERS ----------
  const safeNum = (v) => {
    const n = Number(String(v).replace(",", "."));
    return Number.isFinite(n) && n > 0 ? n : 0;
  };

  const areaM2 = useMemo(() => {
    if (mode === "dims") {
      const L = safeNum(lengthInput);
      const W = safeNum(widthInput);
      return L * W;
    }

    const a = safeNum(roofAreaInput);
    if (roofUnit === "m2") return a;
    return a;
  }, [mode, roofAreaInput, roofUnit, lengthInput, widthInput]);

  // ---------- CALCULATIONS ----------
  const approxKgNeeded = useMemo(() => {
    const kg = areaM2 * ASSUMED_TOTAL_COATS_KG_PER_M2;
    return kg > 0 ? kg : 0;
  }, [areaM2]);

  const tinsNeeded = useMemo(() => {
    if (!approxKgNeeded) return 0;
    return Math.max(1, Math.ceil(approxKgNeeded / TIN_KG));
  }, [approxKgNeeded]);

  const activatorBottles = useMemo(() => {
    if (!tinsNeeded) return 0;
    const perTin = season === "winter" ? ACTIVATOR_PER_TIN_WINTER : ACTIVATOR_PER_TIN_SUMMER;
    return tinsNeeded * perTin;
  }, [tinsNeeded, season]);

  const approxMattingM2 = useMemo(() => {
    if (!areaM2) return 0;
    return areaM2 * ASSUMED_MATTING_FACTOR;
  }, [areaM2]);

  const mattingRolls = useMemo(() => {
    if (!approxMattingM2) return { long: 0, short: 0 };

    let remaining = approxMattingM2;

    const long = Math.floor(remaining / ROLL_LONG_M2);
    remaining -= long * ROLL_LONG_M2;

    const short = Math.ceil(remaining / ROLL_SHORT_M2);
    return { long, short: Math.max(0, short) };
  }, [approxMattingM2]);

  const hasInput = areaM2 > 0;

  const activatorRuleText = useMemo(() => {
    const perTin = season === "winter" ? 2 : 1;
    return `Activator is required at ${perTin} bottle${perTin === 1 ? "" : "s"} per tin (${
      season === "winter" ? "Winter" : "Summer"
    }).`;
  }, [season]);

  const mattingRecommendationLine = useMemo(() => {
    if (!hasInput) return "Recommended: —";

    const parts = [];
    if (mattingRolls.long > 0) parts.push(`${mattingRolls.long} × (1m × 180m)`);
    if (mattingRolls.short > 0) parts.push(`${mattingRolls.short} × (1m × 25m)`);
    if (parts.length === 0) parts.push(`1 × (1m × 25m)`);

    return `Recommended: ${parts.join(" + ")}`;
  }, [hasInput, mattingRolls.long, mattingRolls.short]);

  // ---------- UI ----------
  return (
    <Box
      id="calculator"
      component="section"
      sx={{
        position: "relative",
        minHeight: "100svh",
        bgcolor: "#000",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        py: { xs: 8, sm: 9, md: 6 },
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

      <Box sx={{ width: "100%", zIndex: 2 }}>
        {/* TOP: Inputs + Results */}
        <Box
          sx={{
            width: "min(1280px, 96%)",
            mx: "auto",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "2fr 3fr" },
            columnGap: { xs: 3, md: 3 },
            rowGap: { xs: 3, md: 0 },
            alignItems: "start",
          }}
        >
          {/* LEFT */}
          <Box sx={{ maxWidth: 980 }}>
            <Typography
              sx={{
                color: ORANGE,
                textTransform: "uppercase",
                fontWeight: 700,
                letterSpacing: { xs: "0.18em", md: "0.22em" },
                fontSize: { xs: 12, sm: 13, md: 13 },
                mb: { xs: 1.25, md: 1.5 },
                opacity: 0.95,
              }}
            >
              PROJECT ESTIMATOR
            </Typography>

            <Typography
              sx={{
                fontSize: {
                  xs: "clamp(32px, 7.2vw, 44px)",
                  sm: "clamp(36px, 6vw, 52px)",
                  md: "clamp(44px, 4.2vw, 60px)",
                },
                lineHeight: 1.05,
                fontWeight: 900,
                letterSpacing: "-0.03em",
                mb: { xs: 1.5, md: 2 },
              }}
            >
              Calculate your materials
            </Typography>

            <Typography
              sx={{
                color: "rgba(255,255,255,0.82)",
                fontSize: { xs: 16, sm: 17, md: 18 },
                lineHeight: 1.75,
                maxWidth: 900,
                mb: { xs: 2.5, md: 3 },
              }}
            >
              Enter your roof size and season to get an approximate materials breakdown. Results are guidance only and may
              vary depending on surface condition and detailing.
            </Typography>

            {/* Input Card */}
            <Box
              sx={{
                border: `1px solid rgba(255,106,0,0.35)`,
                bgcolor: "rgba(255,255,255,0.02)",
                backdropFilter: "blur(6px)",
                borderRadius: 3,
                p: { xs: 3, sm: 3.5, md: 4 },
                boxShadow: "0 40px 120px rgba(0,0,0,0.65)",
              }}
            >
              {/* Mode */}
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.6, alignItems: "center", mb: 2.25 }}>
                <Typography
                  sx={{
                    fontSize: { xs: 12, sm: 13, md: 13 },
                    color: "rgba(255,255,255,0.70)",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                  }}
                >
                  INPUT MODE
                </Typography>

                <ToggleButtonGroup value={mode} exclusive onChange={(_, v) => v && setMode(v)} sx={toggleGroupSx}>
                  <ToggleButton value="area">Area (m²)</ToggleButton>
                  <ToggleButton value="dims">Length × Width</ToggleButton>
                </ToggleButtonGroup>
              </Box>

              {/* Inputs */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: mode === "dims" ? "1fr 1fr" : "1.2fr 0.8fr" },
                  gap: { xs: 1.6, md: 2 },
                  mb: 2.25,
                }}
              >
                {mode === "area" ? (
                  <>
                    <TextField
                      value={roofAreaInput}
                      onChange={(e) => setRoofAreaInput(e.target.value)}
                      label="Roof area"
                      placeholder="e.g. 40"
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ style: { color: "rgba(255,255,255,0.70)", fontSize: 13 } }}
                      inputProps={{ style: { color: "#fff", fontSize: 18 } }}
                      sx={fieldSx}
                    />

                    <TextField
                      select
                      value={roofUnit}
                      onChange={(e) => setRoofUnit(e.target.value)}
                      label="Unit"
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ style: { color: "rgba(255,255,255,0.70)", fontSize: 13 } }}
                      sx={fieldSx}
                    >
                      <MenuItem value="m2">m²</MenuItem>
                    </TextField>
                  </>
                ) : (
                  <>
                    <TextField
                      value={lengthInput}
                      onChange={(e) => setLengthInput(e.target.value)}
                      label="Length (m)"
                      placeholder="e.g. 8"
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ style: { color: "rgba(255,255,255,0.70)", fontSize: 13 } }}
                      inputProps={{ style: { color: "#fff", fontSize: 18 } }}
                      sx={fieldSx}
                    />
                    <TextField
                      value={widthInput}
                      onChange={(e) => setWidthInput(e.target.value)}
                      label="Width (m)"
                      placeholder="e.g. 5"
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ style: { color: "rgba(255,255,255,0.70)", fontSize: 13 } }}
                      inputProps={{ style: { color: "#fff", fontSize: 18 } }}
                      sx={fieldSx}
                    />
                  </>
                )}
              </Box>

              {/* Season */}
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.6, alignItems: "center" }}>
                <Typography
                  sx={{
                    fontSize: { xs: 12, sm: 13, md: 13 },
                    color: "rgba(255,255,255,0.70)",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                  }}
                >
                  SEASON
                </Typography>

                <ToggleButtonGroup value={season} exclusive onChange={(_, v) => v && setSeason(v)} sx={toggleGroupSx}>
                  <ToggleButton value="summer">Summer</ToggleButton>
                  <ToggleButton value="winter">Winter</ToggleButton>
                </ToggleButtonGroup>

                <Box
                  sx={{
                    ml: { xs: 0, sm: "auto" },
                    color: "rgba(255,255,255,0.75)",
                    fontSize: { xs: 14, sm: 15, md: 16 },
                  }}
                >
                  Calculated area:{" "}
                  <Box component="span" sx={{ color: "rgba(255,255,255,0.95)", fontWeight: 900 }}>
                    {hasInput ? `${areaM2.toFixed(2)} m²` : "—"}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* RIGHT */}
          <Box
            sx={{
              border: `1px solid rgba(255,106,0,0.35)`,
              bgcolor: "rgba(255,255,255,0.02)",
              backdropFilter: "blur(6px)",
              borderRadius: 3,
              p: { xs: 3, sm: 3.5, md: 4 },
              boxShadow: "0 40px 120px rgba(0,0,0,0.65)",
              height: "fit-content",
              position: "relative",
              overflow: "hidden",
              "&:before": {
                content: '""',
                position: "absolute",
                inset: -2,
                background:
                  "radial-gradient(700px 380px at 15% 25%, rgba(255,106,0,0.22), rgba(0,0,0,0) 55%), radial-gradient(650px 420px at 85% 70%, rgba(255,255,255,0.06), rgba(0,0,0,0) 60%)",
                pointerEvents: "none",
              },
            }}
          >
            <Box sx={{ position: "relative", zIndex: 2 }}>
              <Typography
                sx={{
                  color: ORANGE,
                  textTransform: "uppercase",
                  fontWeight: 700,
                  letterSpacing: { xs: "0.18em", md: "0.22em" },
                  fontSize: { xs: 12, sm: 13, md: 13 },
                  mb: { xs: 1.25, md: 1.5 },
                  opacity: 0.95,
                }}
              >
                RESULTS
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: 14, sm: 15, md: 16 },
                  color: "rgba(255,255,255,0.82)",
                  lineHeight: 1.7,
                  mb: 2,
                }}
              >
                {hasInput ? "Based on the roof size provided, you will need approximately:" : "Enter a roof size to see an estimate."}
              </Typography>

              {/* Big summary */}
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "baseline",
                  gap: 1.5,
                  mb: { xs: 2.5, md: 3 },
                }}
              >
                {hasInput ? (
                  <>
                    <Typography sx={{ fontSize: { xs: 22, sm: 26, md: 30 }, lineHeight: 1.25, color: "#fff", fontWeight: 900 }}>
                      {tinsNeeded} Tin{tinsNeeded === 1 ? "" : "s"}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: 18, sm: 20, md: 22 },
                        lineHeight: 1.25,
                        color: "rgba(255,255,255,0.88)",
                        fontWeight: 800,
                      }}
                    >
                      of GRFlex Waterproof
                    </Typography>

                    <Typography sx={{ fontSize: { xs: 18, sm: 20, md: 22 }, color: ORANGE, fontWeight: 900, mx: 0.5 }}>
                      +
                    </Typography>

                    <Typography sx={{ fontSize: { xs: 22, sm: 26, md: 30 }, lineHeight: 1.25, color: "#fff", fontWeight: 900 }}>
                      {activatorBottles} Bottle{activatorBottles === 1 ? "" : "s"}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: 18, sm: 20, md: 22 },
                        lineHeight: 1.25,
                        color: "rgba(255,255,255,0.88)",
                        fontWeight: 800,
                      }}
                    >
                      of Activator
                    </Typography>

                    <Typography sx={{ fontSize: { xs: 18, sm: 20, md: 22 }, color: ORANGE, fontWeight: 900, mx: 0.5 }}>
                      +
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: { xs: 22, sm: 26, md: 30 },
                        lineHeight: 1.25,
                        color: "#fff",
                        fontWeight: 900,
                      }}
                    >
                      {(() => {
                        const total = (mattingRolls.long || 0) + (mattingRolls.short || 0);
                        return `${total > 0 ? total : 1} Roll${total === 1 ? "" : "s"}`;
                      })()}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: 18, sm: 20, md: 22 },
                        lineHeight: 1.25,
                        color: "rgba(255,255,255,0.88)",
                        fontWeight: 800,
                      }}
                    >
                      of Reinforcement Matting
                    </Typography>
                  </>
                ) : (
                  <Typography sx={{ fontSize: { xs: 16, sm: 18, md: 18 }, color: "rgba(255,255,255,0.7)", fontWeight: 800 }}>
                    Enter a roof size to see an estimate.
                  </Typography>
                )}
              </Box>

              <Divider sx={{ borderColor: "rgba(255,255,255,0.10)", mb: 2.5 }} />

              {/* NEW: 3 cards layout (1 wide + 2 in a row) */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr" },
                  gap: { xs: 1.4, md: 1.6 },
                }}
              >
                {/* Card 1: Roofing System (full width) */}
                <ResultCard
                  title="GRFlex Waterproof"
                  subtitle={
                    hasInput ? `Recommended: ${tinsNeeded} tin${tinsNeeded === 1 ? "" : "s"}` : "Recommended: —"
                  }
                  body={`Each tin of GRFlex Waterproof is supplied in a ${TIN_KG} kg size.`}
                  emphasize
                />

                {/* Cards row */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: { xs: 1.4, md: 1.6 },
                  }}
                >
                  <ResultCard
                    title="Activator"
                    subtitle={
                      hasInput
                        ? `Recommended: ${activatorBottles} bottle${activatorBottles === 1 ? "" : "s"} (300 g)`
                        : "Recommended: —"
                    }
                    body={activatorRuleText}
                  />

                  <ResultCard
                    title="Reinforcement Matting"
                    subtitle={mattingRecommendationLine}
                    body={"Sizes available: 1m × 180m and 1m × 25m (150gsm)"}
                  />
                </Box>
              </Box>
            </Box>
          </Box>

          {/* BOTTOM: Additional items — aligned with Results height (span full row) */}
          <Box
            sx={{
              gridColumn: { xs: "1 / -1", md: "1 / -1" },
              mt: { xs: 1, md: 0 },
              pt: { xs: 2.5, md: 3 },
              borderTop: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Typography sx={{ fontSize: { xs: 14, sm: 15, md: 16 }, color: "rgba(255,255,255,0.62)", lineHeight: 1.75 }}>
              All quantities shown are approximate and for guidance only. Actual material usage may vary depending on surface
              condition, detailing and site workmanship. For a more realistic estimate, we recommend allowing an additional
              10% waste.
            </Typography>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.10)", my: 2.5 }} />

            <Typography
              sx={{
                color: "rgba(255,255,255,0.78)",
                fontSize: { xs: 12, sm: 13, md: 13 },
                letterSpacing: { xs: "0.18em", md: "0.22em" },
                textTransform: "uppercase",
                mb: 2,
                fontWeight: 800,
              }}
            >
              ADDITIONAL ITEMS REQUIRED
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, minmax(0, 1fr))" },
                gap: { xs: 1.2, md: 1.6 },
              }}
            >
              {[
                "Pressure washer (2000 PSI) / stiff broom",
                "Mixing drill + paddle",
                "Short-pile rollers",
                "Brushes for detailing",
                "Scissors / knife for matting",
                "Masking tape + protection sheets",
                "Nitrile gloves",
                "Safety glasses",
              ].map((c) => (
                <ToolRow key={c} text={c} />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

// ---------- Styles ----------
const toggleGroupSx = {
  "& .MuiToggleButton-root": {
    color: "rgba(255,255,255,0.85)",
    borderColor: "rgba(255,255,255,0.18)",
    textTransform: "none",
    px: { xs: 1.4, sm: 1.8, md: 2.2 },
    py: { xs: 0.8, sm: 0.9, md: 1.05 },
    borderRadius: 999,
    fontSize: { xs: 13, sm: 14, md: 15 },
    letterSpacing: "0.02em",
  },
  "& .MuiToggleButton-root.Mui-selected": {
    color: "#000",
    background: `rgba(255,106,0,0.95)`,
    borderColor: "rgba(255,106,0,0.95)",
    "&:hover": { background: `rgba(255,106,0,0.95)` },
  },
};

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

// ---------- Components ----------
function ToolRow({ text }) {
  return (
    <Box
      sx={{
        border: "1px solid rgba(255,255,255,0.10)",
        bgcolor: "rgba(255,255,255,0.02)",
        borderRadius: 2.2,
        px: 2,
        py: 1.6,
      }}
    >
      <Typography sx={{ fontSize: { xs: 14, sm: 15, md: 16 }, color: "rgba(255,255,255,0.82)", lineHeight: 1.55 }}>
        {text}
      </Typography>
    </Box>
  );
}

function ResultCard({ title, subtitle, body, emphasize = false }) {
  return (
    <Box
      sx={{
        border: `1px solid rgba(255,106,0,0.28)`,
        bgcolor: "rgba(0,0,0,0.20)",
        borderRadius: 2.6,
        p: { xs: 2.25, sm: 2.5, md: 2.75 },
        boxShadow: "0 24px 70px rgba(0,0,0,0.45)",
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: 16, sm: 17, md: 18 },
          color: "rgba(255,255,255,0.92)",
          fontWeight: 950,
          mb: 0.9,
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          fontSize: emphasize ? { xs: 15, sm: 16, md: 16 } : { xs: 14, sm: 15, md: 15 },
          lineHeight: 1.65,
          color: "rgba(255,255,255,0.90)",
          fontWeight: emphasize ? 900 : 800,
          mb: 0.7,
        }}
      >
        {subtitle}
      </Typography>

      <Typography
        sx={{
          fontSize: { xs: 13.5, sm: 14, md: 14 },
          lineHeight: 1.7,
          color: "rgba(255,255,255,0.70)",
          fontWeight: 500,
        }}
      >
        {body}
      </Typography>
    </Box>
  );
}
