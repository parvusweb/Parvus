"use client"

import { motion } from "@/components/framer/motion-elements"
import { SpinningSphereBackground } from "@/components/ui/spinning-sphere-background"

const ease = [0.16, 1, 0.3, 1] as const

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease, delay },
})

const blocks = [
  `Todo dono de negócio já ouviu isso: 'vamos fazer um site incrível pra você'. E recebeu algo bonito. Bonito que não toca o telefone. Bonito que não enche a agenda. Bonito que ninguém encontra.`,
  `A Parvus nasceu da necessidade de crescer negócios através dos sites — não é só site bonito, é conversão e é métrica. Ao comprar conosco, o cliente está comprando resultado. Comprando vendas. Não só beleza.`,
  `Não fazemos sites. Fazemos instrumentos de crescimento.`,
]

export function Manifesto() {
  return (
    <section
      id="manifesto"
      className="relative overflow-hidden py-32 px-6 md:px-12 lg:px-20"
    >
      {/* CUBO 3D — fundo absoluto cobrindo toda a seção */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      >
        {/* Máscara: cubo aparece mais forte no centro/direita,
            some nas bordas para não competir com o texto */}
        <div
          className="absolute inset-0"
          style={{
            maskImage: `
              radial-gradient(
                ellipse 80% 70% at 65% 50%,
                black 0%,
                black 40%,
                transparent 75%
              )
            `,
            WebkitMaskImage: `
              radial-gradient(
                ellipse 80% 70% at 65% 50%,
                black 0%,
                black 40%,
                transparent 75%
              )
            `,
            opacity: 0.4,
          }}
        >
          <SpinningSphereBackground />
        </div>
      </div>

      {/* Gradiente de escurecimento sobre o fundo para legibilidade */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(
              to right,
              rgba(8,8,8,0.92) 0%,
              rgba(8,8,8,0.75) 45%,
              rgba(8,8,8,0.2) 100%
            )
          `,
          zIndex: 1,
        }}
      />

      {/* CONTEÚDO — z-10, acima do cubo e do gradiente */}
      <div className="relative z-10 max-w-2xl">
        <motion.span
          {...fadeUp(0)}
          className="block text-[11px] uppercase tracking-[0.15em] text-[#444] mb-6"
        >
          Nossa visão
        </motion.span>

        <motion.h2
          {...fadeUp(0.15)}
          className="font-geist font-bold text-[#F5F5F5] leading-tight mb-10"
          style={{ fontSize: "clamp(36px, 4vw, 56px)" }}
        >
          Nascemos de uma frustração.
        </motion.h2>

        <motion.div {...fadeUp(0.3)} className="space-y-6 text-[#888888] text-base leading-[1.7] max-w-xl">
          {blocks.map((p, i) => (
            <p key={i} className={i === 2 ? "text-[#F5F5F5]" : ""}>
              {p}
            </p>
          ))}
        </motion.div>

        <motion.blockquote
          {...fadeUp(0.5)}
          className="mt-12 font-geist font-light italic text-[#F5F5F5] leading-snug"
          style={{
            borderLeft: "2px solid #F5F5F5",
            paddingLeft: "24px",
            fontSize: "clamp(20px, 2.5vw, 28px)",
          }}
        >
          Ao comprar conosco, você está comprando resultado. Não beleza.
        </motion.blockquote>
      </div>
    </section>
  )
}
