"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface ScrollExpandMediaProps {
  mediaType?: "video" | "image";
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc: string;
  title?: string;
  subtitle?: string;
  scrollToExpand?: string;
  children?: ReactNode;
}

export const ScrollExpandMedia = ({
  mediaType = "video",
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title,
  subtitle,
  scrollToExpand,
  children,
}: ScrollExpandMediaProps) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setScrollProgress(0);
    setShowContent(false);
    setMediaFullyExpanded(false);
  }, [mediaType]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleWheel = (e: globalThis.WheelEvent) => {
      if (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const scrollDelta = e.deltaY * 0.0009;
        const newProgress = Math.min(Math.max(scrollProgress + scrollDelta, 0), 1);
        setScrollProgress(newProgress);
        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }
      }
    };

    const handleTouchStart = (e: globalThis.TouchEvent) => {
      setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: globalThis.TouchEvent) => {
      if (!touchStartY) return;
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      
      if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const scrollFactor = deltaY < 0 ? 0.008 : 0.005;
        const scrollDelta = deltaY * scrollFactor;
        const newProgress = Math.min(Math.max(scrollProgress + scrollDelta, 0), 1);
        setScrollProgress(newProgress);
        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }
        setTouchStartY(touchY);
      }
    };

    const handleScroll = () => {
      if (!mediaFullyExpanded) window.scrollTo(0, 0);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [scrollProgress, mediaFullyExpanded, touchStartY]);

  const mediaWidth = 280 + scrollProgress * (isMobile ? 350 : 1000);
  const mediaHeight = 180 + scrollProgress * (isMobile ? 120 : 500);
  const textTranslateX = scrollProgress * (isMobile ? 100 : 120);
  const mediaTop = 60 - scrollProgress * 20; // Começa mais acima, desce ao expandir

  return (
    <div ref={sectionRef} className="transition-colors duration-700 ease-in-out overflow-x-hidden">
      <section className="relative flex flex-col items-center justify-start min-h-[100dvh]">
        <div className="relative w-full flex flex-col items-center min-h-[100dvh]">
          {/* Background Image */}
          <motion.div
            className="absolute inset-0 z-0 h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 - scrollProgress }}
            transition={{ duration: 0.1 }}
          >
            <Image
              src={bgImageSrc}
              alt="Background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/60" />
          </motion.div>

          <div className="container mx-auto flex flex-col items-center justify-start relative z-10">
            <div className="flex flex-col items-center justify-center w-full h-[100dvh] relative">
              {/* Expanding Media */}
              <div
                className="absolute z-0 left-1/2 transform -translate-x-1/2 transition-none rounded-2xl overflow-hidden border-2 border-[#1E1E1E]"
                style={{
                  width: `${mediaWidth}px`,
                  height: `${mediaHeight}px`,
                  maxWidth: "95vw",
                  maxHeight: "70vh",
                  top: `${mediaTop}%`,
                  transform: `translate(-50%, -50%)`,
                  boxShadow: scrollProgress > 0.5 
                    ? "0px 0px 100px rgba(0, 188, 212, 0.3), 0px 0px 50px rgba(0, 0, 0, 0.5)" 
                    : "0px 10px 40px rgba(0, 0, 0, 0.4)",
                }}
              >
                {mediaType === "video" ? (
                  <div className="relative w-full h-full pointer-events-none">
                    <video
                      src={mediaSrc}
                      poster={posterSrc}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      className="w-full h-full object-cover"
                      controls={false}
                    />
                    <div className="absolute inset-0 z-10 pointer-events-none" />
                    <motion.div
                      className="absolute inset-0 bg-black/30"
                      animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <Image
                      src={mediaSrc}
                      alt={title || "Media"}
                      fill
                      className="object-cover"
                    />
                    <motion.div
                      className="absolute inset-0 bg-black/50"
                      animate={{ opacity: 0.7 - scrollProgress * 0.3 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                )}
              </div>

              {/* Title */}
              {title && (
                <div className="flex flex-col items-center justify-center text-center gap-2 w-full relative z-10">
                  <motion.h2
                    className="text-4xl md:text-5xl lg:text-7xl font-bold text-[#F5F5F5]"
                    style={{ transform: `translateX(-${textTranslateX}vw)` }}
                  >
                    {title.split(" ")[0]}
                  </motion.h2>
                  <motion.h2
                    className="text-4xl md:text-5xl lg:text-7xl font-bold text-[#F5F5F5]"
                    style={{ transform: `translateX(${textTranslateX}vw)` }}
                  >
                    {title.split(" ").slice(1).join(" ")}
                  </motion.h2>
                  {subtitle && (
                    <motion.p
                      className="text-lg md:text-xl text-[#888] mt-4"
                      style={{ transform: `translateX(-${textTranslateX * 0.5}vw)` }}
                    >
                      {subtitle}
                    </motion.p>
                  )}
                </div>
              )}

              {/* Scroll hint */}
              {scrollToExpand && scrollProgress < 0.3 && (
                <motion.div
                  className="absolute bottom-32 flex flex-col items-center gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  <span className="text-[#888] text-xs uppercase tracking-[0.2em]">
                    {scrollToExpand}
                  </span>
                  <motion.div
                    className="w-6 h-10 rounded-full border-2 border-[#333] flex justify-center pt-2"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <motion.div 
                      className="w-1.5 h-3 bg-[#F5F5F5] rounded-full"
                      animate={{ y: [0, 8, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </motion.div>
                </motion.div>
              )}
            </div>

            {/* Content revealed after expansion */}
            <motion.section
              className="flex flex-col w-full px-8 py-10 md:px-16 lg:py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.7 }}
            >
              {children}
            </motion.section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScrollExpandMedia;
