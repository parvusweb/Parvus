"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Overline } from "@/components/ui/Overline";
import { Waves } from "@/components/ui/wave-background";

interface VideoShowcaseProps {
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc?: string; // Deprecated - usando Waves agora
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}

export const VideoShowcase = ({
  mediaSrc,
  posterSrc,
  bgImageSrc: _bgImageSrc, // Deprecated - fundo agora é Waves interativo
  title,
  subtitle,
  children,
}: VideoShowcaseProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section 
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Fundo Interativo de Ondas */}
      <div className="absolute inset-0 z-0 bg-[#080808]">
        <Waves 
          strokeColor="rgba(6, 182, 212, 0.4)" 
          backgroundColor="#080808"
          pointerSize={0.3}
        />
        {/* Gradient overlay para melhor legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        {/* Radial glow no centro */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(6,182,212,0.15)_0%,_transparent_70%)]" />
      </div>

      {/* Conteúdo Principal */}
      <div className="relative z-10 container mx-auto px-6 py-20 flex flex-col items-center">
        
        {/* Header Animado */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <Overline>Cases de Sucesso</Overline>
          <h2 className="mt-6 text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
            {title}
          </h2>
          <p className="mt-4 text-lg md:text-xl text-gray-400 max-w-2xl">
            {subtitle}
          </p>
        </motion.div>

        {/* Video Container com Efeito 3D */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateX: 15 }}
          animate={isInView ? { opacity: 1, scale: 1, rotateX: 0 } : {}}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl mx-auto"
          style={{ perspective: 1000 }}
        >
          {/* Glow Effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl opacity-60" />
          
          {/* Video Frame */}
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-sm shadow-2xl">
            <video
              src={mediaSrc}
              poster={posterSrc}
              autoPlay
              muted
              loop
              playsInline
              className="w-full aspect-video object-cover"
            />
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Play Indicator (subtle) */}
            <motion.div 
              className="absolute bottom-6 left-6 flex items-center gap-2 text-white/60 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Demonstração ao vivo</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 w-full max-w-4xl"
        >
          {[
            { value: "+500%", label: "Aumento em leads" },
            { value: "40+", label: "Projetos entregues" },
            { value: "15 dias", label: "Tempo médio" },
            { value: "100%", label: "Satisfação" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
              className="text-center group cursor-default"
            >
              <div className="text-3xl md:text-4xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Children Content (Cases) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="w-full mt-20"
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
};

export default VideoShowcase;
