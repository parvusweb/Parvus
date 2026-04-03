"use client"

import { useState } from "react"
import { motion, useInView, AnimatePresence } from "@/components/framer/motion-elements"
import Link from "next/link"
import { useRef } from "react"
import { whatsappHref } from "@/lib/site"
import { cn } from "@/lib/utils"

interface Project {
  id: number
  client: string
  category: string
  location: string
  before: {
    image: string
    label: string
    pain: string
    metrics: { label: string; value: string; negative?: boolean }[]
  }
  after: {
    image: string
    label: string
    gain: string
    metrics: { label: string; value: string; highlight?: boolean }[]
  }
  testimonial?: {
    quote: string
    author: string
    role: string
  }
  timeline: string
  investment: string
}

const projects: Project[] = [
  {
    id: 1,
    client: "Clínica Estética",
    category: "Saúde & Bem-estar",
    location: "São Paulo, SP",
    timeline: "14 dias",
    investment: "R$ 4.200",
    before: {
      image: "/images/antes-depois/clinica-antes.jpg",
      label: "Site genérico Wix",
      pain: "Template genérico, carregamento lento, zero SEO",
      metrics: [
        { label: "Carregamento", value: "12s", negative: true },
        { label: "Agendamentos/mês", value: "8", negative: true },
        { label: "Taxa de rejeição", value: "78%", negative: true },
      ],
    },
    after: {
      image: "/images/antes-depois/clinica-depois.jpg",
      label: "Landing Page Otimizada",
      gain: "Sistema de agendamento integrado + SEO local dominante",
      metrics: [
        { label: "Carregamento", value: "1.8s", highlight: true },
        { label: "Agendamentos/mês", value: "127", highlight: true },
        { label: "Taxa de rejeição", value: "32%", highlight: true },
      ],
    },
    testimonial: {
      quote: "Em 30 dias tive que contratar mais uma esteticista. O site virou nossa melhor vendedora.",
      author: "Dra. Marina Costa",
      role: "Proprietária",
    },
  },
  {
    id: 2,
    client: "Escritório de Arquitetura",
    category: "Arquitetura & Design",
    location: "Campinas, SP",
    timeline: "18 dias",
    investment: "R$ 5.800",
    before: {
      image: "/images/antes-depois/arquiteto-antes.jpg",
      label: "Template comprado",
      pain: "Design genérico, sem diferenciação, formulários que não funcionam",
      metrics: [
        { label: "Leads/mês", value: "0", negative: true },
        { label: "Orçamentos", value: "2/mês", negative: true },
        { label: "Tempo no site", value: "45s", negative: true },
      ],
    },
    after: {
      image: "/images/antes-depois/arquiteto-depois.jpg",
      label: "Portfólio Interativo",
      gain: "Galeria imersiva + formulário inteligente + automação de WhatsApp",
      metrics: [
        { label: "Leads/mês", value: "34", highlight: true },
        { label: "Orçamentos", value: "15/mês", highlight: true },
        { label: "Tempo no site", value: "4m 12s", highlight: true },
      ],
    },
    testimonial: {
      quote: "Conseguimos triplicar o faturamento em 4 meses. Cada projeto do site é um cliente que fecha.",
      author: "Carlos Mendes",
      role: "Arquiteto Fundador",
    },
  },
  {
    id: 3,
    client: "Consultório Odontológico",
    category: "Odontologia",
    location: "Americana, SP",
    timeline: "12 dias",
    investment: "R$ 3.600",
    before: {
      image: "/images/antes-depois/dentista-antes.jpg",
      label: "Wix/Site pronto",
      pain: "Invisível no Google, sem integração, layout desatualizado",
      metrics: [
        { label: "Ranking Google", value: "Página 3+", negative: true },
        { label: "Ligações/mês", value: "12", negative: true },
        { label: "Avaliações", value: "8", negative: true },
      ],
    },
    after: {
      image: "/images/antes-depois/dentista-depois.jpg",
      label: "Site Profissional",
      gain: "1º lugar no Maps, integração com Google Business, agendamento online",
      metrics: [
        { label: "Ranking Google", value: "1º lugar", highlight: true },
        { label: "Ligações/mês", value: "89", highlight: true },
        { label: "Avaliações", value: "127", highlight: true },
      ],
    },
    testimonial: {
      quote: "Pacientes dizem que nos acharam no Google e 'o site passou confiança'. Isso é ouro.",
      author: "Dra. Fernanda Lima",
      role: "Dentista Proprietária",
    },
  },
]

function MetricBadge({ label, value, negative, highlight }: { label: string; value: string; negative?: boolean; highlight?: boolean }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-wider text-[#666]">{label}</span>
      <span className={cn(
        "text-sm font-semibold",
        negative && "text-red-400",
        highlight && "text-green-400",
        !negative && !highlight && "text-[#888]"
      )}>
        {value}
      </span>
    </div>
  )
}

