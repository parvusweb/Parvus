"use client"

import { useRef, useState } from "react"
import { motion, useInView, useScroll, useSpring } from "@/components/framer/motion-elements"
import { Overline } from "@/components/ui/Overline"
import { cn } from "@/lib/utils"

const cases = [
  {
    id: 1,
    name: "Marina Floricultura",
    url: "marinafloricultura.vercel.app",
    category: "E-commerce",
    description: "Loja online elegante para uma floricultura local. Design romântico, catálogo de produtos dinâmico e sistema de pedidos simplificado.",
    color: "#E91E63",
    accent: "#F8BBD9",
    icon: "🌸",
    stats: [
      { label: "Conversão", value: "+340%" },
      { label: "Pedidos/mês", value: "150+" },
    ],
    tags: ["Next.js", "Stripe", "CMS"],
  },
  {
    id: 2,
    name: "SEP Impressões 3D",
    url: "sepimpressoes3d.vercel.app",
    category: "Site Institucional",
    description: "Presença digital moderna para um negócio de impressão 3D. Galeria de produtos, orçamento automático e integração com WhatsApp.",
    color: "#00BCD4",
    accent: "#B2EBF2",
    icon: "🖨️",
    stats: [
      { label: "Leads/mês", value: "80+" },
      { label: "Tempo onsite", value: "4min" },
    ],
    tags: ["React", "Three.js", "API"],
  },
]

