import { Navbar } from "@/components/sections/Navbar"
import { Hero } from "@/components/sections/Hero"
import { Marquee } from "@/components/sections/Marquee"
import { Manifesto } from "@/components/sections/Manifesto"
import { Diferenciais } from "@/components/sections/Diferenciais"
import { Numeros } from "@/components/sections/Numeros"
import { Servicos } from "@/components/sections/Servicos"
import { Processo } from "@/components/sections/Processo"
import { Cases } from "@/components/sections/Cases"
import { AntesDepois } from "@/components/sections/AntesDepois"
import { Sobre } from "@/components/sections/Sobre"
import { FAQ } from "@/components/sections/FAQ"
import { CTAFinal } from "@/components/sections/CTAFinal"
import { Footer } from "@/components/sections/Footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#080808]">
      <Navbar />
      <Hero />
      <Marquee />
      <Manifesto />
      <Diferenciais />
      <Numeros />
      <Servicos />
      <Processo />
      <Cases />
      <AntesDepois />
      <Sobre />
      <FAQ />
      <CTAFinal />
      <Footer />
    </main>
  )
}
