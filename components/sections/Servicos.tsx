"use client"

import { useState } from "react"
import { motion } from "@/components/framer/motion-elements"
import { Overline } from "@/components/ui/Overline"
import { ParvusButton } from "@/components/ui/ParvusButton"
import { whatsappHref } from "@/lib/site"
import { cn } from "@/lib/utils"

// Simulador de ROI
function ROICalculator() {
  const [leadsPerMonth, setLeadsPerMonth] = useState(15)
  const conversionRate = 0.15 // 15% taxa de conversão
  const averageTicket = 2500 // Ticket médio R$ 2.500
  const setupCost = 6000
  const monthlyCost = 500
  const months = 12

  const clientsPerMonth = Math.round(leadsPerMonth * conversionRate)
  const monthlyRevenue = clientsPerMonth * averageTicket
  const annualRevenue = monthlyRevenue * months
  const totalInvestment = setupCost + monthlyCost * months
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
      <div className="mb-8">
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

      {/* Resultados */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Investimento */}
        <div className="rounded-xl border border-[#1E1E1E] bg-[#080808] p-4">
          <p className="text-xs uppercase tracking-wider text-[#555]">Investimento</p>
          <p className="mt-1 font-geist text-xl font-bold text-[#F5F5F5]">
            R$ {totalInvestment.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
          </p>
          <p className="mt-1 text-xs text-[#666]">Setup + 12× manutenção</p>
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

      {/* Gráfico visual simplificado */}
      <div className="mt-8 rounded-xl border border-[#1E1E1E] bg-[#080808] p-6">
        <p className="mb-4 text-sm text-[#888]">Projeção de crescimento (12 meses)</p>
        <div className="relative h-32 overflow-hidden">
          {/* Barras do gráfico */}
          <div className="flex h-full items-end justify-between gap-2">
            {[3, 6, 9, 12].map((month) => {
              const revenue = monthlyRevenue * month
              const height = annualRevenue > 0 
                ? Math.max(8, Math.min((revenue / annualRevenue) * 100, 95)) 
                : 8
              return (
                <div key={month} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full min-h-[8px] rounded-t-md bg-gradient-to-t from-green-500/40 to-green-400/80"
                    style={{ 
                      height: `${height}%`,
                      transition: 'height 0.5s ease-out'
                    }}
                  />
                  <span className="text-xs text-[#666]">M{month}</span>
                </div>
              )
            })}
          </div>
          {/* Linha do investimento */}
          <div
            className="absolute left-0 right-0 border-t-2 border-dashed border-red-400/50"
            style={{ bottom: `${(totalInvestment / annualRevenue) * 100}%` }}
          >
            <span className="absolute -top-5 right-0 text-xs text-red-400">
              Investimento
            </span>
          </div>
        </div>
      </div>
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
      { text: "Domínio e hospedagem configurados", highlight: false },
      { text: "Analytics instalado", highlight: false },
      { text: "Treinamento de uso", highlight: false },
      { text: "Otimização SEO local", highlight: true },
      { text: "Integração WhatsApp Business", highlight: true },
    ],
    cta: "Quero meu site",
    highlighted: true,
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative",
        plan.highlighted && "lg:-mt-4 lg:mb-4"
      )}
    >
      <div
        className={cn(
          "h-full rounded-2xl border p-6 transition-all duration-300 md:p-8",
          plan.highlighted
            ? "border-[#333] bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a]"
            : "border-[#1E1E1E] bg-transparent hover:border-[#333]"
        )}
      >
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
      </div>
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
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
