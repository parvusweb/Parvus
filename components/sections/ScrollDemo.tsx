"use client";

import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { motion } from "@/components/framer/motion-elements";
import { Overline } from "@/components/ui/Overline";

// Mock Landing Page Preview Component
function MockLandingPage() {
  return (
    <div className="w-full h-full bg-[#0a0a0a] rounded-xl overflow-hidden flex flex-col">
      {/* Browser Header */}
      <div className="h-8 bg-[#141414] flex items-center px-3 gap-2">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="bg-[#1a1a1a] rounded-md px-3 py-0.5 text-[10px] text-[#666]">
            seunegocio.com.br
          </div>
        </div>
      </div>

      {/* Landing Page Content */}
      <div className="flex-1 overflow-hidden relative">
        {/* Hero Section Mock */}
        <div className="h-full bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] p-6 md:p-10">
          {/* Navigation Mock */}
          <div className="flex justify-between items-center mb-8">
            <div className="text-sm font-bold text-[#F5F5F5]">SUA MARCA</div>
            <div className="flex gap-3">
              <div className="w-16 h-3 bg-[#1E1E1E] rounded" />
              <div className="w-16 h-3 bg-[#1E1E1E] rounded" />
              <div className="w-20 h-6 bg-[#F5F5F5] rounded-full" />
            </div>
          </div>

          {/* Hero Content */}
          <div className="grid md:grid-cols-2 gap-6 h-full items-center">
            <div className="space-y-4">
              <div className="w-24 h-2 bg-green-500/20 rounded" />
              <div className="space-y-2">
                <div className="w-full h-6 bg-[#F5F5F5]/80 rounded" />
                <div className="w-4/5 h-6 bg-[#F5F5F5] rounded" />
                <div className="w-3/5 h-6 bg-[#F5F5F5]/60 rounded" />
              </div>
              <div className="w-full h-3 bg-[#666]/30 rounded mt-4" />
              <div className="w-4/5 h-3 bg-[#666]/30 rounded" />
              
              <div className="flex gap-3 pt-4">
                <div className="w-32 h-8 bg-[#F5F5F5] rounded-lg" />
                <div className="w-24 h-8 bg-[#1E1E1E] rounded-lg" />
              </div>

              {/* Stats */}
              <div className="flex gap-6 pt-6">
                <div>
                  <div className="text-lg font-bold text-green-400">+150%</div>
                  <div className="text-[10px] text-[#666]">Conversão</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-[#F5F5F5]">3x</div>
                  <div className="text-[10px] text-[#666]">Mais Leads</div>
                </div>
              </div>
            </div>

            {/* Hero Image Placeholder */}
            <div className="relative h-full min-h-[200px] md:min-h-0">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#1E1E1E] to-[#2a2a2a] rounded-2xl" />
              <div className="absolute inset-4 bg-[#0a0a0a] rounded-xl flex items-center justify-center">
                <div className="text-[#333] text-6xl">🚀</div>
              </div>
              
              {/* Floating elements */}
              <motion.div 
                className="absolute -top-2 -right-2 bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                +40 leads
              </motion.div>
              <motion.div 
                className="absolute bottom-4 -left-2 bg-[#1E1E1E] text-[#F5F5F5] text-xs px-2 py-1 rounded-full"
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                ROI 500%
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ScrollDemo() {
  return (
    <section className="relative bg-[#050505]">
      <ContainerScroll
        titleComponent={
          <div className="mb-12 md:mb-20">
            <Overline>Visualize o resultado</Overline>
            <h2 className="mt-4 font-geist text-[clamp(32px,5vw,56px)] font-bold leading-tight text-[#F5F5F5]">
              Seu site assim.
              <br />
              <span className="text-[#888]">Conversão garantida.</span>
            </h2>
            <p className="mt-6 max-w-2xl mx-auto text-base md:text-lg text-[#666]">
              Role a página e veja como uma landing page profissional transforma 
              visitantes em clientes reais.
            </p>
          </div>
        }
      >
        <MockLandingPage />
      </ContainerScroll>

      {/* Background glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0, 188, 212, 0.15) 0%, transparent 70%)"
        }}
      />
    </section>
  );
}
