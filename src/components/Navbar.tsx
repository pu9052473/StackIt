"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, easeOut, easeInOut } from "framer-motion";

import logo_dark from "../../public/logo_dark.svg";
import logo_light from "../../public/logo_light.svg";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathName = usePathname();

  const openRoute =
    pathName.includes("/login") ||
    pathName.includes("/signup") ||
    pathName.includes("/privacypolicy") ||
    pathName.includes("/termsandconditions") ||
    pathName.includes("/usepolicy") ||
    pathName === "/";

  useEffect(() => {
    // Initial animation - navbar becomes visible
    const timer = setTimeout(() => setIsVisible(true), 300);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "auto";
  }, [mobileOpen]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/contact" },
  ];

  // Animation variants for the navbar
  const navbarVariants = {
    initial: {
      y: -100,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: easeOut,
      },
    },
  };

  // Animation variants for navbar content
  const contentVariants = {
    initial: {
      opacity: 0,
      x: 20,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: easeOut,
      },
    },
  };

  // Animation variants for logo
  const logoVariants = {
    initial: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: easeOut,
      },
    },
    scrolled: {
      scale: isScrolled ? 0.9 : 1,
      transition: {
        duration: 0.4,
        ease: easeInOut,
      },
    },
  };

  // Animation variants for mobile sidebar
  const sidebarVariants = {
    closed: {
      x: "100%",
      transition: {
        duration: 0.3,
        ease: easeInOut,
      },
    },
    open: {
      x: 0,
      transition: {
        duration: 0.3,
        ease: easeInOut,
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const sidebarItemVariants = {
    closed: {
      opacity: 0,
      x: 20,
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: easeOut,
      },
    },
  };

  // Backdrop variants
  const backdropVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <>
      <motion.nav
        variants={navbarVariants}
        initial="initial"
        animate={isVisible ? "visible" : "initial"}
        className={`
    fixed top-0 left-0 right-0 z-50
    transition-all duration-500
    ${
      isScrolled
        ? "py-3 shadow-lg rounded-3xl border border-primary/20 bg-background/80 backdrop-blur-md"
        : "py-6 bg-transparent"
    }
  `}
        style={{
          margin: "0 auto",
          width: isScrolled ? "70%" : "90%",
          maxWidth: "1280px",
        }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              variants={logoVariants}
              initial="initial"
              animate={isVisible ? ["visible", "scrolled"] : "initial"}
            >
              <Link href="/">
                <Image
                  src={logo_dark}
                  alt="IdeoCity"
                  width={150}
                  height={20}
                  className="object-contain hidden dark:block max-w-full h-auto"
                  priority
                />
                <Image
                  src={logo_light}
                  alt="IdeoCity"
                  width={150}
                  height={20}
                  className="object-contain dark:hidden block max-w-full h-auto"
                  priority
                />
              </Link>
            </motion.div>

            {/* Desktop Nav */}
            <motion.div
              variants={contentVariants}
              initial="initial"
              animate={isVisible ? "visible" : "initial"}
              className="hidden md:flex items-center space-x-6"
            >
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  variants={contentVariants}
                  custom={index}
                >
                  <Link
                    href={link.href}
                    className="relative text-text-inverse dark:text-text-primary font-medium text-sm group overflow-hidden"
                  >
                    <span className="relative z-10 transition-colors duration-300 group-hover:text-primary">
                      {link.name}
                    </span>
                    <span className="mt-1 absolute inset-x-0 -bottom-1 h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Sign In Button - Hidden on mobile */}
            <motion.div
              variants={contentVariants}
              initial="initial"
              animate={isVisible ? "visible" : "initial"}
              className="hidden md:block"
            >
              <Link href="/signin">
                <motion.button
                  className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/25"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign In
                </motion.button>
              </Link>
            </motion.div>

            {/* Burger Menu - Mobile only */}
            <motion.div
              variants={contentVariants}
              initial="initial"
              animate={isVisible ? "visible" : "initial"}
              className="md:hidden"
            >
              <motion.button
                onClick={() => setMobileOpen((prev) => !prev)}
                className="flex flex-col justify-center items-center space-y-1 p-2"
                aria-label="Toggle mobile menu"
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  className="w-6 h-0.5 bg-foreground rounded"
                  animate={{
                    rotate: mobileOpen ? 45 : 0,
                    y: mobileOpen ? 6 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                />
                <motion.span
                  className="w-6 h-0.5 bg-foreground rounded"
                  animate={{
                    opacity: mobileOpen ? 0 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                />
                <motion.span
                  className="w-6 h-0.5 bg-foreground rounded"
                  animate={{
                    rotate: mobileOpen ? -45 : 0,
                    y: mobileOpen ? -6 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            {/* Backdrop */}
            <motion.div
              variants={backdropVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="absolute top-0 right-0 h-full w-80 max-w-[80vw] bg-background/95 backdrop-blur-md border-l border-primary/20 shadow-xl"
            >
              <div className="p-6 pt-20">
                <div className="space-y-6">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.name}
                      variants={sidebarItemVariants}
                      custom={index}
                      whileHover={{ x: 8 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="block text-lg font-medium text-text-inverse dark:text-text-primary hover:text-primary transition-all duration-200 py-2 border-b border-primary/10 hover:border-primary/30"
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}

                  <motion.div
                    variants={sidebarItemVariants}
                    className="mt-8"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href="/signin"
                      onClick={() => setMobileOpen(false)}
                      className="block"
                    >
                      <button className="w-full bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/25">
                        Sign In
                      </button>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
