"use client"

import { useEffect, useRef, useMemo } from "react"
import { motion, useInView } from "@/components/framer/motion-elements"

interface ROIGraphProps {
  monthlyRevenue: number
  totalInvestment: number
  annualRevenue: number
}

export function ROIGraph({ monthlyRevenue, totalInvestment, annualRevenue }: ROIGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  // Gerar dados dos meses
  const monthlyData = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      revenue: monthlyRevenue * (i + 1),
      cumulative: monthlyRevenue * (i + 1),
      breakEven: totalInvestment,
    }))
  }, [monthlyRevenue, totalInvestment])

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !isInView) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const width = rect.width
    const height = rect.height
    const padding = { top: 40, right: 20, bottom: 40, left: 60 }
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    let animationProgress = 0
    let particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      alpha: number
      life: number
    }> = []

    // Create particles along the curve
    const createParticles = (progress: number) => {
      const maxMonth = Math.floor(progress * 12)
      if (maxMonth < 1) return

      const monthIndex = Math.min(maxMonth - 1, 11)
      const x = padding.left + (monthIndex / 11) * chartWidth
      const revenue = monthlyData[monthIndex].revenue
      const y = padding.top + chartHeight - (revenue / annualRevenue) * chartHeight * 0.9

      if (Math.random() > 0.7) {
        particles.push({
          x: x + (Math.random() - 0.5) * 30,
          y: y + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 2,
          vy: -Math.random() * 2 - 1,
          size: Math.random() * 2 + 1,
          alpha: 1,
          life: 1,
        })
      }
    }

    const drawGrid = () => {
      ctx.strokeStyle = "rgba(30, 30, 30, 0.5)"
      ctx.lineWidth = 1

      // Horizontal lines
      for (let i = 0; i <= 5; i++) {
        const y = padding.top + (chartHeight / 5) * i
        ctx.beginPath()
        ctx.moveTo(padding.left, y)
        ctx.lineTo(padding.left + chartWidth, y)
        ctx.stroke()
      }

      // Vertical lines for months
      for (let i = 0; i < 12; i += 3) {
        const x = padding.left + (i / 11) * chartWidth
        ctx.beginPath()
        ctx.moveTo(x, padding.top)
        ctx.lineTo(x, padding.top + chartHeight)
        ctx.stroke()
      }
    }

    const drawAxes = () => {
      ctx.strokeStyle = "rgba(245, 245, 245, 0.2)"
      ctx.lineWidth = 2

      // Y axis
      ctx.beginPath()
      ctx.moveTo(padding.left, padding.top)
      ctx.lineTo(padding.left, padding.top + chartHeight)
      ctx.stroke()

      // X axis
      ctx.beginPath()
      ctx.moveTo(padding.left, padding.top + chartHeight)
      ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight)
      ctx.stroke()

      // Labels
      ctx.fillStyle = "rgba(136, 136, 136, 0.8)"
      ctx.font = "11px Inter, sans-serif"
      ctx.textAlign = "right"

      // Y axis labels
      for (let i = 0; i <= 5; i++) {
        const value = (annualRevenue / 5) * (5 - i)
        const y = padding.top + (chartHeight / 5) * i
        ctx.fillText(`R$${(value / 1000).toFixed(0)}k`, padding.left - 10, y + 4)
      }

      // X axis labels
      ctx.textAlign = "center"
      ctx.fillStyle = "rgba(136, 136, 136, 0.6)"
      for (let i = 0; i < 12; i += 3) {
        const x = padding.left + (i / 11) * chartWidth
        ctx.fillText(`M${i + 1}`, x, padding.top + chartHeight + 20)
      }
    }

    const drawBreakEvenLine = () => {
      const breakEvenY = padding.top + chartHeight - (totalInvestment / annualRevenue) * chartHeight * 0.9

      // Glow effect
      const gradient = ctx.createLinearGradient(padding.left, 0, padding.left + chartWidth, 0)
      gradient.addColorStop(0, "rgba(239, 68, 68, 0)")
      gradient.addColorStop(0.5, "rgba(239, 68, 68, 0.3)")
      gradient.addColorStop(1, "rgba(239, 68, 68, 0)")

      ctx.strokeStyle = gradient
      ctx.lineWidth = 2
      ctx.setLineDash([8, 4])
      ctx.beginPath()
      ctx.moveTo(padding.left, breakEvenY)
      ctx.lineTo(padding.left + chartWidth, breakEvenY)
      ctx.stroke()
      ctx.setLineDash([])

      // Label
      ctx.fillStyle = "rgba(239, 68, 68, 0.8)"
      ctx.font = "12px Inter, sans-serif"
      ctx.textAlign = "left"
      ctx.fillText("Investimento", padding.left + 10, breakEvenY - 8)

      // Animated pulse dot
      const pulseRadius = 4 + Math.sin(Date.now() / 200) * 2
      ctx.fillStyle = "rgba(239, 68, 68, 0.8)"
      ctx.beginPath()
      ctx.arc(padding.left + chartWidth - 40, breakEvenY, pulseRadius, 0, Math.PI * 2)
      ctx.fill()
    }

    const drawCurve = () => {
      const maxMonth = Math.floor(animationProgress * 12)
      if (maxMonth < 1) return

      const points: Array<{ x: number; y: number }> = []

      for (let i = 0; i <= Math.min(maxMonth, 12); i++) {
        const x = padding.left + (i / 11) * chartWidth
        const revenue = monthlyData[Math.min(i, 11)].revenue
        const y = padding.top + chartHeight - (revenue / annualRevenue) * chartHeight * 0.9
        points.push({ x, y })
      }

      if (points.length < 2) return

      // Create smooth curve with gradient stroke
      const gradient = ctx.createLinearGradient(padding.left, 0, padding.left + chartWidth, 0)
      gradient.addColorStop(0, "rgba(74, 222, 128, 0.4)")
      gradient.addColorStop(0.5, "rgba(74, 222, 128, 0.8)")
      gradient.addColorStop(1, "rgba(250, 204, 21, 0.9)")

      // Glow line
      ctx.shadowColor = "rgba(74, 222, 128, 0.5)"
      ctx.shadowBlur = 20
      ctx.strokeStyle = gradient
      ctx.lineWidth = 3
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)

      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1]
        const curr = points[i]
        const cpX = (prev.x + curr.x) / 2
        ctx.quadraticCurveTo(prev.x, prev.y, cpX, (prev.y + curr.y) / 2)
        ctx.lineTo(curr.x, curr.y)
      }

      ctx.stroke()
      ctx.shadowBlur = 0

      // Fill area under curve
      const fillGradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight)
      fillGradient.addColorStop(0, "rgba(74, 222, 128, 0.2)")
      fillGradient.addColorStop(0.5, "rgba(74, 222, 128, 0.05)")
      fillGradient.addColorStop(1, "rgba(74, 222, 128, 0)")

      ctx.fillStyle = fillGradient
      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1]
        const curr = points[i]
        const cpX = (prev.x + curr.x) / 2
        ctx.quadraticCurveTo(prev.x, prev.y, cpX, (prev.y + curr.y) / 2)
        ctx.lineTo(curr.x, curr.y)
      }
      ctx.lineTo(points[points.length - 1].x, padding.top + chartHeight)
      ctx.lineTo(points[0].x, padding.top + chartHeight)
      ctx.closePath()
      ctx.fill()

      // Draw data points
      points.forEach((point, i) => {
        if (i % 3 === 0 || i === points.length - 1) {
          // Outer glow
          ctx.fillStyle = "rgba(74, 222, 128, 0.3)"
          ctx.beginPath()
          ctx.arc(point.x, point.y, 8, 0, Math.PI * 2)
          ctx.fill()

          // Inner dot
          ctx.fillStyle = i === points.length - 1 ? "#facc15" : "#4ade80"
          ctx.beginPath()
          ctx.arc(point.x, point.y, 4, 0, Math.PI * 2)
          ctx.fill()
        }
      })
    }

    const drawParticles = () => {
      particles = particles.filter((p) => {
        p.x += p.vx
        p.y += p.vy
        p.life -= 0.02
        p.alpha = p.life
        p.vy -= 0.05 // Float upward

        if (p.life <= 0) return false

        ctx.fillStyle = `rgba(74, 222, 128, ${p.alpha * 0.6})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()

        return true
      })
    }

    let animationId: number

    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      drawGrid()
      drawAxes()
      drawBreakEvenLine()
      drawCurve()
      drawParticles()

      if (animationProgress < 1) {
        animationProgress += 0.015
        createParticles(animationProgress)
      } else {
        createParticles(1)
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [isInView, monthlyData, annualRevenue, totalInvestment])

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="mt-8 rounded-2xl border border-[#1E1E1E] bg-gradient-to-br from-[#0a0a0a] via-[#080808] to-[#0a0a0a] p-6 overflow-hidden relative"
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-20"
          style={{
            background: "radial-gradient(ellipse, rgba(74, 222, 128, 0.15) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-[#888]">Projeção de crescimento</p>
            <p className="text-xs text-[#555] mt-1">12 meses de retorno acumulado</p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400/80 shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
              <span className="text-[#888]">Receita</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400/80" />
              <span className="text-[#888]">Investimento</span>
            </div>
          </div>
        </div>

        {/* Canvas Graph */}
        <div className="relative h-48 w-full">
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ width: "100%", height: "100%" }}
          />

          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-green-400/30 rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-green-400/30 rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-green-400/30 rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-green-400/30 rounded-br-lg" />
        </div>

        {/* Stats row */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-xl bg-[#0f0f0f] border border-[#1E1E1E]">
            <p className="text-[10px] uppercase tracking-wider text-[#555]">Mês 6</p>
            <p className="text-lg font-bold text-green-400 font-geist">
              R$ {((monthlyRevenue * 6) / 1000).toFixed(0)}k
            </p>
          </div>
          <div className="text-center p-3 rounded-xl bg-[#0f0f0f] border border-[#1E1E1E]">
            <p className="text-[10px] uppercase tracking-wider text-[#555]">Mês 12</p>
            <p className="text-lg font-bold text-yellow-400 font-geist">
              R$ {((monthlyRevenue * 12) / 1000).toFixed(0)}k
            </p>
          </div>
          <div className="text-center p-3 rounded-xl bg-[#0f0f0f] border border-[#1E1E1E]">
            <p className="text-[10px] uppercase tracking-wider text-[#555]">Break-even</p>
            <p className="text-lg font-bold text-[#F5F5F5] font-geist">
              M{Math.max(1, Math.ceil(totalInvestment / monthlyRevenue))}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
