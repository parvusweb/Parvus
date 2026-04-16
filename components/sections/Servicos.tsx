"use client"

import { useState, useRef } from "react"
import { motion } from "@/components/framer/motion-elements"
import { Overline } from "@/components/ui/Overline"
import { ParvusButton } from "@/components/ui/ParvusButton"
import { ROIGraph } from "@/components/ui/ROIGraph"
import { whatsappHref } from "@/lib/site"
import { cn } from "@/lib/utils"

// Simulador de ROI
function ROICalculator() {
  const [leadsPerMonth, setLeadsPerMonth] = useState(15)
  const [includeDeploy, setIncludeDeploy] = useState(false)
  const conversionRate = 0.15 // 15% taxa de conversão
  const averageTicket = 2500 // Ticket médio R$ 2.500
  const setupCost = 6000
  const deployCost = 2000
  const monthlyCost = 500
  const months = 12

  const clientsPerMonth = Math.round(leadsPerMonth * conversionRate)
  const monthlyRevenue = clientsPerMonth * averageTicket
  const annualRevenue = monthlyRevenue * months
  const totalInvestment = setupCost + (includeDeploy ? deployCost : 0) + monthlyCost * months
  const annualProfit = annualRevenue - totalInvestment
  const roi = ((annualProfit / totalInvestment) * 100).toFixed(0)
  const paybackMonths = Math.ceil(totalInvestment / monthlyRevenue)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="mb-16 rounded-2xl border border-[#1E1E1E] bg-gradient-to-br from-[#0a0a0a] to-[#0f0f0f] p-6 md:p-10"
    >
      <div className="mb-8 text-center">
        <h3 className="font-geist text-xl font-semibold text-[#F5F5F5] md:text-2xl">
          Simule seu retorno
        </h3>
        <p className="mt-2 text-sm text-[#888]">
          Ajuste os leads mensais e veja quanto seu site pode faturar
        </p>
      </div>

      {/* Slider */}
      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-[#888]">Leads por mês</span>
          <span className="font-geist text-lg font-semibold text-[#F5F5F5]">
            {leadsPerMonth}
          </span>
        </div>
        <input
          type="range"
          min="5"
          max="100"
          value={leadsPerMonth}
          onChange={(e) => setLeadsPerMonth(Number(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#1E1E1E] accent-[#F5F5F5]"
        />
        <div className="mt-2 flex justify-between text-xs text-[#555]">
          <span>5 leads</span>
          <span>100 leads</span>
        </div>
      </div>

      {/* Deploy Toggle */}
      <div className="mb-8 flex items-center justify-between rounded-xl border border-[#1E1E1E] bg-[#080808] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00BCD4]/10 text-[#00BCD4]">
            🚀
          </div>
          <div>
            <p className="font-medium text-[#F5F5F5]">Incluir Deploy + Domínio</p>
            <p className="text-xs text-[#666]">+ R$ 2.000 — Setup completo em 48h</p>
          </div>
        </div>
        <button
          onClick={() => setIncludeDeploy(!includeDeploy)}
          className={`relative h-7 w-12 rounded-full transition-colors duration-300 ${
            includeDeploy ? "bg-[#00BCD4]" : "bg-[#1E1E1E]"
          }`}
        >
          <motion.div
            className="absolute top-1 h-5 w-5 rounded-full bg-white"
            animate={{ x: includeDeploy ? 24 : 4 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </button>
      </div>

      {/* Resultados */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Investimento */}
        <div className="rounded-xl border border-[#1E1E1E] bg-[#080808] p-4">
          <p className="text-xs uppercase tracking-wider text-[#555]">Investimento</p>
          <p className="mt-1 font-geist text-xl font-bold text-[#F5F5F5]">
            R$ {totalInvestment.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
          </p>
          <p className="mt-1 text-xs text-[#666]">
            Setup{includeDeploy && " + Deploy"} + 12× manutenção
          </p>
        </div>

        {/* Faturamento */}
        <div className="rounded-xl border border-[#1E1E1E] bg-[#080808] p-4">
          <p className="text-xs uppercase tracking-wider text-[#555]">Faturamento 1º ano</p>
          <p className="mt-1 font-geist text-xl font-bold text-green-400">
            R$ {annualRevenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
          </p>
          <p className="mt-1 text-xs text-[#666]">{clientsPerMonth} clientes/mês</p>
        </div>

        {/* Lucro */}
        <div className="rounded-xl border border-[#1E1E1E] bg-[#080808] p-4">
          <p className="text-xs uppercase tracking-wider text-[#555]">Lucro líquido</p>
          <p className="mt-1 font-geist text-xl font-bold text-green-400">
            R$ {annualProfit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
          </p>
          <p className="mt-1 text-xs text-[#666]">ROI de {roi}%</p>
        </div>

        {/* Payback */}
        <div className="rounded-xl border border-[#1E1E1E] bg-[#080808] p-4">
          <p className="text-xs uppercase tracking-wider text-[#555]">Payback</p>
          <p className="mt-1 font-geist text-xl font-bold text-[#F5F5F5]">
            {paybackMonths} meses
          </p>
          <p className="mt-1 text-xs text-[#666]">Investimento retornado</p>
        </div>
      </div>

      {/* Gráfico de ROI animado */}
      <ROIGraph 
        monthlyRevenue={monthlyRevenue}
        totalInvestment={totalInvestment}
        annualRevenue={annualRevenue}
      />
    </motion.div>
  )
}

const plans = [
  {
    id: "landing",
    badge: "Setup único",
    title: "Landing Page Premium",
    price: "R$ 6.000",
    description: "Investimento único. Retorno contínuo. Site que trabalha 24/7 convertendo visitantes em clientes.",
    roi: "ROI médio: 500%+ no primeiro ano",
    features: [
      { text: "Análise completa do negócio", highlight: false },
      { text: "Design system exclusivo", highlight: false },
      { text: "Código próprio (sem construtores)", highlight: false },
      { text: "Analytics instalado", highlight: false },
      { text: "Treinamento de uso", highlight: false },
      { text: "Otimização SEO local", highlight: true },
      { text: "Integração WhatsApp Business", highlight: true },
    ],
    cta: "Quero meu site",
    highlighted: true,
  },
  {
    id: "deploy",
    badge: "Opcional",
    title: "Deploy + Domínio",
    price: "+ R$ 2.000",
    description: "Setup completo de infraestrutura. Configuração profissional de domínio, hospedagem e SSL.",
    roi: "Pronto em 48h",
    features: [
      { text: "Registro de domínio (.com.br)", highlight: true },
      { text: "Hospedagem premium configurada", highlight: true },
      { text: "Certificado SSL (HTTPS)", highlight: false },
      { text: "DNS e apontamentos", highlight: false },
      { text: "E-mails profissionais", highlight: false },
      { text: "Deploy em produção", highlight: true },
    ],
    cta: "Incluir deploy",
    highlighted: false,
  },
  {
    id: "maintenance",
    badge: "Recorrente",
    title: "Manutenção Mensal",
    price: "R$ 500/mês",
    description: "Evolução contínua. Ajustes ilimitados. Seu site sempre no pico de performance.",
    roi: "Custo por lead: ~R$ 15",
    features: [
      { text: "Alterações de conteúdo ilimitadas", highlight: true },
      { text: "Monitoramento de performance", highlight: false },
      { text: "Relatório mensal de métricas", highlight: false },
      { text: "Suporte via WhatsApp", highlight: false },
      { text: "Banners para redes sociais", highlight: false },
      { text: "Backups semanais", highlight: false },
    ],
    cta: "Incluir no pacote",
    highlighted: false,
  },
  {
    id: "identity",
    badge: "Incluso em todos",
    title: "Identidade Digital",
    price: "Sem custo",
    description: "Presença coerente em todos os canais. Google Maps, Instagram e WhatsApp alinhados.",
    roi: "Aumento de 40% nas buscas locais",
    features: [
      { text: "Otimização no Google Maps", highlight: true },
      { text: "Bio do Instagram configurada", highlight: false },
      { text: "Padronização visual dos canais", highlight: false },
      { text: "WhatsApp Business ativo", highlight: false },
    ],
    cta: null,
    highlighted: false,
  },
]

function PlanCard({
  plan,
  index,
}: {
  plan: typeof plans[0]
  index: number
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    // Calculate rotation (max 10 degrees)
    const rotateXVal = ((y - centerY) / centerY) * -10
    const rotateYVal = ((x - centerX) / centerX) * 10
    
    setRotateX(rotateXVal)
    setRotateY(rotateYVal)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
    setIsHovered(false)
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative perspective-1000",
        plan.highlighted && "lg:-mt-4 lg:mb-4"
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
    >
      <motion.div
        className={cn(
          "h-full rounded-2xl border p-6 md:p-8 relative",
          plan.highlighted
            ? "border-[#333] bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a]"
            : plan.id === "deploy"
            ? "border-[#00BCD4]/30 bg-gradient-to-b from-[#00BCD4]/5 to-[#0a0a0a]"
            : "border-[#1E1E1E] bg-transparent"
        )}
        animate={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Glow effect on hover */}
        <motion.div
          className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: plan.highlighted 
              ? "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(245,245,245,0.1), transparent 40%)"
              : plan.id === "deploy"
              ? "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0,188,212,0.15), transparent 40%)"
              : "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(245,245,245,0.06), transparent 40%)",
          }}
          animate={{ opacity: isHovered ? 1 : 0 }}
        />

        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.1 : 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent"
            animate={{
              x: isHovered ? ["-100%", "100%"] : "-100%",
            }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Floating icon for Deploy card */}
        {plan.id === "deploy" && (
          <motion.div
            className="absolute -top-6 -right-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00BCD4] to-[#008ba3] flex items-center justify-center text-2xl shadow-lg"
            animate={{
              y: [0, -8, 0],
              rotate: [0, 5, -5, 0],
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{
              y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 0.3 },
            }}
            style={{ 
              boxShadow: "0 10px 40px rgba(0, 188, 212, 0.3)",
              zIndex: 10 
            }}
          >
            🚀
          </motion.div>
        )}

        {/* Badge */}
        <span
          className={cn(
            "mb-4 inline-block text-[11px] uppercase tracking-widest",
            plan.highlighted ? "text-[#F5F5F5]" : "text-[#555]"
          )}
        >
          {plan.badge}
        </span>

        {/* Title */}
        <h3 className="font-geist text-lg font-semibold text-[#F5F5F5] md:text-xl">
          {plan.title}
        </h3>

        {/* Price */}
        <p
          className={cn(
            "mt-3 font-geist text-3xl font-bold md:text-4xl",
            plan.highlighted ? "text-[#F5F5F5]" : "text-[#888]"
          )}
        >
          {plan.price}
        </p>

        {/* ROI Badge */}
        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1">
          <span className="h-2 w-2 rounded-full bg-green-400" />
          <span className="text-xs text-green-400">{plan.roi}</span>
        </div>

        {/* Description */}
        <p className="mt-4 text-sm leading-relaxed text-[#888]">
          {plan.description}
        </p>

        {/* Features */}
        <ul className="mt-6 space-y-3">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className={cn(
                "mt-0.5 h-5 w-5 flex-shrink-0 rounded-full flex items-center justify-center text-xs",
                feature.highlight 
                  ? "bg-green-500/20 text-green-400" 
                  : "bg-[#1E1E1E] text-[#666]"
              )}>
                {feature.highlight ? "✓" : "•"}
              </span>
              <span className={cn(
                "text-[#888]",
                feature.highlight && "text-[#F5F5F5]"
              )}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        {plan.cta && (
          <div className="mt-8">
            <ParvusButton 
              href={whatsappHref(plan.cta)} 
              variant={plan.highlighted ? "primary" : "secondary"}
              className="w-full"
            >
              {plan.cta}
            </ParvusButton>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export function Servicos() {
  return (
    <section id="servicos" className="scroll-mt-24 px-5 py-24 md:px-8 lg:py-32">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 max-w-2xl"
        >
          <Overline>Investimento</Overline>
          <h2 className="mt-3 font-geist text-[clamp(32px,4vw,48px)] font-bold leading-tight text-[#F5F5F5]">
            Site que paga sozinho.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#888]">
            Um site profissional não é despesa — é investimento com retorno mensurável. 
            Veja quanto seu negócio pode faturar.
          </p>
        </motion.div>

        {/* Simulador de ROI */}
        <ROICalculator />

        {/* Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 lg:gap-8">
          {plans.map((plan, index) => (
            <PlanCard key={plan.id} plan={plan} index={index} />
          ))}
        </div>

        {/* CTA Final */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <p className="mb-6 text-sm text-[#555]">
            Todos os projetos incluem reunião de briefing, pesquisa de mercado e suporte pós-entrega.
          </p>
          <ParvusButton 
            href={whatsappHref("Quero simular meu ROI")} 
            variant="primary"
          >
            Fazer simulação personalizada →
          </ParvusButton>
        </motion.div>
      </div>
    </section>
  )
}
