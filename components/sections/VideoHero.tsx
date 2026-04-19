"use client";

import { ScrollExpandMedia } from "@/components/ui/scroll-expansion-hero";
import { motion } from "@/components/framer/motion-elements";
import { Overline } from "@/components/ui/Overline";

export function VideoHero() {
  return (
    <ScrollExpandMedia
      mediaType="video"
      mediaSrc="/videos/hero-main.mp4"
      posterSrc="/images/hero-poster.jpg"
      bgImageSrc="/images/hero-bg.jpg"
      title="Resultados"
      subtitle="Veja como transformamos negócios"
      scrollToExpand="Role para expandir"
    >
      <div className="max-w-4xl mx-auto py-20">
        <Overline>Cases de Sucesso</Overline>
        
        <motion.h2 
          className="mt-6 font-geist text-3xl md:text-4xl lg:text-5xl font-bold text-[#F5F5F5] leading-tight"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Cada projeto é uma história de crescimento.
        </motion.h2>

        <motion.p 
          className="mt-6 text-lg text-[#888] leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Não criamos apenas sites. Criamos máquinas de conversão que trabalham 
          24 horas por dia para trazer clientes reais para o seu negócio.
        </motion.p>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[
            { value: '+500%', label: 'Aumento médio em leads' },
            { value: '40+', label: 'Projetos entregues' },
            { value: '15 dias', label: 'Tempo médio de entrega' },
            { value: '100%', label: 'Clientes satisfeitos' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="font-geist text-3xl md:text-4xl font-bold text-[#F5F5F5]">
                {stat.value}
              </div>
              <div className="text-sm text-[#666] mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Video placeholders para mais cases */}
        <motion.div 
          className="mt-16 grid md:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="rounded-2xl overflow-hidden border border-[#1E1E1E] bg-[#0a0a0a]">
            <video
              src="/videos/case-floricultura.mp4"
              poster="/images/case-floricultura-poster.jpg"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h3 className="font-geist text-xl font-semibold text-[#F5F5F5]">Marina Floricultura</h3>
              <p className="mt-2 text-sm text-[#666]">
                Aumento de 300% em vendas online após novo site
              </p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-[#1E1E1E] bg-[#0a0a0a]">
            <video
              src="/videos/case-3d.mp4"
              poster="/images/case-3d-poster.jpg"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h3 className="font-geist text-xl font-semibold text-[#F5F5F5]">SEP Impressões 3D</h3>
              <p className="mt-2 text-sm text-[#666]">
                Sistema de orçamento automático reduziu trabalho em 70%
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </ScrollExpandMedia>
  );
}
