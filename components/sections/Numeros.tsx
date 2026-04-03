"use client"

import { motion, useInView } from "@/components/framer/motion-elements"
import { useRef, useState, useEffect } from "react"
import { Overline } from "@/components/ui/Overline"

// Efeito de texto scramble/decodificando
function useScrambleText(text: string, trigger: boolean, duration = 1500) {
  const [displayText, setDisplayText] = useState(text)
  const chars = "0123456789"
  
  useEffect(() => {
    if (!trigger) return
    
    let startTime: number | null = null
    let animationFrame: number
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = (timestamp - startTime) / duration
      
      if (progress >= 1) {
        setDisplayText(text)
        return
      }
      
      const revealedIndex = Math.floor(progress * text.length)
      
      setDisplayText(
        text
          .split("")
          .map((char, i) => {
            if (char === " " || char === "%" || char === "s" || char === "k") return char
            if (i < revealedIndex) return text[i]
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join("")
      )
      
      animationFrame = requestAnimationFrame(animate)
    }
    
    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [text, trigger, duration])
  
  return displayText
}

interface MetricCardProps {
  value: string
  targetValue: string
  label: string
  prefix?: string
  suffix?: string
  index: number
  highlight?: string
}

function MetricCard({ value, targetValue, label, prefix = "", suffix = "", index, highlight }: MetricCardProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-10%" })
  const [isHovered, setIsHovered] = useState(false)
  const scrambledValue = useScrambleText(targetValue, inView, 2000)
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1]
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      {/* Background glow on hover */}
      <motion.div
        className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-[#1E1E1E] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
      />
      
      <div className="relative">
        {/* Número principal com efeito */}
        <div className="relative overflow-hidden">
          <motion.div
            className="font-geist text-[clamp(48px,6vw,80px)] font-bold leading-none"
            animate={isHovered ? { 
              textShadow: "0 0 40px rgba(245,245,245,0.3)" 
            } : { 
              textShadow: "0 0 0px rgba(245,245,245,0)" 
            }}
          >
            <span className="text-[#555]">{prefix}</span>
            <span className="text-[#F5F5F5]">{scrambledValue}</span>
            <span className="text-[#555]">{suffix}</span>
          </motion.div>
          
          {/* Linha de destaque animada */}
          <motion.div
            className="mt-4 h-px bg-gradient-to-r from-[#333] via-[#F5F5F5] to-[#333]"
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: index * 0.15 + 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        
        {/* Label com highlight */}
        <div className="mt-4 space-y-2">
          {highlight && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.15 + 0.8 }}
              className="inline-block text-xs font-medium uppercase tracking-wider text-green-400"
            >
              {highlight}
            </motion.span>
          )}
          <p className="text-sm leading-relaxed text-[#888888] max-w-[200px]">
            {label}
          </p>
        </div>
        
        {/* Corner decoration */}
        <motion.div
          className="absolute -top-2 -right-2 w-8 h-8 border-t border-r border-[#333] opacity-0 group-hover:opacity-100 transition-opacity"
          animate={isHovered ? { scale: 1.2 } : { scale: 1 }}
        />
      </div>
    </motion.div>
  )
}

// Background com grid animado
function AnimatedGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Grid lines */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(245,245,245,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,245,245,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-transparent to-[#080808]" />
      
      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          style={{
            left: `${15 + i * 10}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        />
      ))}
    </div>
  )
}

const metrics = [
  {
    value: "100",
    label: "dos clientes mantêm o site no ar após 6 meses",
    suffix: "%",
    highlight: "Taxa de retenção",
  },
  {
    value: "8",
    label: "é o tempo que o visitante leva para decidir se fica ou sai",
    suffix: "s",
    highlight: "Janela de atenção",
  },
  {
    value: "6",
    label: "ponto de entrada para um site que trabalha por você",
    prefix: "R$",
    suffix: "k",
    highlight: "Investimento inicial",
  },
  {
    value: "3",
    label: "de inteligência artificial trabalhando em cada projeto",
    suffix: "",
    highlight: "Agentes IA",
  },
]

export function Numeros() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-20%" })
  
  return (
    <section 
      ref={sectionRef}
      className="relative scroll-mt-24 overflow-hidden border-y border-[#1E1E1E] bg-[#080808] px-5 py-24 md:px-8 lg:py-32"
    >
      <AnimatedGrid />
      
      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Header com animação */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 max-w-xl"
        >
          <Overline>Em números</Overline>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 font-geist text-3xl font-bold text-[#F5F5F5] md:text-4xl"
          >
            Resultados que medimos.
          </motion.h2>
        </motion.div>
        
        {/* Grid de métricas */}
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-6">
          {metrics.map((metric, index) => (
            <MetricCard
              key={metric.value}
              value={metric.value}
              targetValue={metric.value}
              label={metric.label}
              prefix={metric.prefix}
              suffix={metric.suffix}
              index={index}
              highlight={metric.highlight}
            />
          ))}
        </div>
        
        {/* CTA final */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.5 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-[#555]">
            Esses são os números reais dos nossos clientes.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
