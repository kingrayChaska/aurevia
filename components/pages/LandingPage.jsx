"use client";

import { Header }       from "@/components/pages/landing/Header";
import Hero             from "@/components/pages/landing/Hero";
import Stats            from "@/components/pages/landing/Stats";
import Features         from "@/components/pages/landing/Features";
import Security         from "@/components/pages/landing/Security";
import Testimonials     from "@/components/pages/landing/Testimonials";
import Pricing          from "@/components/pages/landing/Pricing";
import Cta              from "@/components/pages/landing/Cta";
import Footer           from "@/components/pages/landing/Footer";

export default function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Stats />
        <Features />
        <Security />
        <Testimonials />
        <Pricing />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
