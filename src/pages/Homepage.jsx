import React from "react";
import { Box } from "@mui/material";
import KeyBenefitsSection from "../components/KeyBenefitsSection";
import WhyGrflexSection from "../components/WhyGrflexSection";
import ApplicationGuideSection from "../components/ApplicationGuideSection";
import CalculatorSection from "../components/CalculatorSection";
import ImmersiveApplicationExperienceSection from "../components/ImmersiveApplicationExperienceSection";
import ApplicationsSection from "../components/ApplicationsSection";
import FinalCTASection from "../components/FinalCTASection";
import HeroSection from "../components/HeroSection";


const Homepage = () => {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: "#000",
        color: "#fff",
        overflowX: "hidden",
      }}
    >
      {/* SECTION 1: HERO / PRODUCT REVEAL */}
      <HeroSection />


      {/* SECTION 2: KEY BENEFITS */}
      <KeyBenefitsSection />

      {/* SECTION 3: DESIGNED FOR */}
      <ApplicationsSection />

      {/* SECTION 4: WHY GRFLEX */}
      <WhyGrflexSection />

      {/* SECTION 5: APLICATION GUIDE */}
      <ApplicationGuideSection />

      {/* SECTION 6: CALCULATOR*/}
      <CalculatorSection />

      {/* SECTION 7: FAQ */}
  

      {/* aquí irá el CTA final */}
      <FinalCTASection />

    </Box>
  );
};

export default Homepage;
