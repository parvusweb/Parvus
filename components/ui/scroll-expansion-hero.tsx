"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

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
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const sectionRef = useRef<HTMLDivElement>(null);

  // Mount detection
  useEffect(() => {
    setIsMounted(true);
  }, [mediaType]);

  // Mobile detection
  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ABORDAGEM SCROLL TRIGGER - usa scroll natural do documento
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  // Transformar scroll progress (0-1) em valores de animação
  const scrollProgress = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  
  // Valores calculados baseados no scroll
  const mediaWidth = useTransform(scrollProgress, [0, 1], [280, isMobile ? 630 : 1280]);
  const mediaHeight = useTransform(scrollProgress, [0, 1], [180, isMobile ? 300 : 680]);
  const textTranslateX = useTransform(scrollProgress, [0, 1], [0, isMobile ? 100 : 120]);
  const mediaTop = useTransform(scrollProgress, [0, 1], [60, 50]);
  const bgOpacity = useTransform(scrollProgress, [0, 0.5], [1, 0]);
  const contentOpacity = useTransform(scrollProgress, [0.8, 1], [0, 1]);
  const videoOverlayOpacity = useTransform(scrollProgress, [0, 1], [0.5, 0.2]);
  const imageOverlayOpacity = useTransform(scrollProgress, [0, 1], [0.7, 0.4]);
  
  // Transformações de texto - no topo para seguir regra dos hooks
  const titleFirstX = useTransform(textTranslateX, (v) => -v + "vw");
  const titleRestX = useTransform(textTranslateX, (v) => v + "vw");
  const subtitleX = useTransform(textTranslateX, (v) => -v * 0.5 + "vw");
  
  // Opacity para scroll hint
  const scrollHintOpacity = useTransform(scrollProgress, [0, 0.3], [1, 0]);

  // Prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="min-h-[100dvh] bg-[#080808] flex items-center justify-center">
        <div className="w-[280px] h-[180px] rounded-2xl overflow-hidden border-2 border-[#1E1E1E] bg-[#0a0a0a] animate-pulse" />
      </div>
    );
  }

  return (
    <div ref={sectionRef} className="relative h-[200vh]">
      <section className="sticky top-0 h-screen flex flex-col items-center justify-start overflow-hidden">
        <div className="relative w-full h-full">
          {/* Background Image */}
          <motion.div
            className="absolute inset-0 z-0"
            style={{ opacity: bgOpacity }}
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

          <div className="relative z-10 h-full flex flex-col items-center justify-center">
            {/* Expanding Media */}
            <motion.div
              className="absolute left-1/2 rounded-2xl overflow-hidden border-2 border-[#1E1E1E]"
              style={{
                width: mediaWidth,
                height: mediaHeight,
                maxWidth: "95vw",
                maxHeight: "70vh",
                top: mediaTop,
                x: "-50%",
                y: "-50%",
                boxShadow: "0px 0px 50px rgba(0, 0, 0, 0.5)",
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
                    style={{ opacity: videoOverlayOpacity }}
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
                    style={{ opacity: imageOverlayOpacity }}
                  />
                </div>
              )}
            </motion.div>

            {/* Title */}
            {title && (
              <div className="relative z-10 flex flex-col items-center text-center gap-2">
                <motion.h2
                  className="text-4xl md:text-5xl lg:text-7xl font-bold text-[#F5F5F5]"
                  style={{ x: titleFirstX }}
                >
                  {title.split(" ")[0]}
                </motion.h2>
                <motion.h2
                  className="text-4xl md:text-5xl lg:text-7xl font-bold text-[#F5F5F5]"
                  style={{ x: titleRestX }}
                >
                  {title.split(" ").slice(1).join(" ")}
                </motion.h2>
                {subtitle && (
                  <motion.p
                    className="text-lg md:text-xl text-[#888] mt-4"
                    style={{ x: subtitleX }}
                  >
                    {subtitle}
                  </motion.p>
                )}
              </div>
            )}

            {/* Scroll hint */}
            {scrollToExpand && (
              <motion.div
                className="absolute bottom-32 flex flex-col items-center gap-3"
                style={{ opacity: scrollHintOpacity }}
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

            {/* Content revealed after expansion */}
            <motion.div
              className="absolute bottom-0 w-full px-8 py-10 md:px-16 lg:py-20"
              style={{ opacity: contentOpacity }}
            >
              {children}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScrollExpandMedia;