function ComparisonSlider({ project }: { project: Project }) {
  const [showAfter, setShowAfter] = useState(false)
  
  return (
    <div className="relative mb-6 overflow-hidden rounded-xl border border-[#1E1E1E] bg-[#0a0a0a]">
      {/* Tabs */}
      <div className="flex border-b border-[#1E1E1E]">
        <button
          onClick={() => setShowAfter(false)}
          className={cn(
            "flex-1 px-4 py-3 text-xs font-medium uppercase tracking-wider transition-all",
            !showAfter ? "bg-red-500/10 text-red-400" : "text-[#555] hover:text-[#888]"
          )}
        >
          Antes
        </button>
        <button
          onClick={() => setShowAfter(true)}
          className={cn(
            "flex-1 px-4 py-3 text-xs font-medium uppercase tracking-wider transition-all",
            showAfter ? "bg-green-500/10 text-green-400" : "text-[#555] hover:text-[#888]"
          )}
        >
          Depois
        </button>
      </div>

      {/* Content */}
      <div className="relative aspect-[4/3]">
        <AnimatePresence mode="wait">
          {!showAfter ? (
            <motion.div
              key="before"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-[#141414]"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="mb-2 block text-[10px] uppercase tracking-widest text-[#333]">
                    {project.before.label}
                  </span>
                  <span className="text-[#555]">{project.before.pain}</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="after"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-[#0a0a0a]"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-4">
                  <span className="mb-2 block text-[10px] uppercase tracking-widest text-green-500/50">
                    {project.after.label}
                  </span>
                  <span className="text-green-400">{project.after.gain}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-2 border-t border-[#1E1E1E] p-3">
        {!showAfter ? (
          project.before.metrics.map((m, i) => (
            <MetricBadge key={i} {...m} />
          ))
        ) : (
          project.after.metrics.map((m, i) => (
            <MetricBadge key={i} {...m} />
          ))
        )}
      </div>
    </div>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Category & Location */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-[#555]">
          {project.category}
        </span>
        <span className="text-[10px] text-[#333]">{project.location}</span>
      </div>

      {/* Comparison Slider */}
      <ComparisonSlider project={project} />

      {/* Client Name */}
      <h3 className="mb-2 font-geist text-lg font-semibold text-[#F5F5F5]">
        {project.client}
      </h3>

      {/* Project Meta */}
      <div className="mb-4 flex items-center gap-4 text-[11px] text-[#555]">
        <span>⏱ {project.timeline}</span>
        <span>💰 {project.investment}</span>
      </div>

      {/* Testimonial */}
      {project.testimonial && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: isHovered ? 1 : 0.7, height: "auto" }}
          className="rounded-lg border border-[#1E1E1E] bg-[#0a0a0a] p-4"
        >
          <p className="mb-3 text-sm italic text-[#888] leading-relaxed">
            &ldquo;{project.testimonial.quote}&rdquo;
          </p>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-[#1E1E1E]" />
            <div>
              <p className="text-xs font-medium text-[#F5F5F5]">{project.testimonial.author}</p>
              <p className="text-[10px] text-[#555]">{project.testimonial.role}</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export function AntesDepois() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section
      ref={ref}
      id="antes-depois"
      className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24 md:px-8 lg:px-12"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-16 max-w-2xl"
      >
        <span className="mb-4 block text-[11px] uppercase tracking-[0.15em] text-[#444]">
          Resultados reais
        </span>
        <h2
          className="mb-4 font-geist font-bold leading-tight text-[#F5F5F5]"
          style={{ fontSize: "clamp(32px, 4vw, 52px)" }}
        >
          Antes e depois
        </h2>
        <p className="text-base leading-relaxed text-[#888888]">
          O que mudou quando esses negócios deixaram de ter &ldquo;só um site&rdquo; e passaram
          a ter uma máquina de conversão.
        </p>
      </motion.div>

      {/* Grid de 3 projetos - sempre visíveis, sem slider */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
        className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-[#1E1E1E] pt-12 md:flex-row md:items-center"
      >
        <p
          className="font-geist font-light italic leading-snug text-[#F5F5F5]"
          style={{ fontSize: "clamp(20px, 2.5vw, 28px)" }}
        >
          &ldquo;O seu site está trabalhando{" "}
          <em className="text-red-400">contra</em> você ou{" "}
          <em className="text-green-400">por</em> você?&rdquo;
        </p>
        <Link
          href={whatsappHref("Quero transformar meu site")}
          className="shrink-0 rounded border border-[#333333] bg-transparent px-6 py-3 text-sm text-[#F5F5F5] transition-colors duration-200 hover:bg-[#141414]"
          data-hover
        >
          Quero meu antes/depois →
        </Link>
      </motion.div>
    </section>
  )
}
