"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useSpring, useInView } from "@/components/framer/motion-elements"
import { Overline } from "@/components/ui/Overline"
import { cn } from "@/lib/utils"

const steps = [
  {
    num: "01",
    title: "Imersão no negócio",
    when: "Dia 1–2",
    body: `Estudamos o seu negócio a fundo: avaliações de clientes, presença digital atual, concorrentes. O site nasce dessa análise, não de um template.`,
    icon: "🔍",
    color: "#3B82F6",
  },
  {
    num: "02",
    title: "Arquitetura e design",
    when: "Dia 3–7",
    body: `Arquitetura de seções, hierarquia de informação, sistema visual. Você recebe um preview do design antes de qualquer linha de código.`,
    icon: "✏️",
    color: "#8B5CF6",
  },
  {
    num: "03",
    title: "Desenvolvimento",
    when: "Dia 8–18",
    body: `Código escrito do zero. Animações, interações, responsividade — tudo para ser rápido, confiável e fácil de manter.`,
    icon: "⚡",
    color: "#10B981",
  },
  {
    num: "04",
    title: "Entrega e ativação",
    when: "Dia 19–21",
    body: `Deploy em produção, domínio configurado, analytics ativo. Você recebe o repositório, credenciais e treinamento.`,
    icon: "🚀",
    color: "#F59E0B",
  },
]

// Background canvas with connecting particles
function ProcessBackground({ activeStep }: { activeStep: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let particles: Array<{
      x: number
      y: number
      targetX: number
      targetY: number
      size: number
      speed: number
      alpha: number
      stepIndex: number
    }> = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener("resize", resize)

    const initParticles = () => {
      particles = []
      const stepPositions = [
        { x: canvas.width * 0.15, y: canvas.height * 0.4 },
        { x: canvas.width * 0.38, y: canvas.height * 0.4 },
        { x: canvas.width * 0.62, y: canvas.height * 0.4 },
        { x: canvas.width * 0.85, y: canvas.height * 0.4 },
      ]

      stepPositions.forEach((pos, stepIndex) => {
        for (let i = 0; i < 15; i++) {
          particles.push({
            x: pos.x + (Math.random() - 0.5) * 200,
            y: pos.y + (Math.random() - 0.5) * 150,
            targetX: pos.x,
            targetY: pos.y,
            size: Math.random() * 2 + 0.5,
            speed: Math.random() * 0.5 + 0.2,
            alpha: Math.random() * 0.5 + 0.1,
            stepIndex,
          })
        }
      })
    }

    initParticles()

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const stepPositions = [
        { x: canvas.width * 0.15, y: canvas.height * 0.4 },
        { x: canvas.width * 0.38, y: canvas.height * 0.4 },
        { x: canvas.width * 0.62, y: canvas.height * 0.4 },
        { x: canvas.width * 0.85, y: canvas.height * 0.4 },
      ]

      for (let i = 0; i < Math.min(activeStep, stepPositions.length - 1); i++) {
        const start = stepPositions[i]
        const end = stepPositions[i + 1]

        const gradient = ctx.createLinearGradient(start.x, start.y, end.x, end.y)
        gradient.addColorStop(0, `${steps[i].color}40`)
        gradient.addColorStop(0.5, `${steps[i + 1].color}60`)
        gradient.addColorStop(1, `${steps[i + 1].color}40`)

        ctx.strokeStyle = gradient
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5])
        ctx.beginPath()
        ctx.moveTo(start.x, start.y)
        ctx.lineTo(end.x, end.y)
        ctx.stroke()
        ctx.setLineDash([])

        const time = Date.now() / 1000
        const pulsePos = (time % 1)
        const pulseX = start.x + (end.x - start.x) * pulsePos
        const pulseY = start.y + (end.y - start.y) * pulsePos

        ctx.fillStyle = steps[i + 1].color
        ctx.beginPath()
        ctx.arc(pulseX, pulseY, 4, 0, Math.PI * 2)
        ctx.fill()

        const glowGradient = ctx.createRadialGradient(pulseX, pulseY, 0, pulseX, pulseY, 15)
        glowGradient.addColorStop(0, `${steps[i + 1].color}60`)
        glowGradient.addColorStop(1, "transparent")
        ctx.fillStyle = glowGradient
        ctx.beginPath()
        ctx.arc(pulseX, pulseY, 15, 0, Math.PI * 2)
        ctx.fill()
      }

      particles.forEach((p) => {
        const dx = p.targetX - p.x
        const dy = p.targetY - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist > 10) {
          p.x += (dx / dist) * p.speed + (Math.random() - 0.5) * 0.5
          p.y += (dy / dist) * p.speed + (Math.random() - 0.5) * 0.5
        } else {
          p.x += (Math.random() - 0.5) * 2
          p.y += (Math.random() - 0.5) * 2
        }

        const targetAlpha = p.stepIndex <= activeStep ? p.alpha : p.alpha * 0.3
        const currentAlpha = p.alpha < targetAlpha ? p.alpha + 0.02 : p.alpha - 0.02
        p.alpha = Math.max(0.1, Math.min(currentAlpha, targetAlpha))

        ctx.fillStyle = `${steps[p.stepIndex].color}${Math.round(p.alpha * 255).toString(16).padStart(2, "0")}`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      })

      stepPositions.forEach((pos, i) => {
        const isActive = i <= activeStep
        const radius = isActive ? 25 : 20

        if (isActive) {
          const glowGradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, radius * 2)
          glowGradient.addColorStop(0, `${steps[i].color}30`)
          glowGradient.addColorStop(0.5, `${steps[i].color}10`)
          glowGradient.addColorStop(1, "transparent")
          ctx.fillStyle = glowGradient
          ctx.beginPath()
          ctx.arc(pos.x, pos.y, radius * 2, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.fillStyle = isActive ? steps[i].color : "#1E1E1E"
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2)
        ctx.fill()

        ctx.strokeStyle = isActive ? "#F5F5F5" : "#333"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2)
        ctx.stroke()

        ctx.fillStyle = "#F5F5F5"
        ctx.font = `bold ${isActive ? 14 : 12}px Inter`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(steps[i].num, pos.x, pos.y)
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationId)
    }
  }, [activeStep])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  )
}