// 3D Card component
function CaseCard({
  caseItem,
  index,
  isActive,
  onHover,
}: {
  caseItem: typeof cases[0]
  index: number
  isActive: boolean
  onHover: (index: number) => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(cardRef, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60, rotateX: 20 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{
        duration: 0.9,
        delay: index * 0.2,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(-1)}
      className="group relative"
      style={{ perspective: 1000 }}
    >
      <motion.div
        className={cn(
          "relative h-full rounded-3xl border overflow-hidden transition-all duration-700",
          "backdrop-blur-sm"
        )}
        style={{
          borderColor: isActive ? caseItem.color : "#1E1E1E",
          background: isActive
            ? `linear-gradient(135deg, ${caseItem.color}10 0%, #0a0a0a 50%, ${caseItem.color}05 100%)`
            : "linear-gradient(135deg, #0f0f0f 0%, #0a0a0a 100%)",
          boxShadow: isActive
            ? `0 0 60px ${caseItem.color}25, 0 0 120px ${caseItem.color}10, inset 0 1px 0 ${caseItem.color}30`
            : "none",
          transform: isActive ? "translateY(-12px) scale(1.02)" : "translateY(0) scale(1)",
        }}
      >
        {/* Animated gradient overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, transparent 30%, ${caseItem.color}15 50%, transparent 70%)`,
            backgroundSize: "200% 200%",
            animation: isActive ? "shimmer 4s linear infinite" : "none",
          }}
        />

        {/* Browser mockup header */}
        <div className="relative h-48 md:h-56 overflow-hidden">
          {/* Browser chrome */}
          <div className="absolute top-0 left-0 right-0 h-8 bg-[#1a1a1a] flex items-center px-4 gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex-1 mx-4">
              <div className="h-5 bg-[#0a0a0a] rounded-md flex items-center px-2">
                <span className="text-[10px] text-[#555]">{caseItem.url}</span>
              </div>
            </div>
          </div>

          {/* Screenshot preview placeholder with gradient */}
          <div
            className="absolute top-8 left-0 right-0 bottom-0 flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${caseItem.color}20 0%, ${caseItem.color}05 100%)`,
            }}
          >
            {/* Abstract pattern */}
            <div className="absolute inset-0 opacity-30">
              <svg className="w-full h-full" viewBox="0 0 400 300">
                <defs>
                  <pattern id={`grid-${caseItem.id}`} width="40" height="40" patternUnits="userSpaceOnUse">
                    <circle cx="20" cy="20" r="1" fill={caseItem.color} opacity="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#grid-${caseItem.id})`} />
              </svg>
            </div>

            {/* Center icon */}
            <motion.div
              className="relative z-10 text-6xl md:text-7xl"
              animate={isActive ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
              transition={{ duration: 0.6 }}
            >
              {caseItem.icon}
            </motion.div>

            {/* Floating elements */}
            {isActive && (
              <>
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      width: 4 + i * 2,
                      height: 4 + i * 2,
                      background: caseItem.color,
                      left: `${20 + i * 15}%`,
                      top: `${30 + (i % 2) * 40}%`,
                    }}
                    animate={{
                      y: [0, -20, 0],
                      opacity: [0.3, 0.8, 0.3],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2 + i * 0.3,
                      delay: i * 0.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </>
            )}
          </div>

          {/* Category badge */}
          <div className="absolute top-12 right-4 z-20">
            <span
              className="text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full font-medium"
              style={{
                background: `${caseItem.color}20`,
                color: caseItem.color,
                border: `1px solid ${caseItem.color}40`,
              }}
            >
              {caseItem.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Title and URL */}
          <div className="mb-4">
            <h3 className="font-geist text-2xl md:text-3xl font-bold text-[#F5F5F5] group-hover:text-white transition-colors">
              {caseItem.name}
            </h3>
            <a
              href={`https://${caseItem.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#666] hover:text-[#F5F5F5] transition-colors flex items-center gap-1 mt-1"
            >
              {caseItem.url}
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          {/* Description */}
          <p className="text-[15px] leading-relaxed text-[#888] group-hover:text-[#aaa] transition-colors mb-6">
            {caseItem.description}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {caseItem.stats.map((stat, i) => (
              <div
                key={i}
                className="p-3 rounded-xl border transition-all duration-300"
                style={{
                  borderColor: isActive ? `${caseItem.color}30` : "#1E1E1E",
                  background: isActive ? `${caseItem.color}08` : "transparent",
                }}
              >
                <div
                  className="text-2xl font-bold font-geist"
                  style={{ color: isActive ? caseItem.color : "#F5F5F5" }}
                >
                  {stat.value}
                </div>
                <div className="text-xs text-[#555] uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {caseItem.tags.map((tag, i) => (
              <span
                key={i}
                className="text-[11px] px-3 py-1 rounded-full border transition-all duration-300"
                style={{
                  borderColor: isActive ? `${caseItem.color}40` : "#1E1E1E",
                  color: isActive ? caseItem.color : "#666",
                  background: isActive ? `${caseItem.color}10` : "transparent",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Corner accents */}
        <div
          className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 rounded-tl-3xl transition-colors duration-500"
          style={{ borderColor: isActive ? caseItem.color : "#1E1E1E" }}
        />
        <div
          className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 rounded-br-3xl transition-colors duration-500"
          style={{ borderColor: isActive ? caseItem.color : "#1E1E1E" }}
        />
      </motion.div>
    </motion.div>
  )
}

export function Cases() {
  const [activeCase, setActiveCase] = useState(-1)
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const isHeaderInView = useInView(headerRef, { once: true })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.8", "end 0.2"],
  })

  const lineWidth = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  return (
    <section
      id="cases"
      ref={sectionRef}
      className="relative scroll-mt-24 overflow-hidden py-24 md:py-32"
    >
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-[#0a0a0a] to-[#080808]" />

        {/* Animated gradient orbs */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(233,30,99,0.15) 0%, transparent 60%)",
            filter: "blur(80px)",
            left: "10%",
            top: "20%",
          }}
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(0,188,212,0.15) 0%, transparent 60%)",
            filter: "blur(80px)",
            right: "10%",
            bottom: "20%",
          }}
          animate={{
            x: [0, -20, 0],
            y: [0, 30, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 px-5 md:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            ref={headerRef}
            initial={{ opacity: 0, y: 30 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-16 md:mb-20 text-center max-w-3xl mx-auto"
          >
            <Overline>Cases Recentes</Overline>
            <h2 className="mt-4 font-geist text-[clamp(36px,6vw,64px)] font-bold leading-[1.1] text-[#F5F5F5]">
              Projetos que
              <span className="block mt-2 bg-gradient-to-r from-[#E91E63] via-[#F5F5F5] to-[#00BCD4] bg-clip-text text-transparent">
                transformaram negócios
              </span>
            </h2>
            <p className="mt-6 text-lg text-[#888] leading-relaxed">
              Duas histórias de sucesso. Do conceito à entrega, cada pixel pensado para converter.
            </p>
          </motion.div>

          {/* Progress line */}
          <div className="hidden md:block absolute left-0 right-0 top-[280px] h-px">
            <div className="mx-auto max-w-7xl relative h-full">
              <div className="absolute inset-0 bg-[#1E1E1E]" />
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#E91E63] via-[#F5F5F5] to-[#00BCD4]"
                style={{ width: lineWidth.get() * 100 + "%" }}
              />
            </div>
          </div>

          {/* Cases Grid */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {cases.map((caseItem, index) => (
              <CaseCard
                key={caseItem.id}
                caseItem={caseItem}
                index={index}
                isActive={activeCase === index}
                onHover={setActiveCase}
              />
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 md:mt-20 text-center"
          >
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 px-8 py-4 rounded-full border border-[#1E1E1E] bg-[#0f0f0f]">
              <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-[#888]">
                Seu projeto pode ser o próximo case de sucesso
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Global styles */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: 200% 200%; }
          100% { background-position: -200% -200%; }
        }
      `}</style>
    </section>
  )
}
