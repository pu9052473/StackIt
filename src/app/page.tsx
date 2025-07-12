"use client"; 

import React, { useEffect, useRef, useState } from "react";
import Hero from "@/components/Home/Hero";
import CoreCapabilities from "@/components/Home/CoreCapabilities";
import UserPersonas from "@/components/Home/UserPersonas";
import EverythingToSucceed from "@/components/Home/EverythingToSucceed";
import AboutProduct from "@/components/Home/AboutProduct";
import ProblemPromise from "@/components/Home/ProblemPromise";
import Faq from "@/components/Home/Faq";
import Contact from "@/components/Home/Contact";
import Footer from "@/components/Home/footer";
import {
  Twitter,
  Linkedin,
  Github
} from "lucide-react";

const Index = () => {
  const mainContentRef = useRef<HTMLDivElement>(null); // Ref for the main content area

  // Global Interactive Background Effect for Mouse Movement
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (mainContentRef.current) {
        // Calculate mouse position relative to the viewport
        const x = event.clientX;
        const y = event.clientY;

        // Convert to percentage or relative unit for CSS variable
        const percentageX = (x / window.innerWidth) * 100;
        const percentageY = (y / window.innerHeight) * 100;

        mainContentRef.current.style.setProperty(
          "--mouse-x",
          `${percentageX}%`
        );
        mainContentRef.current.style.setProperty(
          "--mouse-y",
          `${percentageY}%`
        );
      }
    };

    // Attach listener to the entire window for global effect
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const productLinks = [
    { href: "#features", label: "Features" },
    { href: "#pricing", label: "Pricing" },
    { href: "#roadmap", label: "Roadmap" },
    { href: "#changelog", label: "Changelog" },
  ];

  const resourceLinks = [
    { href: "/docs", label: "Documentation" },
    { href: "/blog", label: "Blog" },
    { href: "/guides", label: "/guides" },
    { href: "/help", label: "Help Center" },
  ];

  const legalLinks = [
    { href: "/about", label: "About" },
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
    { href: "/cookies", label: "Cookies" },
  ];

  const socialLinks = [
    {
      href: "https://twitter.com/productgenius",
      label: "Twitter",
      icon: Twitter,
    },
    {
      href: "https://linkedin.com/company/productgenius",
      label: "LinkedIn",
      icon: Linkedin,
    },
    {
      href: "https://github.com/productgenius",
      label: "GitHub",
      icon: Github,
    },
  ];

  return (
    <div
      ref={mainContentRef}
      className="min-h-screen max-w-[100vw] flex flex-col relative transition-colors duration-300 bg-background-primary dark:bg-background-secondary" // Remove `bg-secondary/50` - background is now global on `html`
      style={{
        // @ts-expect-error: Allow custom CSS variables for mouse effect
        "--mouse-x": "50%",
        "--mouse-y": "50%",
      }}
    >
      {/* Global Animated Background Elements */}
      <div
        className="fixed inset-0 z-0 pointer-events-none transition-all duration-300" // fixed and z-0 to be behind everything
        style={{
          background:
            "radial-gradient(circle at var(--mouse-x) var(--mouse-y), rgba(139, 85, 246, 0.05), transparent 60%)",
        }}
      ></div>
      <div
        className="fixed inset-0 z-0 pointer-events-none transition-all duration-300 dark:block hidden"
        style={{
          background:
            "radial-gradient(circle at var(--mouse-x) var(--mouse-y), rgba(139, 85, 246, 0.15), transparent 60%)",
        }}
      ></div>

      {/* Blobs */}
      <div className="fixed top-1/4 left-1/4 w-40 h-40 rounded-full blur-xl animate-pulse opacity-50 pointer-events-none transition-all duration-300 bg-gray-200/50 dark:bg-primary/10"></div>
      <div className="fixed bottom-1/4 right-1/4 w-32 h-32 rounded-full blur-xl animate-pulse animation-delay-150 opacity-50 pointer-events-none transition-all duration-300 bg-gray-300/50 dark:bg-primary/10"></div>

      {/* Main Content */}
      <main className="flex-1 w-full relative z-10">
        <Hero />
        <ProblemPromise />
        <CoreCapabilities />
        <UserPersonas />
        <EverythingToSucceed />
        <AboutProduct />
        <Faq />
        <Contact />
      </main>

      <Footer />
      

    </div>
  );
};

export default Index;
