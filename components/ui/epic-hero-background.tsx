"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "@/components/framer/motion-elements"

// Efeito de texto decodificando
function DecodingText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const [displayText, setDisplayText] = useState(text)
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*"
  
  useEffect(() => {
    let iteration = 0
    const maxIterations = text.length * 3
    
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (char === " " || char === "." || char === "!" || char === "?" || char === "ã" || char === "õ" || char === "ç") return char
            if (index < iteration / 3) return text[index]
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join("")
      )
      
      iteration += 1
      
      if (iteration > maxIterations) {
        clearInterval(interval)
        setDisplayText(text)
      }
    }, 30)
    
    return () => clearInterval(interval)
  }, [text])
  
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.5 }}
      className={className}
    >
      {displayText}
    </motion.span>
  )
}

export function EpicHeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0, vx: 0, vy: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 })
  
  const parallaxX = useTransform(smoothMouseX, [-0.5, 0.5], [-30, 30])
  const parallaxY = useTransform(smoothMouseY, [-0.5, 0.5], [-30, 30])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let particles: Particle[] = []
    let time = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener("resize", resize)
    
    // Delay para iniciar animação
    setTimeout(() => setIsLoaded(true), 100)

    class Particle {
      x: number
      y: number
      baseX: number
      baseY: number
      size: number
      speedX: number
      speedY: number
      opacity: number
      pulsePhase: number
      connections: number

      constructor(x?: number, y?: number) {
        this.x = x ?? Math.random() * canvas.width
        this.y = y ?? Math.random() * canvas.height
        this.baseX = this.x
        this.baseY = this.y
        this.size = Math.random() * 1.5 + 0.5
        this.speedX = (Math.random() - 0.5) * 0.3
        this.speedY = (Math.random() - 0.5) * 0.3
        this.opacity = Math.random() * 0.5 + 0.2
        this.pulsePhase = Math.random() * Math.PI * 2
        this.connections = 0
      }

      update() {
        // Movimento orgânico
        this.pulsePhase += 0.02
        const pulse = Math.sin(this.pulsePhase) * 0.5 + 0.5
        
        // Atração suave para posição base
        const dx = this.baseX - this.x
        const dy = this.baseY - this.y
        this.x += dx * 0.01 + this.speedX
        this.y += dy * 0.01 + this.speedY
        
        // Interação dramática com mouse
        const mouseDX = mouseRef.current.x - this.x
        const mouseDY = mouseRef.current.y - this.y
        const distance = Math.sqrt(mouseDX * mouseDX + mouseDY * mouseDY)
        
        if (distance < 200) {
          const force = (200 - distance) / 200
          // Partículas são atraídas para o mouse (efeito de ímã)
          this.x += mouseDX * force * 0.03
          this.y += mouseDY * force * 0.03
          this.opacity = Math.min(1, this.opacity + 0.02)
        } else {
          this.opacity = Math.max(0.2, this.opacity - 0.01)
        }
        
        // Bounce nas bordas
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1
        
        return pulse
      }

      draw(ctx: CanvasRenderingContext2D, pulse: number) {
        const currentSize = this.size * (0.8 + pulse * 0.4)
        
        // Glow intenso
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, currentSize * 4
        )
        gradient.addColorStop(0, `rgba(245, 245, 245, ${this.opacity})`)
        gradient.addColorStop(0.4, `rgba(245, 245, 245, ${this.opacity * 0.3})`)
        gradient.addColorStop(1, `rgba(245, 245, 245, 0)`)
        
        ctx.beginPath()
        ctx.arc(this.x, this.y, currentSize * 4, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
        
        // Núcleo brilhante
        ctx.beginPath()
        ctx.arc(this.x, this.y, currentSize, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${0.8 + pulse * 0.2})`
        ctx.fill()
      }
    }

    // Criar partículas em padrão de constelação
    const createConstellation = () => {
      particles = []
      const numParticles = 80
      
      for (let i = 0; i < numParticles; i++) {
        // Distribuir em grade com variação aleatória
        const gridX = (i % 10) / 10 * canvas.width * 0.8 + canvas.width * 0.1
        const gridY = Math.floor(i / 10) / 8 * canvas.height * 0.8 + canvas.height * 0.1
        const offsetX = (Math.random() - 0.5) * 100
        const offsetY = (Math.random() - 0.5) * 100
        
        particles.push(new Particle(gridX + offsetX, gridY + offsetY))
      }
    }
    
    createConstellation()

    const drawConnections = () => {
      // Desenhar linhas entre partículas próximas
      for (let i = 0; i < particles.length; i++) {
        let connections = 0
        for (let j = i + 1; j < particles.length; j++) {
          if (connections >= 3) break
          
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 150) {
            connections++
            const opacity = (1 - distance / 150) * 0.3
            
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(245, 245, 245, ${opacity})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
    }

    const animate = () => {
      ctx.fillStyle = "rgba(8, 8, 8, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      time += 0.01
      
      // Desenhar conexões primeiro (atrás das partículas)
      drawConnections()
      
      // Atualizar e desenhar partículas
      particles.forEach(p => {
        const pulse = p.update()
        p.draw(ctx, pulse)
      })
      
      // Efeito de ondulação no centro
      const centerX = canvas.width * 0.7
      const centerY = canvas.height * 0.5
      const waveRadius = 100 + Math.sin(time) * 20
      
      const waveGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, waveRadius
      )
      waveGradient.addColorStop(0, "rgba(30, 30, 30, 0.1)")
      waveGradient.addColorStop(0.5, "rgba(30, 30, 30, 0.05)")
      waveGradient.addColorStop(1, "rgba(30, 30, 30, 0)")
      
      ctx.beginPath()
      ctx.arc(centerX, centerY, waveRadius, 0, Math.PI * 2)
      ctx.fillStyle = waveGradient
      ctx.fill()
      
      animationId = requestAnimationFrame(animate)
    }

    animate()

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      mouseRef.current.vx = x - mouseRef.current.x
      mouseRef.current.vy = y - mouseRef.current.y
      mouseRef.current.x = x
      mouseRef.current.y = y
      
      mouseX.set((x / window.innerWidth) - 0.5)
      mouseY.set((y / window.innerHeight) - 0.5)
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationId)
    }
  }, [mouseX, mouseY])

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Canvas com constelação */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
      />
      
      {/* Logo com efeito de glitch/neon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ x: parallaxX, y: parallaxY }}
        className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none select-none"
      >
        <div className="relative">
          {/* Glow atrás */}
          <div 
            className="absolute inset-0 blur-3xl opacity-20"
            style={{
              background: "radial-gradient(circle, rgba(245,245,245,0.3) 0%, transparent 70%)"
            }}
          />
          
          {/* Texto principal */}
          <div 
            className="font-inter text-[18vw] font-thin tracking-[0.15em] text-[#F5F5F5] whitespace-nowrap relative"
            style={{
              textShadow: "0 0 80px rgba(245,245,245,0.1), 0 0 120px rgba(245,245,245,0.05)",
              maskImage: "linear-gradient(to bottom, transparent 10%, black 40%, black 60%, transparent 90%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 10%, black 40%, black 60%, transparent 90%)",
            }}
          >
            <DecodingText text="P A R V U S" delay={0.5} />
          </div>
          
          {/* Linhas decorativas */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isLoaded ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -left-20 top-1/2 h-px w-20 bg-gradient-to-r from-transparent via-[#333] to-[#333]"
          />
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isLoaded ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 1.7, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -right-20 top-1/2 h-px w-20 bg-gradient-to-l from-transparent via-[#333] to-[#333]"
          />
        </div>
      </motion.div>
      
      {/* Partículas flutuantes adicionais (CSS) */}
      <div className="absolute inset-0 z-[2] pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/20"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>
    </div>
  )
}