// 3D Card with hover effects
function StepCard({
  step,
  index,
  isActive,
  onHover,
}: {
  step: typeof steps[0]
  index: number
  isActive: boolean
  onHover: (index: number) => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(cardRef, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50, rotateX: 15 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(-1)}
      className="group relative perspective-1000"
      style={{ perspective: 1000 }}
    >
      <motion.div
        className={cn(
          "relative h-full rounded-2xl border p-6 md:p-8 transition-all duration-500",
          "backdrop-blur-sm overflow-hidden"
        )}
        style={{
          borderColor: isActive ? step.color : "#1E1E1E",
          background: isActive
            ? `linear-gradient(135deg, ${step.color}08 0%, #0a0a0a 50%, ${step.color}05 100%)`
            : "linear-gradient(135deg, #0f0f0f 0%, #0a0a0a 100%)",
          boxShadow: isActive
            ? `0 0 40px ${step.color}30, 0 0 80px ${step.color}10, inset 0 1px 0 ${step.color}30`
            : "none",
          transform: isActive ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
        }}
      >
        {/* Animated gradient border */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, transparent 40%, ${step.color}20 50%, transparent 60%)`,
            backgroundSize: "200% 200%",
            animation: isActive ? "shimmer 3s linear infinite" : "none",
          }}
        />

        {/* Corner accents */}
        <div
          className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 rounded-tl-2xl transition-colors duration-300"
          style={{ borderColor: isActive ? step.color : "#333" }}
        />
        <div
          className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 rounded-br-2xl transition-colors duration-300"
          style={{ borderColor: isActive ? step.color : "#333" }}
        />

        {/* Step indicator */}
        <div className="flex items-center justify-between mb-6">
          <motion.div
            className="flex items-center gap-3"
            animate={isActive ? { scale: 1.05 } : { scale: 1 }}
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
              style={{
                background: isActive ? `${step.color}20` : "#1E1E1E",
                boxShadow: isActive ? `0 0 20px ${step.color}40` : "none",
              }}
            >
              {step.icon}
            </div>
            <span
              className="font-geist text-sm font-bold"
              style={{ color: isActive ? step.color : "#555" }}
            >
              {step.num}
            </span>
          </motion.div>

          <span
            className="text-[11px] uppercase tracking-widest px-3 py-1 rounded-full"
            style={{
              background: isActive ? `${step.color}15` : "#1E1E1E",
              color: isActive ? step.color : "#666",
            }}
          >
            {step.when}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-geist text-xl md:text-2xl font-bold text-[#F5F5F5] mb-4 group-hover:text-white transition-colors">
          {step.title}
        </h3>

        {/* Body */}
        <p className="text-sm leading-relaxed text-[#888] group-hover:text-[#aaa] transition-colors">
          {step.body}
        </p>

        {/* Progress indicator */}
        <div className="mt-6 flex items-center gap-2">
          <div className="flex-1 h-1 bg-[#1E1E1E] rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: step.color }}
              initial={{ width: 0 }}
              animate={isInView ? { width: "100%" } : { width: 0 }}
              transition={{ duration: 1.5, delay: index * 0.2 + 0.5, ease: "easeOut" }}
            />
          </div>
          <span className="text-xs text-[#555] font-mono">{((index + 1) / 4) * 100}%</span>
        </div>

        {/* Floating particles */}
        {isActive && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full pointer-events-none"
                style={{
                  background: step.color,
                  left: `${15 + i * 15}%`,
                  top: "-10px",
                }}
                animate={{
                  y: [-10, -30, -10],
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </>
        )}
      </motion.div>
    </motion.div>
  )
}

// Vertical timeline for mobile
function MobileTimeline({ activeStep, onStepChange }: { activeStep: number; onStepChange: (i: number) => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.2"],
  })

  const lineHeight = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  return (
    <div ref={containerRef} className="lg:hidden relative">
      {/* Central line */}
      <div className="absolute left-6 top-0 bottom-0 w-px bg-[#1E1E1E]">
        <motion.div
          className="w-full bg-gradient-to-b from-blue-500 via-violet-500 to-amber-500"
          style={{ height: lineHeight.get() * 100 + "%" }}
        />
      </div>

      <div className="space-y-8">
        {steps.map((step, index) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            onClick={() => onStepChange(index)}
            className="relative flex gap-4 pl-2"
          >
            {/* Step node */}
            <div className="relative z-10 flex-shrink-0">
              <motion.div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm border-2 transition-all duration-300"
                style={{
                  borderColor: activeStep >= index ? step.color : "#333",
                  background: activeStep >= index ? `${step.color}20` : "#0a0a0a",
                  boxShadow: activeStep === index ? `0 0 20px ${step.color}50` : "none",
                }}
                animate={activeStep === index ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5, repeat: activeStep === index ? Infinity : 0 }}
              >
                {step.icon}
              </motion.div>
            </div>

            {/* Content */}
            <div
              className="flex-1 p-4 rounded-xl border transition-all duration-300"
              style={{
                borderColor: activeStep === index ? step.color : "#1E1E1E",
                background: activeStep === index ? `${step.color}08` : "#0f0f0f",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded"
                  style={{
                    background: activeStep >= index ? step.color : "#333",
                    color: "#0a0a0a",
                  }}
                >
                  {step.when}
                </span>
              </div>
              <h3 className="font-geist text-lg font-bold text-[#F5F5F5] mb-2">{step.title}</h3>
              <p className="text-sm text-[#888] leading-relaxed">{step.body}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export function Processo() {
  const [activeStep, setActiveStep] = useState(-1)
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const isHeaderInView = useInView(headerRef, { once: true })

  return (
    <section
      id="processo"
      ref={sectionRef}
      className="relative scroll-mt-24 overflow-hidden min-h-screen"
    >
      {/* Background canvas */}
      <ProcessBackground activeStep={activeStep} />

      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-[#0a0a0a] to-[#080808]" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, ${steps[0].color}08 0%, transparent 50%),
              radial-gradient(circle at 40% 50%, ${steps[1].color}08 0%, transparent 50%),
              radial-gradient(circle at 60% 50%, ${steps[2].color}08 0%, transparent 50%),
              radial-gradient(circle at 80% 50%, ${steps[3].color}08 0%, transparent 50%)
            `,
          }}
        />
      </div>

      <div className="relative z-10 px-5 py-24 md:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            ref={headerRef}
            initial={{ opacity: 0, y: 30 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-20 text-center max-w-3xl mx-auto"
          >
            <Overline>Processo</Overline>
            <h2 className="mt-4 font-geist text-[clamp(36px,6vw,72px)] font-bold leading-[1.1] text-[#F5F5F5]">
              Da ideia ao ar em
              <span className="block mt-2 bg-gradient-to-r from-blue-400 via-violet-400 to-amber-400 bg-clip-text text-transparent">
                21 dias
              </span>
            </h2>
            <p className="mt-6 text-lg text-[#888] leading-relaxed">
              Cada etapa é uma evolução. Do briefing à entrega, seu site ganha vida
              com propósito e precisão.
            </p>
          </motion.div>

          {/* Desktop Grid */}
          <div className="hidden lg:grid lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <StepCard
                key={step.num}
                step={step}
                index={index}
                isActive={activeStep === index}
                onHover={setActiveStep}
              />
            ))}
          </div>

          {/* Mobile Timeline */}
          <MobileTimeline activeStep={activeStep} onStepChange={setActiveStep} />

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-20 text-center"
          >
            <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full border border-[#1E1E1E] bg-[#0f0f0f]">
              <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-[#888]">
                Próximo slot disponível: <span className="text-[#F5F5F5] font-medium">Maio 2024</span>
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Global styles for shimmer animation */}
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            background-position: 200% 200%;
          }
          100% {
            background-position: -200% -200%;
          }
        }
      `}</style>
    </section>
  )
}
